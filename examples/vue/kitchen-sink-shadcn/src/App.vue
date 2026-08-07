<script setup lang="ts">
import { ref } from 'vue'
import { useTanStackTableDevtools } from '@tanstack/vue-table-devtools'
import { debounce } from '@tanstack/pacer'
import { Search } from '@lucide/vue'
import type { CSSProperties } from 'vue'
import type { Column } from '@tanstack/vue-table'
import type { ExtendedColumnFilter } from '@/types'
import type { Person } from '@/lib/make-data'
import type { features } from '@/hooks/features'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { makeData } from '@/lib/make-data'
import { cn } from '@/lib/utils'
import { useAppTable } from '@/hooks/table'
import { columns } from '@/columns'
import ModeToggle from '@/components/ModeToggle.vue'
import { Input } from '@/components/ui/input'

function getCommonPinningStyles(
  column: Column<typeof features, Person>,
  isSelected = false,
): CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'start' && column.getIsLastColumn('start')
  const isFirstRightPinnedColumn =
    isPinned === 'end' && column.getIsFirstColumn('end')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px var(--border) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px var(--border) inset'
        : undefined,
    insetInlineStart:
      isPinned === 'start' ? `${column.getStart('start')}px` : undefined,
    insetInlineEnd:
      isPinned === 'end' ? `${column.getAfter('end')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    background: isSelected
      ? 'var(--muted)'
      : isPinned
        ? 'var(--background)'
        : undefined,
    zIndex: isPinned ? 1 : 0,
  }
}

const columnFilters = ref<Array<ExtendedColumnFilter>>([])
const globalFilter = ref('')
const data = ref(makeData(1_000))

const refreshData = () => (data.value = makeData(1_000))
const stressTest = () => (data.value = makeData(1_000_000))

const table = useAppTable({
  key: 'kitchen-sink-shadcn',
  columns,
  data,
  debugTable: true,
  state: {
    get columnFilters() {
      return columnFilters.value
    },
    get globalFilter() {
      return globalFilter.value
    },
  },
  onColumnFiltersChange: (updater) => {
    columnFilters.value =
      typeof updater === 'function' ? updater(columnFilters.value) : updater
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value =
      typeof updater === 'function' ? updater(globalFilter.value) : updater
  },
  initialState: {
    columnPinning: { start: ['select'], end: ['actions'] },
    columnOrder: columns.map((c) => c.id ?? ''),
  },
})

useTanStackTableDevtools(table)

const { AppTable, AppHeader, AppCell, FilterList, SortList, ViewOptions, Pagination } =
  table

// Debounced global filter setter — mirrors the react example's DebouncedInput.
const globalFilterInput = ref('')
const setGlobalFilterDebounced = debounce(
  (value: string) => (globalFilter.value = value),
  { wait: 300 },
)

function onGlobalFilterInput(value: string | number) {
  globalFilterInput.value = String(value)
  setGlobalFilterDebounced(String(value))
}
</script>

<template>
  <AppTable>
    <div class="container mx-auto p-4 flex flex-col gap-4">
      <div class="flex items-center justify-end gap-2">
        <ModeToggle />
        <Button variant="outline" size="sm" @click="refreshData()">
          Regenerate Data
        </Button>
        <Button variant="outline" size="sm" @click="stressTest()">
          Stress Test (1M rows)
        </Button>
        <Button
          variant="outline"
          size="sm"
          @click="
            console.info(
              'table.getSelectedRowModel().flatRows',
              table.getSelectedRowModel().flatRows,
            )
          "
        >
          Log Selected Rows
        </Button>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <div class="relative w-full max-w-sm">
            <Search
              class="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              :model-value="globalFilterInput"
              placeholder="Search all columns..."
              class="pl-8"
              @update:model-value="onGlobalFilterInput"
            />
          </div>
          <FilterList />
          <SortList />
          <ViewOptions />
        </div>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
              >
                <template
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                >
                  <AppHeader
                    v-if="header.column.getIsVisible()"
                    :header="header"
                    v-slot="{ header: h }"
                  >
                    <TableHead
                      :colspan="h.colSpan"
                      :class="
                        cn('relative', {
                          'border-r': h.id !== 'actions',
                          'text-center [&>[role=checkbox]]:mx-auto':
                            h.column.id === 'select',
                        })
                      "
                      :style="{
                        flexGrow: h.getSize(),
                        width: `${h.getSize()}px`,
                        ...getCommonPinningStyles(h.column),
                      }"
                    >
                      <component :is="h.FlexRender" v-if="!h.isPlaceholder" />
                      <component :is="h.ResizeHandle" />
                    </TableHead>
                  </AppHeader>
                </template>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                :data-state="row.getIsSelected() ? 'selected' : undefined"
                :aria-selected="row.getIsSelected()"
              >
                <AppCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :cell="cell"
                  v-slot="{ cell: c }"
                >
                  <TableCell
                    :class="
                      cn(
                        c.column.id === 'actions' ? '' : 'border-r',
                        c.column.id === 'select' &&
                          'text-center [&>[role=checkbox]]:mx-auto',
                      )
                    "
                    :style="{
                      flexGrow: c.column.getSize(),
                      width: `${c.column.getSize()}px`,
                      ...getCommonPinningStyles(c.column, row.getIsSelected()),
                    }"
                  >
                    <component
                      :is="c.getIsGrouped() ? c.GroupedCell : c.FlexRender"
                    />
                  </TableCell>
                </AppCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <Pagination />
      </div>
    </div>
  </AppTable>
</template>
