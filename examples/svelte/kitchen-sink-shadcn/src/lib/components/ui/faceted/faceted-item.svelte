<script lang="ts">
  import Check from '@lucide/svelte/icons/check'
  import type { Snippet } from 'svelte'
  import { CommandItem } from '@/lib/components/ui/command'
  import { cn } from '@/lib/utils'
  import { useFacetedContext } from './faceted-context'

  let {
    value,
    class: className,
    onSelect,
    children,
  }: {
    value: string
    class?: string
    onSelect?: (value: string) => void
    children?: Snippet
  } = $props()

  const context = useFacetedContext('FacetedItem')

  const isSelected = $derived(
    context.multiple
      ? Array.isArray(context.value) && context.value.includes(value)
      : context.value === value,
  )

  function onItemSelect() {
    if (onSelect) onSelect(value)
    else context.onItemSelect(value)
  }
</script>

<CommandItem
  data-slot="faceted-item"
  aria-selected={isSelected}
  {value}
  class={cn('gap-2', className)}
  onSelect={onItemSelect}
>
  <span
    class={cn(
      'flex size-4 items-center justify-center rounded-sm border border-primary',
      isSelected
        ? 'bg-primary text-primary-foreground'
        : 'opacity-50 [&_svg]:invisible',
    )}
  >
    <Check class="size-4" />
  </span>
  {@render children?.()}
</CommandItem>
