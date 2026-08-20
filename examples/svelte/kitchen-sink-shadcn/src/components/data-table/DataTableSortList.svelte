<!-- Sort builder popover: add/remove/reorder multi-sort entries. Rows are
  drag-sortable via @dnd-kit-svelte. -->
<script lang="ts">
  import ArrowDownUp from '@lucide/svelte/icons/arrow-down-up'
  import Check from '@lucide/svelte/icons/check'
  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down'
  import GripVertical from '@lucide/svelte/icons/grip-vertical'
  import Trash2 from '@lucide/svelte/icons/trash-2'
  import { DragDropProvider } from '@dnd-kit-svelte/svelte'
  import { useSortable } from '@dnd-kit-svelte/svelte/sortable'
  import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers'
  import { move } from '@dnd-kit/helpers'
  import type { ColumnSort } from '@tanstack/svelte-table'
  import { useTableContext } from '@/hooks/table.svelte'
  import { Badge } from '@/lib/components/ui/badge'
  import { Button } from '@/lib/components/ui/button'
  import * as Command from '@/lib/components/ui/command'
  import * as Popover from '@/lib/components/ui/popover'
  import * as Select from '@/lib/components/ui/select'
  import { cn } from '@/lib/utils'

  const table = useTableContext()
  const sorting = $derived(table.atoms.sorting.get())

  const uid = $props.id()
  const labelId = `${uid}-label`
  const descriptionId = `${uid}-description`
  const listId = `${uid}-list`
  let open = $state(false)

  const sortableColumns = $derived(
    table.getAllColumns().filter((column) => column.getCanSort()),
  )

  function onColumnSelect(currentSortId: string, newColumnId: string) {
    table.setSorting(
      sorting.map((s) =>
        s.id === currentSortId ? { ...s, id: newColumnId } : s,
      ),
    )
  }

  function onSortAdd() {
    const firstAvailableColumn = sortableColumns.find(
      (col) => !sorting.some((s) => s.id === col.id),
    )
    if (firstAvailableColumn) {
      table.setSorting([
        ...sorting,
        { id: firstAvailableColumn.id, desc: false },
      ])
    }
  }

  function onSortUpdate(sortId: string, updates: Partial<Omit<ColumnSort, 'id'>>) {
    table.setSorting(
      sorting.map((s) => (s.id === sortId ? { ...s, ...updates } : s)),
    )
  }

  function onSortRemove(sortId: string) {
    table.setSorting(sorting.filter((s) => s.id !== sortId))
  }
</script>

<DragDropProvider
  modifiers={[RestrictToVerticalAxis]}
  onDragEnd={(e) => table.setSorting(move([...sorting], e))}
