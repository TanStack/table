import Alpine from 'alpinejs'
import { constructTable } from '@tanstack/table-core'
import { FlexRender, flexRender } from './flexRender'
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
   * A lower-level helper to render the content of a cell, header, or footer from a render function and its context.
   */
  flexRender: typeof flexRender

  /**
   * A convenience helper to render a cell, header, or footer object. Call from `x-html`, e.g. `FlexRender({ header })`.
   */
  FlexRender: typeof FlexRender

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
    features: {
      coreReactivityFeature: alpineReactivity(),
      ...tableOptions.features,
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
  table.FlexRender = FlexRender

  const reactivity = Alpine.reactive({ _ver: 0 })

  table.store.subscribe(() => {
    reactivity._ver++
  })

  // Reactively sync options when external Alpine-reactive getters change (e.g.
  // a `get data()` backed by `Alpine.reactive`). Reading the option getters
  // inside the effect registers the dependencies, so the effect re-runs when
  // they change and re-applies the live values via `setOptions`.
  //
  // `setOptions` writes to the options store, not the state store, so a `data`
  // (or other option) change does not emit on `table.store` and would not bump
  // `_ver` on its own. We bump `_ver` here so the template re-pulls derived
  // APIs like `getRowModel()`, which recompute from the new options. The effect
  // never reads `_ver`, so writing it does not re-trigger this effect.
  let initialized = false
  Alpine.effect(() => {
    const state = tableOptions.state as Record<string, unknown> | undefined
    if (state) {
      for (const key in state) {
        void state[key]
      }
    }
    void tableOptions.data

    table.setOptions((prev) => ({
      ...prev,
      ...tableOptions,
    }))

    if (initialized) {
      reactivity._ver++
    }
    initialized = true
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
            return toReactiveProxy(
              (resolvedValue as Function).apply(target, args),
            )
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
