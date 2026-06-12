<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  FlexRender,
  columnSizingFeature,
  columnVisibilityFeature,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { makeColumns, makeData } from './makeData'
import type { ComponentPublicInstance } from 'vue'
import type { Person } from './makeData'

const features = tableFeatures({
  columnSizingFeature,
  columnVisibilityFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const DEFAULT_ROW_COUNT = 1_000
const DEFAULT_COLUMN_COUNT = 1_000
const STRESS_ROW_COUNT = 10_000
const STRESS_COLUMN_COUNT = 10_000

const columns = ref(makeColumns(DEFAULT_COLUMN_COUNT))
const data = ref<Array<Person>>(makeData(DEFAULT_ROW_COUNT, columns.value))

function refreshData() {
  const nextColumns = makeColumns(DEFAULT_COLUMN_COUNT)
  columns.value = nextColumns
  data.value = makeData(DEFAULT_ROW_COUNT, nextColumns)
}

function stressTestRows() {
  data.value = makeData(STRESS_ROW_COUNT, columns.value)
}

function stressTestColumns() {
  const nextColumns = makeColumns(STRESS_COLUMN_COUNT)
  columns.value = nextColumns
  data.value = makeData(data.value.length, nextColumns)
}

const table = useTable({
  features,
  get columns() {
    return columns.value
  },
  data,
  debugTable: true,
})

const visibleColumns = computed(() => table.getVisibleLeafColumns())
const rows = computed(() => table.getRowModel().rows)

const tableContainerRef = ref<HTMLDivElement | null>(null)

const columnVirtualizer = useVirtualizer(
  computed(() => ({
    count: visibleColumns.value.length,
    estimateSize: (index: number) =>
      visibleColumns.value[index]?.getSize() ?? 0,
    getScrollElement: () => tableContainerRef.value,
    horizontal: true,
    overscan: 3,
  })),
)

const rowVirtualizer = useVirtualizer(
  computed(() => ({
    count: rows.value.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.value,
    measureElement:
      typeof window !== 'undefined' && !navigator.userAgent.includes('Firefox')
        ? (element: Element) => element.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })),
)

const virtualColumns = computed(() => columnVirtualizer.value.getVirtualItems())
const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())

const virtualPaddingLeft = computed(() => {
  const items = virtualColumns.value
  return items.length > 0 ? (items[0]?.start ?? 0) : undefined
})

const virtualPaddingRight = computed(() => {
  const items = virtualColumns.value
  if (!items.length) {
    return undefined
  }

  return (
    columnVirtualizer.value.getTotalSize() - (items[items.length - 1]?.end ?? 0)
  )
})

function measureRowElement(element: Element | ComponentPublicInstance | null) {
  if (!element || !(element instanceof Element)) {
    return
  }

  rowVirtualizer.value.measureElement(element)
}
</script>

<template>
  <div class="app">
    <div>({{ columns.length.toLocaleString() }} columns)</div>
    <div>({{ data.length.toLocaleString() }} rows)</div>
    <div class="button-row">
      <button @click="refreshData">Regenerate Data</button>
      <button @click="stressTestRows">Stress Test (10k rows)</button>
      <button @click="stressTestColumns">Stress Test (10k columns)</button>
    </div>

    <div
      ref="tableContainerRef"
      class="container"
      :style="{
        overflow: 'auto',
        position: 'relative',
        height: '800px',
      }"
    >
      <table :style="{ display: 'grid' }">
        <thead
          :style="{
            display: 'grid',
            position: 'sticky',
            top: '0px',
            zIndex: 1,
          }"
        >
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            :style="{ display: 'flex', width: '100%' }"
          >
            <th
              v-if="virtualPaddingLeft"
              :style="{ display: 'flex', width: `${virtualPaddingLeft}px` }"
            />
            <th
              v-for="virtualColumn in virtualColumns"
              :key="`${headerGroup.id}-${virtualColumn.index}`"
              :style="{
                display: 'flex',
                width: `${headerGroup.headers[virtualColumn.index]?.getSize() ?? 0}px`,
              }"
            >
              <template v-if="headerGroup.headers[virtualColumn.index]">
                <div
                  v-if="!headerGroup.headers[virtualColumn.index].isPlaceholder"
                  :class="{
                    'sortable-header':
                      headerGroup.headers[
                        virtualColumn.index
                      ].column.getCanSort(),
                  }"
                  @click="
                    headerGroup.headers[
                      virtualColumn.index
                    ].column.getToggleSortingHandler()?.($event)
                  "
                >
                  <FlexRender
                    :header="headerGroup.headers[virtualColumn.index]"
                  />
                  <span
                    v-if="
                      headerGroup.headers[
                        virtualColumn.index
                      ].column.getIsSorted() === 'asc'
                    "
                  >
                    {' '}🔼
                  </span>
                  <span
                    v-else-if="
                      headerGroup.headers[
                        virtualColumn.index
                      ].column.getIsSorted() === 'desc'
                    "
                  >
                    {' '}🔽
                  </span>
                </div>
              </template>
            </th>
            <th
              v-if="virtualPaddingRight"
              :style="{ display: 'flex', width: `${virtualPaddingRight}px` }"
            />
          </tr>
        </thead>

        <tbody
          :style="{
            display: 'grid',
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }"
        >
          <tr
            v-for="virtualRow in virtualRows"
            :key="rows[virtualRow.index]?.id"
            :data-index="virtualRow.index"
            :ref="measureRowElement"
            :style="{
              display: 'flex',
              position: 'absolute',
              transform: `translateY(${virtualRow.start}px)`,
              width: '100%',
            }"
          >
            <td
              v-if="virtualPaddingLeft"
              :style="{ display: 'flex', width: `${virtualPaddingLeft}px` }"
            />
            <td
              v-for="virtualColumn in virtualColumns"
              :key="`${rows[virtualRow.index]?.id}-${virtualColumn.index}`"
              :style="{
                display: 'flex',
                width: `${rows[virtualRow.index]?.getVisibleCells()[virtualColumn.index]?.column.getSize() ?? 0}px`,
              }"
            >
              <FlexRender
                v-if="
                  rows[virtualRow.index]?.getVisibleCells()[virtualColumn.index]
                "
                :cell="
                  rows[virtualRow.index].getVisibleCells()[virtualColumn.index]
                "
              />
            </td>
            <td
              v-if="virtualPaddingRight"
              :style="{ display: 'flex', width: `${virtualPaddingRight}px` }"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
