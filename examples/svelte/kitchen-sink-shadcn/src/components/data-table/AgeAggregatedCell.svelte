<script lang="ts">
  import { useCellContext } from '@/hooks/table.svelte'

  const cell = useCellContext<number>()
</script>

<span class="text-muted-foreground">
  Avg: {Math.round(Number(cell.getValue()) * 10) / 10}
</span>
