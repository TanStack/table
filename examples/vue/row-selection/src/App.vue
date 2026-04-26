<script setup lang="tsx">
import { useTanStackTableDevtools } from '@tanstack/vue-table-devtools'
import {
  FlexRender,
  useTable,
  createColumnHelper,
  tableFeatures,
  rowSelectionFeature,
} from '@tanstack/vue-table'
import { ref } from 'vue'
import IndeterminateCheckbox from './IndeterminateCheckbox.vue'
import { makeData, Person } from './makeData'

const _features = tableFeatures({
  rowSelectionFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ table }) => {
      return (
        <IndeterminateCheckbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        ></IndeterminateCheckbox>
      ) as any
    },
    cell: ({ row }) => {
      return (
        // @ts-ignore
        <div className="px-1">
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          ></IndeterminateCheckbox>
          {/* @ts-ignore */}
        </div>
      ) as any
    },
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
])

const data = ref(makeData(1_000))
const enableRowSelection = ref(true)

const refreshData = () => {
  data.value = makeData(1_000)
}

const stressTest = () => {
  data.value = makeData(100_000)
}

const toggleRowSelection = () => {
  enableRowSelection.value = !enableRowSelection.value
}

const table = useTable(
  {
    _features,
    _rowModels: {},
    data,
    columns,
    debugTable: true,
    // enable row selection for all rows
    get enableRowSelection() {
      return enableRowSelection.value
    },
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
  },
  (state) => ({ rowSelection: state.rowSelection }),
)

useTanStackTableDevtools(table, 'Row Selection Example')
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
        <tr>
          <td className="p-1">
            <IndeterminateCheckbox
              :checked="table.getIsAllPageRowsSelected()"
              :indeterminate="table.getIsSomePageRowsSelected()"
              :onChange="table.getToggleAllPageRowsSelectedHandler()"
            />
          </td>
          <td :colSpan="20">
            Page Rows {{ table.getRowModel().rows.length.toLocaleString() }}
          </td>
        </tr>
      </tfoot>
    </table>
    <div class="h-4" />
    <button @click="toggleRowSelection" class="border p-2">
      {{ enableRowSelection ? 'Disable' : 'Enable' }} Row Selection
    </button>
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
