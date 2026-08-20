<script setup lang="ts">
import {
  FlexRender,
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { ref } from 'vue'
import { makeData } from './makeData'
import type { Person } from './makeData'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, Person>()

const pageSizes = [10, 20, 30, 40, 50, Infinity]
const data = ref(makeData(1_000))

const columns = ref(
  columnHelper.columns([
    columnHelper.display({
      id: 'rowNumber',
      header: '#',
      cell: ({ row }) => row.getDisplayIndex() + 1,
    }),
    columnHelper.group({
      header: 'Name',
      footer: (props) => props.column.id,
      columns: columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => 'Last Name',
          footer: (props) => props.column.id,
        }),
      ]),
    }),
    columnHelper.group({
      header: 'Info',
      footer: (props) => props.column.id,
      columns: columnHelper.columns([
        columnHelper.accessor('age', {
          header: () => 'Age',
          footer: (props) => props.column.id,
        }),
        columnHelper.group({
          header: 'More Info',
          columns: columnHelper.columns([
            columnHelper.accessor('visits', {
              header: () => 'Visits',
              footer: (props) => props.column.id,
            }),
            columnHelper.accessor('status', {
              header: 'Status',
              footer: (props) => props.column.id,
            }),
            columnHelper.accessor('progress', {
              header: 'Profile Progress',
              footer: (props) => props.column.id,
            }),
          ]),
        }),
      ]),
    }),
  ]),
)

const table = useTable({
  features,
  data,
  get columns() {
    return columns.value
  },
  // initialState: { pagination: { pageIndex: 1, pageSize: 20 } }, // set the initial page once
  // atoms: { pagination: paginationAtom }, // preferred: own pagination state with an external atom
  // state: { pagination }, // classic controlled state; pair with onPaginationChange
  // onPaginationChange: setPagination,
  // autoResetPageIndex: false, // keep the current page after page-altering changes; default true
  // autoResetAll: false, // turn off every feature's automatic reset, including page index
  // manualPagination: true, // pass data that is already paginated, for example from a server
  // pageCount: 10, // total pages for manual pagination; use -1 when unknown
  // rowCount: 1_000, // total rows for manual pagination; pageCount is calculated from this and pageSize
  debugTable: true,
})

const refreshData = () => {
  data.value = makeData(1_000)
}

const stressTest = () => {
  data.value = makeData(1_000_000)
}

function handleGoToPage(e: any) {
  const page = e.target.value ? Number(e.target.value) - 1 : 0
  table.setPageIndex(page)
}

function handlePageSizeChange(e: any) {
  table.setPageSize(Number(e.target.value))
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
            <FlexRender v-if="!header.isPlaceholder" :header="header" />
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
      <tfoot>
        <tr
          v-for="footerGroup in table.getFooterGroups()"
          :key="footerGroup.id"
        >
          <th
            v-for="header in footerGroup.headers"
            :key="header.id"
            :colSpan="header.colSpan"
          >
            <FlexRender v-if="!header.isPlaceholder" :footer="header" />
          </th>
        </tr>
      </tfoot>
    </table>
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
          :disabled="!table.getCanLastPage()"
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
            @input="handleGoToPage"
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
            Show {{ pageSize === Infinity ? 'All' : pageSize }}
          </option>
        </select>
      </div>
      <div>
        Showing {{ table.getRowModel().rows.length.toLocaleString() }} of
        {{ table.getRowCount().toLocaleString() }} Rows
      </div>
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
