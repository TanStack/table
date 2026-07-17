<script setup lang="ts">
import { FlexRender, createColumnHelper, useTable } from '@tanstack/vue-table'
import { ref } from 'vue'
import Filter from './Filter.vue'
import { appFeatures } from './tableHelper'
import { makeData } from './makeData'
import {
  createBucketFilter,
  formatBytes,
  getBucket,
  lastLoginBuckets,
  storageBuckets,
} from './buckets'
import type { Account } from './makeData'

const columnHelper = createColumnHelper<typeof appFeatures, Account>()

const INITIAL_PAGE_INDEX = 0

const goToPageNumber = ref(INITIAL_PAGE_INDEX + 1)
const pageSizes = [10, 20, 30, 40, 50]
const data = ref(makeData(5_000))

const columns = ref(
  columnHelper.columns([
    columnHelper.accessor('name', {
      header: 'Account',
      filterFn: 'includesString',
      meta: { filterVariant: 'text' },
    }),
    columnHelper.accessor('lastLogin', {
      header: 'Last login',
      cell: (info) => info.getValue().toLocaleString(),
      getUniqueValues: (row) => [getBucket(row.lastLogin, lastLoginBuckets)],
      filterFn: createBucketFilter(lastLoginBuckets),
      meta: { filterVariant: 'facets', facetOptions: lastLoginBuckets },
    }),
    columnHelper.accessor('storageBytes', {
      header: 'Storage',
      cell: (info) => formatBytes(info.getValue()),
      getUniqueValues: (row) => [getBucket(row.storageBytes, storageBuckets)],
      filterFn: createBucketFilter(storageBuckets),
      meta: { filterVariant: 'facets', facetOptions: storageBuckets },
    }),
    columnHelper.accessor('files', {
      header: 'Files',
      enableColumnFilter: false,
      cell: (info) => info.getValue().toLocaleString(),
    }),
  ]),
)

const table = useTable({
  features: appFeatures,
  data,
  get columns() {
    return columns.value
  },
  // Column faceting has no table-level options; configure its row-model factories in `features`.
  // initialState: { columnFilters: [{ id: 'firstName', value: 'Jane' }] }, // set filters once
  // atoms: { columnFilters: columnFiltersAtom }, // preferred: own column filters with an external atom
  // state: { columnFilters }, // classic controlled state; pair with onColumnFiltersChange
  // onColumnFiltersChange: setColumnFilters,
  // enableFilters: false, // disable all column and global filtering; default true
  // enableColumnFilters: false, // disable per-column filters; default true
  // filterFromLeafRows: true, // keep parents whose descendants match; default filters from parents down
  // maxLeafRowFilterDepth: 1, // only filter through this nested-row depth; default 100
  // manualFiltering: true, // pass data that is already filtered, for example from a server
  debugTable: true,
  debugHeaders: true,
  debugColumns: false,
})

const refreshData = () => {
  data.value = makeData(5_000)
}

const stressTest = () => {
  data.value = makeData(1_000_000)
}

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
            <template v-if="!header.isPlaceholder">
              <FlexRender :header="header" />
              <div v-if="header.column.getCanFilter()">
                <Filter :column="header.column" />
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
          {{ (table.atoms.pagination.get().pageIndex + 1).toLocaleString() }} of
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
        :value="table.atoms.pagination.get().pageSize"
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
