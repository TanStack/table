<!-- Column header dropdown with sort / group / pin / hide actions. -->
<script lang="ts">
  import ArrowDown from '@lucide/svelte/icons/arrow-down'
  import ArrowUp from '@lucide/svelte/icons/arrow-up'
  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down'
  import EyeOff from '@lucide/svelte/icons/eye-off'
  import Group from '@lucide/svelte/icons/group'
  import Pin from '@lucide/svelte/icons/pin'
  import PinOff from '@lucide/svelte/icons/pin-off'
  import Ungroup from '@lucide/svelte/icons/ungroup'
  import { useHeaderContext } from '@/hooks/table.svelte'
  import { Button } from '@/lib/components/ui/button'
  import * as DropdownMenu from '@/lib/components/ui/dropdown-menu'
  import { cn } from '@/lib/utils'

  let { title, class: className }: { title?: string; class?: string } = $props()

  const header = useHeaderContext()
  const column = $derived(header.column)

  const displayTitle = $derived(
    column.columnDef.meta?.label ?? title ?? column.id,
  )

  const canSort = $derived(column.getCanSort())
  const canHide = $derived(column.getCanHide())
  const canPin = $derived(column.getCanPin())
  const canGroup = $derived(column.getCanGroup())

  const sorted = $derived(canSort ? column.getIsSorted() : false)
  const pinned = $derived(canPin ? column.getIsPinned() : false)
  const grouped = $derived(canGroup ? column.getIsGrouped() : false)
</script>

{#if !canSort && !canHide && !canPin && !canGroup}
  <div class={cn(className)}>{displayTitle}</div>
{:else}
  <div class={cn('flex items-center gap-2', className)}>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button
            {...props}
            variant="ghost"
            size="sm"
            class="group -ml-3 h-8 data-open:bg-accent"
          >
            <span>{displayTitle}</span>
            {#if sorted === 'desc'}
              <ArrowDown class="ml-2 size-4" />
            {:else if sorted === 'asc'}
              <ArrowUp class="ml-2 size-4" />
            {:else if canSort}
              <ChevronsUpDown
                class="ml-2 size-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-data-open:opacity-100"
              />
            {/if}
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        {#if canSort}
          <DropdownMenu.Item onclick={() => column.toggleSorting(false)}>
            <ArrowUp class="mr-2 size-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenu.Item>
          <DropdownMenu.Item onclick={() => column.toggleSorting(true)}>
            <ArrowDown class="mr-2 size-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenu.Item>
        {/if}
        {#if canGroup}
          {#if canSort}
            <DropdownMenu.Separator />
          {/if}
          <DropdownMenu.Item onclick={column.getToggleGroupingHandler()}>
            {#if grouped}
              <Ungroup class="mr-2 size-3.5 text-muted-foreground/70" />
              Ungroup
            {:else}
              <Group class="mr-2 size-3.5 text-muted-foreground/70" />
              Group by
            {/if}
          </DropdownMenu.Item>
        {/if}
        {#if canPin}
          {#if canSort || canGroup}
            <DropdownMenu.Separator />
          {/if}
          <DropdownMenu.Item
            onclick={() => column.pin('start')}
            disabled={pinned === 'start'}
          >
            <Pin class="mr-2 size-3.5 text-muted-foreground/70" />
            Pin left
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onclick={() => column.pin('end')}
            disabled={pinned === 'end'}
          >
            <Pin class="mr-2 size-3.5 rotate-180 text-muted-foreground/70" />
            Pin right
          </DropdownMenu.Item>
          {#if pinned}
            <DropdownMenu.Item onclick={() => column.pin(false)}>
              <PinOff class="mr-2 size-3.5 text-muted-foreground/70" />
              Unpin
            </DropdownMenu.Item>
          {/if}
        {/if}
        {#if canHide}
          <DropdownMenu.Separator />
          <DropdownMenu.Item onclick={() => column.toggleVisibility(false)}>
            <EyeOff class="mr-2 size-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenu.Item>
        {/if}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
{/if}
