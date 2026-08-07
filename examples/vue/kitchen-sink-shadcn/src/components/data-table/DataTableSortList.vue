<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDownUp } from '@lucide/vue'
import { DragDropProvider } from 'dnd-kit-vue'
import { useId } from 'reka-ui'
import type { ColumnSort } from '@tanstack/vue-table'
import { useTableContext } from '@/hooks/table'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import DataTableSortListItem from '@/components/data-table/DataTableSortListItem.vue'

const table = useTableContext()
const sorting = computed(() => table.atoms.sorting.get())

const labelId = useId()
const descriptionId = useId()
const listId = useId()
const open = ref(false)

const sortableColumns = computed(() =>
  table.getAllColumns().filter((column) => column.getCanSort()),
)

function onColumnSelect(currentSortId: string, newColumnId: string) {
  table.setSorting(
    sorting.value.map((s) =>
      s.id === currentSortId ? { ...s, id: newColumnId } : s,
    ),
  )
}

function onSortAdd() {
  const firstAvailableColumn = sortableColumns.value.find(
    (col) => !sorting.value.some((s) => s.id === col.id),
  )
  if (firstAvailableColumn) {
    table.setSorting([
      ...sorting.value,
      { id: firstAvailableColumn.id, desc: false },
    ])
  }
}

function onSortUpdate(sortId: string, updates: Partial<Omit<ColumnSort, 'id'>>) {
  table.setSorting(
    sorting.value.map((s) => (s.id === sortId ? { ...s, ...updates } : s)),
  )
}

function onSortRemove(sortId: string) {
  table.setSorting(sorting.value.filter((s) => s.id !== sortId))
}

function onDragEnd(event: { canceled: boolean; operation: { source: any } }) {
  if (event.canceled) return
  const source = event.operation.source
  const from = source?.sortable?.initialIndex
  const to = source?.sortable?.index
  if (from == null || to == null || from === to) return
  const next = [...sorting.value]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  table.setSorting(next)
}

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
  <DragDropProvider @drag-end="onDragEnd">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          size="sm"
          class="[&_svg]:size-3"
          @click="($event.currentTarget as HTMLElement).focus()"
          @pointerdown="onTriggerPointerDown"
        >
          <ArrowDownUp />
          Sort
          <Badge
            v-if="sorting.length > 0"
            variant="secondary"
            class="h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono font-normal text-[0.65rem]"
          >
            {{ sorting.length }}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        :aria-labelledby="labelId"
        :aria-describedby="descriptionId"
        align="start"
        :collision-padding="16"
        class="w-[calc(100vw-theme(spacing.20))] origin-(--reka-popover-content-transform-origin) flex flex-col gap-3 min-w-72 max-w-[25rem] p-4 sm:w-[25rem]"
      >
        <div class="flex flex-col gap-1">
          <h4 :id="labelId" class="font-medium leading-none">
            {{ sorting.length > 0 ? 'Sort by' : 'No sorting applied' }}
          </h4>
          <p
            :id="descriptionId"
            :class="
              cn(
                'text-muted-foreground text-sm',
                sorting.length > 0 && 'sr-only',
              )
            "
          >
            {{
              sorting.length > 0
                ? 'Modify sorting to organize your results.'
                : 'Add sorting to organize your results.'
            }}
          </p>
        </div>
        <div
          v-if="sorting.length > 0"
          role="list"
          :id="listId"
          :aria-labelledby="labelId"
          :aria-describedby="descriptionId"
          class="flex max-h-[300px] flex-col gap-2 overflow-y-auto p-0.5"
        >
          <DataTableSortListItem
            v-for="(sort, index) in sorting"
            :key="sort.id"
            :sort="sort"
            :index="index"
            :list-id="listId"
            :sorting="sorting"
            :sortable-columns="sortableColumns"
            :on-column-select="onColumnSelect"
            :on-sort-update="onSortUpdate"
            :on-sort-remove="onSortRemove"
          />
        </div>
        <div class="flex items-center gap-2">
          <Button
            aria-label="Add new sort"
            size="sm"
            :disabled="sorting.length >= sortableColumns.length"
            @click="onSortAdd"
          >
            Add sort
          </Button>
          <Button
            v-if="sorting.length > 0"
            aria-label="Reset all sorting"
            size="sm"
            variant="outline"
            @click="table.resetSorting()"
          >
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  </DragDropProvider>
</template>
