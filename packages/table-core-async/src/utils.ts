// import { Batch, TaskPriority } from './core'
import { NoInfer, TableGenerics, TableInstance } from '@tanstack/table-core'

export async function batchLoop<T>(
  arr: T[],
  count: number,
  schedule: (itemCb: () => void) => void,
  itemCb: (item: T, index: number) => void | Promise<void>
): Promise<void[]> {
  const size = arr.length
  let promises: (Promise<void> | void)[] = []
  const groupCount = Math.ceil(size / count)

  for (let i = 0; i < groupCount; i++) {
    promises.push(
      new Promise(resolve => {
        schedule(() => {
          let subPromises: (Promise<void> | void)[] = []
          // Flag the prefiltered row model with each filter state
          for (let j = 0; j < count; j++) {
            const index = i * count + j
            if (index > size - 1) {
              break
            }
            subPromises.push(itemCb(arr[index]!, index))
          }

          Promise.all(subPromises).then(() => resolve())
        })
      })
    )
  }

  return Promise.all(promises)
}

export async function batchReduce<T, TReturn>(
  arr: T[],
  count: number,
  schedule: (itemCb: () => void) => void,
  initialValue: TReturn,
  itemCb: (ref: { current: TReturn }, item: T, index: number) => Promise<void>
): Promise<TReturn> {
  const ref = { current: initialValue }

  await batchLoop(arr, count, schedule, (item, index) =>
    itemCb(ref, item, index)
  )

  return initialValue
}

type WorkFn = () => void

export function batchMemo<
  TDeps extends readonly any[],
  TArgs extends readonly any[],
  TResult,
  TGenerics extends TableGenerics
>(
  getDeps: () => [...TDeps],
  getInitialValue: (
    ...args: [...TArgs]
  ) => (...deps: NoInfer<[...TDeps]>) => TResult,
  schedule: (
    ...args: [...TArgs]
  ) => (
    ...deps: NoInfer<[...TDeps]>
  ) => (scheduler: (workFn: WorkFn) => void) => Promise<TResult>,
  opts: {
    instance: TableInstance<TGenerics>
    priority: any
    keepPrevious: () => any
    key: any
    onProgress: (progress: number) => void
    onChange: (result: TResult) => void
    initialSync?: boolean
    timeout?: number
    debug?: () => any
  }
): (...args: TArgs) => TResult {
  let deps: any[]
  let result: TResult | undefined
  let queueTime: number
  let currentBatch: undefined | any

  return (...args) => {
    let newDeps = getDeps()

    if (!deps) {
      deps = []
    }

    const depsChanged =
      newDeps.length !== deps.length ||
      newDeps.some((dep: any, index: number) => deps[index] !== dep)

    if (!depsChanged) {
      return result!
    }

    if (currentBatch) {
      currentBatch.cancel()
    }

    if (!opts.keepPrevious?.() || !queueTime) {
      result = getInitialValue(...args)(...newDeps)
    }

    queueTime = Date.now()
    const queueTimeSnap = queueTime
    let doneTaskCount = 1
    let totalTaskCount = 1
    let progress = 0
    let startTime = Date.now()

    deps = newDeps

    opts.onProgress(progress)

    const batch = (opts.instance as any).createBatch(opts.priority)
    currentBatch = batch

    const scheduleFn = (workFn: WorkFn) => {
      totalTaskCount++
      batch.schedule(() => {
        workFn()
        if (doneTaskCount === 1) {
          startTime = Date.now()
        }
        doneTaskCount++
        progress = Math.max(progress, doneTaskCount / totalTaskCount)
        opts.onProgress(progress)
      })
    }

    schedule(...args)(...newDeps)(scheduleFn).then(nextResult => {
      // Do not commit outdated results
      if (queueTime !== queueTimeSnap) {
        return
      }

      if (opts.key && opts.debug) {
        if (opts?.debug()) {
          const resultEndTime =
            Math.round((Date.now() - startTime!) * 100) / 100
          const resultFpsPercentage = !totalTaskCount
            ? 0
            : resultEndTime / totalTaskCount / 16

          console.info(
            `%c⏱ ${resultEndTime} ms / ${totalTaskCount} tasks = ${
              !totalTaskCount ? 0 : Math.round(resultEndTime / totalTaskCount)
            } ms/task`,
            `
      font-size: .6rem;
      font-weight: bold;
      color: hsl(${Math.max(
        0,
        Math.min(120 - 120 * resultFpsPercentage, 120)
      )}deg 100% 31%);`,
            opts?.key
          )
        }
      }

      result = nextResult
      opts.onChange(result)
      opts.onProgress(1)
    })

    return result!
  }
}

export function incrementalMemo<
  TDeps extends readonly any[],
  TArgs extends readonly any[],
  TResult,
  TGenerics extends TableGenerics
>(
  getDeps: () => [...TDeps],
  getInitialValue: (
    ...args: [...TArgs]
  ) => (...deps: NoInfer<[...TDeps]>) => TResult,
  schedule: (
    ...args: [...TArgs]
  ) => (...deps: NoInfer<[...TDeps]>) => Promise<TResult>,
  opts: {
    instance: TableInstance<TGenerics>
    keepPrevious: () => any
    key: any
    onChange: () => void
    onComplete: (result: TResult) => void
    initialSync?: boolean
    timeout?: number
    debug?: () => any
  }
): (...args: TArgs) => TResult {
  let deps: any[]
  let result: TResult | undefined
  let queueTime: number
  let abortController: undefined | AbortController
  let status: 'pending' | 'rejected' | 'resolved' = 'pending'

  return (...args) => {
    let newDeps = getDeps()

    if (!deps) {
      deps = []
    }

    const depsChanged =
      newDeps.length !== deps.length ||
      newDeps.some((dep: any, index: number) => deps[index] !== dep)

    if (!depsChanged) {
      return result!
    }

    if (abortController) {
      abortController.abort()
    }

    if (!opts.keepPrevious?.() || !queueTime) {
      result = getInitialValue(...args)(...newDeps)
    }

    queueTime = Date.now()
    const queueTimeSnap = queueTime
    let startTime = Date.now()
    abortController = new AbortController()

    deps = newDeps

    opts.onChange()

    schedule(...args)(...newDeps).then(nextResult => {
      // Do not commit outdated results
      if (queueTime !== queueTimeSnap) {
        return
      }

      if (opts.key && opts.debug) {
        if (opts?.debug()) {
          const resultEndTime =
            Math.round((Date.now() - startTime!) * 100) / 100

          console.info(
            `%c⏱ ${resultEndTime}`,
            `
      font-size: .6rem;
      font-weight: bold;`,
            opts?.key
          )
        }
      }

      result = nextResult
      opts.onComplete(result)
    })

    return result!
  }
}
