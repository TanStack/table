export type Updater<T> = T | ((old: T) => T)

export type OnChangeFn<T> = (updaterOrValue: Updater<T>) => void

export type RowData = Record<string, any> | Array<any>

export type CellData = unknown

export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>

export type UnionToIntersection<T> = (
  T extends any ? (x: T) => any : never
) extends (x: infer R) => any
  ? R
  : never

type ComputeRange<
  N extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends N
  ? Result
  : ComputeRange<N, [...Result, Result['length']]>

type Index40 = ComputeRange<40>[number]

// Is this type a tuple?
type IsTuple<T> = T extends ReadonlyArray<any> & { length: infer Length }
  ? Length extends Index40
    ? T
    : never
  : never

// If this type is a tuple, what indices are allowed?
type AllowedIndexes<
  Tuple extends ReadonlyArray<any>,
  Keys extends number = never,
> = Tuple extends readonly []
  ? Keys
  : Tuple extends readonly [infer _, ...infer Tail]
    ? AllowedIndexes<Tail, Keys | Tail['length']>
    : Keys

export type DeepKeys<
  T,
  TDepth extends Array<any> = [],
> = TDepth['length'] extends 5
  ? never
  : unknown extends T
    ? string
    : T extends ReadonlyArray<any> & IsTuple<T>
      ? AllowedIndexes<T> | DeepKeysPrefix<T, AllowedIndexes<T>, TDepth>
      : T extends Array<any>
        ? DeepKeys<T[number], [...TDepth, any]>
        : T extends Date
          ? never
          : T extends object
            ? (keyof T & string) | DeepKeysPrefix<T, keyof T, TDepth>
            : never

type DeepKeysPrefix<
  T,
  TPrefix,
  TDepth extends Array<any>,
> = TPrefix extends keyof T & (number | string)
  ? `${TPrefix}.${DeepKeys<T[TPrefix], [...TDepth, any]> & string}`
  : never

export type DeepValue<T, TProp> =
  T extends Record<string | number, any>
    ? TProp extends `${infer TBranch}.${infer TDeepProp}`
      ? DeepValue<T[TBranch], TDeepProp>
      : T[TProp & string]
    : never

export type NoInfer<T> = [T][T extends any ? 0 : never]

export type Getter<TValue> = <TTValue = TValue>() => NoInfer<TTValue>

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & unknown
