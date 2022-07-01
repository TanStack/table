import { NoInfer, TableState, Updater } from './types'

export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>
export type Overwrite<T, U extends { [TKey in keyof T]?: any }> = Omit<
  T,
  keyof U
> &
  U

export type UnionToIntersection<T> = (
  T extends any ? (x: T) => any : never
) extends (x: infer R) => any
  ? R
  : never

export type IfDefined<T, N> = 0 extends 1 & T ? N : T extends {} ? T : N

export function functionalUpdate<T>(updater: Updater<T>, input: T): T {
  return typeof updater === 'function'
    ? (updater as (input: T) => T)(input)
    : updater
}

export function noop() {
  //
}

export function makeStateUpdater(key: keyof TableState, table: unknown) {
  return (updater: Updater<any>) => {
    ;(table as any).setState(<TTableState>(old: TTableState) => {
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
