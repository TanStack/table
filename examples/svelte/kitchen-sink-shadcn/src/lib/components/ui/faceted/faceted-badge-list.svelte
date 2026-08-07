<script lang="ts">
  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down'
  import { Badge } from '@/lib/components/ui/badge'
  import { cn } from '@/lib/utils'
  import { useFacetedContext } from './faceted-context'

  let {
    options = [],
    max = 2,
    placeholder = 'Select options...',
    class: className,
    badgeClassName,
  }: {
    options?: Array<{ label: string; value: string }>
    max?: number
    placeholder?: string
    class?: string
    badgeClassName?: string
  } = $props()

  const context = useFacetedContext('FacetedBadgeList')
  const values = $derived(
    Array.isArray(context.value)
      ? context.value
      : context.value
        ? [context.value]
        : [],
  )

  function getLabel(value: string) {
    return options.find((opt) => opt.value === value)?.label ?? value
  }
</script>

{#if values.length === 0}
  <div
    data-slot="faceted-badge-list"
    class="flex w-full items-center gap-1 text-muted-foreground"
  >
    {placeholder}
    <ChevronsUpDown class="ml-auto size-4 shrink-0 opacity-50" />
  </div>
{:else}
  <div
    data-slot="faceted-badge-list"
    class={cn('flex flex-wrap items-center gap-1', className)}
  >
    {#if values.length > max}
      <Badge
        variant="secondary"
        class={cn('rounded-sm px-1 font-normal', badgeClassName)}
      >
        {values.length} selected
      </Badge>
    {:else}
      {#each values as value (value)}
        <Badge
          variant="secondary"
          class={cn('rounded-sm px-1 font-normal', badgeClassName)}
        >
          <span class="truncate">{value ? getLabel(value) : ''}</span>
        </Badge>
      {/each}
    {/if}
  </div>
{/if}
