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

const data = ref(makeData(1_000))

const refreshData = () => {
  data.value = makeData(1_000)
}

const stressTest = () => {
  data.value = makeData(100_000)
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
  }),
)
</script>

<template>
  <div class="p-2">
    <div class="flex flex-wrap gap-2">
      <button @click="refreshData" class="border p-2">Regenerate Data</button>
      <button @click="stressTest" class="border p-2">
        Stress Test (100k rows)
      </button>
    </div>
    <div class="h-4" />
    <div>
      <DebouncedInput
        :modelValue="table.state.globalFilter ?? ''"
        @update:modelValue="(value) => table.setGlobalFilter(String(value))"
        className="p-2 font-lg shadow border border-block"
        placeholder="Search all columns..."
      />
    </div>
    <div className="h-2" />
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
    <div class="h-4" />
  </div>
</template>
<style>
html {
  font-family: sans-serif;
  font-size: 14px;
}

table {
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
