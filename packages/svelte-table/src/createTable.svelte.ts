import { constructTable } from '@tanstack/table-core'
import { useSelector } from '@tanstack/svelte-store'
import { untrack } from 'svelte'
import { mergeObjects } from './merge-objects'
import { svelteReactivity } from './signals.svelte'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableReactivityBindings,
  TableState,
} from '@tanstack/table-core'

export type SvelteTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> & {
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
  // 1. Merge reactivity into options using mergeObjects (preserves getters)
  const mergedOptions = mergeObjects(tableOptions, {
    reactivity: tableOptions.reactivity ?? svelteReactivity(),
  }) as TableOptions<TFeatures, TData> & { reactivity: TableReactivityBindings }

  // 2. Set up resolved options with mergeOptions handler
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
  ) as TableOptions<TFeatures, TData> & { reactivity: TableReactivityBindings }

  // 3. Construct table
  const table = constructTable(resolvedOptions) as SvelteTable<
    TFeatures,
    TData,
    TSelected
  >

  // 4. Sync options reactively. When controlled state changes (e.g., $state
  // inside createTableState), the effect re-runs and calls setOptions.
  // Use $effect.pre so the table sees updated options BEFORE the DOM renders,
  // ensuring getRowModel() returns current data (not stale, one-frame-behind data).
  // The reactive reads (state getters, data getter) happen OUTSIDE untrack
  // so they become dependencies. The setOptions call is INSIDE untrack so
  // option writes do not subscribe this effect to table internals.
  $effect.pre(() => {
    // Read reactive getters to create $effect dependencies on external state
    const state: Record<string, unknown> | undefined = mergedOptions.state
    if (state) {
      for (const key in state) {
        void state[key]
      }
    }
    void mergedOptions.data

    untrack(() => {
      table.setOptions((prev) => {
        return mergeObjects(prev, mergedOptions)
      })
    })
  })

  // 5. State selector
  const stateStore = useSelector(table.store, selector)

  Object.defineProperty(table, 'state', {
    get() {
      return stateStore.current
    },
    configurable: true,
    enumerable: true,
  })

  return table
}
