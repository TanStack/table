import { constructTable } from '@tanstack/table-core'
import { untrack } from 'svelte'
import { flatMerge, mergeObjects } from './merge-objects'
import { svelteReactivity } from './reactivity.svelte'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core'

/**
 * A Svelte-aware TanStack Table instance.
 *
 * Table APIs and `table.atoms.<slice>.get()` reads participate in Svelte
 * dependency tracking when used in templates, `$derived`, or `$effect`.
 */
export type SvelteTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table<TFeatures, TData>

/**
 * Creates a Svelte 5 table instance backed by rune-aware TanStack Store atoms.
 *
 * Read a specific state slice with `table.atoms.<slice>.get()` and read the
 * complete state with `table.store.get()`. Those reads participate in Svelte
 * dependency tracking when they run in a template, `$derived`, or `$effect`.
 * The adapter syncs options in `$effect.pre`, so reactive option getters and
 * external `$state` values are applied before DOM updates read table APIs such
 * as `getRowModel()`.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   const table = createTable({
 *     features,
 *     columns,
 *     get data() {
 *       return data
 *     },
 *   })
 *
 *   const pagination = $derived(table.atoms.pagination.get())
 *   const stateJson = $derived(JSON.stringify(table.store.get(), null, 2))
 * </script>
 *
 * <span>Page {pagination.pageIndex + 1}</span>
 * <pre>{stateJson}</pre>
 * ```
 */
export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(tableOptions: TableOptions<TFeatures, TData>): SvelteTable<TFeatures, TData> {
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
  const table = constructTable(resolvedOptions)

  // 4. Sync options reactively. When controlled state changes (e.g., $state
  // inside createTableState), the effect re-runs and calls setOptions.
  // Use $effect.pre so the table sees updated options BEFORE the DOM renders,
  // ensuring getRowModel() returns current data (not stale, one-frame-behind data).
  // Reactive option getters and nested state keys are read OUTSIDE untrack so
  // they become dependencies. The setOptions call is INSIDE untrack so option
  // writes do not subscribe this effect to table internals.
  $effect.pre(() => {
    // Resolve every option outside untrack so getter-backed data, columns,
    // callbacks, metadata, and state become dependencies of this effect.
    const nextOptions = flatMerge(mergedOptions)
    const state = nextOptions.state as Record<string, unknown> | undefined
    if (state) {
      const resolvedState: Record<string, unknown> = {}
      for (const key in state) {
        resolvedState[key] = state[key]
      }
      Object.defineProperty(nextOptions, 'state', {
        configurable: true,
        enumerable: true,
        value: resolvedState,
        writable: true,
      })
    }

    untrack(() => {
      table.setOptions((prev) => {
        return flatMerge(prev, nextOptions)
      })
    })
  })

  return table
}
