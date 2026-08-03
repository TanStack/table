<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { faker } from '@faker-js/faker'
import { useTanStackTableDevtools } from '@tanstack/vue-table-devtools'
import { useHotkeys } from '@tanstack/vue-hotkeys'
import {
  FlexRender,
  cellSelectionFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { makeData } from './makeData'
import type { Cell } from '@tanstack/vue-table'
import type { Person } from './makeData'

const features = tableFeatures({
  cellSelectionFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()

// Serializing a selection for the clipboard is a userland concern: the table
// hands back `getSelectedCellRangesData()` as raw values, and the delimiter,
// the null representation, and the quoting rules are all yours to pick. This is
// the spreadsheet-flavored version.
function escapeTsvValue(value: unknown) {
  const text = value == null ? '' : String(value)
  const safeText =
    typeof value === 'string' && /^[\t\r ]*[=+@-]/.test(value)
      ? `'${text}`
      : text

  // spreadsheets expect a field to be quoted once it contains a delimiter, a
  // newline, or a quote, with inner quotes doubled
  return /["\t\n\r]/.test(safeText)
    ? `"${safeText.replace(/"/g, '""')}"`
    : safeText
}

function toTsv(ranges: Array<Array<Array<unknown>>>) {
  return ranges
    .map((grid) =>
      grid.map((row) => row.map(escapeTsvValue).join('\t')).join('\n'),
    )
    .join('\n\n') // blank line between final selected regions
}

function getCellClassName(cell: Cell<typeof features, Person>) {
  // Most cells in a large grid are unselected, so bail before asking for edges.
  // getSelectionEdges() would otherwise resolve the cell's position a second
  // time just to discover it is not selected.
  if (!cell.getIsSelected()) {
    return cell.getIsFocused()
      ? 'cell-selectable cell-focused'
      : 'cell-selectable'
  }

  const edges = cell.getSelectionEdges()

  return [
    'cell-selectable',
    'cell-selected',
    cell.getIsFocused() && 'cell-focused',
    edges.top && 'cell-edge-top',
    edges.right && 'cell-edge-right',
    edges.bottom && 'cell-edge-bottom',
    edges.left && 'cell-edge-left',
  ]
    .filter(Boolean)
    .join(' ')
}

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
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
    // enableCellSelection: false, // this column opts out of cell selection
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('city', {
    header: 'City',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('country', {
    header: 'Country',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('department', {
    header: 'Department',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('salary', {
    header: 'Salary',
    cell: (info) => info.getValue().toLocaleString(),
    footer: (props) => props.column.id,
  }),
])

const data = ref(makeData(20))
const refreshData = () => (data.value = makeData(20))
const stressTest = () => (data.value = makeData(1_000))

const table = useTable({
  key: 'cell-selection', // needed for devtools
  features,
  data,
  columns,
  getRowId: (row: Person) => row.id,
  enableCellSelection: true, // enable cell selection for all cells
  // initialState: { cellSelection: [] }, // select cells on first render
  // state: { cellSelection }, // classic controlled state; pair with onCellSelectionChange
  // onCellSelectionChange: setCellSelection,
  // enableCellRangeSelection: false, // disable Shift-click and drag ranges; default true
  // enableMultiCellRangeSelection: false, // allow only one rectangle at a time; default true
  // enableCellSelectionDrag: false, // disable drag-to-select; default true
  // isCellRangeSelectionEvent: event => Boolean(event.metaKey), // use Meta instead of Shift
  debugTable: true,
})

useTanStackTableDevtools(table)

const copySelection = () =>
  void navigator.clipboard.writeText(toTsv(table.getSelectedCellRangesData()))

const logRangesData = () =>
  console.info(
    'table.getSelectedCellRangesData()',
    table.getSelectedCellRangesData(),
  )

const randomizeColumns = () => {
  table.setColumnOrder(
    faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
  )
}

// optionally, reset the cellSelection state not only when data changes, but also
// when column order, pinning, visibility, or sorting changes
// customize this to your needs
watch(
  () => [
    table.atoms.columnOrder.get(),
    table.atoms.columnPinning.get(),
    table.atoms.columnVisibility.get(),
    table.atoms.sorting.get(),
  ],
  () => table.resetCellSelection(true),
)

const gridRef = useTemplateRef<HTMLDivElement>('grid')

// keyboard navigation is TanStack Hotkeys driving the table's imperative APIs;
// table-core ships no keydown handling of its own
useHotkeys(
  [
    { hotkey: 'ArrowUp', callback: () => table.moveCellSelection('up') },
    { hotkey: 'ArrowDown', callback: () => table.moveCellSelection('down') },
    { hotkey: 'ArrowLeft', callback: () => table.moveCellSelection('left') },
    { hotkey: 'ArrowRight', callback: () => table.moveCellSelection('right') },
    {
      hotkey: 'Shift+ArrowUp',
      callback: () => table.extendCellSelection('up'),
    },
    {
      hotkey: 'Shift+ArrowDown',
      callback: () => table.extendCellSelection('down'),
    },
    {
      hotkey: 'Shift+ArrowLeft',
      callback: () => table.extendCellSelection('left'),
    },
    {
      hotkey: 'Shift+ArrowRight',
      callback: () => table.extendCellSelection('right'),
    },
    { hotkey: 'Mod+A', callback: () => table.selectAllCells() },
    { hotkey: 'Escape', callback: () => table.resetCellSelection(true) },
    {
      hotkey: 'Mod+C',
      callback: () => {
        void navigator.clipboard.writeText(
          toTsv(table.getSelectedCellRangesData()),
        )
      },
    },
  ],
  { target: gridRef },
)
</script>

<template>
  <div class="demo-root">
    <div>
      <button class="demo-button demo-button-spaced" @click="refreshData">
        Regenerate Data
      </button>
      <button class="demo-button demo-button-spaced" @click="stressTest">
        Stress Test (1K rows)
      </button>
    </div>
    <div class="spacer-sm" />
    <p>
      Click and drag to select a range of cells. Hold Shift while clicking to
      extend the selection, or Ctrl/Cmd to add or subtract a rectangle. Arrow
      keys move the selection, Shift+Arrow extends it, Mod+A selects all, Mod+C
      copies, and Escape clears. Uncomment `enableCellSelection: false` on a
      column def to opt that column out of selection.
    </p>
    <p class="demo-note">
      Hiding, reordering, and pinning columns all keep a live selection anchored
      to the same cell ids. Ranges are indexed in render order, so a pinned
      column moves the rectangle with it rather than splitting it.
    </p>
    <div class="column-toggle-panel">
      <div class="column-toggle-panel-header">
        <label>
          <input
            type="checkbox"
            :checked="table.getIsAllColumnsVisible()"
            @change="table.getToggleAllColumnsVisibilityHandler()($event)"
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
            @change="column.getToggleVisibilityHandler()($event)"
          />
          {{ column.id }}
        </label>
      </div>
    </div>
    <div class="spacer-sm" />
    <div class="button-row">
      <button class="demo-button demo-button-spaced" @click="randomizeColumns">
        Shuffle Columns
      </button>
      <button
        class="demo-button demo-button-spaced"
        @click="
          table.setColumnOrder(
            [...table.getAllLeafColumns().map((column) => column.id)].reverse(),
          )
        "
      >
        Reverse Column Order
      </button>
      <button
        class="demo-button demo-button-spaced"
        @click="table.resetColumnOrder()"
      >
        Reset Column Order
      </button>
      <button
        class="demo-button demo-button-spaced"
        @click="table.resetColumnPinning()"
      >
        Reset Pinning
      </button>
      <button
        class="demo-button demo-button-spaced"
        @click="table.resetColumnVisibility()"
      >
        Reset Visibility
      </button>
    </div>
    <div class="spacer-sm" />
    <!--
      Vue tracks atom reads natively, so this count re-evaluates on its own.
      There is no equivalent of React's per-row Subscribe to reach for here.
    -->
    <div>
      {{ table.getSelectedCellCount().toLocaleString() }} cells selected across
      {{ table.getCellSelectionRowIds().length.toLocaleString() }} rows and
      {{ table.getCellSelectionColumnIds().length }} columns
    </div>
    <div class="spacer-sm" />
    <div ref="grid" tabindex="0">
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
                <button
                  type="button"
                  :disabled="!header.column.getCanSort()"
                  :class="
                    header.column.getCanSort()
                      ? 'header-button sortable-header'
                      : 'header-button'
                  "
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <FlexRender :header="header" />
                  {{
                    { asc: ' 🔼', desc: ' 🔽' }[
                      header.column.getIsSorted() as string
                    ] ?? ''
                  }}
                </button>
                <div v-if="header.column.getCanPin()" class="pin-actions">
                  <button
                    v-if="header.column.getIsPinned() !== 'start'"
                    class="pin-button"
                    @click="header.column.pin('start')"
                  >
                    {{ '<=' }}
                  </button>
                  <button
                    v-if="header.column.getIsPinned()"
                    class="pin-button"
                    @click="header.column.pin(false)"
                  >
                    X
                  </button>
                  <button
                    v-if="header.column.getIsPinned() !== 'end'"
                    class="pin-button"
                    @click="header.column.pin('end')"
                  >
                    {{ '=>' }}
                  </button>
                </div>
              </template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <template v-for="cell in row.getVisibleCells()" :key="cell.id">
              <td
                v-if="cell.getCanSelect()"
                :class="getCellClassName(cell)"
                :tabindex="cell.getTabIndex()"
                @mousedown="cell.getSelectionStartHandler()($event)"
                @mouseenter="cell.getSelectionExtendHandler()($event)"
              >
                <FlexRender :cell="cell" />
              </td>
              <td v-else>
                <FlexRender :cell="cell" />
              </td>
            </template>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td :colSpan="20">
              Rows ({{ table.getRowModel().rows.length.toLocaleString() }})
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="spacer-sm" />
    <div>
      <button class="demo-button demo-button-spaced" @click="copySelection">
        Copy Selection
      </button>
      <button
        class="demo-button demo-button-spaced"
        @click="table.selectAllCells()"
      >
        Select All Cells
      </button>
      <button
        class="demo-button demo-button-spaced"
        @click="table.resetCellSelection(true)"
      >
        Clear Selection
      </button>
    </div>
    <hr />
    <br />
    <div>
      <button class="demo-button demo-button-spaced" @click="logRangesData">
        Log table.getSelectedCellRangesData()
      </button>
    </div>
    <div>
      <label>State:</label>
      <pre>{{
        data.length < 1_001 ? JSON.stringify(table.store.get(), null, 2) : ''
      }}</pre>
    </div>
    <div>
      <label for="paste-target">Paste Test:</label>
      <!--
        scratch area for pasting a copied selection back in, to eyeball the
        tab-separated shape. It sits outside the grid ref, so the table hotkeys
        never intercept typing or Mod+V in here.
      -->
      <textarea
        id="paste-target"
        class="text-input"
        :rows="8"
        placeholder="Copy a selection, then paste here to check the tab-separated output..."
      />
    </div>
  </div>
</template>
