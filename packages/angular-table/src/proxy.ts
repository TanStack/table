import type { Signal } from '@angular/core'
import { computed } from '@angular/core'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

export function defineLazyComputedProperty<T extends object>(
  notifier: Signal<Table<{}, any>>,
  setObjectOptions: {
    originalObject: T
    property: keyof T & string
    valueFn: Function
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
 * Here we'll handle all type of accessors:
 * - 0 argument -> e.g. table.getCanNextPage())
 * - 0~1 arguments -> e.g. table.getIsSomeRowsPinned(position?)
 * - 1 required argument -> e.g. table.getColumn(columnId)
 * - 1+ argument -> e.g. table.getRow(id, searchAll?)
 *
 * Since we are not able to detect automatically the accessors parameters,
 * we'll wrap all accessors into a cached function wrapping a computed
 * that return it's value based on the given parameters
 */
export function toComputed<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(notifier: Signal<Table<TFeatures, TData>>, fn: Function, debugName: string) {
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
    return computedFn
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

  return computedFn
}

function serializeArgs(...args: Array<any>) {
  return JSON.stringify(args)
}
