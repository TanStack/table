import { table_autoResetPageIndex } from '../features/row-pagination/rowPaginationFeature.utils'
import { table_autoResetExpanded } from '../features/row-expanding/rowExpandingFeature.utils'
import {
  tableWorkerPipeline,
  tableWorkerStageStateDeps,
} from './tableWorkerProtocol'
import type { Table_Internal } from '../types/Table'
import type { TableFeature } from '../types/TableFeatures'
import type { TableWorkerDataPayload } from './rebuildRowModel'
import type {
  TableState_WorkerRowModels,
  TableWorkerResponse,
  TableWorkerStage,
  TableWorkerStagePayload,
} from './tableWorkerProtocol'

// Importing anything from this module (e.g. `workerRowModelsFeature`)
// registers the plugin key and its state slice with the core type maps, so
// userland needs no `declare module` of its own. Apps that never use worker
// row models never load this module and never see the types.
declare module '../types/TableFeatures' {
  interface Plugins {
    workerRowModelsFeature: TableFeature
  }
}
declare module '../types/TableState' {
  interface TableState_FeatureMap {
    workerRowModelsFeature: TableState_WorkerRowModels
  }
}

export interface TableWorkerOptions {
  /**
   * Creates the dedicated worker that runs the shadow table. The worker entry
   * must call `initTableWorker` with the same columns and processing config.
   *
   * The `new Worker(new URL(...))` expression must live in your code (not the
   * library) so your bundler can statically discover and bundle the worker
   * entry file.
   *
   * @example
   * ```ts
   * createWorker: () =>
   *   new Worker(new URL('./table.worker.ts', import.meta.url), {
   *     type: 'module',
   *   })
   * ```
   */
  createWorker: () => Worker
}

export interface TableWorkerBridge {
  worker: Worker | null
  /** The worker errored (load failure or uncaught throw); stop posting. */
  failed: boolean
  lastData: unknown
  dataVersion: number
  requestId: number
  resultRequestId: number
  /** A process request has been posted and its result has not arrived yet. */
  inFlight: boolean
  /** State changed since the last posted request; post when possible. */
  needsProcess: boolean
  sentAt: number
  /** The stages registered on this table (grows as factories initialize). */
  stages: Set<TableWorkerStage>
  /** Snapshot of state refs + stage count captured at the last post. */
  sentState: Record<string, unknown> | null
  sentStageCount: number
  /** Latest observed state refs, posted on the trailing edge if in flight. */
  lastState: Record<string, unknown>
  results: { [K in TableWorkerStage]?: TableWorkerDataPayload }
  /** Bumped per stage only when that stage's payload actually changed. */
  stageVersions: { [K in TableWorkerStage]?: number }
}

type AnyTable = Table_Internal<any, any>

/**
 * A handle shared by every worker-backed row model on a table. It owns the
 * worker instance and the per-table request/result bookkeeping, so registering
 * one stage or four costs exactly one worker and one round trip per change.
 */
export interface TableWorker {
  _options: TableWorkerOptions
  _bridges: WeakMap<object, TableWorkerBridge>
  _liveBridges: Set<TableWorkerBridge>
  /**
   * Terminates every worker created through this handle and resets the
   * bookkeeping. Safe to call at any time: the next row model read lazily
   * recreates the worker and re-sends the data (self-healing). Note that
   * nothing calls this automatically yet; React StrictMode double-mounts and
   * HMR updates still leak a worker in development until the reactivity
   * bindings grow a real `unmount` hook.
   */
  terminate: () => void
}

/**
 * Registers the `workerRowModels` state slice
 * (`{ version, isPending, lastComputeMs, lastRoundTripMs }`). Worker results
 * land by bumping `version`, so re-renders flow through the exact same state
 * mechanism as every other table state change.
 */
export const workerRowModelsFeature: TableFeature = {
  getInitialState: (initialState: any) => ({
    workerRowModels: { version: 0, isPending: false },
    ...initialState,
  }),
}

