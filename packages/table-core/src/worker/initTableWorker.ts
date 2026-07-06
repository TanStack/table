import { constructTable } from '../core/table/constructTable'
import { storeReactivityBindings } from '../store-reactivity-bindings'
import { makeObjectMap } from '../utils'
import { serializeRowModel } from './serializeRowModel'
import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { TableOptions } from '../types/TableOptions'
import type { Table_Internal } from '../types/Table'
import type {
  TableWorkerRequest,
  TableWorkerResult,
  TableWorkerStage,
  TableWorkerStagePayload,
} from './tableWorkerProtocol'

export type TableWorkerConfig<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Omit<TableOptions<TFeatures, TData>, 'data'>

function capitalize(stage: string) {
  return stage.charAt(0).toUpperCase() + stage.slice(1)
}

/** Flatten column-group defs to leaf defs (mirrors core's id resolution). */
function flattenColumnDefs(defs: Array<any>): Array<any> {
  return defs.flatMap((def) =>
    def.columns ? flattenColumnDefs(def.columns) : [def],
  )
}

/**
 * Runs a headless "shadow table" inside a dedicated Web Worker.
 *
 * Call this from a user-authored worker entry file, passing the same columns
 * and processing features used on the main thread. The shadow table runs the
 * real table-core row model pipeline (real fns, real Row objects) off the
 * main thread and posts back one payload per stage the main thread requested:
 * a transferable index permutation for flat results, a serialized row tree
 * (with eagerly computed aggregates) when grouping produces synthetic rows.
 *
 * Everything passed here must be thread-portable: `accessorKey` columns or
 * accessors defined in a shared module, and fns from registries or shared
 * modules (no closures over app state).
 *
 * @example
 * ```ts
 * // table.worker.ts
 * import { initTableWorker } from '@tanstack/table-core/experimental-worker-plugin'
 * import { columns, sharedFeatures } from './tableConfig'
 *
 * initTableWorker({ features: sharedFeatures, columns })
 * ```
 */
export function initTableWorker<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(config: TableWorkerConfig<TFeatures, TData>): void {
  let table: Table_Internal<TFeatures, TData> | undefined
  let dataVersion = 0
  let coreIndexById: Record<string, number> = makeObjectMap()
  let aggregateColumnIds: Array<string> = []
  // Last-sent model identity per stage: the memoized getters return stable
  // objects when their inputs did not change, so identity equality is exactly
  // "this stage's result is unchanged".
  let lastSentModels: { [K in TableWorkerStage]?: unknown } = {}

  self.onmessage = (event: MessageEvent<TableWorkerRequest<TData>>) => {
    const message = event.data

    if (message.type === 'data') {
      dataVersion = message.dataVersion
      lastSentModels = {}
      if (!table) {
        table = constructTable<TFeatures, TData>({
          ...(config as TableOptions<TFeatures, TData>),
          features: {
            coreReactivityFeature: storeReactivityBindings(),
            ...config.features,
          },
          data: message.data,
        }) as unknown as Table_Internal<TFeatures, TData>
        // Only columns with an explicit aggregation get eagerly aggregated
        // per group. Sync tables aggregate lazily (visible cells only), so
        // auto-aggregating every column would explode on high-cardinality
        // grouping for values nothing renders. Read the RAW column defs:
        // columnGroupingFeature injects default aggregatedCell/aggregationFn
        // into every resolved columnDef, so the resolved defs can't tell
        // explicit from default.
        aggregateColumnIds = flattenColumnDefs(config.columns as Array<any>)
          .filter(
            (def) => def.aggregationFn != null || def.aggregatedCell != null,
          )
          .map(
            (def) =>
              def.id ??
              (typeof def.accessorKey === 'string'
                ? def.accessorKey.replaceAll('.', '_')
                : undefined),
          )
          .filter((id): id is string => id != null)
      } else {
        table.setOptions((prev) => ({ ...prev, data: message.data }))
      }
      // Map row ids to data positions once per dataset; serialization uses it
      // to express every stage result in terms of core row positions.
      const coreFlatRows = table.getCoreRowModel().flatRows
      coreIndexById = makeObjectMap()
      for (let i = 0; i < coreFlatRows.length; i++) {
        coreIndexById[coreFlatRows[i]!.id] = i
      }
      return
    }

    if (!table) return

    const start = performance.now()

    // Apply the serializable state slices to the shadow table's base atoms.
    table._reactivity.batch(() => {
      for (const [key, value] of Object.entries(message.state)) {
        const baseAtom = (table!.baseAtoms as Record<string, any>)[key]
        if (baseAtom && value !== undefined) {
          baseAtom.set(value)
        }
      }
    })

    // Compute exactly the stages the main thread requested, skipping any this
    // shadow table has no row model factory for (the main thread warns).
    const stages: { [K in TableWorkerStage]?: TableWorkerStagePayload } = {}
    const transfer: Array<Transferable> = []

    for (const stage of message.stages) {
      if (!(config.features as Record<string, unknown>)[`${stage}RowModel`]) {
        continue
      }
      const model = (table as any)[`get${capitalize(stage)}RowModel`]()
      // Memoized getters return the same object when inputs are unchanged;
      // skip re-serializing (and the main thread skips rebuilding). Safe under
      // single-flight: results are never dropped within a dataVersion.
      if (lastSentModels[stage] === model) {
        stages[stage] = { kind: 'unchanged' }
        continue
      }
      lastSentModels[stage] = model
      stages[stage] = serializeRowModel(
        model,
        coreIndexById,
        aggregateColumnIds,
        transfer,
      )
    }

    const response: TableWorkerResult = {
      type: 'result',
      requestId: message.requestId,
      dataVersion,
      stages,
      computeMs: performance.now() - start,
    }
    postMessage(response, { transfer })
  }
}
