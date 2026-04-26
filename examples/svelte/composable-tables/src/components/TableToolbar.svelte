<!--
  Table toolbar with title and actions.
  Uses useTableContext to access the table instance.
-->
<script lang="ts">
  import { useTableContext } from '../hooks/table'

  interface Props {
    title: string
    onRefresh?: () => void
  }

  let { title, onRefresh }: Props = $props()

  const table = useTableContext()
</script>

<div class="table-toolbar">
  <h2>{title}</h2>
  <div>
    <button onclick={() => table.resetColumnFilters()}>
      Clear Filters
    </button>
    <button onclick={() => table.resetSorting()}>
      Clear Sorting
    </button>
    {#if onRefresh}
      <button onclick={onRefresh}>Regenerate Data</button>
    {/if}
  </div>
</div>
