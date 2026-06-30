import Alpine from 'alpinejs'
import { constructTable } from '@tanstack/table-core'
import { FlexRender, flexRender } from './flexRender'
import { alpineReactivity } from './reactivity'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core'

export type AlpineTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table<TFeatures, TData> & {
  /**
   * A lower-level helper to render the content of a cell, header, or footer from a render function and its context.
   */
  flexRender: typeof flexRender

  /**
   * A convenience helper to render a cell, header, or footer object. Call from `x-html`, e.g. `FlexRender({ header })`.
   */
  FlexRender: typeof FlexRender
}

export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(tableOptions: TableOptions<TFeatures, TData>): AlpineTable<TFeatures, TData> {
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

  const table = constructTable(mergedOptions) as unknown as AlpineTable<
    TFeatures,
    TData
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

    // Built-in exotic objects (Map, Set, Date, etc.) rely on internal slots and
    // throw "incompatible receiver" when their getters/methods run with a Proxy
    // as the receiver (e.g. `getFacetedUniqueValues().size`). Return them as-is;
    // the read that produced them already tracked `_ver` at the call site.
    if (
      value instanceof Map ||
      value instanceof Set ||
      value instanceof WeakMap ||
      value instanceof WeakSet ||
      value instanceof Date ||
      value instanceof RegExp ||
      value instanceof Promise
    ) {
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

  return toReactiveProxy(table)
}
