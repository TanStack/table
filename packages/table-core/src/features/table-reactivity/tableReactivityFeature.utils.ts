import { $internalMemoFnMeta, getMemoFnMeta } from '../../utils'
import type { MemoFnMeta } from '@tanstack/table-core'
import type { ReactivityFeatureFactoryOptions } from './tableReactivityFeature'

const $TABLE_REACTIVE = Symbol('reactive')

function markReactive<T extends object>(obj: T): void {
  Object.defineProperty(obj, $TABLE_REACTIVE, { value: true })
}

function isReactive<T>(obj: T): boolean {
  return Reflect.get(obj as {}, $TABLE_REACTIVE) === true
}

export type Accessor<T> = () => T

/**
 * Defines a lazy computed property on an object. The property is initialized
 * with a getter that computes its value only when accessed for the first time.
 * After the first access, the computed value is cached, and the getter is
 * replaced with a direct property assignment for efficiency.
 *
 * @internal should be used only internally
 */
export function defineLazyComputedProperty<T extends object>(
  notifier: Accessor<T>,
  setObjectOptions: {
    originalObject: T
    property: keyof T & string
    valueFn: (...args: any) => any
    overridePrototype?: boolean
    factory: ReactivityFeatureFactoryOptions
  },
) {
  const { originalObject, property, overridePrototype, valueFn, factory } =
    setObjectOptions

  if (overridePrototype) {
    assignReactivePrototypeAPI(notifier, originalObject, property, factory)
  } else {
    Object.defineProperty(originalObject, property, {
      enumerable: true,
      configurable: true,
      get() {
        const computedValue = toComputed(notifier, valueFn, property, factory)
        markReactive(computedValue)
        // Once the property is set the first time, we don't need a getter anymore
        // since we have a computed / cached fn value
        Object.defineProperty(originalObject, property, {
          value: computedValue,
          configurable: true,
          enumerable: true,
        })
        return computedValue
      },
    })
  }
}

/**
 * @internal should be used only internally
 */
type ComputedFunction<T> = T extends () => infer TReturn
  ? Accessor<TReturn>
  : // 1+ args
    T extends (arg0?: any, ...args: Array<any>) => any
    ? T
    : never

/**
 * @description Transform a function into a computed that react to given notifier re-computations
 *
 * Here we'll handle all type of accessors:
 * - 0 argument -> e.g. table.getCanNextPage())
 * - 0~1 arguments -> e.g. table.getIsSomeRowsPinned(position?)
 * - 1 required argument -> e.g. table.getColumn(columnId)
 * - 1+ argument -> e.g. table.getRow(id, searchAll?)
 *
 * Since we are not able to detect automatically the accessors parameters,
 * we'll wrap all accessors into a cached function wrapping a computed
 * that return it's value based on the given parameters
 *
 * @internal should be used only internally
 */
export function toComputed<
  T,
  TReturn,
  TFunction extends (...args: any) => TReturn,
>(
  notifier: Accessor<T>,
  fn: TFunction,
  debugName: string,
  factory: ReactivityFeatureFactoryOptions,
): ComputedFunction<TFunction> {
  const { createMemo } = factory
  const hasArgs = getFnArgsLength(fn) > 0
  if (!hasArgs) {
    const computedFn = createMemo(() => {
      void notifier()
      return fn()
    })
    Object.defineProperty(computedFn, 'name', { value: debugName })
    markReactive(computedFn)
    return computedFn as ComputedFunction<TFunction>
  }

  const computedFn: ((this: unknown, ...argsArray: Array<any>) => unknown) & {
    _reactiveCache?: Record<string, Accessor<unknown>>
  } = function (this: unknown, ...argsArray: Array<any>) {
    const cacheable =
      argsArray.length === 0 ||
      argsArray.every((arg) => {
        return (
          arg === null ||
          arg === undefined ||
          typeof arg === 'string' ||
          typeof arg === 'number' ||
          typeof arg === 'boolean' ||
          typeof arg === 'symbol'
        )
      })
    if (!cacheable) {
      return fn.apply(this, argsArray)
    }
    const serializedArgs = serializeArgs(...argsArray)
    if ((computedFn._reactiveCache ??= {})[serializedArgs]) {
      return computedFn._reactiveCache[serializedArgs]()
    }
    const computedSignal = createMemo(() => {
      void notifier()
      return fn.apply(this, argsArray)
    })

    computedFn._reactiveCache[serializedArgs] = computedSignal

    return computedSignal()
  }

  Object.defineProperty(computedFn, 'name', { value: debugName })
  markReactive(computedFn)

  return computedFn as ComputedFunction<TFunction>
}

function serializeArgs(...args: Array<any>) {
  return JSON.stringify(args)
}

function getFnArgsLength(
  fn: ((...args: any) => any) & { originalArgsLength?: number },
): number {
  return Math.max(0, getMemoFnMeta(fn)?.originalArgsLength ?? fn.length)
}

function assignReactivePrototypeAPI(
  notifier: Accessor<unknown>,
  prototype: Record<string, any>,
  fnName: string,
  factory: ReactivityFeatureFactoryOptions,
) {
  if (isReactive(prototype[fnName])) return

  const { createMemo } = factory

  const fn = prototype[fnName]
  const originalArgsLength = getFnArgsLength(fn)

  if (originalArgsLength <= 1) {
    Object.defineProperty(prototype, fnName, {
      enumerable: true,
      configurable: true,
      get(this) {
        const self = this
        // Create a cache in the current prototype to allow the signals
        // to be garbage collected. Shorthand for a WeakMap implementation
        self._reactiveCache ??= {}
        const cached = (self._reactiveCache[`${self.id}${fnName}`] ??=
          createMemo(() => {
            notifier()
            return fn.apply(self)
          }))
        markReactive(cached)
        cached[$internalMemoFnMeta] = {
          originalArgsLength,
        } satisfies MemoFnMeta
        return cached
      },
    })
  } else {
    prototype[fnName] = function (this: unknown, ...args: Array<any>) {
      notifier()
      return fn.apply(this, args)
    }
    markReactive(prototype[fnName])
    prototype[fnName][$internalMemoFnMeta] = {
      originalArgsLength,
    } satisfies MemoFnMeta
  }
}

export function setReactivePropertiesOnObject<T extends object>(
  notifier: Accessor<T>,
  obj: { [key: string]: any },
  options: {
    overridePrototype?: boolean
    skipProperty: (property: string) => boolean
    factory: ReactivityFeatureFactoryOptions
  },
) {
  const { skipProperty, factory } = options
  if (isReactive(obj)) {
    return
  }
  markReactive(obj)

  for (const property in obj) {
    const value = obj[property]
    if (typeof value !== 'function' || skipProperty(property)) {
      continue
    }
    defineLazyComputedProperty(notifier, {
      valueFn: value,
      property,
      originalObject: obj,
      overridePrototype: options.overridePrototype,
      factory: factory,
    })
  }
}
