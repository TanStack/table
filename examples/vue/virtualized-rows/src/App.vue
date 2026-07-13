<script setup lang="ts">
import './index.css'
import { computed, h, ref } from 'vue'
import {
  FlexRender,
  columnSizingFeature,
  createSortedRowModel,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { useVirtualizer } from '@tanstack/vue-virtual'
import IndeterminateCheckbox from './IndeterminateCheckbox.vue'
import { makeData } from './makeData'
import type { ColumnDef, Row } from '@tanstack/vue-table'
import type { ComponentPublicInstance } from 'vue'
import type { Person } from './makeData'

const features = tableFeatures({
  columnSizingFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
})

const search = ref('')

const data = ref<Array<Person>>(makeData(50_000))

function refreshData() {
  data.value = makeData(50_000)
}

function stressTest() {
  data.value = makeData(1_000_000)
}

const filteredData = computed<Array<Person>>(() => {
  const searchValue = search.value.toLowerCase()

  // If no search value is present, return all data
  if (!searchValue) return data.value

  return data.value.filter((row) => {
    return Object.values(row).some((value) => {
      if (value instanceof Date) {
        return value.toLocaleString().toLowerCase().includes(searchValue)
      }
      // Stringify the value and check if it contains the search term
      return `${value}`.toLowerCase().includes(searchValue)
    })
  })
})

let searchTimeout: ReturnType<typeof setTimeout>
function handleDebounceSearch(ev: Event) {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    search.value = (ev?.target as HTMLInputElement)?.value ?? ''
  }, 300)
}

const columns = computed<Array<ColumnDef<typeof features, Person>>>(() => [
  {
    id: 'select',
    header: '',
    cell: '',
    size: 40,
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => h('span', 'Last Name'),
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
  },
  {
    accessorKey: 'visits',
    header: () => h('span', 'Visits'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: (info) => info.getValue<Date>().toLocaleString(),
  },
])

const table = useTable({
  features,
  get data() {
    return filteredData.value
  },
  columns: columns.value,
  getRowId: (row: Person) => String(row.id),
  debugTable: false,
})

function toggleSelected(row: Row<typeof features, Person>, event: Event) {
  row.getToggleSelectedHandler({
    // selectChildren: false
  })(event)
}

const rows = computed(() => table.getRowModel().rows)

// The virtualizer needs to know the scrollable container element
const tableContainerRef = ref<HTMLDivElement | null>(null)

const rowVirtualizerOptions = computed(() => {
  return {
    count: rows.value.length,
    estimateSize: () => 33, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.value,
    overscan: 5,
  }
})

const rowVirtualizer = useVirtualizer(rowVirtualizerOptions)

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
const totalSize = computed(() => rowVirtualizer.value.getTotalSize())

function measureElement(el: Element | ComponentPublicInstance | null) {
  if (!el || !(el instanceof Element)) {
    return
  }

  rowVirtualizer.value.measureElement(el)
}
</script>

<template>
  <div>
    <p class="centered-text">
      For tables, the basis for the offset of the translate css function is from
      the row's initial position itself. Because of this, we need to calculate
      the translateY pixel count different and base it off the the index.
    </p>
    <h1 class="virtualized-title">Virtualized Rows</h1>
    <p>Hold Shift while selecting rows to select or deselect a range.</p>
    <p>{{ table.getSelectedRowIds().length.toLocaleString() }} rows selected</p>
    <div class="centered-button-row" style="margin-bottom: 8px">
      <button @click="refreshData" class="demo-button">Regenerate Data</button>
      <button @click="stressTest" class="demo-button">
        Stress Test (1M rows)
      </button>
    </div>
    <div style="margin: 0 auto; width: min-content">
      <input
        :modelValue="search"
        @input="handleDebounceSearch"
        placeholder="Search"
        class="demo-root"
      />
      {{ rows.length.toLocaleString() }} results
    </div>
  </div>
  <div
    class="container"
    ref="tableContainerRef"
    :style="{
      overflow: 'auto', //our scrollable table container
      position: 'relative', //needed for sticky header
      height: '800px', //should be a fixed height
    }"
  >
    <div :style="{ height: `${totalSize}px` }">
      <!-- Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights -->
      <table :style="{ display: 'grid' }">
        <thead
          :style="{
            display: 'grid',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }"
        >
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            :style="{ display: 'flex', width: '100%' }"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colspan="header.colSpan"
              :style="{ width: `${header.getSize()}px` }"
            >
              <IndeterminateCheckbox
                v-if="header.column.id === 'select'"
                :checked="table.getIsAllRowsSelected()"
                :indeterminate="table.getIsSomeRowsSelected()"
                :onChange="table.getToggleAllRowsSelectedHandler()"
              />
              <div
                v-else-if="!header.isPlaceholder"
                :class="{
                  'sortable-header': header.column.getCanSort(),
                }"
                @click="(e) => header.column.getToggleSortingHandler()?.(e)"
              >
                <FlexRender :header="header" />
                <span v-if="header.column.getIsSorted() === 'asc'"> 🔼</span>
                <span v-if="header.column.getIsSorted() === 'desc'"> 🔽</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody
          :style="{
            display: 'grid',
            height: `${totalSize}px`, //tells scrollbar how big the table is
            position: 'relative', //needed for absolute positioning of rows
          }"
        >
          <tr
            v-for="vRow in virtualRows"
            :data-index="
              vRow.index /* needed for dynamic row height measurement*/
            "
            :ref="measureElement /*measure dynamic row height*/"
            :key="rows[vRow.index].id"
            :style="{
              display: 'flex',
              position: 'absolute',
              transform: `translateY(${vRow.start}px)`, //this should always be a `style` as it changes on scroll
              width: '100%',
            }"
          >
            <td
              v-for="cell in rows[vRow.index].getAllCells()"
              :key="cell.id"
              :style="{
                display: 'flex',
                width: `${cell.column.getSize()}px`,
              }"
            >
              <IndeterminateCheckbox
                v-if="cell.column.id === 'select'"
                :checked="rows[vRow.index].getIsSelected()"
                :disabled="!rows[vRow.index].getCanSelect()"
                :indeterminate="rows[vRow.index].getIsSomeSelected()"
                :onClick="(event) => toggleSelected(rows[vRow.index], event)"
              />
              <FlexRender v-else :cell="cell" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
