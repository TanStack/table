<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import { PopoverContent } from '@/lib/components/ui/popover'
  import { Command } from '@/lib/components/ui/command'
  import { cn } from '@/lib/utils'
  import { useFacetedContext } from './faceted-context'

  let {
    class: className,
    children,
    ...restProps
  }: ComponentProps<typeof PopoverContent> = $props()

  // Assert the context so misuse fails loudly, like the react version.
  useFacetedContext('FacetedContent')
</script>

<PopoverContent
  data-slot="faceted-content"
  align="start"
  class={cn('w-[200px] origin-(--transform-origin) p-0', className)}
  {...restProps}
>
  <Command>
    {@render children?.()}
  </Command>
</PopoverContent>
