<script lang="ts">
  import { useCellContext } from '@/hooks/table.svelte'
  import { formatDate } from '@/lib/utils'

  const cell = useCellContext<string>()
  const earliest = $derived(cell.getValue())
</script>

<span class="text-muted-foreground">
  Earliest: {earliest ? formatDate(earliest) : '—'}
</span>
