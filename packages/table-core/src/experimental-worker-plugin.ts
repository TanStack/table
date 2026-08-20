/**
 * Web Worker row models sub-entry (experimental POC).
 *
 * Offloads row model stages to a dedicated worker running a headless "shadow
 * table" built with the same table-core row model pipeline. The main thread
 * receives transferable index permutations and rebuilds its row models from
 * them, stale-while-revalidate style.
 *
 * Main thread:
 * - `createTableWorker` — one shared handle per table worker
 * - `createWorkerRowModel` — turns any flat row model stage into a
 *   worker-backed factory for the matching `features` slot
 * - `workerRowModelsFeature` — registers the `workerRowModels` state slice
 *
 * Worker entry (user-authored file):
 * - `initTableWorker` — runs the shadow table; computes only the stages whose
 *   row model factories are registered in its config
 */
export * from './worker/tableWorkerProtocol'
export * from './worker/initTableWorker'
export * from './worker/createTableWorker'
export * from './worker/createWorkerRowModel'
