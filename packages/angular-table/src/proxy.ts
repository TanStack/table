import { computed, untracked } from '@angular/core'
import type { Signal } from '@angular/core'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

type TableSignal<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table<TFeatures, TData> & Signal<Table<TFeatures, TData>>

/**
 * @deprecated
 * @param tableSignal
 * @returns
 */
export function proxifyTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  tableSignal: Signal<Table<TFeatures, TData>>,
): Table<TFeatures, TData> & Signal<Table<TFeatures, TData>> {
  const internalState = tableSignal as TableSignal<TFeatures, TData>

  return new Proxy(internalState, {
    apply() {
      return tableSignal()
    },
    get(target, property): any {
      if (typeof property === 'string' && target[property]) {
        return target[property]
      }
      const table = untracked(tableSignal)
      /**
       * Attempt to convert all accessors into computed ones,
       * excluding handlers as they do not retain any reactive value
       */
      if (
        typeof property === 'string' &&
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
      return (target[property] = table[property])
    },
    has(_, prop) {
      const t = untracked(tableSignal)
      return !!Reflect.get(tableSignal, prop)
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

export function proxifyTableV2<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  tableSignal: Signal<Table<TFeatures, TData>>,
): Table<TFeatures, TData> & Signal<Table<TFeatures, TData>> {
  const internalState = tableSignal as TableSignal<TFeatures, TData>

  return new Proxy(internalState, {
    apply() {
      return tableSignal()
    },
    get(target, property): any {
      if (typeof property === 'string' && Reflect.has(target, property)) {
        return Reflect.get(target, property)
      }
      const table = untracked(tableSignal)
      // @ts-expect-error Typescript
      return (target[property] = table[property])
    },
    has(_, prop) {
      const t = untracked(tableSignal)
      return !!Reflect.get(tableSignal, prop)
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
export function toComputed<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(signal: Signal<Table<TFeatures, TData>>, fn: Function, debugName?: string) {
  const hasArgs = fn.length > 0
  if (!hasArgs) {
    return computed(
      () => {
        void signal()
        return fn()
      },
      { equal: () => false, debugName },
    )
  }

  const computedCache: Record<string, Signal<unknown>> = {}

  return (...argsArray: Array<any>) => {
    const serializedArgs = serializeArgs(...argsArray)
    if (computedCache.hasOwnProperty(serializedArgs)) {
      return computedCache[serializedArgs]?.()
    }
    const computedSignal = computed(
      () => {
        void signal()
        return fn(...argsArray)
      },
      { debugName },
    )

    computedCache[serializedArgs] = computedSignal

    return computedSignal()
  }
}

function serializeArgs(...args: Array<any>) {
  return JSON.stringify(args)
}
