import { TableState, Updater } from './types'

export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<T>
export type RequiredKeys<T, K extends keyof T> = T & { [P in K]-?: T[P] }
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

export type IsAny<T, Y, N> = 1 extends 0 & T ? Y : N
export type IsKnown<T, Y, N> = unknown extends T ? N : Y

type IndexableData = Record<string | number, any>
export type DeepValue<T, TProp> = T extends IndexableData
  ? TProp extends `${infer TBranch}.${infer TDeepProp}`
    ? DeepValue<T[TBranch], TDeepProp>
    : TProp extends keyof T
    ? T[TProp]
    : never
  : never

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
]

type ExplicitLeaves =
  | Date
  | Number
  | BigInt
  | String
  | Set<unknown>
  | Map<unknown, unknown>
  | WeakSet<object>
  | WeakMap<object, unknown>

export type DeepKeys<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends ExplicitLeaves
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, DeepKeys<T[K], Prev[D]>>
        : never
    }[keyof T]
  : ''

export type NoInfer<T> = [T][T extends any ? 0 : never]

export type Getter<TValue> = <TTValue = TValue>() => NoInfer<TTValue>

///

export function functionalUpdate<T>(updater: Updater<T>, input: T): T {
  return typeof updater === 'function'
    ? (updater as (input: T) => T)(input)
    : updater
}

export function noop() {
  //
}

export function makeStateUpdater<K extends keyof TableState>(
  key: K,
  instance: unknown
) {
  return (updater: Updater<TableState[K]>) => {
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
