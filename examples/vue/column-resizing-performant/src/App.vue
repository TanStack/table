<script setup lang="ts">
import { h, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import {
  FlexRender,
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { makeData } from './makeData'
import type { FunctionalComponent } from 'vue'
import type { Header } from '@tanstack/vue-table'
import type { Person } from './makeData'

/**
 * This example implements column resizing with NO root re-renders!
 * Vue tracks atom reads per component render effect, so resize-state reads
 * are kept out of the root template and isolated in tiny islands, while the
 * column widths are written imperatively as CSS variables
 */

const features = tableFeatures({ columnResizingFeature, columnSizingFeature })

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
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
])

const data = ref(makeData(200))
const refreshData = () => {
  data.value = makeData(200)
}
const stressTest = () => {
  data.value = makeData(5_000)
}

const table = useTable({
  features,
  columns,
  data,
  defaultColumn: {
    minSize: 60,
    maxSize: 800,
  },
  columnResizeMode: 'onChange',
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
})

const tableEl = useTemplateRef<HTMLTableElement>('tableEl')

/**
 * Instead of re-rendering Vue on every resize tick, we subscribe to the
 * table store OUTSIDE of Vue and write the column size CSS variables
 * directly onto the <table> element. Header and data cells reference the
 * variables, so the browser updates widths with zero Vue work per tick.
 * (The core resize handler already coalesces pointer events to one state
 * update per animation frame.)
 */
onMounted(() => {
  const writeColumnSizeVars = () => {
    const el = tableEl.value
    if (!el) return
    for (const header of table.getFlatHeaders()) {
      el.style.setProperty(
        `--header-${header.id}-size`,
        String(header.getSize()),
      )
      el.style.setProperty(
        `--col-${header.column.id}-size`,
        String(header.column.getSize()),
      )
    }
    el.style.width = `${table.getTotalSize()}px`
  }
  writeColumnSizeVars() // initial paint
  const { unsubscribe } =
    table.atoms.columnSizing.subscribe(writeColumnSizeVars)
  onUnmounted(unsubscribe)
})

/**
 * Functional components have their own render effects, so only these little
 * islands re-render when resize state changes, never the root template.
 */
const StateDump: FunctionalComponent = () =>
  h(
    'pre',
    { style: { height: '10rem', overflow: 'auto' } },
    JSON.stringify(table.store.get(), null, 2),
  )

// Each resizer island tracks only its own column's resizing state
const Resizer: FunctionalComponent<{
  header: Header<typeof features, Person, unknown>
}> = ({ header }) =>
  h('div', {
    class: ['resizer', { isResizing: header.column.getIsResizing() }],
    onDblclick: () => header.column.resetSize(),
    onMousedown: header.getResizeHandler(),
    onTouchstart: header.getResizeHandler(),
  })
</script>

<template>
  <div class="demo-root">
    <div class="button-row">
      <button class="demo-button" @click="refreshData">Regenerate Data</button>
      <button class="demo-button" @click="stressTest">
        Stress Test (5k rows)
      </button>
    </div>
    <div class="spacer-md" />
    <!-- Only this little island re-renders per resize tick -->
    <StateDump />
    <div class="spacer-md" />
    ({{ data.length.toLocaleString() }} rows)
    <div class="scroll-container">
      <!-- This example is using semantic table tags, but also CSS Grid/Flexbox layout for more absolute column widths -->
      <table ref="tableEl" style="display: grid">
        <thead style="display: grid">
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            style="display: flex; width: 100%; height: 30px"
          >
            <!-- use CSS variables for widths so cells never re-render -->
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colspan="header.colSpan"
              :style="{
                display: 'flex',
                flexShrink: 0,
                width: `calc(var(--header-${header.id}-size) * 1px)`,
              }"
            >
              <FlexRender v-if="!header.isPlaceholder" :header="header" />
              <Resizer :header="header" />
            </th>
          </tr>
        </thead>
        <!-- No memoization needed: the root template reads no resize state,
             so the body only re-renders when the data itself changes -->
        <tbody style="display: grid">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            style="
              display: flex;
              width: 100%;
              height: 30px;
              content-visibility: auto;
              contain-intrinsic-height: auto 30px;
            "
          >
            <td
              v-for="cell in row.getAllCells()"
              :key="cell.id"
              :style="{
                display: 'flex',
                flexShrink: 0,
                width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
              }"
            >
              {{ cell.renderValue() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
