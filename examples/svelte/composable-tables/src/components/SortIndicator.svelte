<!--
  Sort indicator showing current sort direction.
  Uses useHeaderContext to access the header instance.
-->
<script lang="ts">
  import { useHeaderContext } from '../hooks/table'

  const header = useHeaderContext()
</script>

{#if header.column.getIsSorted()}
  <span class="sort-indicator">
    {header.column.getIsSorted() === 'asc' ? '🔼' : '🔽'}
  </span>
{/if}
