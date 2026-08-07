<script lang="ts">
  import { useHeaderContext } from '@/hooks/table.svelte'
  import { cn } from '@/lib/utils'

  const header = useHeaderContext()
</script>

{#if header.column.getCanResize()}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    ondblclick={() => header.column.resetSize()}
    onmousedown={header.getResizeHandler()}
    ontouchstart={header.getResizeHandler()}
    class={cn(
      'absolute right-[-2px] z-10 top-1/2 h-6 w-[3px] -translate-y-1/2 cursor-e-resize select-none touch-none rounded-md transition-colors hover:bg-blue-600 before:absolute before:left-[-4px] before:right-[-4px] before:top-0 before:h-full before:content-[""]',
      header.column.getIsResizing() && 'bg-blue-600',
    )}
  ></div>
{/if}
