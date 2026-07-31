import type { Table_Internal } from './types/Table'
import type { RowData, Updater } from './types/type-utils'
import type { TableFeatures } from './types/TableFeatures'
import type { TableState, TableState_All } from './types/TableState'
import type { ReadonlyAtom } from '@tanstack/store'

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

    const copy: Record<string, unknown> = proto === null ? makeObjectMap() : {}
    const keys = Object.keys(value)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!
      Object.defineProperty(copy, key, {
        configurable: true,
        enumerable: true,
        value: cloneState((value as Record<string, unknown>)[key]),
        writable: true,
      })
    }

    return copy as T
  }

  return value
}

/**
 * Copies prototype-instance own properties without carrying over lazy memo
 * closures or the per-row cell cache, both of which are bound to the source
 * instance (cached cells reference the source row).
 */
export function copyInstancePropertiesWithoutMemos<
  TTarget extends Record<string, any>,
  TSource extends Record<string, any>,
>(target: TTarget, source: TSource): TTarget & TSource {
  const keys = Object.keys(source)
  const targetRecord = target as Record<string, any>

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!
    if (!key.startsWith('_memo_') && key !== '_cellsCache') {
      targetRecord[key] = source[key]
    }
  }

  return target as TTarget & TSource
}

/**
 * Creates an object intended only for string-keyed dictionary lookups.
 *
 * The null prototype keeps user-controlled ids such as `__proto__` and
 * `hasOwnProperty` as plain data keys.
 */
export function makeObjectMap<TValue = unknown>(): Record<string, TValue> {
  return Object.create(null) as Record<string, TValue>
}

/**
 * Checks whether an object owns a key, including null-prototype dictionaries.
 */
