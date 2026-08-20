<script setup lang="ts">
import {
  FlexRender,
  columnSizingFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { ref } from 'vue'
import { makeData } from './makeData'
import type { Person } from './makeData'

// This is not the Column Resizing Example, this is a simplified version that just sets static column sizes

const features = tableFeatures({ columnSizingFeature })

const columnHelper = createColumnHelper<typeof features, Person>()

const data = ref(makeData(20))

const columns = ref(
  columnHelper.columns([
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
      size: 120, // initial size
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      cell: (info) => info.getValue(),
      header: () => 'Last Name',
      footer: (props) => props.column.id,
      size: 120,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      footer: (props) => props.column.id,
      size: 100,
    }),
    columnHelper.accessor('visits', {
      header: () => 'Visits',
      footer: (props) => props.column.id,
      size: 80,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      footer: (props) => props.column.id,
      size: 200,
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: (props) => props.column.id,
      size: 200,
    }),
  ]),
)

const table = useTable({
  features,
  data,
  get columns() {
    return columns.value
  },
  // defaultColumn: { size: 150, minSize: 50, maxSize: 500 }, // set sizing defaults for every column
  // initialState: { columnSizing: { firstName: 200 } }, // set column sizes on first render
  // atoms: { columnSizing: columnSizingAtom }, // preferred: own sizing state with an external atom
  // state: { columnSizing }, // classic controlled state; pair with onColumnSizingChange
  // onColumnSizingChange: setColumnSizing,
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
})

const refreshData = () => {
  data.value = makeData(20)
}

const stressTest = () => {
  data.value = makeData(1_000)
}

function handleSizeChange(columnId: string, e: Event) {
  const value = (e.target as HTMLInputElement).value
  // Don't actually do this to resize columns. This is just for demonstration purposes.
  // See the Column Resizing Example for how to do this with dedicated resizing APIs efficiently.
  table.setColumnSizing({
    ...table.atoms.columnSizing.get(),
    [columnId]: Number(value),
  })
}
</script>

<template>
  <div class="demo-root">
    <div class="button-row">
      <button @click="refreshData" class="demo-button">Regenerate Data</button>
      <button @click="stressTest" class="demo-button">
        Stress Test (1k rows)
      </button>
    </div>
    <div class="spacer-md" />
    <div class="button-row">
      <div class="section-title">Initial Column Sizes</div>
      <br />
      <div v-for="column in table.getAllLeafColumns()" :key="column.id">
        <label>
          {{ column.id }}
          <input
            type="number"
            :value="column.getSize()"
            @input="(e) => handleSizeChange(column.id, e)"
            class="column-size-input"
          />
        </label>
      </div>
    </div>
    <div class="controls"></div>
    <div class="spacer-md" />
    <div class="section-title">&lt;table/&gt;</div>
    <div class="scroll-container">
      <table :style="{ width: `${table.getCenterTotalSize()}px` }">
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
              :style="{ width: `${header.getSize()}px` }"
            >
              <FlexRender v-if="!header.isPlaceholder" :header="header" />
              <div />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <td
              v-for="cell in row.getAllCells()"
              :key="cell.id"
              :style="{ width: `${cell.column.getSize()}px` }"
            >
              <FlexRender :cell="cell" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="spacer-md" />
    <div class="section-title">&lt;div/&gt; (relative)</div>
    <div class="scroll-container">
      <div class="divTable" :style="{ width: `${table.getTotalSize()}px` }">
        <div class="thead">
          <div
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="tr"
          >
            <div
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="th"
              :style="{ width: `${header.getSize()}px` }"
            >
              <FlexRender v-if="!header.isPlaceholder" :header="header" />
              <div />
            </div>
          </div>
        </div>
        <div class="tbody">
          <div v-for="row in table.getRowModel().rows" :key="row.id" class="tr">
            <div
              v-for="cell in row.getAllCells()"
              :key="cell.id"
              class="td"
              :style="{ width: `${cell.column.getSize()}px` }"
            >
              <FlexRender :cell="cell" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="spacer-md" />
    <div class="section-title">&lt;div/&gt; (absolute positioning)</div>
    <div class="scroll-container">
      <div class="divTable" :style="{ width: `${table.getTotalSize()}px` }">
        <div class="thead">
          <div
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="tr"
            :style="{ position: 'relative' }"
          >
            <div
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="th"
              :style="{
                position: 'absolute',
                left: `${header.getStart()}px`,
                width: `${header.getSize()}px`,
              }"
            >
              <FlexRender v-if="!header.isPlaceholder" :header="header" />
              <div />
            </div>
          </div>
        </div>
        <div class="tbody">
          <div
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="tr"
            :style="{ position: 'relative' }"
          >
            <div
              v-for="cell in row.getAllCells()"
              :key="cell.id"
              class="td"
              :style="{
                position: 'absolute',
                left: `${cell.column.getStart()}px`,
                width: `${cell.column.getSize()}px`,
              }"
            >
              <FlexRender :cell="cell" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="spacer-md" />
    <pre data-testid="table-state">{{
      JSON.stringify(table.store.get(), null, 2)
    }}</pre>
  </div>
</template>