/**
 * Creates the shared worker handle for a table's worker-backed row models.
 * Pass it to `createWorkerRowModel()` once per stage you want offloaded.
 */
export function createTableWorker(options: TableWorkerOptions): TableWorker {
  const liveBridges = new Set<TableWorkerBridge>()
  return {
    _options: options,
    _bridges: new WeakMap(),
    _liveBridges: liveBridges,
    terminate: () => {
      for (const bridge of liveBridges) {
        bridge.worker?.terminate()
        bridge.worker = null
        bridge.failed = false
        bridge.lastData = undefined
        bridge.inFlight = false
        bridge.needsProcess = true
        bridge.sentState = null
        bridge.sentStageCount = 0
      }
      liveBridges.clear()
    },
  }
}

export function getTableWorkerBridge(
  tableWorker: TableWorker,
  table: AnyTable,
): TableWorkerBridge {
  let bridge = tableWorker._bridges.get(table)
  if (!bridge) {
    bridge = {
      worker: null,
      failed: false,
      lastData: undefined,
      dataVersion: 0,
      requestId: 0,
      resultRequestId: 0,
      inFlight: false,
      needsProcess: true,
      sentAt: 0,
      stages: new Set(),
      sentState: null,
      sentStageCount: 0,
      lastState: {},
      results: {},
      stageVersions: {},
    }
    tableWorker._bridges.set(table, bridge)
  }
  return bridge
}

/** Shallow reference comparison; atoms return stable refs when unchanged. */
function statesEqual(
  a: Record<string, unknown> | null,
  b: Record<string, unknown>,
): boolean {
  if (a === null) return false
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) return false
  for (const key of bKeys) {
    if (a[key] !== b[key]) return false
  }
  return true
}

function setWorkerRowModelsState(
  table: AnyTable,
  update: (prev: any) => Record<string, unknown>,
) {
  const stateAtom = (table.baseAtoms as Record<string, any>).workerRowModels
  stateAtom?.set((prev: any) => update(prev ?? { version: 0 }))
}

function postProcess(table: AnyTable, bridge: TableWorkerBridge): void {
  const stages = tableWorkerPipeline.filter((stage) => bridge.stages.has(stage))
  bridge.needsProcess = false
  bridge.sentState = bridge.lastState
  bridge.sentStageCount = bridge.stages.size
  bridge.inFlight = true
  bridge.sentAt = performance.now()
  const requestId = ++bridge.requestId
  bridge.worker!.postMessage({
    type: 'process',
    requestId,
    dataVersion: bridge.dataVersion,
    stages,
    state: bridge.lastState,
  })
  // postProcess can run during render (via sync); defer the pending write.
  table._reactivity.schedule(() => {
    if (bridge.requestId === requestId && bridge.resultRequestId < requestId) {
      setWorkerRowModelsState(table, (prev) => ({ ...prev, isPending: true }))
    }
  })
}

function handleResult(
  table: AnyTable,
  bridge: TableWorkerBridge,
  message: TableWorkerResponse,
) {
  if (message.requestId !== bridge.requestId) return
  bridge.inFlight = false
  bridge.resultRequestId = message.requestId

  // A data change raced this request: the result is for the old dataset.
  // Drop it and immediately re-process against the new data.
  if (message.dataVersion !== bridge.dataVersion) {
    postProcess(table, bridge)
    return
  }

  // Merge stage payloads: `unchanged` keeps the previous result (and its
  // rebuilt model, via the per-stage version), changed payloads replace it.
  let anyChanged = false
  let groupedChanged = false
  for (const [stage, payload] of Object.entries(message.stages) as Array<
    [TableWorkerStage, TableWorkerStagePayload]
  >) {
    if (payload.kind === 'unchanged') continue
    bridge.results[stage] = payload
    bridge.stageVersions[stage] = (bridge.stageVersions[stage] ?? 0) + 1
    anyChanged = true
    if (stage === 'grouped') groupedChanged = true
  }

  const roundTripMs = performance.now() - bridge.sentAt
  setWorkerRowModelsState(table, (prev) => ({
    version: (prev.version ?? 0) + 1,
    isPending: false,
    lastComputeMs: message.computeMs,
    lastRoundTripMs: roundTripMs,
  }))

  // The async equivalent of the sync models' `onAfterUpdate` hooks. The
  // worker's unchanged-detection is its memo identity, so `groupedChanged`
  // mirrors exactly when the sync grouped model would have recomputed (and
  // reset expansion).
  if (anyChanged) {
    table._reactivity.schedule(() =>
      table._reactivity.untrack(() => {
        if (groupedChanged) {
          table_autoResetExpanded(table)
        }
        table_autoResetPageIndex(table)
      }),
    )
  }

  // Trailing edge: state changed while this request was in flight.
  if (bridge.needsProcess) {
    postProcess(table, bridge)
  }
}

