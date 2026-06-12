import type { Table_Internal } from './types/Table'
import type { NoInfer, RowData, Updater } from './types/type-utils'
import type { TableFeatures } from './types/TableFeatures'
import type { TableState, TableState_All } from './types/TableState'

/**
 * Applies a TanStack updater to a value.
 *
 * If the updater is a function it is called with the previous value; otherwise the updater value is returned directly.
 */
export function functionalUpdate<T>(updater: Updater<T>, input: T): T {
  return typeof updater === 'function'
    ? (updater as (i: T) => T)(input)
    : updater
}

/**
 * Clones table state values while preserving non-plain objects.
 *
 * Plain objects and arrays are copied recursively so state updates can avoid mutating existing references.
 */
export function cloneState<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(cloneState) as T
  }

  if (value && typeof value === 'object') {
    const proto = Object.getPrototypeOf(value)

    if (proto !== Object.prototype && proto !== null) {
      return value
    }

    const copy: Record<string, unknown> = {}
    const keys = Object.keys(value)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!
      copy[key] = cloneState((value as Record<string, unknown>)[key])
    }

    return copy as T
  }

  return value
}

/**
 * Creates a table state updater for a single state slice.
 *
 * The updater writes through the table base atom for the slice and supports both value and functional updater forms.
 */
export function makeStateUpdater<
  TFeatures extends TableFeatures,
  K extends (string & {}) | keyof TableState_All | keyof TableState<TFeatures>,
>(
  key: K,
  // Minimal structural shape so any table view (public `Table`,
  // `Table_Internal`, or a custom plugin table) can be passed without forcing
  // the compiler to relate the full table types.
  instance: {
    readonly options: { readonly atoms?: object | undefined }
    readonly baseAtoms: object
  },
) {
  return (updater: Updater<TableState<any>[K & keyof TableState<any>]>) => {
    const externalAtom = (instance.options as any).atoms?.[key]
    const targetAtom = externalAtom ?? (instance.baseAtoms as any)[key]
    targetAtom.set((old: any) => functionalUpdate(updater, old))
  }
}

type AnyFunction = (...args: any) => any

/**
 * Returns whether a value is a function.
 */
export function isFunction<T extends AnyFunction>(d: any): d is T {
  return d instanceof Function
}

/**
 * Flattens a tree of nodes by recursively reading child nodes.
 *
 * The original nodes are preserved in depth-first order.
 */
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

/**
 * Creates a dependency-tracked memoized function for table internals.
 *
 * The memo recomputes only when its dependency tuple changes and can emit debug timing information.
 */
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

  const memoizedFn = (depArgs?: TDepArgs): TResult => {
    onBeforeCompare?.()
    const newDeps = memoDeps?.(depArgs)
    let depsChanged = !newDeps || newDeps.length !== deps?.length
    if (!depsChanged && newDeps) {
      for (let i = 0; i < newDeps.length; i++) {
        if (newDeps[i] !== deps![i]) {
          depsChanged = true
          break
        }
      }
    }
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

  return memoizedFn
}

interface TableMemoOptions<
  TFeatures extends TableFeatures,
  TDeps extends ReadonlyArray<any>,
  TDepArgs,
  TResult,
> extends MemoOptions<TDeps, TDepArgs, TResult> {
  feature?: keyof TFeatures & string
  fnName: string
  objectId?: string
  onAfterUpdate?: () => void
  table: Table_Internal<TFeatures, any>
}

const pad = (str: number | string, num: number) => {
  str = String(str)
  while (str.length < num) {
    str = ' ' + str
  }
  return str
}

/**
 * Creates a table-aware memoized function.
 *
 * This wraps `memo` with table debug options and feature metadata so row models and derived APIs can share consistent diagnostics.
 */
export function tableMemo<
  TFeatures extends TableFeatures,
  TDeps extends ReadonlyArray<any>,
  TDepArgs,
  TResult,
>({
  feature,
  fnName,
  objectId,
  onAfterUpdate,
  table,
  ...memoOptions
}: TableMemoOptions<TFeatures, TDeps, TDepArgs, TResult>) {
  let beforeCompareTime: number
  let afterCompareTime: number
  let startCalcTime: number
  let endCalcTime: number
  let runCount = 0
  let debug: boolean | undefined
  let debugCache: boolean | undefined

  if (process.env.NODE_ENV === 'development') {
    const { debugCache: _debugCache, debugAll } = table.options
    debugCache = _debugCache
    const { parentName } = getFunctionNameInfo(fnName, '.')

    const debugByParent =
      // @ts-expect-error
      table.options[
        `debug${(parentName != 'table' ? parentName + 's' : parentName).replace(
          parentName,
          parentName.charAt(0).toUpperCase() + parentName.slice(1),
        )}`
      ]
    const debugByFeature = feature
      ? // @ts-expect-error
        table.options[
          `debug${feature.charAt(0).toUpperCase() + feature.slice(1)}`
        ]
      : false

    debug = debugAll || debugByParent || debugByFeature
  }

  function logTime(time: number, depsChanged: boolean) {
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
    console.info({
      feature,
      state: table.store.state,
      deps: memoOptions.memoDeps?.toString(),
    })
    console.trace()
    console.groupEnd()
  }

  const onAfterUpdateHandler = () => {
    if (!onAfterUpdate) {
      return
    }

    const { schedule, untrack } = table._reactivity
    schedule(() => untrack(() => onAfterUpdate()))
  }

  const debugOptions =
    process.env.NODE_ENV === 'development'
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
            onAfterUpdateHandler()
          },
        }
      : {
          onAfterUpdate: () => {
            onAfterUpdateHandler()
          },
        }

  return memo({
    ...memoOptions,
    ...debugOptions,
  })
}

