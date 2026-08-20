import type { RowData } from '../types/type-utils'

/**
 * Row model stages that can be offloaded to the worker, in pipeline order.
 * Everything else in this module is derived from this list; adding a stage
 * means adding an entry here and to `tableWorkerStageStateDeps`.
 */
export const tableWorkerPipeline = [
  'filtered',
  'grouped',
  'sorted',
  'expanded',
] as const

export type TableWorkerStage = (typeof tableWorkerPipeline)[number]

/**
 * The state slices each stage's computation depends on. The main thread sends
 * the union of deps for its registered stages; a change to any of them
 * triggers one worker round trip.
 */
export const tableWorkerStageStateDeps: Record<
  TableWorkerStage,
  Array<string>
> = {
  filtered: ['columnFilters', 'globalFilter'],
  grouped: ['grouping'],
  sorted: ['sorting'],
  expanded: ['expanded'],
}

/**
 * A serialized synthetic (group) row. Leaf rows serialize as their position in
 * `options.data`; group rows carry what `constructRow` + the grouped row model
 * need to rebuild them, plus eagerly computed aggregate values so no
 * aggregation runs on the main thread.
 */
export interface TableWorkerGroupNode {
  id: string
  groupingColumnId: string
  groupingValue: unknown
  index: number
  aggregates: Record<string, unknown>
  children: Array<TableWorkerRowNode>
}

export type TableWorkerRowNode = number | TableWorkerGroupNode

/**
 * A stage result. Flat models (every row is a data row) travel as a
 * transferable index permutation; models containing synthetic rows (grouping)
 * travel as a tree. The kind is chosen from the model's actual shape at
 * runtime, not from the stage name: a sorted model is flat without grouping
 * and a tree with it.
 *
 * `unchanged` means the stage's model is identical to the last one sent for
 * this dataset (its memoized inputs did not change); the main thread keeps
 * its previous result and skips the rebuild entirely.
 */
export type TableWorkerStagePayload =
  | { kind: 'flat'; indices: Uint32Array }
  | { kind: 'tree'; children: Array<TableWorkerRowNode> }
  | { kind: 'unchanged' }

export type TableWorkerRequest<TData extends RowData = any> =
  | {
      type: 'data'
      dataVersion: number
      data: Array<TData>
    }
  | {
      type: 'process'
      requestId: number
      dataVersion: number
      /** The stages the main thread has worker-backed row models for. */
      stages: Array<TableWorkerStage>
      /** Serializable state slices (union of the stages' deps). */
      state: Record<string, unknown>
    }

export interface TableWorkerResult {
  type: 'result'
  requestId: number
  dataVersion: number
  stages: { [K in TableWorkerStage]?: TableWorkerStagePayload }
  computeMs: number
}

export type TableWorkerResponse = TableWorkerResult

/**
 * The state slice added by `workerRowModelsFeature`. `version` bumps when a
 * worker result lands (driving re-renders through the normal state path);
 * `isPending` is true while a request is in flight. The timing fields expose
 * the last result's worker compute time and full round trip for devtools and
 * debugging.
 */
export interface TableState_WorkerRowModels {
  workerRowModels: {
    version: number
    isPending: boolean
    lastComputeMs?: number
    lastRoundTripMs?: number
  }
}
