<script setup lang="ts">
import {
  FlexRender,
  columnOrderingFeature,
  columnPinningFeature,
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

const data = ref(makeData(1_000))

const features = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
})

const columnHelper = createColumnHelper<typeof features, Person>()

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

const isSplit = ref(false)

const refreshData = () => {
  data.value = makeData(1_000)
}

const stressTest = () => {
  data.value = makeData(1_000_000)
}

const table = useTable({
  features,
  data,
  get columns() {
    return columns.value
  },
  // initialState: { columnPinning: { start: ['firstName'], end: [] } }, // `start`/`end` follow layout direction
  // atoms: { columnPinning: columnPinningAtom }, // preferred: own pinning state with an external atom
  // state: { columnPinning }, // classic controlled state; pair with onColumnPinningChange
  // onColumnPinningChange: setColumnPinning,
  // enableColumnPinning: false, // disable pinning for every column; default true
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
})

const randomizeColumns = () => {
  table.setColumnOrder(
    faker.helpers.shuffle(
      table
        .getAllLeafColumns()
        .map((column: Column<typeof features, Person>) => column.id),
    ),
  )
}

function toggleColumnVisibility(column: Column<typeof features, Person>) {
  table.setColumnVisibility({
    ...table.atoms.columnVisibility.get(),
    [column.id]: !column.getIsVisible(),
  })
}

function toggleAllColumnsVisibility() {
  table
    .getAllLeafColumns()
    .forEach((column: Column<typeof features, Person>) => {
      toggleColumnVisibility(column)
    })
}
</script>

<template>
  <div class="demo-root">
    <div class="column-toggle-panel">
      <div class="column-toggle-panel-header">
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
        class="column-toggle-row"
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
    <div class="spacer-md" />
    <div class="button-row">
      <button @click="refreshData" class="demo-button demo-button-sm">
        Regenerate Data
      </button>
      <button @click="stressTest" class="demo-button demo-button-sm">
        Stress Test (1M rows)
      </button>
      <button @click="randomizeColumns" class="demo-button demo-button-sm">
        Shuffle Columns
      </button>
    </div>
    <div class="spacer-md" />
    <div>
      <label>
        <input type="checkbox" v-model="isSplit" />
        Split Mode
      </label>
    </div>
    <div class="spacer-md" />
    <div :class="`table-row-group ${isSplit ? 'split-gap' : ''}`">
      <!-- left -->
      <table v-if="isSplit" class="outlined-table table-left">
        <thead>
          <tr
            v-for="headerGroup in table.getStartHeaderGroups()"
            :key="headerGroup.id"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
            >
              <div class="nowrap">
                <FlexRender v-if="!header.isPlaceholder" :header="header" />
              </div>
              <div
                v-if="!header.isPlaceholder && header.column.getCanPin()"
                class="pin-actions"
              >
                <button
                  v-if="header.column.getIsPinned() !== 'start'"
                  @click="header.column.pin('start')"
                  class="pin-button"
                >
                  {{ '<=' }}
                </button>
                <button
                  v-if="header.column.getIsPinned()"
                  @click="header.column.pin(false)"
                  class="pin-button"
                >
                  X
                </button>
                <button
                  v-if="header.column.getIsPinned() !== 'end'"
                  @click="header.column.pin('end')"
                  class="pin-button"
                >
                  {{ '=>' }}
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.getRowModel().rows.slice(0, 20)"
            :key="row.id"
          >
            <td v-for="cell in row.getStartVisibleCells()" :key="cell.id">
              <FlexRender :cell="cell" />
            </td>
          </tr>
        </tbody>
      </table>
      <!-- center -->
      <table class="outlined-table table-center">
        <thead>
          <tr
            v-for="headerGroup in isSplit
              ? table.getCenterHeaderGroups()
              : table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
            >
              <div class="nowrap">
                <FlexRender v-if="!header.isPlaceholder" :header="header" />
              </div>
              <div
                v-if="!header.isPlaceholder && header.column.getCanPin()"
                class="pin-actions"
              >
                <button
                  v-if="header.column.getIsPinned() !== 'start'"
                  @click="header.column.pin('start')"
                  class="pin-button"
                >
                  {{ '<=' }}
                </button>
                <button
                  v-if="header.column.getIsPinned()"
                  @click="header.column.pin(false)"
                  class="pin-button"
                >
                  X
                </button>
                <button
                  v-if="header.column.getIsPinned() !== 'end'"
                  @click="header.column.pin('end')"
                  class="pin-button"
                >
                  {{ '=>' }}
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.getRowModel().rows.slice(0, 20)"
            :key="row.id"
          >
            <td
              v-for="cell in isSplit
                ? row.getCenterVisibleCells()
                : row.getVisibleCells()"
              :key="cell.id"
            >
              <FlexRender :cell="cell" />
            </td>
          </tr>
        </tbody>
      </table>
      <!-- right -->
      <table v-if="isSplit" class="outlined-table table-right">
        <thead>
          <tr
            v-for="headerGroup in table.getEndHeaderGroups()"
            :key="headerGroup.id"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
            >
              <div class="nowrap">
                <FlexRender v-if="!header.isPlaceholder" :header="header" />
              </div>
              <div
                v-if="!header.isPlaceholder && header.column.getCanPin()"
                class="pin-actions"
              >
                <button
                  v-if="header.column.getIsPinned() !== 'start'"
                  @click="header.column.pin('start')"
                  class="pin-button"
                >
                  {{ '<=' }}
                </button>
                <button
                  v-if="header.column.getIsPinned()"
                  @click="header.column.pin(false)"
                  class="pin-button"
                >
                  X
                </button>
                <button
                  v-if="header.column.getIsPinned() !== 'end'"
                  @click="header.column.pin('end')"
                  class="pin-button"
                >
                  {{ '=>' }}
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.getRowModel().rows.slice(0, 20)"
            :key="row.id"
          >
            <td v-for="cell in row.getEndVisibleCells()" :key="cell.id">
              <FlexRender :cell="cell" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pre data-testid="table-state">{{
      JSON.stringify(table.store.get(), null, 2)
    }}</pre>
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
  border-spacing: 0;
  border-collapse: collapse;
  border: 1px solid lightgray;
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
