<script setup lang="ts">
import { computed } from 'vue'
import { Check, ChevronsUpDown, GripVertical, Trash2 } from '@lucide/vue'
import { useSortable } from 'dnd-kit-vue'
import type { Column, ColumnSort, RowData, SortDirection } from '@tanstack/vue-table'
import type { features } from '@/hooks/features'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const props = defineProps<{
  sort: ColumnSort
  index: number
  listId: string
  sorting: Array<ColumnSort>
  sortableColumns: Array<Column<typeof features, RowData>>
  onColumnSelect: (currentSortId: string, newColumnId: string) => void
  onSortUpdate: (sortId: string, updates: Partial<Omit<ColumnSort, 'id'>>) => void
  onSortRemove: (sortId: string) => void
}>()

const { elementRef, handleRef, isDragging } = useSortable(() => ({
  id: props.sort.id,
  index: props.index,
}))

const columnTitle = computed(
  () =>
    props.sortableColumns.find((col) => col.id === props.sort.id)?.columnDef
      .meta?.label ?? props.sort.id,
)

const sortItemId = computed(() => `${props.listId}-item-${props.sort.id}`)
const triggerId = computed(() => `${props.listId}-${props.index}-trigger`)
const fieldListboxId = computed(() => `${sortItemId.value}-field-listbox`)
const operatorListboxId = computed(() => `${sortItemId.value}-operator-listbox`)

const selectableColumns = computed(() =>
  props.sortableColumns.filter(
    (column) =>
      !props.sorting.some((s) => s.id === column.id && s.id !== props.sort.id),
  ),
)

function onTriggerPointerDown(event: PointerEvent) {
  const target = event.target
  if (!(target instanceof HTMLElement)) return
  if (target.hasPointerCapture(event.pointerId)) {
    target.releasePointerCapture(event.pointerId)
  }

  if (
    event.button === 0 &&
    event.ctrlKey === false &&
    event.pointerType === 'mouse'
  ) {
    event.preventDefault()
  }
}
</script>

<template>
  <div
    :ref="elementRef"
    role="listitem"
    :id="sortItemId"
    :tabindex="-1"
    :data-dragging="isDragging"
    class="grid items-center grid-cols-[175px_100px_32px_32px] gap-2 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
  >
    <Popover>
      <PopoverTrigger as-child>
        <Button
          role="combobox"
          :id="triggerId"
          :aria-controls="fieldListboxId"
          :aria-label="`Select column to sort by. Current: ${columnTitle}`"
          variant="outline"
          size="sm"
          class="h-8 font-normal justify-between gap-2 focus:outline-none focus:ring-1 focus:ring-ring"
          @pointerdown="onTriggerPointerDown"
        >
          <span class="truncate">{{ columnTitle }}</span>
          <ChevronsUpDown class="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        :id="fieldListboxId"
        class="w-(--reka-popover-trigger-width) p-0"
      >
        <Command>
          <CommandInput
            placeholder="Search columns..."
            aria-label="Search sortable columns"
          />
          <CommandList>
            <CommandEmpty>No column found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                v-for="column in selectableColumns"
                :key="column.id"
                :value="column.id"
                @select="props.onColumnSelect(props.sort.id, column.id)"
              >
                <span class="truncate">
                  {{ column.columnDef.meta?.label ?? column.id }}
                </span>
                <Check
                  :class="
                    cn(
                      'ml-auto size-4',
                      column.id === props.sort.id
                        ? 'opacity-100'
                        : 'opacity-0',
                    )
                  "
                  aria-hidden="true"
                />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    <Select
      :model-value="props.sort.desc ? 'desc' : 'asc'"
      @update:model-value="
        (value) =>
          props.onSortUpdate(props.sort.id, {
            desc: (value as SortDirection) === 'desc',
          })
      "
    >
      <SelectTrigger
        :aria-controls="operatorListboxId"
        :aria-label="`Sort direction for ${columnTitle}`"
        class="h-8"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        :id="operatorListboxId"
        class="min-w-(--reka-select-trigger-width)"
      >
        <SelectItem value="asc">Asc</SelectItem>
        <SelectItem value="desc">Desc</SelectItem>
      </SelectContent>
    </Select>
    <Button
      :aria-label="`Remove sort for ${columnTitle}`"
      variant="outline"
      size="icon"
      class="size-8 [&_svg]:size-3.5 shrink-0"
      @click="props.onSortRemove(props.sort.id)"
    >
      <Trash2 />
    </Button>
    <Button
      :ref="handleRef"
      :aria-label="`Drag to reorder ${columnTitle} sort`"
      variant="outline"
      size="icon"
      class="size-8 [&_svg]:size-3.5 shrink-0"
    >
      <GripVertical />
    </Button>
  </div>
</template>
