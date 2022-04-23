import { Getter, NoInfer, PropGetterValue, TableState, Updater } from './types'

export type IsAny<T> = 0 extends 1 & T ? true : false
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>
export type Overwrite<T, U extends { [TKey in keyof T]?: any }> = Omit<
  T,
  keyof U
> &
  U

export type IfDefined<T, N> = 0 extends 1 & T ? N : T extends {} ? T : N

// export type DefinedGenericKeys<T extends AnyGenerics> = {
//   [K in keyof T]: 0 extends 1 & T[K] ? never : T[K] extends {} ? K : never
// }[keyof T]

// export type DefinedGenerics<T extends AnyGenerics> = Pick<
//   T,
//   DefinedGenericKeys<T>
// >

export type DataUpdateFunction<T> = (input: T) => T

export function functionalUpdate<T>(updater: Updater<T>, input: T): T {
  return typeof updater === 'function'
    ? (updater as DataUpdateFunction<T>)(input)
    : updater
}

export function noop() {
  //
}

export function getBatchGroups<T>(arr: T[], count: number) {
  const groups: { start: number; end: number; items: T[] }[] = [
    {
      start: 0,
      end: count - 1,
      items: [],
    },
  ]

  let groupIndex = 0
  let group = groups[groupIndex]

  for (let i = 0; i < arr.length; i++) {
    if (i > group.end) {
      groupIndex++
      groups[groupIndex] = {
        start: i,
        end: i + count - 1,
        items: [],
      }
    }
    group = groups[groupIndex]
    const item = arr[i]
    group.items.push(item)
  }

  return groups
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

type PropGetterImpl = <TBaseProps, TGetter extends Getter<TBaseProps>>(
  initial: TBaseProps,
  userProps?: TGetter
) => PropGetterValue<TBaseProps, TGetter>

// @ts-ignore // Just rely on the type, not the implementation
export const propGetter: PropGetterImpl = (initial, getter) => {
  if (isFunction(getter)) {
    return getter(initial)
  }

  return {
    ...initial,
    ...(getter ?? {}),
  }
}

export function memo<TDeps extends readonly any[], TResult>(
  getDeps: () => [...TDeps],
  fn: (...args: NoInfer<[...TDeps]>) => TResult,
  opts: {
    key: string
    debug?: () => any
    onChange?: (result: TResult, previousResult?: TResult) => void
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

    if (depsChanged) {
      let oldResult = result
      let resultTime: number
      if (opts.key && opts.debug) resultTime = Date.now()
      result = fn(...newDeps)
      deps = newDeps
      opts?.onChange?.(result, oldResult)

      if (opts.key && opts.debug) {
        if (opts?.debug()) {
          const depEndTime = Math.round((Date.now() - depTime!) * 100) / 100
          const resultEndTime =
            Math.round((Date.now() - resultTime!) * 100) / 100
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
            opts?.key,
            {
              length: `${deps.length} -> ${newDeps.length}`,
              ...newDeps
                .map((_, index) => {
                  if (deps[index] !== newDeps[index]) {
                    return [index, deps[index], newDeps[index]]
                  }

                  return false
                })
                .filter(Boolean)
                .reduce(
                  (accu, [a, b]: any) => ({
                    ...accu,
                    [a]: b,
                  }),
                  {}
                ),
              parent,
            }
          )
        }
      }

      oldResult = undefined
    }

    return result!
  }
}

type WorkFn = () => void

export function incrementalMemo<TDeps extends readonly any[], TResult>(
  getDeps: () => [...TDeps],
  getInitialValue: (...args: NoInfer<[...TDeps]>) => TResult,
  schedule: (
    ...args: NoInfer<[...TDeps]>
  ) => (resultRef: {
    current: TResult
  }) => (scheduler: (workFn: WorkFn) => void) => void,
  opts: {
    key: string
    onProgress: (
      progress: number,
      nextResult: TResult,
      result?: TResult
    ) => void
    onChange: (result: TResult, previousResult?: TResult) => void
    initialSync?: boolean
    timeout?: number
    debug?: () => any
  }
): () => TResult {
  let oldDeps: any[]
  let deps: any[]
  let result: TResult | undefined
  let nextResultRef: { current: TResult }
  let tasks: WorkFn[] = []
  let totalTaskCount = 0
  let resultStartTime: number
  let batchIndex = 0
  let progress = 0
  let working = false
  let callback: ReturnType<typeof requestIdleCallback>

  const timeout = opts.timeout ?? 100

  const onProgress = (latestResult: TResult, previousResult?: TResult) => {
    progress = 1 - tasks.length / totalTaskCount
    opts.onProgress(progress, latestResult, previousResult)
  }

  return () => {
    const scheduleFn = (workFn: WorkFn) => {
      totalTaskCount++
      tasks.push(workFn)
    }

    const newDeps = getDeps()

    let first = false

    if (!deps) {
      first = true
      deps = []
      result = getInitialValue(...newDeps)
    }

    const depsChanged =
      newDeps.length !== deps.length ||
      newDeps.some((dep: any, index: number) => deps[index] !== dep)

    if (depsChanged) {
      cancelIdleCallback(callback)
      oldDeps = deps
      deps = newDeps
      totalTaskCount = 0
      tasks = []
      nextResultRef = { current: getInitialValue(...newDeps) }
      resultStartTime = Date.now()
      schedule(...newDeps)(nextResultRef)(scheduleFn)
    }

    const commitResult = () => {
      cancelIdleCallback(callback)

      if (opts.key && opts.debug) {
        if (opts?.debug()) {
          const resultEndTime =
            Math.round((Date.now() - resultStartTime!) * 100) / 100
          const resultFpsPercentage = resultEndTime / batchIndex / 16

          console.info(
            `%c⏱ ${resultEndTime} ms / ${batchIndex} tasks = ${Math.round(
              resultEndTime / batchIndex
            )} ms/task`,
            `
      font-size: .6rem;
      font-weight: bold;
      color: hsl(${Math.max(
        0,
        Math.min(120 - 120 * resultFpsPercentage, 120)
      )}deg 100% 31%);`,
            opts?.key,
            {
              length: `${oldDeps.length} -> ${deps.length}`,
              ...deps
                .map((_, index) => {
                  if (oldDeps[index] !== deps[index]) {
                    return [index, oldDeps[index], deps[index]]
                  }

                  return false
                })
                .filter(Boolean)
                .reduce(
                  (accu, [a, b]: any) => ({
                    ...accu,
                    [a]: b,
                  }),
                  {}
                ),
              parent,
            }
          )
        }
      }

      working = false
      let previousResult = result
      result = nextResultRef.current
      onProgress(result, previousResult)
      opts.onChange(result, previousResult)
    }

    if (opts.initialSync && first) {
      batchIndex = 1
      first = false
      for (let i = 0; i < tasks.length; i++) {
        tasks[i]()
      }
      tasks = []
      commitResult()
    } else if (!working && tasks.length) {
      cancelIdleCallback(callback)
      working = true
      batchIndex = 0

      const workLoop = (deadline: any) => {
        while (tasks.length && deadline.timeRemaining() > 0) {
          tasks.shift()!()
        }

        if (!tasks.length) {
          commitResult()
        } else {
          ++batchIndex
          onProgress(nextResultRef.current, result)
          callback = requestIdleCallback(workLoop, { timeout })
        }
      }

      callback = requestIdleCallback(workLoop, { timeout })
    }

    return result!
  }
}

// opts?.onChange?.(result, oldResult)
