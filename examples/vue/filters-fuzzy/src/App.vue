<script setup lang="ts">
import {
  FlexRender,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { ref, watch } from 'vue'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import DebouncedInput from './DebouncedInput.vue'
import { makeData } from './makeData'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { Person } from './makeData'
import type {
  Column,
  ColumnFiltersState,
  FilterFn,
  SortFn,
  TableFeatures,
} from '@tanstack/vue-table'

// The filter meta that the fuzzy filter attaches to rows, declared per-table
// via the `filterMeta` slot below. No declaration merging needed!
interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

// Broad features type for writing the custom fns below before the `features`
// object exists, with the filter meta type plugged in
type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<FuzzyFeatures, any> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta?.({ itemRank })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort: SortFn<FuzzyFeatures, any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank as RankingInfo,
      rowB.columnFiltersMeta[columnId].itemRank as RankingInfo,
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

const columnHelper = createColumnHelper<typeof features, Person>()

const data = ref(makeData(5_000))

const columns = ref(
  columnHelper.columns([
    columnHelper.accessor('id', {
      header: 'ID',
      filterFn: 'equalsString', // note: normal non-fuzzy filter column - exact match required
    }),
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: (info) => info.getValue(),
      filterFn: 'includesStringSensitive', // note: normal non-fuzzy filter column - case sensitive
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      header: () => 'Last Name',
      cell: (info) => info.getValue(),
      filterFn: 'includesString', // note: normal non-fuzzy filter column - case insensitive
    }),
    columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
      id: 'fullName',
      header: 'Full Name',
      cell: (info) => info.getValue(),
      filterFn: 'fuzzy', // using our custom fuzzy filter function registered in `features`
      sortFn: 'fuzzy', // sort by fuzzy rank (falls back to alphanumeric)
    }),
  ]),
)

const table = useTable({
  features,
  data,
  get columns() {
    return columns.value
  },
  globalFilterFn: 'fuzzy', // apply fuzzy filter to the global filter (most common use case for fuzzy filter)
  debugTable: true,
  debugHeaders: true,
  debugColumns: false,
})

// apply the fuzzy sort if the fullName column is being filtered
watch(
  () => table.atoms.columnFilters.get(),
  (filters: ColumnFiltersState) => {
    if (
      filters[0]?.id === 'fullName' &&
      table.atoms.sorting.get()[0]?.id !== 'fullName'
    ) {
      table.setSorting([{ id: 'fullName', desc: false }])
    }
  },
)

const refreshData = () => {
  data.value = makeData(5_000)
}

const stressTest = () => {
  data.value = makeData(1_000_000)
}

function getColumnFilterValue(column: Column<typeof features, Person>) {
  return (column.getFilterValue() ?? '') as string
}
</script>

<template>
  <div class="demo-root">
    <div class="button-row">
      <button @click="refreshData" class="demo-button">Regenerate Data</button>
      <button @click="stressTest" class="demo-button">
        Stress Test (1M rows)
      </button>
    </div>
    <div class="spacer-md" />
    <div>
      <DebouncedInput
        :modelValue="table.atoms.globalFilter.get() ?? ''"
        @update:modelValue="(value) => table.setGlobalFilter(String(value))"
        class="summary-panel"
        placeholder="Search all columns..."
      />
    </div>
    <div class="spacer-sm" />
    <table>
      <thead>
        <tr
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :colSpan="header.colSpan"
          >
            <template v-if="!header.isPlaceholder">
              <div
                :class="header.column.getCanSort() ? 'sortable-header' : ''"
                @click="header.column.getToggleSortingHandler()?.($event)"
              >
                <FlexRender :header="header" />
                {{
                  { asc: ' 🔼', desc: ' 🔽' }[
                    header.column.getIsSorted() as string
                  ] ?? ''
                }}
              </div>
              <div v-if="header.column.getCanFilter()">
                <DebouncedInput
                  type="text"
                  :modelValue="getColumnFilterValue(header.column)"
                  @update:modelValue="
                    (value) => header.column.setFilterValue(value)
                  "
                  placeholder="Search..."
                  class="filter-select"
                />
              </div>
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td v-for="cell in row.getAllCells()" :key="cell.id">
            <FlexRender :cell="cell" />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="spacer-sm" />
    <div class="controls">
      <button
        class="demo-button demo-button-sm"
        @click="() => table.setPageIndex(0)"
        :disabled="!table.getCanPreviousPage()"
      >
        «
      </button>
      <button
        class="demo-button demo-button-sm"
        @click="() => table.previousPage()"
        :disabled="!table.getCanPreviousPage()"
      >
        ‹
      </button>
      <button
        class="demo-button demo-button-sm"
        @click="() => table.nextPage()"
        :disabled="!table.getCanNextPage()"
      >
        ›
      </button>
      <button
        class="demo-button demo-button-sm"
        @click="() => table.setPageIndex(table.getPageCount() - 1)"
        :disabled="!table.getCanNextPage()"
      >
        »
      </button>
      <span class="inline-controls">
        <div>Page</div>
        <strong>
          {{ (table.atoms.pagination.get().pageIndex + 1).toLocaleString() }} of
          {{ table.getPageCount().toLocaleString() }}
        </strong>
      </span>
      <span class="inline-controls">
        | Go to page:
        <input
          type="number"
          min="1"
          :max="table.getPageCount()"
          :value="table.atoms.pagination.get().pageIndex + 1"
          @input="
            table.setPageIndex(
              ($event.target as HTMLInputElement).value
                ? Number(($event.target as HTMLInputElement).value) - 1
                : 0,
            )
          "
          class="page-size-input"
        />
      </span>
      <select
        :value="table.atoms.pagination.get().pageSize"
        @change="
          table.setPageSize(Number(($event.target as HTMLSelectElement).value))
        "
      >
        <option
          v-for="pageSize in [10, 20, 30, 40, 50]"
          :key="pageSize"
          :value="pageSize"
        >
          Show {{ pageSize }}
        </option>
      </select>
    </div>
    <div>
      {{ table.getPrePaginatedRowModel().rows.length.toLocaleString() }} Rows
    </div>
    <pre>{{ JSON.stringify(table.store.get(), null, 2) }}</pre>
    <div class="spacer-md" />
  </div>
</template>

<style>
html {
  font-family: sans-serif;
  font-size: 14px;
}

table {
  border-spacing: 0;
  border-collapse: collapse;
  border: 1px solid lightgray;
}

tbody {
  border-bottom: 1px solid lightgray;
}

th {
  border-bottom: 1px solid lightgray;
  border-right: 1px solid lightgray;
  padding: 2px 4px;
}

tfoot {
  color: gray;
}

tfoot th {
  font-weight: normal;
}
</style>
