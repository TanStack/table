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

const _features = tableFeatures({
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
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
  data.value = makeData(100_000)
}

const table = useTable(
  {
    _features,
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
    },
    data,
    columns,
    debugTable: true,
  },
  (state) => ({ sorting: state.sorting }),
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
            :class="
              header.column.getCanSort() ? 'cursor-pointer select-none' : ''
            "
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

    <div class="h-4"></div>

    <div>{{ table.getRowModel().rows.length.toLocaleString() }} Rows</div>

    <pre>{{ JSON.stringify(table.state.sorting, null, 2) }}</pre>
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
