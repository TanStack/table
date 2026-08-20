<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import { PopoverTrigger } from '@/lib/components/ui/popover'
  import { cn } from '@/lib/utils'

  let {
    class: className,
    ...restProps
  }: ComponentProps<typeof PopoverTrigger> = $props()
</script>

<PopoverTrigger
  data-slot="faceted-trigger"
  class={cn(
    'justify-between text-left focus:outline-none focus:ring-1 focus:ring-ring',
    className,
  )}
  {...restProps}
/>
