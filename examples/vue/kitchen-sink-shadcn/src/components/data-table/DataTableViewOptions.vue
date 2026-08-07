<script setup lang="ts">
import { computed } from 'vue'
import { ChevronsUpDown, Settings2 } from '@lucide/vue'
import { DragDropProvider } from 'dnd-kit-vue'
import { useTableContext } from '@/hooks/table'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import DataTableViewOptionsItem from '@/components/data-table/DataTableViewOptionsItem.vue'

const table = useTableContext()
const columnOrder = computed(() => table.atoms.columnOrder.get())

const orderedToggleableColumns = computed(() =>
  table
    .getAllColumns()
    .slice()
    .sort((a, b) => {
      const aIndex = columnOrder.value.indexOf(a.id)
      const bIndex = columnOrder.value.indexOf(b.id)
      return aIndex - bIndex
    })
    .filter((column) => typeof column.accessorFn !== 'undefined'),
)

function onDragEnd(event: { canceled: boolean; operation: { source: any } }) {
  if (event.canceled) return
  const source = event.operation.source
  const from = source?.sortable?.initialIndex
  const to = source?.sortable?.index
  if (from == null || to == null || from === to) return

  // Map the drag within the toggleable subset back onto the full column order.
  const draggableIds = orderedToggleableColumns.value.map((c) => c.id)
  const movedId = draggableIds[from]
  const targetId = draggableIds[to]
  const fullOrder = columnOrder.value.filter((id) => id !== movedId)
  const insertAt = fullOrder.indexOf(targetId) + (to > from ? 1 : 0)
  fullOrder.splice(insertAt, 0, movedId)
  table.setColumnOrder(fullOrder)
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
    <Popover>
      <PopoverTrigger as-child>
        <Button
          aria-label="Toggle columns"
          variant="outline"
          role="combobox"
          size="sm"
          class="ml-auto hidden h-8 gap-2 focus:outline-none focus:ring-1 focus:ring-ring lg:flex"
          @pointerdown="onTriggerPointerDown"
        >
          <Settings2 />
          View
          <ChevronsUpDown class="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" class="w-full max-w-48 p-0">
        <Command>
          <CommandInput placeholder="Search columns..." />
          <CommandList>
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup>
              <DataTableViewOptionsItem
                v-for="(column, index) in orderedToggleableColumns"
                :key="column.id"
                :column="column"
                :index="index"
              />
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <div class="flex items-center gap-1">
                <CommandItem
                  value="hide-all"
                  class="w-full justify-center border"
                  @select="table.toggleAllColumnsVisible(false)"
                >
                  Hide All
                </CommandItem>
                <CommandItem
                  value="show-all"
                  class="w-full justify-center border"
                  @select="table.toggleAllColumnsVisible(true)"
                >
                  Show All
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </DragDropProvider>
</template>
