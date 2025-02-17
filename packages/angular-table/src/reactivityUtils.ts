import { computed } from '@angular/core'
import type { Signal } from '@angular/core'

export const $TABLE_REACTIVE = Symbol('reactive')

export function markReactive<T extends object>(obj: T): void {
  Object.defineProperty(obj, $TABLE_REACTIVE, { value: true })
}

export function isReactive<T extends object>(
  obj: T,
): obj is T & { [$TABLE_REACTIVE]: true } {
  return Reflect.get(obj, $TABLE_REACTIVE) === true
}

/**
 * Defines a lazy computed property on an object. The property is initialized
 * with a getter that computes its value only when accessed for the first time.
 * After the first access, the computed value is cached, and the getter is
 * replaced with a direct property assignment for efficiency.
 *
 * @internal should be used only internally
 */
export function defineLazyComputedProperty<T extends object>(
  notifier: Signal<T>,
  setObjectOptions: {
    originalObject: T
    property: keyof T & string
    valueFn: (...args: any) => any
  },
) {
  const { valueFn, originalObject, property } = setObjectOptions
  let computedValue: (...args: Array<unknown>) => any
  Object.defineProperty(originalObject, property, {
    enumerable: true,
    configurable: true,
    get() {
      computedValue = toComputed(notifier, valueFn, property)
      // Once the property is set the first time, we don't need a getter anymore
      // since we have a computed / cached fn value
      Object.defineProperty(this, property, {
        value: computedValue,
        configurable: true,
        enumerable: true,
      })
      return computedValue
    },
  })
}

/**
 * @internal should be used only internally
 */
type ComputedFunction<T> =
  // 0 args
  T extends (...args: []) => infer TReturn
    ? Signal<TReturn>
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
  notifier: Signal<T>,
  fn: TFunction,
  debugName: string,
): ComputedFunction<TFunction> {
  const hasArgs = fn.length > 0
  if (!hasArgs) {
    const computedFn = computed(
      () => {
        void notifier()
        return fn()
      },
      { debugName },
    )
    Object.defineProperty(computedFn, 'name', { value: debugName })
    markReactive(computedFn)
    return computedFn as ComputedFunction<TFunction>
  }

  const computedCache: Record<string, Signal<unknown>> = {}

  const computedFn = (arg0: any, ...otherArgs: Array<any>) => {
    const argsArray = [arg0, ...otherArgs]
    const serializedArgs = serializeArgs(...argsArray)
    if (computedCache.hasOwnProperty(serializedArgs)) {
      return computedCache[serializedArgs]?.()
    }
    const computedSignal = computed(
      () => {
        void notifier()
        return fn(...argsArray)
      },
      { debugName },
    )

    computedCache[serializedArgs] = computedSignal

    return computedSignal()
  }

  Object.defineProperty(computedFn, 'name', { value: debugName })
  markReactive(computedFn)

  return computedFn as ComputedFunction<TFunction>
}

function serializeArgs(...args: Array<any>) {
  return JSON.stringify(args)
}
