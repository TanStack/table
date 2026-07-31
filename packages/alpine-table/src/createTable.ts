import Alpine from 'alpinejs'
import { shallow } from '@tanstack/store'
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

/**
 * Creates an Alpine-reactive table instance.
 *
 * Reactivity is bridged through a single version counter that every proxied
 * table read registers as a dependency, so by default ANY state change
 * re-evaluates every Alpine binding that touches the table. Pass a `selector`
 * to gate that: the counter then only bumps when the selected slice of state
 * changes (shallow compare). Use `() => ({})` to opt out of state-driven
 * re-evaluation entirely and handle high-frequency state (e.g. column
 * resizing) with explicit `table.atoms.<slice>.subscribe()` side effects.
 * Options changes (e.g. new `data`) always re-evaluate.
 *
 * @example
 * ```ts
 * const table = createTable(options, (state) => ({ sorting: state.sorting }))
 * ```
 */
export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  tableOptions: TableOptions<TFeatures, TData>,
  selector?: (state: TableState<TFeatures>) => unknown,
): AlpineTable<TFeatures, TData> {
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

  // With a selector, only bump the version counter (and thereby re-evaluate
  // table-reading Alpine bindings) when the selected state actually changes.
  // No selector keeps the previous behavior of re-evaluating on every state
  // change.
  let lastSelected = selector ? selector(table.store.state) : undefined

  table.store.subscribe(() => {
    if (selector) {
      const nextSelected = selector(table.store.state)
      if (shallow(lastSelected as any, nextSelected as any)) {
        return
      }
      lastSelected = nextSelected
    }
    reactivity._ver++
  })

  // Reactively sync options when external Alpine-reactive getters change (e.g.
  // a `get data()` backed by `Alpine.reactive`). Reading the option getters
  // inside the effect registers the dependencies, so the effect re-runs when
  // they change and re-applies the live values via `setOptions`.
  //
  // `setOptions` writes option atoms, not the state store, so a `data` (or
  // other option) change does not emit on `table.store` and would not bump
  // `_ver` on its own. We bump `_ver` here so the template re-pulls derived
  // APIs like `getRowModel()`. The effect never reads `_ver`, so writing it
  // does not re-trigger this effect.
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

  // Cache method wrappers per (target, prop) so repeated reads of the same
  // function property (e.g. `cell.renderValue` across thousands of cells)
  // reuse one closure instead of allocating a new one per access.
  const wrapperCache = new WeakMap<
    object,
    Map<PropertyKey, { original: Function; wrapper: Function }>
  >()

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
        const descriptor = Reflect.getOwnPropertyDescriptor(target, prop)

        // A Proxy must return the exact value of a non-configurable,
        // non-writable data property. Core exposes options and optionAtoms this
        // way, which also means callback reads preserve their source identity.
        // The containing property read still tracks Alpine's version counter.
        if (
          descriptor &&
          !descriptor.configurable &&
          'value' in descriptor &&
          !descriptor.writable
        ) {
          void reactivity._ver
          return resolvedValue
        }

        if (typeof resolvedValue === 'function') {
          let targetWrappers = wrapperCache.get(target)
          if (!targetWrappers) {
            targetWrappers = new Map()
            wrapperCache.set(target, targetWrappers)
          }
          const cached = targetWrappers.get(prop)
          if (cached && cached.original === resolvedValue) {
            return cached.wrapper
          }
          const wrapper = (...args: Array<unknown>) => {
            void reactivity._ver
            return toReactiveProxy(
              (resolvedValue as Function).apply(target, args),
            )
          }
          targetWrappers.set(prop, { original: resolvedValue, wrapper })
          return wrapper
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
