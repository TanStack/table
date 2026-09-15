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
 * Copies prototype-instance own properties without carrying over the memo
 * holder or the per-row cell cache, both of which are bound to the source
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
    // `_memo` covers the `_memos` holder and dedicated `_memo<Name>` slots.
    if (!key.startsWith('_memo') && key !== '_cellsCache') {
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
 * Rewrites every own property of a throwaway instance with a different value
 * of a compatible kind.
 *
 * Called once per table on a discarded instance right after its shared shape
 * is created, this pre-marks each declared field as mutable in the engine.
 * Without it, fields that hold the same value on every instance (the
 * `undefined`-declared slots) are assumed constant by V8, and the first real
 * write (a grouped row's `groupingColumnId`, a memo slot, a pinned
 * `position`) deoptimizes every function that embedded that assumption; one
 * wave per field per table.
 */
export function warmInstanceShape(instance: Record<string, unknown>): void {
  const keys = Object.keys(instance)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!
    // Custom features may declare read-only or accessor instance data; those
    // fields cannot be rewritten (and accessor reads could have side effects).
    const descriptor = Object.getOwnPropertyDescriptor(instance, key)
    if (!descriptor?.writable) continue
    const value = instance[key]
    instance[key] =
      typeof value === 'number'
        ? value + 1
        : typeof value === 'string'
          ? `${value}~`
          : value === undefined
            ? null
            : makeObjectMap()
  }
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

/**
 * Checks whether a value is an array or a plain (or null-prototype) object.
 * Class instances, dates, and other exotic values compare by reference only,
 * mirroring the `cloneState` plain-object policy.
 */
function isPlainContainer(value: unknown): value is object {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  if (Array.isArray(value)) {
    return true
  }
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * Returns every enumerable own key, including symbols and non-index array
 * properties. Keeping key presence explicit distinguishes sparse array holes
 * from entries whose value is `undefined`.
 */
function getEnumerableOwnKeys(value: object): Array<PropertyKey> {
  return Reflect.ownKeys(value).filter((key) =>
    Object.prototype.propertyIsEnumerable.call(value, key),
  )
}

const MAX_STATE_COMPARE_DEPTH = 3

/**
 * Structurally compares two state slice values as deeply as stock feature
 * state can nest and no deeper.
 *
 * Three container levels cover flat maps and arrays, arrays of state objects,
 * array-valued filter values, and `columnResizing.columnSizingStart` tuples.
 * Deeper containers and non-plain values compare by reference. A `false`
 * result is always safe: the state update simply proceeds.
 */
export function stateSlicesEqual(a: unknown, b: unknown): boolean {
  return stateSlicesEqualAtDepth(a, b, MAX_STATE_COMPARE_DEPTH)
}

function stateSlicesEqualAtDepth(
  a: unknown,
  b: unknown,
  depth: number,
): boolean {
  if (Object.is(a, b)) {
    return true
  }
  if (depth <= 0 || !isPlainContainer(a) || !isPlainContainer(b)) {
    return false
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false
    }
  }

  const keysA = getEnumerableOwnKeys(a)
  const keysB = getEnumerableOwnKeys(b)
  if (keysA.length !== keysB.length) {
    return false
  }

  const recordA = a as Record<PropertyKey, unknown>
  const recordB = b as Record<PropertyKey, unknown>
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i]!
    if (!Object.prototype.propertyIsEnumerable.call(b, key)) {
      return false
    }
    if (!stateSlicesEqualAtDepth(recordA[key], recordB[key], depth - 1)) {
      return false
    }
  }
  return true
}

type StateSliceForKey<K extends string> = K extends keyof TableState<any>
  ? TableState<any>[K]
  : unknown

export type StateSliceEqualityFn<T> = (current: T, next: T) => boolean

/**
 * Routes a state slice update through the slice's `on<State>Change` handler,
 * preserving the owner's current reference for structural no-ops.
 *
 * Equality is evaluated inside the updater received by the state owner, never
 * against the table's potentially stale controlled snapshot. This keeps
 * same-tick updates composable in queued host containers such as React state,
 * evaluates the original updater only when the owner applies it, and lets atom
 * owners suppress notifications by returning their existing reference.
 *
 * A user-provided change handler is still invoked for a no-op because only that
 * handler's state container can know its latest queued value. The guarded
 * updater returns that container's previous reference, preventing a state write
 * or render in state containers with identity bailout semantics.
 *
 * Hot-path slices that skip guarding entirely (selection maps that scale with
 * row count, pointer-frequency resize state) call their change handler
 * directly instead of routing through this util. Custom feature slices with a
 * cheaper or semantic-aware comparison can pass `isEqual` to override the
 * structural default.
 */
