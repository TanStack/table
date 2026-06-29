<script lang="ts">
  import { useHeaderContext } from './table'

  const header = useHeaderContext()
</script>

{#if header.column.getIsSorted()}
  {header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽'}
{/if}
