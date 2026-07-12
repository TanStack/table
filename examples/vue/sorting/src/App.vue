<script setup lang="ts">
import {
  FlexRender,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { h, ref } from 'vue'
import { makeData } from './makeData'
import type { Person } from './makeData'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'rowNumber',
    header: '#',
    cell: ({ row }) => row.getDisplayIndex() + 1,
  }),
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => h('span', 'Last Name'),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    sortFn: 'alphanumeric',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => h('span', 'Visits'),
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
])

const data = ref(makeData(1_000))

const refreshData = () => {
  data.value = makeData(1_000)
}

const stressTest = () => {
  data.value = makeData(1_000_000)
}

const table = useTable({
  features,
  data,
  columns,
  // initialState: { sorting: [{ id: 'firstName', desc: false }] }, // set the initial sort once
  // atoms: { sorting: sortingAtom }, // preferred: own sorting state with an external atom
  // state: { sorting }, // classic controlled state; pair with onSortingChange
  // onSortingChange: setSorting,
  // enableSorting: false, // disable sorting for every column; default true
  // sortDescFirst: true, // start every sort cycle with descending order; inferred by column data by default
  // enableSortingRemoval: false, // keep a sorted column sorted when toggling; default true
  // enableMultiSort: false, // disable Shift-click multi-sorting; default true
  // enableMultiRemove: false, // prevent a multi-sort toggle from removing a sorted column; default true
  // isMultiSortEvent: () => true, // make every sort interaction a multi-sort; default requires Shift
  // maxMultiSortColCount: 3, // limit multi-sorting to three columns; default Infinity
  // manualSorting: true, // pass data that is already sorted, for example from a server
  // autoResetPageIndex: false, // with pagination, keep the current page when sorting changes; default true
  debugTable: true,
})
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
            :class="header.column.getCanSort() ? 'sortable-header' : ''"
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <template v-if="!header.isPlaceholder">
              <FlexRender :header="header" />

              {{
                { asc: ' 🔼', desc: ' 🔽' }[
                  header.column.getIsSorted() as string
                ]
              }}
            </template>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in table.getRowModel().rows.slice(0, 10)" :key="row.id">
          <td v-for="cell in row.getAllCells()" :key="cell.id">
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

    <div class="spacer-md"></div>

    <div>{{ table.getRowModel().rows.length.toLocaleString() }} Rows</div>

    <pre>{{ JSON.stringify(table.atoms.sorting.get(), null, 2) }}</pre>
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
