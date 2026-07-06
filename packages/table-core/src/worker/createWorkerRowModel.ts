import { tableMemo } from '../utils'
import { getTableWorkerBridge, syncTableWorker } from './createTableWorker'
import { rebuildRowModel } from './rebuildRowModel'
import { tableWorkerPipeline } from './tableWorkerProtocol'
import type { RowModel } from '../core/row-models/coreRowModelsFeature.types'
import type { Table, Table_Internal } from '../types/Table'
import type { TableFeatures } from '../types/TableFeatures'
import type { RowData } from '../types/type-utils'
import type { TableWorker } from './createTableWorker'
import type { TableWorkerStage } from './tableWorkerProtocol'

type AnyTable = Table_Internal<any, any>

function capitalize(stage: string) {
  return stage.charAt(0).toUpperCase() + stage.slice(1)
}

/**
 * Turns any row model stage into a worker-backed one. The returned factory
 * plugs into the standard feature slot for that stage, so it composes with
 * the rest of the pipeline exactly like the sync factory it replaces.
 *
 * Register only the stages you want offloaded; each import is independent and
 * tree-shakable. All stages on a table share one worker and one round trip
 * per state change via the `tableWorker` handle. Until a result lands, the
 * stage returns its pre-stage model (stale-while-revalidate).
 *
 * Offloaded stages must form a contiguous prefix of the pipeline
 * (filtered -> grouped -> sorted -> expanded): a stage's worker result encodes
 * everything upstream as computed in the worker, so any upstream stage
 * registered on the main thread must be offloaded too. A dev warning fires on
 * mismatches.
 *
 * @example
 * ```ts
 * const tableWorker = createTableWorker({ createWorker })
 *
 * const features = tableFeatures({
 *   rowSortingFeature,
 *   columnGroupingFeature,
 *   workerRowModelsFeature,
 *   filteredRowModel: createWorkerRowModel(tableWorker, 'filtered'),
 *   groupedRowModel: createWorkerRowModel(tableWorker, 'grouped'),
 *   sortedRowModel: createWorkerRowModel(tableWorker, 'sorted'),
 * })
 * ```
 */
export function createWorkerRowModel(
  tableWorker: TableWorker,
  stage: TableWorkerStage,
) {
  return <TFeatures extends TableFeatures, TData extends RowData>(
    _table: Table<TFeatures, TData>,
  ): (() => RowModel<TFeatures, TData>) => {
    const table = _table as unknown as AnyTable
    // Stages register per table as their factories initialize (first read).
    // The first render may therefore fire one extra coalesced request while
    // the stage set grows; single-flight makes it a cheap trailing request.
    getTableWorkerBridge(tableWorker, table).stages.add(stage)
    let warned = false

    const warnOnce = (message: string) => {
      if (process.env.NODE_ENV === 'development' && !warned) {
        warned = true
        console.warn(`[table-worker] ${message}`)
      }
    }

    const memoized = tableMemo({
      table,
      fnName: `table.get${capitalize(stage)}RowModel`,
      // The per-stage version bumps only when this stage's payload actually
      // changed, so stages the worker reported as `unchanged` skip the O(n)
      // rebuild entirely (the re-render itself rides the state slice bump).
      memoDeps: () => [
        table.getCoreRowModel(),
        getTableWorkerBridge(tableWorker, table).stageVersions[stage],
      ],
      fn: () => {
        const bridge = getTableWorkerBridge(tableWorker, table)
        const payload = bridge.results[stage]
        if (!payload) {
          if (bridge.resultRequestId > 0) {
            warnOnce(
              `The worker returned no '${stage}' result. Make sure the ` +
                `worker's initTableWorker() config registers a ` +
                `${stage}RowModel factory.`,
            )
          }
          return (table as any)[`getPre${capitalize(stage)}RowModel`]()
        }
        // Contiguous-prefix check: any upstream stage registered on this
        // table must also have a worker result, or it is silently bypassed.
        if (bridge.resultRequestId > 0) {
          for (const upstream of tableWorkerPipeline) {
            if (upstream === stage) break
            if (
              (table.options.features as Record<string, unknown>)[
                `${upstream}RowModel`
              ] &&
              !bridge.results[upstream]
            ) {
              warnOnce(
                `This table has a ${upstream}RowModel, but the worker result ` +
                  `for '${stage}' was computed without an offloaded ` +
                  `'${upstream}' stage, so it is bypassed. Offload it too ` +
                  `with createWorkerRowModel(tableWorker, '${upstream}').`,
              )
            }
          }
        }
        return rebuildRowModel(table, payload, stage !== 'filtered')
      },
    })

    return () => {
      syncTableWorker(tableWorker, table)
      return memoized()
    }
  }
}
