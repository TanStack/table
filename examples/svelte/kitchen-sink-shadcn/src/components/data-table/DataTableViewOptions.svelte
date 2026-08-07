<!-- Column visibility + drag-reorderable column list. -->
<script lang="ts">
  import Check from '@lucide/svelte/icons/check'
  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down'
  import GripVertical from '@lucide/svelte/icons/grip-vertical'
  import Settings2 from '@lucide/svelte/icons/settings-2'
  import { DragDropProvider } from '@dnd-kit-svelte/svelte'
  import { useSortable } from '@dnd-kit-svelte/svelte/sortable'
  import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers'
  import { move } from '@dnd-kit/helpers'
  import type { Column, RowData } from '@tanstack/svelte-table'
  import type { features } from '@/hooks/features'
  import { useTableContext } from '@/hooks/table.svelte'
  import { Button } from '@/lib/components/ui/button'
  import * as Command from '@/lib/components/ui/command'
  import * as Popover from '@/lib/components/ui/popover'
  import { cn } from '@/lib/utils'

  const table = useTableContext()
  const columnOrder = $derived(table.atoms.columnOrder.get())

  const orderedColumns = $derived(
    [...table.getAllColumns()]
      .sort((a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id))
      .filter((column) => typeof column.accessorFn !== 'undefined'),
  )
</script>

<DragDropProvider
  modifiers={[RestrictToVerticalAxis]}
  onDragEnd={(e) => table.setColumnOrder(move([...columnOrder], e))}
>
  <Popover.Root>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button
          {...props}
          aria-label="Toggle columns"
          variant="outline"
          role="combobox"
          size="sm"
          class="ml-auto hidden h-8 gap-2 focus:outline-none focus:ring-1 focus:ring-ring lg:flex"
        >
          <Settings2 />
          View
          <ChevronsUpDown class="ml-auto opacity-50" />
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content align="end" class="w-full max-w-48 p-0">
      <Command.Root>
        <Command.Input placeholder="Search columns..." />
        <Command.List>
          <Command.Empty>No columns found.</Command.Empty>
          <Command.Group>
            {#each orderedColumns as column, index (column.id)}
              {@render ColumnRow({ column, index })}
            {/each}
          </Command.Group>
          <Command.Separator />
          <Command.Group>
            <div class="flex items-center gap-1">
              <Command.Item
                onSelect={() => table.toggleAllColumnsVisible(false)}
                class="w-full justify-center border"
              >
                Hide All
              </Command.Item>
              <Command.Item
                onSelect={() => table.toggleAllColumnsVisible(true)}
                class="w-full justify-center border"
              >
                Show All
              </Command.Item>
            </div>
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</DragDropProvider>

{#snippet ColumnRow({
  column,
  index,
}: {
  column: Column<typeof features, RowData>
  index: number
})}
  {@const sortable = useSortable({ id: column.id, index: () => index })}

  <Command.Item
    aria-selected={column.getIsVisible()}
    data-selected={column.getIsVisible()}
    data-dragging={sortable.isDragging.current}
    class="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
    onSelect={() => column.toggleVisibility(!column.getIsVisible())}
    {@attach sortable.ref}
  >
    <Check
      class={cn(
        'size-4 shrink-0',
        column.getIsVisible() ? 'opacity-100' : 'opacity-0',
      )}
    />
    <span class="truncate">{column.columnDef.meta?.label ?? column.id}</span>
    <Button
      {@attach sortable.handleRef}
      variant="ghost"
      size="icon"
      class="ml-auto size-6"
    >
      <GripVertical />
    </Button>
  </Command.Item>
{/snippet}