>
  <Popover.Root bind:open>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" size="sm" class="[&_svg]:size-3">
          <ArrowDownUp />
          Sort
          {#if sorting.length > 0}
            <Badge
              variant="secondary"
              class="h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono font-normal text-[0.65rem]"
            >
              {sorting.length}
            </Badge>
          {/if}
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      align="start"
      collisionPadding={16}
      class="w-[calc(100vw-theme(spacing.20))] origin-(--transform-origin) flex flex-col gap-3 min-w-72 max-w-[25rem] p-4 sm:w-[25rem]"
    >
      <div class="flex flex-col gap-1">
        <h4 id={labelId} class="font-medium leading-none">
          {sorting.length > 0 ? 'Sort by' : 'No sorting applied'}
        </h4>
        <p
          id={descriptionId}
          class={cn(
            'text-muted-foreground text-sm',
            sorting.length > 0 && 'sr-only',
          )}
        >
          {sorting.length > 0
            ? 'Modify sorting to organize your results.'
            : 'Add sorting to organize your results.'}
        </p>
      </div>
      {#if sorting.length > 0}
        <div
          role="list"
          id={listId}
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          class="flex max-h-[300px] flex-col gap-2 overflow-y-auto p-0.5"
        >
          {#each sorting as sort, index (sort.id)}
            {@render SortRow({ sort, index })}
          {/each}
        </div>
      {/if}
      <div class="flex items-center gap-2">
        <Button
          aria-label="Add new sort"
          size="sm"
          onclick={onSortAdd}
          disabled={sorting.length >= sortableColumns.length}
        >
          Add sort
        </Button>
        {#if sorting.length > 0}
          <Button
            aria-label="Reset all sorting"
            size="sm"
            variant="outline"
            onclick={() => table.resetSorting()}
          >
            Reset
          </Button>
        {/if}
      </div>
    </Popover.Content>
  </Popover.Root>
</DragDropProvider>

{#snippet SortRow({ sort, index }: { sort: ColumnSort; index: number })}
  {@const columnTitle =
    sortableColumns.find((col) => col.id === sort.id)?.columnDef.meta?.label ??
    sort.id}
  {@const sortItemId = `${listId}-item-${sort.id}`}
  {@const fieldListboxId = `${sortItemId}-field-listbox`}
  {@const operatorListboxId = `${sortItemId}-operator-listbox`}
  {@const sortable = useSortable({ id: sort.id, index: () => index })}

  <div
    role="listitem"
    id={sortItemId}
    tabindex="-1"
    data-dragging={sortable.isDragging.current}
    class="relative z-0 grid items-center grid-cols-[175px_100px_32px_32px] gap-2 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
    {@attach sortable.ref}
  >
    <Popover.Root>
      <Popover.Trigger>
        {#snippet child({ props })}
          <Button
            {...props}
            role="combobox"
            aria-controls={fieldListboxId}
            aria-label={`Select column to sort by. Current: ${columnTitle}`}
            variant="outline"
            size="sm"
            class="h-8 font-normal justify-between gap-2 focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <span class="truncate">{columnTitle}</span>
            <ChevronsUpDown class="opacity-50" />
          </Button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content id={fieldListboxId} class="w-[175px] p-0">
        <Command.Root>
          <Command.Input
            placeholder="Search columns..."
            aria-label="Search sortable columns"
          />
          <Command.List>
            <Command.Empty>No column found.</Command.Empty>
            <Command.Group>
              {#each sortableColumns.filter((column) => !sorting.some((s) => s.id === column.id && s.id !== sort.id)) as column (column.id)}
                <Command.Item
                  value={column.id}
                  onSelect={() => onColumnSelect(sort.id, column.id)}
                >
                  <span class="truncate">
                    {column.columnDef.meta?.label ?? column.id}
                  </span>
                  <Check
                    class={cn(
                      'ml-auto size-4',
                      column.id === sort.id ? 'opacity-100' : 'opacity-0',
                    )}
                    aria-hidden="true"
                  />
                </Command.Item>
              {/each}
            </Command.Group>
          </Command.List>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
    <Select.Root
      type="single"
      value={sort.desc ? 'desc' : 'asc'}
      onValueChange={(value) => onSortUpdate(sort.id, { desc: value === 'desc' })}
    >
      <Select.Trigger
        aria-controls={operatorListboxId}
        aria-label={`Sort direction for ${columnTitle}`}
        class="h-8"
      >
        {sort.desc ? 'Desc' : 'Asc'}
      </Select.Trigger>
      <Select.Content id={operatorListboxId}>
        <Select.Item value="asc" label="Asc" />
        <Select.Item value="desc" label="Desc" />
      </Select.Content>
    </Select.Root>
    <Button
      aria-label={`Remove sort for ${columnTitle}`}
      variant="outline"
      size="icon"
      class="size-8 [&_svg]:size-3.5 shrink-0"
      onclick={() => onSortRemove(sort.id)}
    >
      <Trash2 />
    </Button>
    <Button
      {@attach sortable.handleRef}
      aria-label={`Drag to reorder ${columnTitle} sort`}
      variant="outline"
      size="icon"
      class="size-8 [&_svg]:size-3.5 shrink-0"
    >
      <GripVertical />
    </Button>
  </div>
{/snippet}
