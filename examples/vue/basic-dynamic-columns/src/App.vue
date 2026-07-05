<script setup lang="ts">
import { computed, ref } from 'vue'
import { FlexRender, useTable } from '@tanstack/vue-table'
import { useTanStackTableDevtools } from '@tanstack/vue-table-devtools'
import Filter from './Filter.vue'
import { makeData } from './makeData'
import {
  detectDataType,
  features,
  formatHeader,
  getFilterFn,
  getSortFn,
  renderValue,
} from './tableHelper'
import type { DynamicRow } from './tableHelper'
import type { ColumnDef, Header } from '@tanstack/vue-table'

const data = ref<Array<DynamicRow>>(makeData(1_000))

const refreshData = () => {
  data.value = makeData(1_000)
}
const stressTest = () => {
  data.value = makeData(1_000_000)
}

// Derive the columns from the keys of the data instead of hard-coding them.
const columns = computed<Array<ColumnDef<typeof features, DynamicRow>>>(() => {
  if (data.value.length === 0) return []
  return Object.keys(data.value[0]).map(
    (key): ColumnDef<typeof features, DynamicRow> => {
      const dataType = detectDataType(data.value, key)
      return {
        accessorKey: key,
        header: formatHeader(key),
        meta: { dataType },
        sortFn: getSortFn(dataType),
        filterFn: getFilterFn(dataType),
        cell: (info) => renderValue(info.getValue(), dataType),
      }
    },
  )
})

const table = useTable({
  key: 'basic-dynamic-columns', // needed for devtools
  debugTable: true,
  features,
  get columns() {
    return columns.value
  },
  data,
})

useTanStackTableDevtools(table)

const rowCount = computed(() => table.getRowModel().rows.length)
const visibleRows = computed(() => table.getRowModel().rows.slice(0, 15))

const sortIndicator = (
  header: Header<typeof features, DynamicRow, unknown>,
) => {
  return (
    { asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? ''
  )
}
</script>

<template>
  <div class="demo-root">
    <p class="demo-note">
      Columns, sort fns, filter fns, and filter components are all derived from
      the data type of each field, not from a hard-coded column definition.
    </p>
    <div class="button-row">
      <button class="demo-button demo-button-sm" @click="refreshData">
        Regenerate Data
      </button>
      <button class="demo-button demo-button-sm" @click="stressTest">
        Stress Test (1M rows)
      </button>
    </div>
    <div class="spacer-sm" />
    <div class="scroll-container">
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
              <template v-if="!header.isPlaceholder">
                <div
                  :class="header.column.getCanSort() ? 'sortable-header' : ''"
                  :title="
                    header.column.getCanSort() ? 'Toggle sorting' : undefined
                  "
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <FlexRender :header="header" />
                  {{ sortIndicator(header) }}
                </div>
                <Filter
                  v-if="header.column.getCanFilter()"
                  :column="header.column"
                  :table="table"
                />
              </template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in visibleRows" :key="row.id">
            <td v-for="cell in row.getAllCells()" :key="cell.id">
              <FlexRender :cell="cell" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="spacer-sm" />
    <div>{{ rowCount.toLocaleString() }} Rows</div>
  </div>
</template>
