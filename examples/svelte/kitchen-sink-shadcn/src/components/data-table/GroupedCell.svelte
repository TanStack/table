<!-- Expand/collapse toggle rendered for grouped cells, with the cell's normal
  content and the sub-row count inline. -->
<script lang="ts">
  import ChevronDown from '@lucide/svelte/icons/chevron-down'
  import ChevronRight from '@lucide/svelte/icons/chevron-right'
  import { useCellContext } from '@/hooks/table.svelte'
  import { Button } from '@/lib/components/ui/button'

  const cell = useCellContext()
  const row = $derived(cell.row)
</script>

<Button
  variant="ghost"
  size="sm"
  class="-ml-2 h-7 gap-1 px-2"
  onclick={row.getToggleExpandedHandler()}
  disabled={!row.getCanExpand()}
  style={`padding-left: calc(${row.depth} * 1.5rem + 0.5rem)`}
>
  {#if row.getIsExpanded()}
    <ChevronDown class="size-4" />
  {:else}
    <ChevronRight class="size-4" />
  {/if}
  <cell.FlexRender {cell} />
  <span class="text-muted-foreground">({row.subRows.length})</span>
</Button>
