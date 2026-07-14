<script setup lang="ts">
import {
  FlexRender,
  aggregationFeature,
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_mean,
  aggregationFn_sum,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { ref } from 'vue'
import { makeData } from './makeData'
import type { Sale } from './makeData'
import type { Table } from '@tanstack/vue-table'

type RowSource = 'all' | 'custom' | 'filtered' | 'page' | 'selected'
type AggregationTableMeta = { rowSource: RowSource }
const features = tableFeatures({
  aggregationFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  aggregationFns: {
    count: aggregationFn_count,
    extent: aggregationFn_extent,
    mean: aggregationFn_mean,
    sum: aggregationFn_sum,
  },
  tableMeta: metaHelper<AggregationTableMeta>(),
})
const columnHelper = createColumnHelper<typeof features, Sale>()
function getAggregationRows(table: Table<typeof features, Sale>) {
  const source = table.options.meta?.rowSource
  if (source === 'all') return table.getCoreRowModel().rows
  if (source === 'page') return table.getRowModel().rows
  if (source === 'selected') return table.getFilteredSelectedRowModel().rows
  if (source === 'custom') return table.getCoreRowModel().rows.slice(0, 3)
  return undefined
}
function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(formatValue).join(' – ')
  if (value && typeof value === 'object')
    return Object.entries(value)
      .map(([key, entry]) => `${key}: ${formatValue(entry)}`)
      .join(', ')
  if (typeof value === 'number')
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return String(value ?? '—')
}
const data = ref(makeData(10_000))
const rowSource = ref<RowSource>('filtered')
const columns = columnHelper.columns([
  columnHelper.display({ id: 'select' }),
  columnHelper.accessor('category', {
    header: 'Category',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('item', {
    header: 'Item',
    footer: ({ table }) => `${table.options.meta?.rowSource} total`,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    aggregationFn: 'sum',
    cell: ({ getValue }) => getValue<number>().toLocaleString(),
    footer: ({ column, table }) =>
      formatValue(column.getAggregationValue(getAggregationRows(table))),
  }),
  columnHelper.accessor('score', {
    header: 'Score',
    aggregationFn: ['count', 'mean', { id: 'range', aggregationFn: 'extent' }],
    footer: ({ column, table }) =>
      formatValue(column.getAggregationValue(getAggregationRows(table))),
  }),
])
const table = useTable({
  features,
  data,
  columns,
  get meta() {
    return { rowSource: rowSource.value }
  },
  initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  debugTable: true,
  debugColumns: true,
})
function setCategoryFilter(event: Event) {
  table
    .getColumn('category')
    ?.setFilterValue((event.target as HTMLInputElement).value)
}
function setRowSource(event: Event) {
  rowSource.value = (event.target as HTMLSelectElement).value as RowSource
}
function setPage(event: Event) {
  const value = (event.target as HTMLInputElement).value
  table.setPageIndex(value ? Number(value) - 1 : 0)
}
</script>

<template>
  <div class="demo-root">
    <h1>Aggregation without grouping</h1>
    <p>
      Amount uses a scalar <code>sum</code>. Score runs count, mean, and range
      together and returns a keyed object.
    </p>
    <div>
      <button @click="data = makeData(10_000)">Regenerate Data</button
      ><button @click="data = makeData(200_000)">
        Stress Test (200k rows)
      </button>
    </div>
    <div class="spacer-sm" />
    <div class="controls">
      <label
        >Category filter:
        <input
          :value="table.getColumn('category')?.getFilterValue() ?? ''"
          @input="setCategoryFilter"
      /></label>
      <label
        >Total rows:
        <select :value="rowSource" @change="setRowSource">
          <option value="filtered">Filtered rows</option>
          <option value="all">All rows</option>
          <option value="page">Visible page</option>
          <option value="selected">Filtered selected rows</option>
          <option value="custom">First three core rows</option>
        </select></label
      >
    </div>
    <div class="spacer-sm" />
    <table>
      <thead>
        <tr v-for="group in table.getHeaderGroups()" :key="group.id">
          <th v-for="header in group.headers" :key="header.id">
            <input
              v-if="header.column.id === 'select'"
              type="checkbox"
              :checked="table.getIsAllPageRowsSelected()"
              @change="table.toggleAllPageRowsSelected()"
            /><FlexRender v-else-if="!header.isPlaceholder" :header="header" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td
            v-for="cell in row.getAllCells()"
            :key="cell.id"
            :class="{ numeric: cell.column.id === 'amount' }"
          >
            <input
              v-if="cell.column.id === 'select'"
              type="checkbox"
              :checked="row.getIsSelected()"
              @change="row.toggleSelected()"
            /><FlexRender v-else :cell="cell" />
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr v-for="group in table.getFooterGroups()" :key="group.id">
          <th
            v-for="header in group.headers"
            :key="header.id"
            :colspan="header.colSpan"
          >
            <FlexRender v-if="!header.isPlaceholder" :footer="header" />
          </th>
        </tr>
      </tfoot>
    </table>
    <div class="spacer-sm" />
    <div class="controls">
      <button
        class="demo-button demo-button-sm"
        @click="table.firstPage()"
        :disabled="!table.getCanPreviousPage()"
      >
        &lt;&lt;</button
      ><button
        class="demo-button demo-button-sm"
        @click="table.previousPage()"
        :disabled="!table.getCanPreviousPage()"
      >
        &lt;</button
      ><button
        class="demo-button demo-button-sm"
        @click="table.nextPage()"
        :disabled="!table.getCanNextPage()"
      >
        &gt;</button
      ><button
        class="demo-button demo-button-sm"
        @click="table.lastPage()"
        :disabled="!table.getCanNextPage()"
      >
        &gt;&gt;
      </button>
      <span class="inline-controls"
        ><div>Page</div>
        <strong
          >{{
            (table.atoms.pagination.get().pageIndex + 1).toLocaleString()
          }}
          of {{ table.getPageCount().toLocaleString() }}</strong
        ></span
      >
      <span class="inline-controls"
        >| Go to page:<input
          type="number"
          min="1"
          :max="table.getPageCount()"
          :value="table.atoms.pagination.get().pageIndex + 1"
          @input="setPage"
          class="page-size-input"
      /></span>
      <select
        :value="table.atoms.pagination.get().pageSize"
        @change="
          table.setPageSize(Number(($event.target as HTMLSelectElement).value))
        "
      >
        <option v-for="size in [10, 20, 30, 40, 50]" :key="size" :value="size">
          Show {{ size }}
        </option>
      </select>
    </div>
    <div>
      Showing {{ table.getRowModel().rows.length.toLocaleString() }} of
      {{ table.getRowCount().toLocaleString() }} Rows
    </div>
    <pre>{{ JSON.stringify(table.atoms.pagination.get(), null, 2) }}</pre>
  </div>
</template>
