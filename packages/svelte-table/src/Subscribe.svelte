<script
  lang="ts"
  generics="TFeatures extends TableFeatures, TData extends RowData, TSelected = unknown"
>
  import { useStore } from '@tanstack/svelte-store'
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

  const props: Props<TFeatures, TData, TSelected> = $props()

  // Subscribe to the store and get the selected state
  // Access table and selector from props object to avoid closure warnings
  const selectedState = useStore(
    props.table.store,
    props.selector as (state: any) => any,
  )
</script>

{@render props.children(selectedState.current)}
