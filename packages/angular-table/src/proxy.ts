import { type Signal, computed, untracked } from '@angular/core'
import {
  type RowData,
  type Table,
  type TableFeatures,
} from '@tanstack/table-core'

type TableSignal<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> = Table<TFeatures, TFns, TData> & Signal<Table<TFeatures, TFns, TData>>

export function proxifyTable<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  tableSignal: Signal<Table<TFeatures, TFns, TData>>,
): Table<TFeatures, TFns, TData> & Signal<Table<TFeatures, TFns, TData>> {
  const internalState = tableSignal as TableSignal<TFeatures, TFns, TData>

  return new Proxy(internalState, {
    apply() {
      return tableSignal()
    },
    get(target, property: keyof Table<TFeatures, TFns, TData>): any {
      if (target[property]) {
        return target[property]
      }
      const table = untracked(tableSignal)
      /**
       * Attempt to convert all accessors into computed ones,
       * excluding handlers as they do not retain any reactive value
       */
      if (
        property.startsWith('get') &&
        !property.endsWith('Handler') &&
        !property.endsWith('Model')
      ) {
        const maybeFn = table[property] as Function | never
        if (typeof maybeFn === 'function') {
          Object.defineProperty(target, property, {
            value: toComputed(tableSignal, maybeFn),
            configurable: true,
            enumerable: true,
          })
          return target[property]
        }
      }
      // @ts-expect-error
      return (target[property] = table[property])
    },
    has(_, prop: keyof Table<TFeatures, TFns, TData>) {
      return !!untracked(tableSignal)[prop]
    },
    ownKeys() {
      return Reflect.ownKeys(untracked(tableSignal))
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true,
      }
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
function toComputed<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(signal: Signal<Table<TFeatures, TFns, TData>>, fn: Function) {
  const hasArgs = fn.length > 0
  if (!hasArgs) {
    return computed(() => {
      void signal()
      return fn()
    })
  }

  const computedCache: Record<string, Signal<unknown>> = {}

  return (...argsArray: Array<any>) => {
    const serializedArgs = serializeArgs(...argsArray)
    if (computedCache.hasOwnProperty(serializedArgs)) {
      return computedCache[serializedArgs]?.()
    }
    const computedSignal = computed(() => {
      void signal()
      return fn(...argsArray)
    })

    computedCache[serializedArgs] = computedSignal

    return computedSignal()
  }
}

function serializeArgs(...args: Array<any>) {
  return JSON.stringify(args)
}