export function hasOwn(obj: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
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

interface TableMemoOptions<
  TFeatures extends TableFeatures,
  TResult,
> {
  compare?: (previous: TResult, next: TResult) => boolean
  feature?: keyof TFeatures & string
  fn: () => TResult
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
 * The native readonly atom is created on the first public read so eager
 * framework computeds cannot evaluate during incomplete table construction.
 */
export function tableMemo<
  TFeatures extends TableFeatures,
  TResult,
>({
  compare,
  feature,
  fn,
  fnName,
  objectId,
  onAfterUpdate,
  table,
}: TableMemoOptions<TFeatures, TResult>): () => TResult {
  let atom: ReadonlyAtom<TResult> | undefined
  let evaluationCount = 0
  let hasStableResult = false
  let stableResult: TResult
  let debug = false
  let debugCache = false
  let debugInitialized = false
  const isDevelopment = process.env.NODE_ENV === 'development'

  const initializeDebug = () => {
    if (!isDevelopment || debugInitialized) {
      return
    }
    debugInitialized = true

    table._reactivity.untrack(() => {
      const options = table.options as unknown as Record<
        PropertyKey,
        unknown
      >
      const { parentName } = getFunctionNameInfo(fnName, '.')
      const debugParent = (
        parentName !== 'table' ? `${parentName}s` : parentName
      ).replace(
        parentName,
        parentName.charAt(0).toUpperCase() + parentName.slice(1),
      )
      const debugByParent = options[`debug${debugParent}`]
      const debugByFeature = feature
        ? options[
            `debug${feature.charAt(0).toUpperCase() + feature.slice(1)}`
          ]
        : false

      debug = Boolean(options.debugAll || debugByParent || debugByFeature)
      debugCache = Boolean(options.debugCache)
    })
  }

  function logTime(time: number, evaluated: boolean) {
    const runType = evaluated
      ? evaluationCount === 1
        ? '(1st run)'
        : `(rerun #${evaluationCount - 1})`
      : '(cache)'

    console.groupCollapsed(
      `%c⏱ ${pad(`${time.toFixed(1)} ms`, 12)} %c${runType}%c ${fnName}%c ${objectId ? `(${fnName.split('.')[0]}Id: ${objectId})` : ''}`,
      `font-size: .6rem; font-weight: bold; ${
        evaluated
          ? `color: hsl(
        ${Math.max(0, Math.min(120 - Math.log10(time) * 60, 120))}deg 100% 31%);`
          : ''
      } `,
      `color: ${evaluationCount < 2 ? '#FF00FF' : '#FF1493'}`,
      'color: #666',
      'color: #87CEEB',
    )
    console.info({
      feature,
      state: table.store.state,
    })
    console.trace()
    console.groupEnd()
  }

  const createAtom = () => {
    initializeDebug()
    atom = table._reactivity.createReadonlyAtom(
      () => {
        const startedAt = isDevelopment && debug ? performance.now() : 0
        let result: TResult
        try {
          const nextResult = fn()
          result =
            hasStableResult && compare?.(stableResult, nextResult)
              ? stableResult
              : nextResult
        } catch (error) {
          // A few native computed implementations clear their dirty flag
          // even when evaluation or comparison throws. Drop this instance
          // so the next public read can retry instead of returning a stale
          // snapshot.
          atom = undefined
          throw error
        }

        stableResult = result
        hasStableResult = true
        if (isDevelopment) {
          evaluationCount++
        }

        if (isDevelopment && debug) {
          const executionTime =
            Math.round((performance.now() - startedAt) * 100) / 100
          table._reactivity.untrack(() => logTime(executionTime, true))
        }

        if (onAfterUpdate) {
          const { schedule, untrack } = table._reactivity
          schedule(() => untrack(onAfterUpdate))
        }

        return result
      },
      {
        debugName: fnName,
        mode: 'memo',
      },
    )
    return atom
  }

  if (!isDevelopment) {
    return () => (atom ?? createAtom()).get()
  }

  return () => {
    const startedAt = debugCache ? performance.now() : 0
    const beforeEvaluation = evaluationCount
    const result = (atom ?? createAtom()).get()

    if (debugCache && evaluationCount === beforeEvaluation) {
      const cacheTime =
        Math.round((performance.now() - startedAt) * 100) / 100
      table._reactivity.untrack(() => logTime(cacheTime, false))
    }

    return result
  }
}

export type API =
  | {
      compare?: (previous: any, next: any) => boolean
      computed: () => any
      fn?: never
    }
  | {
      compare?: never
      computed?: never
      fn: (...args: Array<any>) => any
    }

export type APIObject = Record<string, API>

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
>(
  feature: keyof TFeatures & string,
  table: Table_Internal<TFeatures, TData>,
  apis: APIObject,
): void {
  for (const [staticFnName, api] of Object.entries(apis)) {
    const { fnKey, fnName } = getFunctionNameInfo(staticFnName)

    ;(table as Record<string, any>)[fnKey] =
      'computed' in api && api.computed
        ? tableMemo({
            compare: api.compare,
            fn: api.computed,
            fnName,
            table,
            feature,
          })
        : api.fn
  }
}

export type PrototypeAPI =
  | {
      compare?: (previous: any, next: any) => boolean
      computed: (self: any) => any
      fn?: never
    }
  | {
      compare?: never
      computed?: never
      fn: (self: any, ...args: Array<any>) => any
    }

export type PrototypeAPIObject = Record<string, PrototypeAPI>

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
>(
  feature: keyof TFeatures & string,
  prototype: Record<string, any>,
  table: Table_Internal<TFeatures, TData>,
  apis: PrototypeAPIObject,
): void {
  for (const [staticFnName, api] of Object.entries(apis)) {
    const { fnKey, fnName } = getFunctionNameInfo(staticFnName)

    if ('computed' in api && api.computed) {
      // For memoized methods, create a function that lazily initializes
      // the memo on first access and stores it on the instance
      const memoKey = `_memo_${fnKey}`

      prototype[fnKey] = function (this: any) {
        // Lazily create memo on first access for this instance
        if (!this[memoKey]) {
          const self = this
          this[memoKey] = tableMemo({
            compare: api.compare,
            fn: () => api.computed(self),
            fnName,
            objectId: self.id,
            table,
            feature,
          })
        }
        return this[memoKey]()
      }
    } else {
      // Non-memoized methods just call the static function with `this`
      prototype[fnKey] = function (this: any, ...args: Array<any>) {
        return api.fn(this, ...args)
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
