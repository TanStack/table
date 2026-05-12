import Alpine from 'alpinejs'
import { constructTable } from '@tanstack/table-core'
import { flexRender } from './flexRender'
import { alpineReactivity } from './reactivity'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export type AlpineTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
> = Table<TFeatures, TData> & {
  /**
   * A helper function to render the content of a cell, header, or footer.
   */
  flexRender: typeof flexRender
  
  /**
   * The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `createTable`.
   *
   * @example
   * const table = createTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state
   *
   * console.log(table.state.globalFilter)
   */
  readonly state: Readonly<TSelected>
}

export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
>(
  tableOptions: TableOptions<TFeatures, TData>,
  selector?: (state: TableState<TFeatures>) => TSelected,
): AlpineTable<TFeatures, TData, TSelected> {

  const mergedOptions: TableOptions<TFeatures, TData> = {
    ...tableOptions,
    _features: {
      coreReativityFeature: alpineReactivity(),
      ...tableOptions._features,
    },
    mergeOptions: (
      defaultOptions: TableOptions<TFeatures, TData>,
      newOptions: Partial<TableOptions<TFeatures, TData>>,
    ) => {
      return {
        ...defaultOptions,
        ...newOptions,
      }
    },
  }

  const table = constructTable(mergedOptions) as AlpineTable<
    TFeatures,
    TData,
    TSelected
  >

  table.flexRender = flexRender

  const reactivity = Alpine.reactive({ _ver: 0 })

  table.store.subscribe(() => {
    reactivity._ver++
  })

  const proxyCache = new WeakMap<object, object>()

  const toReactiveProxy = <TValue>(value: TValue): TValue => {
    if (typeof value !== 'object' || value === null) {
      return value
    }

    const cachedProxy = proxyCache.get(value)
    if (cachedProxy) {
      return cachedProxy as TValue
    }

    const proxy = new Proxy(value, {
      get(target, prop, receiver) {
        if (prop === '__v_skip') {
          return true
        }

        const resolvedValue = Reflect.get(target, prop, receiver)

        if (typeof resolvedValue === 'function') {
          return (...args: Array<unknown>) => {
            void reactivity._ver
            return toReactiveProxy((resolvedValue as Function).apply(target, args))
          }
        }

        void reactivity._ver
        return toReactiveProxy(resolvedValue)
      },
    })

    proxyCache.set(value, proxy)
    return proxy
  }

  Object.defineProperty(table, 'state', {
    get() {
      void reactivity._ver
      const state = selector ? selector(table.store.state) : table.store.state
      return toReactiveProxy(state) as Readonly<TSelected>
    },
    enumerable: true,
    configurable: true,
  })

  return toReactiveProxy(table)
}
