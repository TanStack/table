<script setup lang="ts">
import { ref } from 'vue'
import DebouncedInput from './DebouncedInput.vue'
import Filter from './Filter.vue'
import { createAppColumnHelper, useAppTable } from './tableHelper'
import { makeData } from './makeData'
import type { Person } from './tableHelper'

const columnHelper = createAppColumnHelper<Person>()

const columns = ref(
  columnHelper.columns([
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

const INITIAL_PAGE_INDEX = 0

const goToPageNumber = ref(INITIAL_PAGE_INDEX + 1)
const pageSizes = [10, 20, 30, 40, 50]
const data = ref(makeData(1_000))

const refreshData = () => {
  data.value = makeData(1_000)
}

const stressTest = () => {
  data.value = makeData(200_000)
}

const table = useAppTable(
  {
    debugTable: true,
    data,
    get columns() {
      return columns.value
    },
  },
  (state) => ({
    columnFilters: state.columnFilters,
    globalFilter: state.globalFilter,
    pagination: state.pagination,
  }),
)

function handleGoToPage(e: any) {
  const page = e.target.value ? Number(e.target.value) - 1 : 0
  goToPageNumber.value = page + 1
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
        Stress Test (200k rows)
      </button>
    </div>
    <div class="spacer-md" />
    <div>
      <DebouncedInput
        :modelValue="table.state.globalFilter ?? ''"
        @update:modelValue="(value) => table.setGlobalFilter(String(value))"
        className="summary-panel"
        placeholder="Search all columns..."
      />
    </div>
    <div className="spacer-sm" />
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
            <component
              v-if="!header.isPlaceholder"
              :is="table.FlexRender"
              :header="header"
            />
            <template
              v-if="!header.isPlaceholder && header.column.getCanFilter()"
            >
              <Filter :column="header.column" :table="table" />
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td v-for="cell in row.getAllCells()" :key="cell.id">
            <component :is="table.FlexRender" :cell="cell" />
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
            <component
              v-if="!header.isPlaceholder"
              :is="table.FlexRender"
              :footer="header"
            />
          </th>
        </tr>
      </tfoot>
    </table>
    <div class="spacer-md" />
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
          {{ (table.state.pagination.pageIndex + 1).toLocaleString() }} of
          {{ table.getPageCount().toLocaleString() }}
        </strong>
      </span>
      <span class="inline-controls">
        | Go to page:
        <input
          type="number"
          :value="goToPageNumber"
          @change="handleGoToPage"
          class="page-size-input"
        />
      </span>
      <select
        :value="table.state.pagination.pageSize"
        @change="handlePageSizeChange"
      >
        <option :key="pageSize" :value="pageSize" v-for="pageSize in pageSizes">
          Show {{ pageSize }}
        </option>
      </select>
    </div>
    <div>
      {{ table.getPrePaginatedRowModel().rows.length.toLocaleString() }} Rows
    </div>
    <pre>{{ JSON.stringify(table.state, null, 2) }}</pre>
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
