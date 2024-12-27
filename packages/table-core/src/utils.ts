import type { Table_Internal } from './types/Table'
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
  fn: (...args: NoInfer<TDeps>) => TResult
  memoDeps?: (depArgs?: TDepArgs) => [...TDeps] | undefined
  onAfterCompare?: (depsChanged: boolean) => void
  onAfterUpdate?: (result: TResult) => void
  onBeforeCompare?: () => void
  onBeforeUpdate?: () => void
}

export const memo = <TDeps extends ReadonlyArray<any>, TDepArgs, TResult>({
  fn,
  memoDeps,
  onAfterCompare,
  onAfterUpdate,
  onBeforeCompare,
  onBeforeUpdate,
}: MemoOptions<TDeps, TDepArgs, TResult>): ((
  depArgs?: TDepArgs,
) => TResult) => {
  let deps: Array<any> | undefined = []
  let result: TResult | undefined

  return (depArgs): TResult => {
    onBeforeCompare?.()
    const newDeps = memoDeps?.(depArgs)
    const depsChanged =
      !newDeps ||
      newDeps.length !== deps?.length ||
      newDeps.some((dep: any, index: number) => deps?.[index] !== dep)
    onAfterCompare?.(depsChanged)

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
  debugCache?: boolean
  fnName: string
  objectId?: string
  onAfterUpdate?: () => void
}

const pad = (str: number | string, num: number) => {
  str = String(str)
  while (str.length < num) {
    str = ' ' + str
  }
  return str
}

export function tableMemo<TDeps extends ReadonlyArray<any>, TDepArgs, TResult>({
  debug,
  debugCache,
  fnName,
  objectId,
  onAfterUpdate,
  ...memoOptions
}: TableMemoOptions<TDeps, TDepArgs, TResult>) {
  let beforeCompareTime: number
  let afterCompareTime: number
  let startCalcTime: number
  let endCalcTime: number
  let runCount = 0

  function logTime(time: number, depsChanged: boolean) {
    if (isDev) {
      const runType =
        runCount === 0
          ? '(1st run)'
          : depsChanged
            ? '(rerun #' + runCount + ')'
            : '(cache)'
      runCount++

      console.groupCollapsed(
        `%c⏱ ${pad(`${time.toFixed(1)} ms`, 12)} %c${runType}%c ${fnName}%c ${objectId ? `(${fnName.split('.')[0]}Id: ${objectId})` : ''}`,
        `font-size: .6rem; font-weight: bold; ${
          depsChanged
            ? `color: hsl(
        ${Math.max(0, Math.min(120 - Math.log10(time) * 60, 120))}deg 100% 31%);`
            : ''
        } `,
        `color: ${runCount < 2 ? '#FF00FF' : '#FF1493'}`,
        'color: #666',
        'color: #87CEEB',
      )
      console.trace()
      console.groupEnd()
    }
  }

  const debugOptions = isDev
    ? {
        onBeforeCompare: () => {
          if (debugCache) {
            beforeCompareTime = performance.now()
          }
        },
        onAfterCompare: (depsChanged: boolean) => {
          if (debugCache) {
            afterCompareTime = performance.now()
            const compareTime =
              Math.round((afterCompareTime - beforeCompareTime) * 100) / 100
            if (!depsChanged) {
              logTime(compareTime, depsChanged)
            }
          }
        },
        onBeforeUpdate: () => {
          if (debug) {
            startCalcTime = performance.now()
          }
        },
        onAfterUpdate: () => {
          if (debug) {
            endCalcTime = performance.now()
            const executionTime =
              Math.round((endCalcTime - startCalcTime) * 100) / 100
            logTime(executionTime, true)
          }
          queueMicrotask(() => onAfterUpdate?.())
        },
      }
    : {
        onAfterUpdate: () => {
          queueMicrotask(() => onAfterUpdate?.())
        },
      }

  return memo({
    ...memoOptions,
    ...debugOptions,
  })
}

interface API<TDeps extends ReadonlyArray<any>, TDepArgs> {
  fn: (...args: any) => any
  memoDeps?: (depArgs?: any) => [...any] | undefined
}

/**
 * Assumes that a function name is in the format of `parentName_fnKey` and returns the `fnKey` and `fnName` in the format of `parentName.fnKey`.
 */
export function getFunctionNameInfo(fn: AnyFunction) {
  const rawName = fn.name
  const name =
    rawName != 'fn'
      ? rawName
      : (fn.toString().match(/\s*(\w+)\s*\(/)?.[1] as `${string}_${string}`)
  const [parentName, fnKey] = name.split('_')
  const fnName = `${parentName}.${fnKey}`
  return { fnKey, fnName, parentName } as {
    fnKey: string
    fnName: string
    parentName: string
  }
}

/**
 * Takes a static function, looks at its name and assigns it to an object with optional memoization and debugging.
 */
export function assignAPIs<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TObject extends Record<string, any>,
  TDeps extends ReadonlyArray<any>,
  TDepArgs,
>(
  obj: TObject extends Record<string, infer U> ? U : never, // table, row, cell, column, header
  apis: Array<API<TDeps, NoInfer<TDepArgs>>>,
): void {
  const table = (obj._table ?? obj) as Table_Internal<TFeatures, TData>
  apis.forEach(({ fn, memoDeps }) => {
    const { fnKey, fnName, parentName } = getFunctionNameInfo(fn)

    const debugLevel = (
      parentName != 'table' ? parentName + 's' : parentName
    ).replace(
      parentName,
      parentName.charAt(0).toUpperCase() + parentName.slice(1),
    ) as 'Table' | 'Rows' | 'Columns' | 'Headers' | 'Cells'

    obj[fnKey] = memoDeps
      ? tableMemo({
          memoDeps,
          fn,
          fnName,
          objectId: obj.id,
          debug: isDev
            ? (table.options.debugAll ?? table.options[`debug${debugLevel}`])
            : false,
          debugCache: isDev && table.options.debugCache,
        })
      : fn
  })
}

/**
 * Looks to run the memoized function with the builder pattern on the object if it exists, otherwise fallback to the static method passed in.
 */
export function callMemoOrStaticFn<
  TObject extends Record<string, any>,
  TStaticFn extends AnyFunction,
>(
  obj: TObject,
  staticFn: TStaticFn,
  ...args: Parameters<TStaticFn> extends [any, ...infer Rest] ? Rest : never
): ReturnType<TStaticFn> {
  const { fnKey } = getFunctionNameInfo(staticFn)
  return (
    (obj[fnKey] as Function | undefined)?.(...args) ?? staticFn(obj, ...args)
  )
}
