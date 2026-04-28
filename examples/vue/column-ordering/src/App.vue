<script setup lang="ts">
import {
  FlexRender,
  columnOrderingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { ref } from 'vue'
import { faker } from '@faker-js/faker'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type { Column } from '@tanstack/vue-table'

const _features = tableFeatures({
  columnOrderingFeature,
  columnVisibilityFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const data = ref(makeData(20))

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

const refreshData = () => {
  data.value = makeData(20)
}

const stressTest = () => {
  data.value = makeData(1_000)
}

const table = useTable(
  {
    _features,
    data,
    get columns() {
      return columns.value
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  },
  (state) => ({
    columnOrder: state.columnOrder,
    columnVisibility: state.columnVisibility,
  }),
)

const randomizeColumns = () => {
  table.setColumnOrder(
    faker.helpers.shuffle(
      table
        .getAllLeafColumns()
        .map((column: Column<typeof _features, Person>) => column.id),
    ),
  )
}

function toggleColumnVisibility(column: Column<typeof _features, Person>) {
  table.setColumnVisibility({
    ...table.state.columnVisibility,
    [column.id]: !column.getIsVisible(),
  })
}

function toggleAllColumnsVisibility() {
  table
    .getAllLeafColumns()
    .forEach((column: Column<typeof _features, Person>) => {
      toggleColumnVisibility(column)
    })
}
</script>

<template>
  <div class="p-2">
    <div class="inline-block border border-black shadow rounded">
      <div class="px-1 border-b border-black">
        <label>
          <input
            type="checkbox"
            :checked="table.getIsAllColumnsVisible()"
            @input="toggleAllColumnsVisibility"
          />
          Toggle All
        </label>
      </div>
      <div
        v-for="column in table.getAllLeafColumns()"
        :key="column.id"
        class="px-1"
      >
        <label>
          <input
            type="checkbox"
            :checked="column.getIsVisible()"
            @input="toggleColumnVisibility(column)"
          />

          {{ column.id }}
        </label>
      </div>
    </div>
    <div class="h-4" />
    <div class="flex flex-wrap gap-2">
      <button @click="refreshData" class="border p-1">Regenerate Data</button>
      <button @click="stressTest" class="border p-1">
        Stress Test (1k rows)
      </button>
      <button @click="randomizeColumns" class="border p-1">
        Shuffle Columns
      </button>
    </div>
    <div class="h-4" />

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
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
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
    <pre>{{ JSON.stringify(table.state.columnOrder, null, 2) }}</pre>
  </div>
</template>

<style>
html,
body {
  padding: 4px;
  margin: 0;

  font-family: Arial, Helvetica, sans-serif;
}

table {
  border: 1px solid lightgray;
  border-collapse: collapse;
}

tbody {
  border-bottom: 1px solid lightgray;
}

th,
td {
  border-bottom: 1px solid lightgray;
  border-right: 1px solid lightgray;
  padding: 2px 4px;
}

th {
  padding: 8px;
}

tfoot {
  color: gray;
}

tfoot th {
  font-weight: normal;
}
</style>