function handleError(
  table: AnyTable,
  bridge: TableWorkerBridge,
  event: unknown,
) {
  if (bridge.failed) return
  bridge.failed = true
  bridge.inFlight = false
  console.error(
    '[table-worker] The table worker failed; worker row models will keep ' +
      'their last results and stop updating. Check that the worker entry ' +
      'loads and that its initTableWorker() config is thread-portable.',
    event,
  )
  bridge.worker?.terminate()
  bridge.worker = null
  setWorkerRowModelsState(table, (prev) => ({ ...prev, isPending: false }))
}

function ensureWorker(
  tableWorker: TableWorker,
  table: AnyTable,
  bridge: TableWorkerBridge,
) {
  if (bridge.worker) return
  bridge.worker = tableWorker._options.createWorker()
  tableWorker._liveBridges.add(bridge)
  bridge.worker.onmessage = (event: MessageEvent<TableWorkerResponse>) => {
    handleResult(table, bridge, event.data)
  }
  bridge.worker.onerror = (event) => handleError(table, bridge, event)
  bridge.worker.onmessageerror = (event) => handleError(table, bridge, event)
}

/**
 * Pull-based sync, called at the top of every worker-backed row model read
 * (i.e. every render). Posts data on identity change and a single-flight
 * process request on state change; both are cheap no-ops otherwise, and
 * multiple stages sharing the handle dedupe onto one request.
 */
export function syncTableWorker(tableWorker: TableWorker, table: AnyTable) {
  // SSR: no Worker global. Getters fall back to pre-stage models, so the
  // server renders unprocessed rows and the client takes over after hydration.
  if (typeof Worker === 'undefined') return

  const bridge = getTableWorkerBridge(tableWorker, table)
  if (bridge.failed) return
  ensureWorker(tableWorker, table, bridge)

  const data = table.options.data
  if (data !== bridge.lastData) {
    bridge.lastData = data
    bridge.dataVersion++
    bridge.worker!.postMessage({
      type: 'data',
      dataVersion: bridge.dataVersion,
      data,
    })
    bridge.needsProcess = true
  }

  // Union of the registered stages' state deps, compared by reference (atoms
  // return stable refs when a slice did not change).
  const atoms = table.atoms as Record<string, any>
  const state: Record<string, unknown> = {}
  for (const stage of bridge.stages) {
    for (const key of tableWorkerStageStateDeps[stage]) {
      state[key] = atoms[key]?.get()
    }
  }
  bridge.lastState = state

  if (
    !bridge.needsProcess &&
    (!statesEqual(bridge.sentState, state) ||
      bridge.stages.size !== bridge.sentStageCount)
  ) {
    bridge.needsProcess = true
  }

  // Single-flight: at most one request in the worker at a time. If one is in
  // flight, the latest state is posted from the result handler (trailing
  // edge), so rapid input coalesces instead of queueing doomed computes.
  if (bridge.needsProcess && !bridge.inFlight) {
    postProcess(table, bridge)
  }
}
