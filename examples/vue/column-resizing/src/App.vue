<script setup lang="ts">
import {
  FlexRender,
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { ref } from 'vue'
import { makeData } from './makeData'
import type {
  ColumnResizeDirection,
  ColumnResizeMode,
  Header,
} from '@tanstack/vue-table'
import type { Person } from './makeData'

const features = tableFeatures({ columnResizingFeature, columnSizingFeature })

const columnHelper = createColumnHelper<typeof features, Person>()

const data = ref(makeData(10))

const columns = ref(
  columnHelper.columns([
    columnHelper.group({
      header: 'Name',
      footer: (props) => props.column.id,
      columns: columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
          size: 180,
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => 'Last Name',
          footer: (props) => props.column.id,
          size: 180,
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
          size: 120,
        }),
        columnHelper.group({
          header: 'More Info',
          columns: columnHelper.columns([
            columnHelper.accessor('visits', {
              header: () => 'Visits',
              footer: (props) => props.column.id,
              size: 120,
            }),
            columnHelper.accessor('status', {
              header: 'Status',
              footer: (props) => props.column.id,
              size: 140,
            }),
            columnHelper.accessor('progress', {
              header: 'Profile Progress',
              footer: (props) => props.column.id,
              size: 180,
            }),
          ]),
        }),
      ]),
    }),
  ]),
)

const columnResizeMode = ref<ColumnResizeMode>('onChange')
const columnResizeDirection = ref<ColumnResizeDirection>('ltr')

const table = useTable({
  features,
  data,
  get columns() {
    return columns.value
  },
  get columnResizeMode() {
    return columnResizeMode.value
  },
  get columnResizeDirection() {
    return columnResizeDirection.value
  },
  // initialState: { columnSizing: { firstName: 200 } }, // set column sizes on first render
  // atoms: { columnResizing: columnResizingAtom }, // preferred: own transient resize state with an external atom
  // state: { columnResizing }, // classic controlled state; pair with onColumnResizingChange
  // onColumnResizingChange: setColumnResizing,
  // enableColumnResizing: false, // disable resizing for every column; default true
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
})

const refreshData = () => {
  data.value = makeData(10)
}

const stressTest = () => {
  data.value = makeData(100)
}

function resizerTransform(header: Header<typeof features, Person, unknown>) {
  if (columnResizeMode.value === 'onEnd' && header.column.getIsResizing()) {
    const dir = table.options.columnResizeDirection === 'rtl' ? -1 : 1
    const deltaOffset = table.atoms.columnResizing.get().deltaOffset ?? 0
    return `translateX(${dir * deltaOffset}px)`
  }
  return ''
}
</script>

<template>
  <div class="demo-root">
    <div class="button-row">
      <button @click="refreshData" class="demo-button">Regenerate Data</button>
      <button @click="stressTest" class="demo-button">
        Stress Test (100 rows)
      </button>
    </div>
    <div class="spacer-md" />
    <select
      :value="columnResizeMode"
      @change="
        columnResizeMode = ($event.target as HTMLSelectElement)
          .value as ColumnResizeMode
      "
      class="demo-button outlined-control"
    >
      <option value="onEnd">Resize: "onEnd"</option>
      <option value="onChange">Resize: "onChange"</option>
    </select>
    <select
      :value="columnResizeDirection"
      @change="
        columnResizeDirection = ($event.target as HTMLSelectElement)
          .value as ColumnResizeDirection
      "
      class="demo-button outlined-control"
    >
      <option value="ltr">Resize Direction: "ltr"</option>
      <option value="rtl">Resize Direction: "rtl"</option>
    </select>
    <div :style="{ direction: table.options.columnResizeDirection }">
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
                <div
                  @dblclick="header.column.resetSize()"
                  @mousedown="header.getResizeHandler()($event)"
                  @touchstart="header.getResizeHandler()($event)"
                  :class="[
                    'resizer',
                    table.options.columnResizeDirection,
                    { isResizing: header.column.getIsResizing() },
                  ]"
                  :style="{ transform: resizerTransform(header) }"
                />
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
                <div
                  @dblclick="header.column.resetSize()"
                  @mousedown="header.getResizeHandler()($event)"
                  @touchstart="header.getResizeHandler()($event)"
                  :class="[
                    'resizer',
                    table.options.columnResizeDirection,
                    { isResizing: header.column.getIsResizing() },
                  ]"
                  :style="{ transform: resizerTransform(header) }"
                />
              </div>
            </div>
          </div>
          <div class="tbody">
            <div
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              class="tr"
            >
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
                <div
                  @dblclick="header.column.resetSize()"
                  @mousedown="header.getResizeHandler()($event)"
                  @touchstart="header.getResizeHandler()($event)"
                  :class="[
                    'resizer',
                    table.options.columnResizeDirection,
                    { isResizing: header.column.getIsResizing() },
                  ]"
                  :style="{ transform: resizerTransform(header) }"
                />
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
    </div>
    <div class="spacer-md" />
    <pre>{{ JSON.stringify(table.store.get(), null, 2) }}</pre>
  </div>
</template>
