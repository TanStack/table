<script setup lang="ts">
import {
  FlexRender,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { ref } from 'vue'
import { faker } from '@faker-js/faker'
import { makeData } from './makeData'
import type { CSSProperties } from 'vue'
import type { Column } from '@tanstack/vue-table'
import type { Person } from './makeData'

const features = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const data = ref(makeData(20))

const columns = ref(
  columnHelper.columns([
    columnHelper.accessor('firstName', {
      id: 'firstName',
      header: 'First Name',
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
    columnHelper.accessor('age', {
      id: 'age',
      header: 'Age',
      footer: (props) => props.column.id,
      size: 180,
    }),
    columnHelper.accessor('visits', {
      id: 'visits',
      header: 'Visits',
      footer: (props) => props.column.id,
      size: 180,
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: 'Status',
      footer: (props) => props.column.id,
      size: 180,
    }),
    columnHelper.accessor('progress', {
      id: 'progress',
      header: 'Profile Progress',
      footer: (props) => props.column.id,
      size: 180,
    }),
  ]),
)

const table = useTable({
  features,
  data,
  get columns() {
    return columns.value
  },
  columnResizeMode: 'onChange',
  // initialState: { columnPinning: { start: ['firstName'], end: [] } }, // `start`/`end` follow layout direction
  // atoms: { columnPinning: columnPinningAtom }, // preferred: own pinning state with an external atom
  // state: { columnPinning }, // classic controlled state; pair with onColumnPinningChange
  // onColumnPinningChange: setColumnPinning,
  // enableColumnPinning: false, // disable pinning for every column; default true
  debugColumnVisibilityFeature: true,
  debugColumnPinningFeature: true,
  debugColumnSizingFeature: true,
})

const refreshData = () => {
  data.value = makeData(20)
}

const stressTest = () => {
  data.value = makeData(1_000)
}

const randomizeColumns = () => {
  table.setColumnOrder(
    faker.helpers.shuffle(
      table
        .getAllLeafColumns()
        .map((column: Column<typeof features, Person>) => column.id),
    ),
  )
}

function toggleColumnVisibility(column: Column<typeof features, Person>) {
  table.setColumnVisibility({
    ...table.atoms.columnVisibility.get(),
    [column.id]: !column.getIsVisible(),
  })
}

function toggleAllColumnsVisibility() {
  table
    .getAllLeafColumns()
    .forEach((column: Column<typeof features, Person>) => {
      toggleColumnVisibility(column)
    })
}

// These are the important styles to make sticky column pinning work!
// Apply styles like this using your CSS strategy of choice with this kind of
// logic to head cells, data cells, footer cells, etc.
// View the index.css file for more needed styles such as border-collapse: collapse
const getCommonPinningStyles = (
  column: Column<typeof features, Person>,
): CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'start' && column.getIsLastColumn('start')
  const isFirstRightPinnedColumn =
    isPinned === 'end' && column.getIsFirstColumn('end')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    insetInlineStart:
      isPinned === 'start' ? `${column.getStart('start')}px` : undefined,
    insetInlineEnd:
      isPinned === 'end' ? `${column.getAfter('end')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    width: `${column.getSize()}px`,
    zIndex: isPinned ? 1 : 0,
  }
}
</script>

<template>
  <div class="demo-root">
    <div class="column-toggle-panel">
      <div class="column-toggle-panel-header">
        <label>
          <input
            type="checkbox"
            :checked="table.getIsAllColumnsVisible()"
            @input="toggleAllColumnsVisibility"
          />
          Toggle All
        </label>
      </div>
      <div
        v-for="column in table.getAllLeafColumns()"
        :key="column.id"
        class="column-toggle-row"
      >
        <label>
          <input
            type="checkbox"
            :checked="column.getIsVisible()"
            @input="toggleColumnVisibility(column)"
          />
          {{ column.id }}
        </label>
      </div>
    </div>
    <div class="spacer-md" />
    <div class="button-row">
      <button @click="refreshData" class="demo-button demo-button-sm">
        Regenerate Data
      </button>
      <button @click="stressTest" class="demo-button demo-button-sm">
        Stress Test (1k rows)
      </button>
      <button @click="randomizeColumns" class="demo-button demo-button-sm">
        Shuffle Columns
      </button>
    </div>
    <div class="spacer-md" />
    <div class="table-container">
      <table :style="{ width: `${table.getTotalSize()}px` }">
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
              :style="getCommonPinningStyles(header.column)"
            >
              <div class="nowrap">
                <template v-if="!header.isPlaceholder">
                  <FlexRender :header="header" />
                </template>
                {{
                  header.column.getIndex(
                    header.column.getIsPinned() || 'center',
                  )
                }}
              </div>
              <div
                v-if="!header.isPlaceholder && header.column.getCanPin()"
                class="pin-actions"
              >
                <button
                  v-if="header.column.getIsPinned() !== 'start'"
                  @click="header.column.pin('start')"
                  class="pin-button"
                >
                  {{ '<=' }}
                </button>
                <button
                  v-if="header.column.getIsPinned()"
                  @click="header.column.pin(false)"
                  class="pin-button"
                >
                  X
                </button>
                <button
                  v-if="header.column.getIsPinned() !== 'end'"
                  @click="header.column.pin('end')"
                  class="pin-button"
                >
                  {{ '=>' }}
                </button>
              </div>
              <div
                @dblclick="header.column.resetSize()"
                @mousedown="header.getResizeHandler()($event)"
                @touchstart="header.getResizeHandler()($event)"
                :class="`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :style="getCommonPinningStyles(cell.column)"
            >
              <FlexRender :cell="cell" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pre data-testid="table-state">{{
      JSON.stringify(table.store.get(), null, 2)
    }}</pre>
  </div>
</template>
