<script setup lang="ts">
import {
  createExpandedRowModel,
  createTableHook,
  rowExpandingFeature,
} from '@tanstack/vue-table'
import { Text, h, ref } from 'vue'
import { makeData } from './makeData'
import type { Row } from '@tanstack/vue-table'
import type { Person } from './makeData'

const { appFeatures, createAppColumnHelper, useAppTable } = createTableHook({
  _features: { rowExpandingFeature },
  _rowModels: {
    expandedRowModel: createExpandedRowModel(),
  },
})

const columnHelper = createAppColumnHelper<Person>()

function renderExpanded(row: Row<typeof appFeatures, Person>) {
  if (!row.getCanExpand()) {
    return h(Text, '🔵')
  }
  return h(
    'button',
    {
      onClick: row.getToggleExpandedHandler(),
      style: { cursor: 'pointer' },
    },
    row.getIsExpanded() ? '👇' : '👉',
  )
}

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'expander',
    header: () => null,
    cell: ({ row }) => renderExpanded(row),
  }),
  columnHelper.accessor('firstName', {
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
  }),
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
])

const data = ref(makeData(20))

const refreshData = () => {
  data.value = makeData(20)
}

const stressTest = () => {
  data.value = makeData(1_000)
}

const table = useAppTable(
  {
    debugTable: true,
    // features and row models are already defined in the createTableHook call
    data,
    columns,
    getRowCanExpand: () => true,
  },
  (state) => ({ expanded: state.expanded }),
)
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
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in table.getRowModel().rows" :key="row.id">
          <tr>
            <td v-for="cell in row.getAllCells()" :key="cell.id">
              <component :is="table.FlexRender" :cell="cell" />
            </td>
          </tr>
          <tr v-if="row.getIsExpanded()">
            <td :colspan="row.getAllCells().length">
              <pre :style="{ fontSize: '10px' }">
                  <code>{{ JSON.stringify(row.original, null, 2) }}</code>
                </pre>
            </td>
          </tr>
        </template>
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
    <div class="spacer-md" />
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
