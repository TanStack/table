import Alpine from 'alpinejs'
import { faker } from '@faker-js/faker'
import { createMultiHotkeyHandler } from '@tanstack/hotkeys'
import {
  FlexRender,
  cellSelectionFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  createSortedRowModel,
  createTable,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { Cell, ColumnDef, Header } from '@tanstack/alpine-table'
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

const columns: Array<ColumnDef<typeof features, Person>> = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorFn: (row) => row.lastName, id: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'visits', header: 'Visits' },
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    // enableCellSelection: false, // this column opts out of cell selection
  },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'country', header: 'Country' },
  { accessorKey: 'department', header: 'Department' },
  {
    accessorKey: 'salary',
    header: 'Salary',
    cell: (info) => (info.getValue() as number).toLocaleString(),
  },
]

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

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(20) })

  const table = createTable(
    {
      features,
      columns,
      get data() {
        return local.data
      },
      getRowId: (row: Person) => row.id,
      enableCellSelection: true, // enable cell selection for all cells
      // initialState: { cellSelection: [] }, // select cells on first render
      // atoms: { cellSelection: cellSelectionAtom }, // own selection state with an external atom
      // state: { cellSelection }, // classic controlled state; pair with onCellSelectionChange
      // onCellSelectionChange: setCellSelection,
      // enableCellRangeSelection: false, // disable Shift-click and drag ranges; default true
      // enableMultiCellRangeSelection: false, // allow only one rectangle at a time; default true
      // enableCellSelectionDrag: false, // disable drag-to-select; default true
      // isCellRangeSelectionEvent: event => Boolean(event.metaKey), // use Meta instead of Shift
      debugTable: true,
    },
    // Alpine re-renders from a version counter, and the selector decides which
    // slices bump it. cellSelection has to be here or the highlight never moves.
    (state) => ({
      cellSelection: state.cellSelection,
      sorting: state.sorting,
      columnOrder: state.columnOrder,
      columnPinning: state.columnPinning,
      columnVisibility: state.columnVisibility,
    }),
  )

  // optionally, reset the cellSelection state not only when data changes, but
  // also when column order, pinning, visibility, or sorting changes
  // customize this to your needs
  let isFirstColumnLayout = true
  let lastLayoutKey = ''

  const resetOnLayoutChange = () => {
    const layoutKey = JSON.stringify([
      table.atoms.columnOrder.get(),
      table.atoms.columnPinning.get(),
      table.atoms.columnVisibility.get(),
      table.atoms.sorting.get(),
    ])

    if (isFirstColumnLayout) {
      isFirstColumnLayout = false
      lastLayoutKey = layoutKey
      return
    }

    if (layoutKey !== lastLayoutKey) {
      lastLayoutKey = layoutKey
      queueMicrotask(() => table.resetCellSelection(true))
    }
  }

  const copySelection = () =>
    void navigator.clipboard.writeText(toTsv(table.getSelectedCellRangesData()))

  return {
    table,
    FlexRender,

    refreshData() {
      local.data = makeData(20)
    },
    stressTest() {
      local.data = makeData(1_000)
    },

    // Alpine cannot call chained methods cleanly from directives, so the
    // per-cell reads and handlers are exposed here.
    cellClass(cell: Cell<typeof features, Person>) {
      // Most cells in a large grid are unselected, so bail before asking for
      // edges. getSelectionEdges() would otherwise resolve the cell's position
      // a second time just to discover it is not selected.
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
    },
    onCellMouseDown(cell: Cell<typeof features, Person>, event: MouseEvent) {
      cell.getSelectionStartHandler()(event)
    },
    onCellMouseEnter(cell: Cell<typeof features, Person>, event: MouseEvent) {
      cell.getSelectionExtendHandler()(event)
    },
    sortIndicator(header: Header<typeof features, Person, unknown>) {
      const sorted = header.column.getIsSorted()
      return sorted === 'asc' ? ' 🔼' : sorted === 'desc' ? ' 🔽' : ''
    },

    selectionSummary() {
      resetOnLayoutChange()
      return `${table.getSelectedCellCount().toLocaleString()} cells selected across ${table
        .getCellSelectionRowIds()
        .length.toLocaleString()} rows and ${
        table.getCellSelectionColumnIds().length
      } columns`
    },

    shuffleColumns() {
      table.setColumnOrder(
        faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
      )
    },
    reverseColumns() {
      table.setColumnOrder(
        [...table.getAllLeafColumns().map((column) => column.id)].reverse(),
      )
    },

    copySelection,

    logRangesData() {
      console.info(
        'table.getSelectedCellRangesData()',
        table.getSelectedCellRangesData(),
      )
    },

    stringifiedState() {
      return local.data.length < 1_001
        ? JSON.stringify(table.store.get(), null, 2)
        : ''
    },

    // keyboard navigation is TanStack Hotkeys driving the table's imperative
    // APIs; table-core ships no keydown handling of its own. Alpine has no
    // hotkeys adapter, so the framework-agnostic core handler is used directly.
    onGridKeyDown: createMultiHotkeyHandler({
      ArrowUp: () => table.moveCellSelection('up'),
      ArrowDown: () => table.moveCellSelection('down'),
      ArrowLeft: () => table.moveCellSelection('left'),
      ArrowRight: () => table.moveCellSelection('right'),
      'Shift+ArrowUp': () => table.extendCellSelection('up'),
      'Shift+ArrowDown': () => table.extendCellSelection('down'),
      'Shift+ArrowLeft': () => table.extendCellSelection('left'),
      'Shift+ArrowRight': () => table.extendCellSelection('right'),
      'Mod+A': () => table.selectAllCells(),
      Escape: () => table.resetCellSelection(true),
      'Mod+C': () => copySelection(),
    }),
  }
})

window.Alpine = Alpine
Alpine.start()
