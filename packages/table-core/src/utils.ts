// import { Batch, TaskPriority } from './core'
import {
  NoInfer,
  TableGenerics,
  TableInstance,
  TableState,
  Updater,
} from './types'

export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>
export type Overwrite<T, U extends { [TKey in keyof T]?: any }> = Omit<
  T,
  keyof U
> &
  U

export type IfDefined<T, N> = 0 extends 1 & T ? N : T extends {} ? T : N

export function functionalUpdate<T>(updater: Updater<T>, input: T): T {
  return typeof updater === 'function'
    ? (updater as (input: T) => T)(input)
    : updater
}

export function noop() {
  //
}

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

export function makeStateUpdater(key: keyof TableState, instance: unknown) {
  return (updater: Updater<any>) => {
    ;(instance as any).setState(<TTableState>(old: TTableState) => {
      return {
        ...old,
        [key]: functionalUpdate(updater, (old as any)[key]),
      }
    })
  }
}

type AnyFunction = (...args: any) => any

export function isFunction<T extends AnyFunction>(d: any): d is T {
  return d instanceof Function
}

export function flattenBy<TNode>(
  arr: TNode[],
  getChildren: (item: TNode) => TNode[]
) {
  const flat: TNode[] = []

  const recurse = (subArr: TNode[]) => {
    subArr.forEach(item => {
      flat.push(item)
      const children = getChildren(item)
      if (children?.length) {
        recurse(children)
      }
    })
  }

  recurse(arr)

  return flat
}

export function memo<TDeps extends readonly any[], TResult>(
  getDeps: () => [...TDeps],
  fn: (...args: NoInfer<[...TDeps]>) => TResult,
  opts: {
    key: any
    debug?: () => any
    onChange?: (result: TResult) => void
  }
): () => TResult {
  let deps: any[] = []
  let result: TResult | undefined

  return () => {
    let depTime: number
    if (opts.key && opts.debug) depTime = Date.now()

    const newDeps = getDeps()

    const depsChanged =
      newDeps.length !== deps.length ||
      newDeps.some((dep: any, index: number) => deps[index] !== dep)

    if (!depsChanged) {
      return result!
    }

    deps = newDeps

    let resultTime: number
    if (opts.key && opts.debug) resultTime = Date.now()

    result = fn(...newDeps)
    opts?.onChange?.(result)

    if (opts.key && opts.debug) {
      if (opts?.debug()) {
        const depEndTime = Math.round((Date.now() - depTime!) * 100) / 100
        const resultEndTime = Math.round((Date.now() - resultTime!) * 100) / 100
        const resultFpsPercentage = resultEndTime / 16

        const pad = (str: number | string, num: number) => {
          str = String(str)
          while (str.length < num) {
            str = ' ' + str
          }
          return str
        }

        console.info(
          `%c⏱ ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`,
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

    return result!
  }
}

// type WorkFn = () => void

// export function incrementalMemo<
//   TDeps extends readonly any[],
//   TArgs extends readonly any[],
//   TResult,
//   TGenerics extends TableGenerics
// >(
//   getDeps: () => [...TDeps],
//   getInitialValue: (
//     ...args: [...TArgs]
//   ) => (...deps: NoInfer<[...TDeps]>) => TResult,
//   schedule: (
//     ...args: [...TArgs]
//   ) => (
//     ...deps: NoInfer<[...TDeps]>
//   ) => (scheduler: (workFn: WorkFn) => void) => Promise<TResult>,
//   opts: {
//     instance: TableInstance<TGenerics>
//     priority: TaskPriority
//     keepPrevious: () => any
//     key: any
//     onProgress: (progress: number) => void
//     onChange: (result: TResult) => void
//     initialSync?: boolean
//     timeout?: number
//     debug?: () => any
//   }
// ): (...args: TArgs) => TResult {
//   let deps: any[]
//   let result: TResult | undefined
//   let queueTime: number
//   let currentBatch: undefined | Batch

//   return (...args) => {
//     let newDeps = getDeps()

//     if (!deps) {
//       deps = []
//     }

//     const depsChanged =
//       newDeps.length !== deps.length ||
//       newDeps.some((dep: any, index: number) => deps[index] !== dep)

//     if (!depsChanged) {
//       return result!
//     }

//     if (currentBatch) {
//       currentBatch.cancel()
//     }

//     if (!opts.keepPrevious?.() || !queueTime) {
//       result = getInitialValue(...args)(...newDeps)
//     }

//     queueTime = Date.now()
//     const queueTimeSnap = queueTime
//     let doneTaskCount = 1
//     let totalTaskCount = 1
//     let progress = 0
//     let startTime = Date.now()

//     deps = newDeps

//     opts.onProgress(progress)

//     const batch = opts.instance.createBatch(opts.priority)
//     currentBatch = batch

//     const scheduleFn = (workFn: WorkFn) => {
//       totalTaskCount++
//       batch.schedule(() => {
//         workFn()
//         if (doneTaskCount === 1) {
//           startTime = Date.now()
//         }
//         doneTaskCount++
//         progress = Math.max(progress, doneTaskCount / totalTaskCount)
//         opts.onProgress(progress)
//       })
//     }

//     schedule(...args)(...newDeps)(scheduleFn).then(nextResult => {
//       // Do not commit outdated results
//       if (queueTime !== queueTimeSnap) {
//         return
//       }

//       if (opts.key && opts.debug) {
//         if (opts?.debug()) {
//           const resultEndTime =
//             Math.round((Date.now() - startTime!) * 100) / 100
//           const resultFpsPercentage = !totalTaskCount
//             ? 0
//             : resultEndTime / totalTaskCount / 16

//           console.info(
//             `%c⏱ ${resultEndTime} ms / ${totalTaskCount} tasks = ${
//               !totalTaskCount ? 0 : Math.round(resultEndTime / totalTaskCount)
//             } ms/task`,
//             `
//       font-size: .6rem;
//       font-weight: bold;
//       color: hsl(${Math.max(
//         0,
//         Math.min(120 - 120 * resultFpsPercentage, 120)
//       )}deg 100% 31%);`,
//             opts?.key
//           )
//         }
//       }

//       result = nextResult
//       opts.onChange(result)
//       opts.onProgress(1)
//     })

//     return result!
//   }
// }
