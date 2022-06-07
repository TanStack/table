<script setup lang="ts">
import { createTable, getCoreRowModel, useTableInstance, } from '@tanstack/vue-table'
import type { Column, ColumnOrderState, ColumnPinningState } from '@tanstack/vue-table'

import { makeData, type Person } from './makeData'
import { ref } from 'vue'
import faker from '@faker-js/faker'


let table = createTable().setRowType<Person>()

const defaultColumns = [
  table.createGroup({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      table.createDataColumn(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: 'Last Name',
        footer: props => props.column.id,
      }),
    ],
  }),
  table.createGroup({
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('age', {
        header: 'Age',
        footer: props => props.column.id,
      }),
      table.createGroup({
        header: 'More Info',
        columns: [
          table.createDataColumn('visits', {
            header: () => 'Visits',
            footer: props => props.column.id,
          }),
          table.createDataColumn('status', {
            header: 'Status',
            footer: props => props.column.id,
          }),
          table.createDataColumn('progress', {
            header: 'Profile Progress',
            footer: props => props.column.id,
          }),
        ],
      }),
    ],
  }),
]

const data = ref(makeData(5000))
const columns = ref(defaultColumns)
const columnVisibility = ref({})
const columnOrder = ref<ColumnOrderState>([])

const columnPinning = ref<ColumnPinningState>({})
const isSplit = ref(false)

const rerender = () => data.value = makeData(5000)

const instance = useTableInstance(table, {
  get data() {
    return data.value
  },
  get columns() { return columns.value },
  state: {
    get columnVisibility() {
      return columnVisibility.value
    },
    get columnOrder() {
      return columnOrder.value
    },
    get columnPinning() {
      return columnPinning.value
    },
  },

  onColumnOrderChange: (order) => {
    columnOrder.value = order
  },
  onColumnPinningChange: (pinning) => {
    columnPinning.value = pinning()
  },
  getCoreRowModel: getCoreRowModel(),
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
})

const randomizeColumns = () => {
  instance.setColumnOrder(
    faker.helpers.shuffle(instance.getAllLeafColumns().map(d => d.id))
  )
}

function toggleColumnVisibility(column: Column<any>) {
  columnVisibility.value = {
    ...columnVisibility.value,
    [column.id]: !column.getIsVisible(),
  }
}

function toggleAllColumnsVisibility() {
  instance.getAllLeafColumns().forEach(column => {
    toggleColumnVisibility(column)
  })
}

</script>

<template>
  <div class="p-2">
    <div class="inline-block border border-black rounded shadow">
      <div class="px-1 border-b border-black">
        <label>
          <input type="checkbox" :checked="instance.getIsAllColumnsVisible()" @input="toggleAllColumnsVisibility" />
          Toggle All
        </label>
      </div>
      <div v-for="column in instance.getAllLeafColumns()" :key="column.id" class="px-1">
        <label>
          <input type="checkbox" :checked="column.getIsVisible()" @input="toggleColumnVisibility(column)" />
          {{ column.id }}
        </label>
      </div>
    </div>
    <div class="h-4" />
    <div class="flex flex-wrap gap-2">
      <button @click="rerender" class="p-1 border">
        Regenerate
      </button>
      <button @click="randomizeColumns" class="p-1 border">
        Shuffle Columns
      </button>
    </div>
    <div class="h-4" />
    <div>
      <label>
        <input type="checkbox" v-model="isSplit" />
        Split Mode
      </label>
    </div>
    <div class="h-4" />
    <div :class="`flex ${isSplit ? 'gap-4' : ''}`">
      <!-- left -->
      <table v-if="isSplit" class="border-2 border-black table-left">
        <thead>
          <tr v-for="headerGroup in instance.getLeftHeaderGroups()" :key="headerGroup.id">
            <th v-for="header in headerGroup.headers" :key="header.id" :colSpan="header.colSpan">
              <div class="whitespace-nowrap">
                <component v-if="!header.isPlaceholder" :is="header.renderHeader" />
              </div>
              <div v-if="!header.isPlaceholder && header.column.getCanPin()" class="flex justify-center gap-1">
                <button v-if="header.column.getIsPinned() !== 'left'" @click="header.column.pin('left')"
                  class="px-2 border rounded">
                  {{ '<=' }} </button>
                    <button v-if="header.column.getIsPinned()" @click="header.column.pin(false)"
                      class="px-2 border rounded">
                      X
                    </button>
                    <button v-if="header.column.getIsPinned() !== 'right'" @click="header.column.pin('right')"
                      class="px-2 border rounded">
                      {{ '=>' }}
                    </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in instance.getRowModel().rows.slice(0, 20)" :key="row.id">
            <td v-for="cell in row.getLeftVisibleCells()" :key="cell.id">
              <component :is="cell.renderCell" />
            </td>
          </tr>
        </tbody>
      </table>
      <!-- center -->
      <table class="border-2 border-black table-center">
        <thead>
          <tr v-for="headerGroup in (isSplit ? instance.getCenterHeaderGroups(): instance.getHeaderGroups())" :key="headerGroup.id">

            <th v-for="header in headerGroup.headers" :key="header.id" :colSpan="header.colSpan">
              <div class="whitespace-nowrap">
                <component v-if="!header.isPlaceholder" :is="header.renderHeader" />
              </div>
              <div v-if="!header.isPlaceholder && header.column.getCanPin()" class="flex justify-center gap-1">
                <button v-if="header.column.getIsPinned() !== 'left'" @click="header.column.pin('left')"
                  class="px-2 border rounded">
                  {{ '<=' }} </button>
                    <button v-if="header.column.getIsPinned()" @click="header.column.pin(false)"
                      class="px-2 border rounded">
                      X
                    </button>
                    <button v-if="header.column.getIsPinned() !== 'right'" @click="header.column.pin('right')"
                      class="px-2 border rounded">
                      {{ '=>' }}
                    </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in instance.getRowModel().rows.slice(0, 20)" :key="row.id">
            <td v-for="cell in (isSplit
              ? row.getCenterVisibleCells()
              : row.getVisibleCells()
            )" :key="cell.id">
              <component :is="cell.renderCell" />
            </td>
          </tr>

        </tbody>
      </table>
      <!-- right -->
      <table v-if="isSplit" class="border-2 border-black table-right">
        <thead>
          <tr v-for="headerGroup in instance.getRightHeaderGroups()" :key="headerGroup.id">
            <th v-for="header in headerGroup.headers" :key="header.id" :colSpan="header.colSpan">
              <div class="whitespace-nowrap">
                <component v-if="!header.isPlaceholder" :is="header.renderHeader" />
              </div>
              <div v-if="!header.isPlaceholder && header.column.getCanPin()" class="flex justify-center gap-1">
                <button v-if="header.column.getIsPinned() !== 'left'" @click="header.column.pin('left')"
                  class="px-2 border rounded">
                  {{ '<=' }} </button>
                    <button v-if="header.column.getIsPinned()" @click="header.column.pin(false)"
                      class="px-2 border rounded">
                      X
                    </button>
                    <button v-if="header.column.getIsPinned() !== 'right'" @click="header.column.pin('right')"
                      class="px-2 border rounded">
                      {{ '=>' }}
                    </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in instance.getRowModel().rows.slice(0, 20)" :key="row.id">
            <td v-for="cell in row.getRightVisibleCells()" :key="cell.id">
              <component :is="cell.renderCell" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pre>{{ JSON.stringify(instance.getState().columnOrder, null, 2) }}</pre>
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
