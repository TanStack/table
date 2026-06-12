import { constructTable } from '@tanstack/table-core'
import { useSelector } from '@tanstack/svelte-store'
import { untrack } from 'svelte'
import { flatMerge, mergeObjects } from './merge-objects'
import { svelteReactivity } from './reactivity.svelte'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export type SvelteTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
> = Omit<Table<TFeatures, TData>, 'store'> & {
  /**
   * @deprecated Prefer `table.state` for render reads,
   * `table.atoms.<slice>.get()` for slice snapshots, or
   * `useSelector(table.store, selector)` for explicit subscriptions.
   * `table.store.state` is a current-value snapshot and is easy to misuse in
   * render code.
   */
  readonly store: Table<TFeatures, TData>['store']
  /**
   * The selected state of the table. This state may not match the structure of
   * the full table state because it is selected by the selector function that
   * you pass as the 2nd argument to `createTable`.
   *
   * @example
   * const table = createTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state
   *
   * console.log(table.state.globalFilter)
   */
  readonly state: Readonly<TSelected>
}

/**
 * Creates a Svelte 5 table instance backed by rune-aware TanStack Store atoms.
 *
 * The optional selector projects from `table.store`; the selected value is
 * exposed on `table.state`. The adapter syncs options in `$effect.pre`, so
 * reactive option getters and external `$state` values are applied before DOM
 * updates read table APIs such as `getRowModel()`.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   const table = createTable(
 *     {
 *       features,
 *       columns,
 *       data,
 *     },
 *     (state) => ({ pagination: state.pagination }),
 *   )
 * </script>
 *
 * {table.state.pagination.pageIndex}
 * ```
 */
export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
>(
  tableOptions: TableOptions<TFeatures, TData>,
  selector?: (state: TableState<TFeatures>) => TSelected,
): SvelteTable<TFeatures, TData, TSelected> {
  // 1. Merge reactivity into options using mergeObjects (preserves getters)
  const mergedOptions = mergeObjects(tableOptions, {
    features: {
      coreReactivityFeature: svelteReactivity(),
      ...tableOptions.features,
    },
  }) as TableOptions<TFeatures, TData>

  // 2. Set up resolved options with mergeOptions handler
  const resolvedOptions = mergeObjects(
    {
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        newOptions: Partial<TableOptions<TFeatures, TData>>,
      ) => {
        return flatMerge(defaultOptions, newOptions)
      },
    },
    mergedOptions,
  ) as TableOptions<TFeatures, TData>

  // 3. Construct table
  const table = constructTable(resolvedOptions) as unknown as SvelteTable<
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
        return flatMerge(prev, mergedOptions)
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
