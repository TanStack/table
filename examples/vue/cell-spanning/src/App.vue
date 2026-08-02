<script setup lang="ts">
import { ref } from 'vue'
import {
  FlexRender,
  cellSelectionFeature,
  cellSpanningFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { makeData, makeSummaryData } from './makeData'
import type { Cell } from '@tanstack/vue-table'
import type { Shift, SummaryRow } from './makeData'

const features = tableFeatures({
  cellSelectionFeature,
  cellSpanningFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
})

const columnHelper = createColumnHelper<typeof features, Shift>()

const columns = columnHelper.columns([
  columnHelper.accessor('region', {
    header: 'Region',
    sortFn: 'alphanumeric',
    // Adjacent rows that share a region merge into one vertically spanning
    // cell. Spans always derive from the rows that are actually rendered, so
    // sorting, filtering, and paging just change which rows are adjacent.
    spanRows: true,
  }),
  columnHelper.accessor('team', {
    header: 'Team',
    sortFn: 'alphanumeric',
    spanRows: true,
  }),
  columnHelper.accessor('shift', {
    header: 'Shift',
    sortFn: 'alphanumeric',
    // The predicate form: shifts only merge while the table is sorted by the
    // shift column, so the predicate itself is visibly reactive.
    spanRows: ({ column, value, anchorValue }) =>
      column.getIsSorted() !== false && value === anchorValue,
  }),
  columnHelper.accessor('employee', {
    header: 'Employee',
    sortFn: 'alphanumeric',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('hours', {
    header: 'Hours',
    sortFn: 'basic',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    sortFn: 'alphanumeric',
    filterFn: 'includesString',
  }),
])

const summaryFeatures = tableFeatures({
  cellSpanningFeature,
  columnVisibilityFeature,
})

const summaryColumnHelper = createColumnHelper<
  typeof summaryFeatures,
  SummaryRow
>()

const summaryColumns = summaryColumnHelper.columns([
  summaryColumnHelper.accessor('label', {
    header: 'Shift',
    // Subtotal rows render one label cell covering every column but the
    // total. `Infinity` clamps to the rest of the cell's pinned region.
    spanColumns: ({ row }) => (row.original.kind === 'subtotal' ? Infinity : 1),
  }),
  summaryColumnHelper.accessor('region', {
    header: 'Region',
  }),
  summaryColumnHelper.accessor('hours', {
    header: 'Hours',
  }),
])

/**
 * Selection styling for the spanning table. A merged cell is always entirely
 * selected or entirely unselected: the selection bounds expand to enclose any
 * merge they touch, so the tint and the outline land on the rendered anchor.
 */
function getCellClassName(cell: Cell<typeof features, Shift>): string {
  const base =
    cell.getRowSpan() > 1 ? 'cell-selectable span-cell' : 'cell-selectable'

  if (!cell.getIsSelected()) {
    return cell.getIsFocused() ? `${base} cell-focused` : base
  }

  const edges = cell.getSelectionEdges()

  return [
    base,
    'cell-selected',
    cell.getIsFocused() && 'cell-focused',
    edges.top && 'cell-edge-top',
    edges.right && 'cell-edge-right',
    edges.bottom && 'cell-edge-bottom',
    edges.left && 'cell-edge-left',
  ]
    .filter(Boolean)
    .join(' ')
}

const data = ref(makeData())
const summaryData = ref(makeSummaryData())
const spanningEnabled = ref(true)
const refreshData = () => (data.value = makeData())

const table = useTable({
  debugTable: true,
  features,
  columns,
  data,
  // a ref works here: the adapter unwraps and watches reactive option values
  enableCellSpanning: spanningEnabled,
  initialState: {
    pagination: { pageIndex: 0, pageSize: 12 },
  },
})

const summaryTable = useTable({
  debugTable: true,
  features: summaryFeatures,
  columns: summaryColumns,
  data: summaryData,
})
</script>

<template>
  <div class="demo-root">
    <div class="controls">
      <button class="demo-button" @click="refreshData">Regenerate Data</button>
      <label>
        <input v-model="spanningEnabled" type="checkbox" />
        Row spanning
      </label>
      <label v-for="columnId in ['team', 'shift']" :key="columnId">
        <input
          type="checkbox"
          :checked="table.getColumn(columnId)!.getIsVisible()"
          @change="
            table.getColumn(columnId)!.getToggleVisibilityHandler()($event)
          "
        />
        {{ String(table.getColumn(columnId)!.columnDef.header) }}
      </label>
      <select
        data-testid="status-filter"
        :value="
          (table.getColumn('status')!.getFilterValue() as string | undefined) ??
          ''
        "
        @change="
          table
            .getColumn('status')!
            .setFilterValue(
              ($event.target as HTMLSelectElement).value || undefined,
            )
        "
      >
        <option value="">All statuses</option>
        <option value="Approved">Approved</option>
        <option value="Pending">Pending</option>
        <option value="Rejected">Rejected</option>
      </select>
      <input
        data-testid="employee-filter"
        class="filter-input"
        placeholder="Filter employees..."
        :value="
          (table.getColumn('employee')!.getFilterValue() as
            string | undefined) ?? ''
        "
        @input="
          table
            .getColumn('employee')!
            .setFilterValue(
              ($event.target as HTMLInputElement).value || undefined,
            )
        "
      />
    </div>
    <div class="spacer-sm" />
    <div class="controls">
      <button
        class="demo-button-sm"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()"
      >
        {{ '<' }}
      </button>
      <button
        class="demo-button-sm"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage()"
      >
        {{ '>' }}
      </button>
      <span>
        Page {{ table.atoms.pagination.get().pageIndex + 1 }} of
        {{ table.getPageCount() }}
      </span>
      <select
        data-testid="page-size"
        :value="table.atoms.pagination.get().pageSize"
        @change="
          table.setPageSize(Number(($event.target as HTMLSelectElement).value))
        "
      >
        <option
          v-for="pageSize in [10, 12, 36]"
          :key="pageSize"
          :value="pageSize"
        >
          Show {{ pageSize }}
        </option>
      </select>
      <span>
        Visible columns:
        <span data-testid="visible-leaf-count">{{
          table.getVisibleLeafColumns().length
        }}</span>
      </span>
      <span>
        Selected cells:
        <span data-testid="selected-count">{{
          table.getSelectedCellCount()
        }}</span>
      </span>
    </div>
    <div class="spacer-md" />
    <!-- The panels wrap into a grid whenever the viewport is wide enough. -->
    <div class="example-grid">
      <section class="example-panel">
        <h2 class="section-title">Row Spanning</h2>
        <table data-testid="span-table">
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
                <button
                  type="button"
                  class="sortable-header header-sort-button"
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <FlexRender :header="header" />
                  {{
                    { asc: ' 🔼', desc: ' 🔽' }[
                      header.column.getIsSorted() as string
                    ] ?? ''
                  }}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in table.getRowModel().rows" :key="row.id">
              <!--
                A span of 0 means this cell is covered by a cell above or to
                its left. Skip it. Do NOT render `rowspan="0"`: in HTML that
                means "span to the end of the row group", so forgetting this
                check merges the cell down the whole tbody instead of
                rendering nothing.
              -->
              <template v-for="cell in row.getVisibleCells()" :key="cell.id">
                <td
                  v-if="cell.getRowSpan() !== 0 && cell.getColSpan() !== 0"
                  :rowSpan="cell.getRowSpan()"
                  :colSpan="cell.getColSpan()"
                  :class="getCellClassName(cell)"
                  @mousedown="cell.getSelectionStartHandler()($event)"
                  @mouseenter="cell.getSelectionExtendHandler()($event)"
                >
                  <FlexRender :cell="cell" />
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="example-panel">
        <h2 class="section-title">Reference (no spanning)</h2>
        <!-- The same table instance rendered flat. Under every sort, filter,
             and page combination the merged panel must describe exactly this
             grid. -->
        <table data-testid="reference-table">
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
                <button
                  type="button"
                  class="sortable-header header-sort-button"
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <FlexRender :header="header" />
                  {{
                    { asc: ' 🔼', desc: ' 🔽' }[
                      header.column.getIsSorted() as string
                    ] ?? ''
                  }}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in table.getRowModel().rows" :key="row.id">
              <td v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :cell="cell" />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="example-panel">
        <h2 class="section-title">Summary Rows (colSpan)</h2>
        <table data-testid="summary-table">
          <thead>
            <tr
              v-for="headerGroup in summaryTable.getHeaderGroups()"
              :key="headerGroup.id"
            >
              <th
                v-for="header in headerGroup.headers"
                :key="header.id"
                :colSpan="header.colSpan"
              >
                <FlexRender :header="header" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in summaryTable.getRowModel().rows"
              :key="row.id"
              :class="
                row.original.kind === 'subtotal' ? 'subtotal-row' : undefined
              "
            >
              <template v-for="cell in row.getVisibleCells()" :key="cell.id">
                <td
                  v-if="cell.getRowSpan() !== 0 && cell.getColSpan() !== 0"
                  :rowSpan="cell.getRowSpan()"
                  :colSpan="cell.getColSpan()"
                >
                  <FlexRender :cell="cell" />
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
    <div class="spacer-md" />
    <pre data-testid="table-state">{{
      JSON.stringify(table.store.get(), null, 2)
    }}</pre>
  </div>
</template>
