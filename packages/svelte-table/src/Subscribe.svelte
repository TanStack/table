<script
  lang="ts"
  generics="TFeatures extends TableFeatures, TData extends RowData, TSelected = unknown"
>
  import type {
    NoInfer,
    RowData,
    TableFeatures,
    TableState,
  } from '@tanstack/table-core'
  import type { Snippet } from 'svelte'
  import type { SvelteTable } from './createTable.svelte'

  type Props<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TSelected,
  > = {
    /**
     * A function that selects a portion of the table state to subscribe to.
     * @param state - The full table state
     * @returns The selected portion of state
     */
    selector: (state: NoInfer<TableState<TFeatures>>) => TSelected
    /**
     * A Svelte snippet that receives the selected state and renders content.
     * The snippet will be called with the selected state whenever it changes.
     */
    children: Snippet<[state: Readonly<TSelected>]>
    /**
     * The table instance to subscribe to
     */
    table: SvelteTable<TFeatures, TData, unknown>
  }

  let { table, selector, children }: Props<TFeatures, TData, TSelected> =
    $props()
</script>

<!--
  Access table.store.state in the template (a reactive context).
  The constructReactivityFeature interceptor makes this trigger
  the $state-based notifier, so Svelte tracks it automatically.
-->
{@render children(selector(table.store.state as TableState<TFeatures>))}
