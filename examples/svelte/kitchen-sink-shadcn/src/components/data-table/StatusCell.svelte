<script lang="ts">
  import CheckCircle from '@lucide/svelte/icons/circle-check'
  import Clock from '@lucide/svelte/icons/clock'
  import XCircle from '@lucide/svelte/icons/circle-x'
  import type { Component } from 'svelte'
  import type { Person } from '@/lib/make-data'
  import { useCellContext } from '@/hooks/table.svelte'
  import { Badge } from '@/lib/components/ui/badge'
  import { toSentenceCase } from '@/lib/utils'

  const cell = useCellContext<Person['status'] | undefined>()
  const status = $derived(cell.getValue())

  const icons: Record<Person['status'], Component> = {
    active: CheckCircle,
    inactive: XCircle,
    pending: Clock,
  }
</script>

{#if status}
  {@const Icon = icons[status]}
  <Badge
    variant="outline"
    class="gap-1 w-fit [&>svg]:size-3.5 px-3 py-1 [&>svg]:shrink-0 rounded-full"
  >
    <Icon />
    <span class="truncate">{toSentenceCase(status)}</span>
  </Badge>
{/if}
