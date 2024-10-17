import type { Table } from './types/Table'
import type { NoInfer, RowData, Updater } from './types/type-utils'
import type { TableFeatures } from './types/TableFeatures'
import type { TableState } from './types/TableState'

export const isDev = process.env.NODE_ENV === 'development'

export function functionalUpdate<T>(updater: Updater<T>, input: T): T {
  return typeof updater === 'function'
    ? (updater as (i: T) => T)(input)
    : updater
}

export function noop() {}

export function makeStateUpdater<K extends keyof TableState<any>>(
  key: K,
  instance: unknown,
) {
  return (updater: Updater<TableState<any>[K]>) => {
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

export function isNumberArray(d: any): d is Array<number> {
  return Array.isArray(d) && d.every((val) => typeof val === 'number')
}

export function flattenBy<TNode>(
  arr: Array<TNode>,
  getChildren: (item: TNode) => Array<TNode>,
) {
  const flat: Array<TNode> = []

  const recurse = (subArr: Array<TNode>) => {
    subArr.forEach((item) => {
      flat.push(item)
      const children = getChildren(item)
      if (children.length) {
        recurse(children)
      }
    })
  }

  recurse(arr)

  return flat
}

interface MemoOptions<TDeps extends ReadonlyArray<any>, TDepArgs, TResult> {
  memoDeps?: (depArgs?: TDepArgs) => [...TDeps] | undefined
  fn: (...args: NoInfer<TDeps>) => TResult
  onAfterUpdate?: (result: TResult) => void
  onBeforeUpdate?: () => void
  onBeforeCompare?: () => void
  onAfterCompare?: () => void
}

export const memo = <TDeps extends ReadonlyArray<any>, TDepArgs, TResult>(
  options: MemoOptions<TDeps, TDepArgs, TResult>,
): ((depArgs?: TDepArgs) => TResult) => {
  const {
    memoDeps,
    fn,
    onAfterUpdate,
    onBeforeUpdate,
    onBeforeCompare,
    onAfterCompare,
  } = options
  let deps: Array<any> | undefined = []
  let result: TResult | undefined

  return (depArgs): TResult => {
    onBeforeCompare?.()
    const newDeps = memoDeps?.(depArgs)
    const depsChanged =
      !newDeps ||
      newDeps.length !== deps?.length ||
      newDeps.some((dep: any, index: number) => deps?.[index] !== dep)
    onAfterCompare?.()

    if (!depsChanged) {
      return result!
    }

    deps = newDeps

    onBeforeUpdate?.()
    result = fn(...(newDeps ?? ([] as any)))
    onAfterUpdate?.(result)

    return result
  }
}

interface TableMemoOptions<TDeps extends ReadonlyArray<any>, TDepArgs, TResult>
  extends MemoOptions<TDeps, TDepArgs, TResult> {
  debug?: boolean
  fnName: string
  onAfterUpdate?: () => void
}

const pad = (str: number | string, num: number) => {
  str = String(str)
  while (str.length < num) {
    str = ' ' + str
  }
  return str
}

export function tableMemo<TDeps extends ReadonlyArray<any>, TDepArgs, TResult>(
  tableMemoOptions: TableMemoOptions<TDeps, TDepArgs, TResult>,
) {
  const { debug, fnName, onAfterUpdate, ...memoOptions } = tableMemoOptions

  let beforeCompareTime: number
  let afterCompareTime: number

  let startCalcTime: number
  let endCalcTime: number

  const debugOptions = isDev
    ? {
        onBeforeCompare: () => {
          if (debug) beforeCompareTime = performance.now()
        },
        onAfterCompare: () => {
          if (debug) afterCompareTime = performance.now()
        },
        onBeforeUpdate: () => {
          if (debug) startCalcTime = performance.now()
        },
        onAfterUpdate: () => {
          if (debug) {
            endCalcTime = performance.now()
            const compareTime =
              Math.round((afterCompareTime - beforeCompareTime) * 100) / 100
            const executionTime =
              Math.round((endCalcTime - startCalcTime) * 100) / 100
            const totalTime = compareTime + executionTime
            console.info(
              `%c⏱ ${pad(`${compareTime.toFixed(1)} ms + ${executionTime.toFixed(1)} ms`, 17)}`,
              `font-size: .6rem; font-weight: bold; color: hsl(
              ${Math.max(0, Math.min(120 - totalTime, 120))}deg 100% 31%);`,
              fnName,
            )
          }
          queueMicrotask(() => onAfterUpdate)
        },
      }
    : {}

  return memo({
    ...memoOptions,
    ...debugOptions,
  })
}

interface API<TDeps extends ReadonlyArray<any>, TDepArgs> {
  fn: (...args: any) => any
  memoDeps?: (depArgs?: any) => [...any] | undefined
}

export function assignAPIs<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TObject extends Record<string, any>,
  TDeps extends ReadonlyArray<any>,
  TDepArgs,
>(
  obj: TObject extends Record<string, infer U> ? U : never, // table, row, cell, column, header
  table: Table<TFeatures, TData>,
  apis: Array<API<TDeps, NoInfer<TDepArgs>>>,
): void {
  apis.forEach(({ fn, memoDeps }) => {
    const name = fn.toString().match(/\s*(\w+)\s*\(/)?.[1] as string
    const fnName = name.replace('_', '.')
    const fnKey = name.split('_')[1]!

    const debugLevel = (name.split('_')[0]! + 's').replace(
      name.split('_')[0]!,
      name.split('_')[0]!.charAt(0).toUpperCase() +
        name.split('_')[0]!.slice(1),
    ) as 'Table' | 'Rows' | 'Columns' | 'Headers' | 'Cells'

    obj[fnKey] = memoDeps
      ? tableMemo({
          memoDeps,
          fn,
          fnName,
          debug: table.options.debugAll ?? table.options[`debug${debugLevel}`],
        })
      : fn
  })
}
