<script setup lang="ts">
import { h, ref } from 'vue'
import {
  FlexRender,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { debounce } from '@tanstack/pacer'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from '@lucide/vue'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table'
import { makeData } from './makeData'
import type { Column } from '@tanstack/vue-table'
import type { Person } from './makeData'

// 3. New in V9! Tell the table which features and row models we want to use.
// Adding sorting, pagination, and global filtering opts the table into those
// feature sets.
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
  filterFns: {
    includesString: filterFn_includesString,
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()
// 4. Define the columns for your table.
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: 'Last Name',
    cell: (info) => h('i', info.getValue<string>()),
  }),
  columnHelper.accessor((row) => Number(row.age), {
    id: 'age',
    header: 'Age',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

// 5. Store data in a ref so regenerating it stays reactive
const data = ref(makeData(200))
const refreshData = () => (data.value = makeData(200))
const stressTest = () => (data.value = makeData(10_000))

// 6. Create the table instance with required features, columns, and data.
// No `state` / `onSortingChange` / `onPaginationChange` options needed.
// V9 manages sorting, pagination, and globalFilter state internally.
const table = useTable({
  debugTable: true,
  features,
  columns,
  get data() {
    return data.value
  },
  globalFilterFn: 'includesString',
})

// Debounced global filter setter — mirrors the react example's DebouncedInput.
const setGlobalFilterDebounced = debounce(
  (value: string | number) => table.setGlobalFilter(String(value)),
  { wait: 300 },
)

function sortIcon(column: Column<typeof features, Person>) {
  const sorted = column.getIsSorted()
  return sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown
}
</script>

<!-- 7. Render your table markup from the table instance APIs. -->
<template>
  <div class="p-4">
    <div class="flex items-center justify-between gap-2 mb-4">
      <div class="relative w-full max-w-sm">
        <Search
          class="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          :model-value="table.atoms.globalFilter.get() ?? ''"
          placeholder="Search all columns..."
          class="pl-8"
          @update:model-value="setGlobalFilterDebounced"
        />
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="refreshData">
          Regenerate Data
        </Button>
        <Button variant="outline" @click="stressTest">
          Stress Test (10k rows)
        </Button>
      </div>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colspan="header.colSpan"
            >
              <template v-if="!header.isPlaceholder">
                <Button
                  v-if="header.column.getCanSort()"
                  variant="ghost"
                  size="sm"
                  class="-ml-3 h-8 data-[state=open]:bg-accent"
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <FlexRender :header="header" />
                  <component :is="sortIcon(header.column)" class="ml-2" />
                </Button>
                <span v-else class="text-sm font-medium">
                  <FlexRender :header="header" />
                </span>
              </template>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="table.getRowModel().rows.length === 0">
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
          <TableRow v-for="row in table.getRowModel().rows" v-else :key="row.id">
            <TableCell v-for="cell in row.getAllCells()" :key="cell.id">
              <FlexRender :cell="cell" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination controls -->
    <div class="flex items-center justify-between gap-4 px-2 py-4">
      <div class="text-sm text-muted-foreground">
        {{ table.getPrePaginatedRowModel().rows.length.toLocaleString() }} of
        {{ data.length.toLocaleString() }} rows
      </div>
      <div class="flex items-center gap-6 lg:gap-8">
        <div class="flex items-center gap-2">
          <p class="text-sm font-medium">Rows per page</p>
          <Select
            :model-value="`${table.atoms.pagination.get().pageSize}`"
            @update:model-value="(value) => table.setPageSize(Number(value))"
          >
            <SelectTrigger size="sm" class="w-[70px]">
              <SelectValue
                :placeholder="`${table.atoms.pagination.get().pageSize}`"
              />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem
                v-for="pageSize in [10, 20, 30, 40, 50]"
                :key="pageSize"
                :value="`${pageSize}`"
              >
                {{ pageSize }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div
          class="flex w-[100px] items-center justify-center text-sm font-medium"
        >
          Page {{ table.atoms.pagination.get().pageIndex + 1 }} of
          {{ Math.max(1, table.getPageCount()) }}
        </div>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            class="hidden size-8 lg:flex"
            :disabled="!table.getCanPreviousPage()"
            @click="table.firstPage()"
          >
            <span class="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="size-8"
            :disabled="!table.getCanPreviousPage()"
            @click="table.previousPage()"
          >
            <span class="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="size-8"
            :disabled="!table.getCanNextPage()"
            @click="table.nextPage()"
          >
            <span class="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="hidden size-8 lg:flex"
            :disabled="!table.getCanNextPage()"
            @click="table.lastPage()"
          >
            <span class="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
