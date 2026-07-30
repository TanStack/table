<script setup lang="ts">
import {
  FlexRender,
  rowAggregationFeature,
  aggregationFn_mean,
  aggregationFn_median,
  aggregationFn_sum,
  columnFilteringFeature,
  columnGroupingFeature,
  createColumnHelper,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { ref } from 'vue'
import { makeData } from './makeData'
import type { Person } from './makeData'

const features = tableFeatures({
  rowAggregationFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  // register only the aggregation fns referenced by name in the column definitions
  aggregationFns: {
    mean: aggregationFn_mean,
    median: aggregationFn_median,
    sum: aggregationFn_sum,
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()

const pageSizes = [10, 20, 30, 40, 50]
const data = ref(makeData(10_000))

const columns = ref(
  columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
      footer: 'Grand Total',
      cell: (info) => info.getValue(),
      /**
       * override the value used for row grouping
       * (otherwise, defaults to the value derived from accessorKey / accessorFn)
       */
      getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      header: () => 'Last Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      aggregationFn: 'median',
      aggregatedCell: ({ getValue }) =>
        Math.round(getValue<number>() * 100) / 100,
      footer: ({ column }) => {
        const value = column.getAggregationValue<number | undefined>()
        return value === undefined ? '' : Math.round(value * 100) / 100
      },
    }),
    columnHelper.accessor('visits', {
      header: () => 'Visits',
      aggregationFn: 'sum',
      aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
      footer: ({ column }) =>
        column.getAggregationValue<number>().toLocaleString(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      cell: ({ getValue }) => Math.round(getValue<number>() * 100) / 100 + '%',
      aggregationFn: 'mean',
      aggregatedCell: ({ getValue }) =>
        Math.round(getValue<number>() * 100) / 100 + '%',
      footer: ({ column }) => {
        const value = column.getAggregationValue<number | undefined>()
        return value === undefined ? '' : `${Math.round(value * 100) / 100}%`
      },
    }),
  ]),
)

const table = useTable({
  features,
  data,
  get columns() {
    return columns.value
  },
  // initialState: { grouping: ['status'] }, // group by a column on first render
  // atoms: { grouping: groupingAtom }, // preferred: own grouping state with an external atom
  // state: { grouping }, // classic controlled state; pair with onGroupingChange
  // onGroupingChange: setGrouping,
  // enableGrouping: false, // disable grouping for every column; default true
  // groupedColumnMode: 'remove', // remove grouped columns instead of moving them to the start; default 'reorder'
  // manualGrouping: true, // pass rows that are already grouped and aggregated, for example from a server
  debugTable: true,
})

const refreshData = () => {
  data.value = makeData(10_000)
}

const stressTest = () => {
  data.value = makeData(1_000_000)
}

function handlePageSizeChange(e: Event) {
  const target = e.target as HTMLSelectElement
  table.setPageSize(Number(target.value))
}

function handleGoToPage(e: Event) {
  const target = e.target as HTMLInputElement
  const page = target.value ? Number(target.value) - 1 : 0
  table.setPageIndex(page)
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
            <div v-if="!header.isPlaceholder">
              <button
                v-if="header.column.getCanGroup()"
                @click="header.column.getToggleGroupingHandler()()"
                style="cursor: pointer"
              >
                {{
                  header.column.getIsGrouped()
                    ? `🛑 (${header.column.getGroupedIndex()}) `
                    : `👊 `
                }}
              </button>
              <FlexRender :header="header" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td
            v-for="cell in row.getAllCells()"
            :key="cell.id"
            :style="{
              background: cell.getIsGrouped()
                ? '#0aff0082'
                : cell.getIsAggregated()
                  ? '#ffa50078'
                  : cell.getIsPlaceholder()
                    ? '#ff000042'
                    : 'white',
            }"
          >
            <button
              v-if="cell.getIsGrouped()"
              @click="row.getToggleExpandedHandler()()"
              :style="{ cursor: row.getCanExpand() ? 'pointer' : 'normal' }"
            >
              {{ row.getIsExpanded() ? '👇' : '👉' }}
              <FlexRender :cell="cell" />
              ({{ row.subRows.length.toLocaleString() }})
            </button>
            <FlexRender v-else-if="cell.getIsAggregated()" :cell="cell" />
            <template v-else-if="cell.getIsPlaceholder()" />
            <FlexRender v-else :cell="cell" />
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr
          v-for="footerGroup in table.getFooterGroups()"
          :key="footerGroup.id"
        >
          <th
            v-for="header in footerGroup.headers"
            :key="header.id"
            :colspan="header.colSpan"
          >
            <FlexRender v-if="!header.isPlaceholder" :footer="header" />
          </th>
        </tr>
      </tfoot>
    </table>
    <div class="spacer-sm" />
    <div>
      <div class="controls">
        <button
          class="demo-button demo-button-sm"
          @click="() => table.firstPage()"
          :disabled="!table.getCanPreviousPage()"
        >
          <<
        </button>
        <button
          class="demo-button demo-button-sm"
          @click="() => table.previousPage()"
          :disabled="!table.getCanPreviousPage()"
        >
          <
        </button>
        <button
          class="demo-button demo-button-sm"
          @click="() => table.nextPage()"
          :disabled="!table.getCanNextPage()"
        >
          >
        </button>
        <button
          class="demo-button demo-button-sm"
          @click="() => table.lastPage()"
          :disabled="!table.getCanNextPage()"
        >
          >>
        </button>
        <span class="inline-controls">
          <div>Page</div>
          <strong>
            {{ (table.atoms.pagination.get().pageIndex + 1).toLocaleString() }}
            of
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
            @change="handleGoToPage"
            class="page-size-input"
          />
        </span>
        <select
          :value="table.atoms.pagination.get().pageSize"
          @change="handlePageSizeChange"
        >
          <option
            :key="pageSize"
            :value="pageSize"
            v-for="pageSize in pageSizes"
          >
            Show {{ pageSize }}
          </option>
        </select>
      </div>
      <div>{{ table.getRowModel().rows.length.toLocaleString() }} Rows</div>
      <pre data-testid="table-state">{{
        JSON.stringify(table.store.get(), null, 2)
      }}</pre>
    </div>
    <div class="spacer-sm" />
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
