<!--
  Table toolbar with title and actions.
  Uses useTableContext to access the table instance.
-->
<script lang="ts">
  import { useTableContext } from '../hooks/table'

  interface Props {
    title: string
    onRefresh?: () => void
    onStressTest?: () => void
  }

  let { title, onRefresh, onStressTest }: Props = $props()

  const table = useTableContext()
</script>

<div class="table-toolbar">
  <h2>{title}</h2>
  <div class="table-toolbar-actions">
    {#if onRefresh}
      <button onclick={onRefresh}>Regenerate Data</button>
    {/if}
    {#if onStressTest}
      <button onclick={onStressTest}>Stress Test (200k rows)</button>
    {/if}
    <button onclick={() => table.resetColumnFilters()}>
      Clear Filters
    </button>
    <button onclick={() => table.resetSorting()}>
      Clear Sorting
    </button>
  </div>
</div>