export function setStateSlice<K extends (string & {}) | keyof TableState_All>(
  // Minimal structural shape so any table view (public `Table`,
  // `Table_Internal`, or a custom plugin table) can be passed without forcing
  // the compiler to relate the full table types.
  instance: {
    readonly options: object
  },
  key: K,
  // Unknown keys (custom feature slices) accept any updater shape instead of
  // collapsing to `never`.
  updater: Updater<StateSliceForKey<K>>,
  isEqual: StateSliceEqualityFn<StateSliceForKey<K>> = stateSlicesEqual,
): void {
  const onChangeKey = `on${key.charAt(0).toUpperCase()}${key.slice(1)}Change`
  const onChange = (instance.options as Record<string, unknown>)[
    onChangeKey
  ] as ((updater: Updater<any>) => void) | undefined
  if (!onChange) {
    return
  }

  onChange((current: StateSliceForKey<K>) => {
    const next = functionalUpdate(updater, current)
    return isEqual(current, next) ? current : next
  })
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

/**
 * Wraps a callback so that its first invocation is skipped.
 *
 * Row-model `onAfterUpdate` hooks schedule auto-resets when their inputs
 * change. The initial computation of a row model is not a change, so state
 * resets must not fire for it — otherwise merely reading a row model on mount
 * would wipe initial or controlled state.
 */
export function skipFirstRun(fn: () => void): () => void {
  let hasRun = false
  return () => {
    if (!hasRun) {
      hasRun = true
      return
    }
    fn()
  }
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
    const { debugAll } = table.options
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

export interface API<_TDeps extends ReadonlyArray<any>, _TDepArgs> {
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

export interface PrototypeAPI<_TDeps extends ReadonlyArray<any>, _TDepArgs> {
  fn: (self: any, ...args: any) => any
  memoDeps?: (self: any, depArgs?: any) => [...any] | undefined
  /**
   * Own-property slot name for this API's memo state, for render-hot APIs
   * where the `_memos` holder's per-call dictionary lookup is measurable.
   * The declaring feature must pre-declare the slot as `undefined` at
   * construction (in the constructor's fixed property list for core features,
   * or in `init*InstanceData` for plugins) so first calls stay shape-neutral.
   * Slot names must start with `_memo` so instance-copy helpers skip them.
   */
  memoSlot?: `_memo${string}`
}

export type PrototypeAPIObject<
  TDeps extends ReadonlyArray<any>,
  TDepArgs,
> = Record<string, PrototypeAPI<TDeps, TDepArgs>>

/**
 * Assigns API methods to a prototype object for memory-efficient method sharing.
 * All instances created with this prototype will share the same method references.
 *
 * For memoized methods, the memo state is lazily created and stored in the
 * instance's pre-declared `_memos` holder. This provides shared method code +
 * per-instance caching without hidden-class transitions after construction.
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
  for (const [staticFnName, { fn, memoDeps, memoSlot }] of Object.entries(
    apis,
  )) {
    const { fnKey, fnName } = getFunctionNameInfo(staticFnName)

    if (memoDeps) {
      const makeMemo = (self: any) =>
        tableMemo({
          memoDeps: (depArgs) => memoDeps(self, depArgs),
          fn: (...deps) => fn(self, ...deps),
          fnName,
          objectId: self.id,
          table,
          feature,
        })

      // Memoized methods keep their memo state in pre-declared instance
      // storage, so first calls never add own properties (adding one would
      // fork the instance's hidden class). Memo closures themselves are still
      // created lazily; untouched instances only pay for the declared slots.
      if (memoSlot) {
        // Render-hot APIs read the memo from a dedicated own slot, keeping
        // the per-call load monomorphic.
        prototype[fnKey] = function (this: any, ...args: Array<any>) {
          const memoizedFn = this[memoSlot] ?? (this[memoSlot] = makeMemo(this))
          return memoizedFn(...args)
        }
      } else {
        prototype[fnKey] = function (this: any, ...args: Array<any>) {
          const memos = (this._memos ??=
            makeObjectMap<(...fnArgs: Array<any>) => any>())
          const memoizedFn = memos[fnKey] ?? (memos[fnKey] = makeMemo(this))
          return memoizedFn(...args)
        }
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
 * Looks to run the memoized function with the builder pattern on the object if it exists, otherwise fall back to the static method passed in.
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
