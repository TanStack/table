<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  createColumnHelper,
} from '@tanstack/vue-table'

import {makeData, type Person} from './makeData'
import {h, ref} from 'vue'
import ThCheckbox from "./ThCheckbox.vue";
import TdCheckbox from "./TdCheckbox.vue";

const columnHelper = createColumnHelper<Person>()

const data = ref(makeData(20))
const columns = ref([
  {
    id: 'select',
    header: ({table}) => h(ThCheckbox, {table}),
    cell: ({row}) => h(TdCheckbox, {row}),
  },
  columnHelper.group({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => 'Last Name',
        footer: props => props.column.id,
      }),
    ],
  }),
  columnHelper.group({
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      columnHelper.group({
        header: 'More Info',
        columns: [
          columnHelper.accessor('visits', {
            header: () => 'Visits',
            footer: props => props.column.id,
          }),
          columnHelper.accessor('status', {
            header: 'Status',
            footer: props => props.column.id,
          }),
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: props => props.column.id,
          }),
        ],
      }),
    ],
  }),
])

const rerender = () => (data.value = makeData(20))
const rowSelection = ref({});

const table = useVueTable({
  get data() {
    return data.value
  },
  get columns() {
    return columns.value
  },
  state: {
    get rowSelection() {
      return rowSelection.value;
    },
  },
  enableRowSelection: true, //enable row selection for all rows
  // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
  onRowSelectionChange: updaterOrValue => {
    rowSelection.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(rowSelection.value)
        : updaterOrValue
  },
  getCoreRowModel: getCoreRowModel(),
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
})
</script>

<template>
  <div class="p-2">
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
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
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
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.footer"
              :props="header.getContext()"
            />
          </th>
        </tr>
      </tfoot>
    </table>
    <pre>rowSelection = {{ JSON.stringify(rowSelection, null, 2) }}</pre>
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
