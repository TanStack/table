<script lang="ts">
  import { useCellContext } from '@/hooks/table.svelte'

  const cell = useCellContext<number>()
</script>

<span>{String(cell.getValue())}</span>