export interface API<TDeps extends ReadonlyArray<any>, TDepArgs> {
  fn: (...args: any) => any
  memoDeps?: (depArgs?: any) => [...any] | undefined
}

export type APIObject<TDeps extends ReadonlyArray<any>, TDepArgs> = Record<
  string,
  API<TDeps, TDepArgs>
>

/**
 * Assumes that a function name is in the format of `parentName_fnKey` and returns the `fnKey` and `fnName` in the format of `parentName.fnKey`.
 */
export function getFunctionNameInfo(
  staticFnName: string,
  splitBy: '_' | '.' = '_',
) {
  const [parentName, fnKey] = staticFnName.split(splitBy)
  const fnName = `${parentName}.${fnKey}`
  return { fnKey, fnName, parentName } as {
    fnKey: string
    fnName: string
    parentName: string
  }
}

/**
 * Assigns Table API methods directly to the table instance.
 * Unlike row/cell/column/header, the table is a singleton so methods are assigned directly.
 */
export function assignTableAPIs<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TDeps extends ReadonlyArray<any>,
  TDepArgs,
>(
  feature: keyof TFeatures & string,
  table: Table_Internal<TFeatures, TData>,
  apis: APIObject<TDeps, NoInfer<TDepArgs>>,
): void {
  for (const [staticFnName, { fn, memoDeps }] of Object.entries(apis)) {
    const { fnKey, fnName } = getFunctionNameInfo(staticFnName)

    ;(table as Record<string, any>)[fnKey] = memoDeps
      ? tableMemo({
          memoDeps,
          fn,
          fnName,
          table,
          feature,
        })
      : fn
  }
}

export interface PrototypeAPI<TDeps extends ReadonlyArray<any>, TDepArgs> {
  fn: (self: any, ...args: any) => any
  memoDeps?: (self: any, depArgs?: any) => [...any] | undefined
}

export type PrototypeAPIObject<
  TDeps extends ReadonlyArray<any>,
  TDepArgs,
> = Record<string, PrototypeAPI<TDeps, TDepArgs>>

/**
 * Assigns API methods to a prototype object for memory-efficient method sharing.
 * All instances created with this prototype will share the same method references.
 *
 * For memoized methods, the memo state is lazily created and stored on each instance.
 * This provides the best of both worlds: shared method code + per-instance caching.
 */
export function assignPrototypeAPIs<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TDeps extends ReadonlyArray<any>,
  TDepArgs,
>(
  feature: keyof TFeatures & string,
  prototype: Record<string, any>,
  table: Table_Internal<TFeatures, TData>,
  apis: PrototypeAPIObject<TDeps, NoInfer<TDepArgs>>,
): void {
  for (const [staticFnName, { fn, memoDeps }] of Object.entries(apis)) {
    const { fnKey, fnName } = getFunctionNameInfo(staticFnName)

    if (memoDeps) {
      // For memoized methods, create a function that lazily initializes
      // the memo on first access and stores it on the instance
      const memoKey = `_memo_${fnKey}`

      prototype[fnKey] = function (this: any, ...args: Array<any>) {
        // Lazily create memo on first access for this instance
        if (!this[memoKey]) {
          const self = this
          this[memoKey] = tableMemo({
            memoDeps: (depArgs) => memoDeps(self, depArgs),
            fn: (...deps) => fn(self, ...deps),
            fnName,
            objectId: self.id,
            table,
            feature,
          })
        }
        return this[memoKey](...args)
      }
    } else {
      // Non-memoized methods just call the static function with `this`
      prototype[fnKey] = function (this: any, ...args: Array<any>) {
        return fn(this, ...args)
      }
    }
  }
}

/**
 * Looks to run the memoized function with the builder pattern on the object if it exists, otherwise fallback to the static method passed in.
 */
export function callMemoOrStaticFn<
  TObject extends Record<string, any>,
  TArgs extends Array<any>,
  TReturn,
>(
  obj: TObject,
  fnKey: string,
  staticFn: (obj: TObject, ...args: TArgs) => TReturn,
  ...args: TArgs
): TReturn {
  return (
    (obj[fnKey] as Function | undefined)?.(...args) ?? staticFn(obj, ...args)
  )
}
