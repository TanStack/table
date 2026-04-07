import {
  constructReactivityFeature,
  constructTable,
} from '@tanstack/table-core'
import { useStore } from '@tanstack/svelte-store'
import { untrack } from 'svelte'
import { mergeObjects } from './merge-objects'
import type {
  NoInfer,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { Snippet } from 'svelte'

export type SvelteTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> & {
  /**
   * A Svelte component that allows you to subscribe to the table state.
   *
   * This is useful for opting into state subscriptions for specific parts of the table state.
   *
   * @example
   * <table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
   *   {(state) => (
   *     <tr>
   *       // render the row
   *     </tr>
   *   )}
   * </table.Subscribe>
   */
  Subscribe: <TSelected>(props: {
    selector: (state: NoInfer<TableState<TFeatures>>) => TSelected
    children: ((state: Readonly<TSelected>) => Snippet) | Snippet
  }) => any
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
  TSelected = {},
>(
  tableOptions: TableOptions<TFeatures, TData>,
  selector: (state: TableState<TFeatures>) => TSelected = () =>
    ({}) as TSelected,
): SvelteTable<TFeatures, TData, TSelected> {
  // 1. Create $state-based notifier for reactivity feature
  let notifierValue = $state(0)

  // 2. Construct reactivity feature (same pattern as solid/vue/angular)
  const svelteReactivityFeature = constructReactivityFeature<TFeatures, TData>({
    stateNotifier: () => notifierValue,
    optionsNotifier: () => notifierValue,
  })

  // 3. Merge reactivity feature into options using mergeObjects (preserves getters)
  const mergedOptions = mergeObjects(tableOptions, {
    _features: mergeObjects(tableOptions._features, {
      svelteReactivityFeature,
    }),
  }) as any

  // 4. Set up resolved options with mergeOptions handler
  const resolvedOptions = mergeObjects(
    {
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        newOptions: Partial<TableOptions<TFeatures, TData>>,
      ) => {
        return mergeObjects(defaultOptions, newOptions)
      },
    },
    mergedOptions,
  ) as TableOptions<TFeatures, TData>

  // 5. Construct table
  const table = constructTable(resolvedOptions) as SvelteTable<
    TFeatures,
    TData,
    TSelected
  >

  // 6. Subscribe to all state and options via useStore
  const allState = useStore(table.store, (state) => state)
  const allOptions = useStore(table.optionsStore, (options) => options)

  // 7. Sync store changes -> notifier.
  // Use $effect.pre so this runs before DOM updates (like Solid's createComputed).
  // Use untrack for the write so the effect only depends on allState/allOptions,
  // not on notifierValue itself (which would cause an infinite loop).
  $effect.pre(() => {
    allState.current
    allOptions.current
    untrack(() => {
      notifierValue++
    })
  })

  // 8. Sync options reactively. When controlled state changes (e.g., $state
  // inside createTableState), the effect re-runs and calls setOptions.
  // Use $effect.pre so the table sees updated options BEFORE the DOM renders,
  // ensuring getRowModel() returns current data (not stale, one-frame-behind data).
  // The reactive reads (state getters, data getter) happen OUTSIDE untrack
  // so they become dependencies. The setOptions call is INSIDE untrack to
  // prevent tracking notifierValue (read via store.state's stateNotifier
  // interceptor inside setOptions), which would cause an infinite loop.
  $effect.pre(() => {
    // Read reactive getters to create $effect dependencies on external state
    const state = mergedOptions.state
    if (state) {
      for (const key in state) {
        void state[key]
      }
    }
    void mergedOptions.data

    untrack(() => {
      table.setOptions((prev) => {
        return mergeObjects(prev, mergedOptions) as TableOptions<
          TFeatures,
          TData
        >
      })
    })
  })

  // 9. Subscribe component
  table.Subscribe = function Subscribe<TSel>(props: {
    selector: (state: TableState<TFeatures>) => TSel
    children: ((state: Readonly<TSel>) => Snippet) | Snippet
  }): any {
    const selected = useStore(table.store, props.selector)
    if (typeof props.children === 'function') {
      return props.children(selected.current)
    }
    return props.children
  }

  // 10. State selector
  const stateStore = useStore(table.store, selector)

  Object.defineProperty(table, 'state', {
    get() {
      return stateStore.current
    },
    configurable: true,
    enumerable: true,
  })

  return table
}
