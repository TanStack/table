import Alpine from 'alpinejs'
import {
  FlexRender,
  cellSelectionFeature,
  cellSpanningFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData, makeSummaryData } from './makeData'
import './index.css'
import type { Cell, Header } from '@tanstack/alpine-table'
import type { Shift, SummaryRow } from './makeData'

const features = tableFeatures({
  cellSelectionFeature,
  cellSpanningFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
})

const columnHelper = createColumnHelper<typeof features, Shift>()

const columns = columnHelper.columns([
  columnHelper.accessor('region', {
    header: 'Region',
    sortFn: 'alphanumeric',
    // Adjacent rows that share a region merge into one vertically spanning
    // cell. Spans always derive from the rows that are actually rendered, so
    // sorting, filtering, and paging just change which rows are adjacent.
    spanRows: true,
  }),
  columnHelper.accessor('team', {
    header: 'Team',
    sortFn: 'alphanumeric',
    spanRows: true,
  }),
  columnHelper.accessor('shift', {
    header: 'Shift',
    sortFn: 'alphanumeric',
    // The predicate form: shifts only merge while the table is sorted by the
    // shift column, so the predicate itself is visibly reactive.
    spanRows: ({ column, value, anchorValue }) =>
      column.getIsSorted() !== false && value === anchorValue,
  }),
  columnHelper.accessor('employee', {
    header: 'Employee',
    sortFn: 'alphanumeric',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('hours', {
    header: 'Hours',
    sortFn: 'basic',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    sortFn: 'alphanumeric',
    filterFn: 'includesString',
  }),
])

const summaryFeatures = tableFeatures({
  cellSpanningFeature,
  columnVisibilityFeature,
})

const summaryColumnHelper = createColumnHelper<
  typeof summaryFeatures,
  SummaryRow
>()

const summaryColumns = summaryColumnHelper.columns([
  summaryColumnHelper.accessor('label', {
    header: 'Shift',
    // Subtotal rows render one label cell covering every column but the
    // total. `Infinity` clamps to the rest of the cell's pinned region.
    spanColumns: ({ row }) => (row.original.kind === 'subtotal' ? Infinity : 1),
  }),
  summaryColumnHelper.accessor('region', {
    header: 'Region',
  }),
  summaryColumnHelper.accessor('hours', {
    header: 'Hours',
  }),
])

/** The structural slice a cell needs to expose for the span-skip filter. */
type SpannableCell = {
  id: string
  getRowSpan: () => number
  getColSpan: () => number
}

Alpine.data('table', () => {
  const local = Alpine.reactive({
    data: makeData(),
    summaryData: makeSummaryData(),
    spanningEnabled: true,
  })

  const table = createTable(
    {
      debugTable: true,
      features,
      columns,
      get data() {
        return local.data
      },
      // Option getters are the Alpine idiom for reactive options: the memoized
      // span index lists `enableCellSpanning` in its deps, so flipping the
      // reactive flag both invalidates the index and re-evaluates the bindings
      // that read it.
      get enableCellSpanning() {
        return local.spanningEnabled
      },
      initialState: {
        pagination: { pageIndex: 0, pageSize: 12 },
      },
    },
    (state) => state, // default selector
  )

  const summaryTable = createTable(
    {
      debugTable: true,
      features: summaryFeatures,
      columns: summaryColumns,
      get data() {
        return local.summaryData
      },
    },
    (state) => state, // default selector
  )

  return {
    table,
    summaryTable,
    FlexRender,

    refreshData() {
      local.data = makeData()
    },

    get spanningEnabled() {
      return local.spanningEnabled
    },
    setSpanningEnabled(enabled: boolean) {
      local.spanningEnabled = enabled
    },

    /**
     * A span of 0 means this cell is covered by a cell above or to its left.
     * Skip it. Do NOT render `rowspan="0"`: in HTML that means "span to the
     * end of the row group", so forgetting this check merges the cell down the
     * whole tbody instead of rendering nothing. Alpine templates cannot skip
     * an `x-for` item inline, so the filter lives here.
     */
    spanCells(row: { getVisibleCells: () => Array<SpannableCell> }) {
      return row
        .getVisibleCells()
        .filter((cell) => cell.getRowSpan() !== 0 && cell.getColSpan() !== 0)
    },

    /**
     * Selection styling for the spanning table. A merged cell is always
     * entirely selected or entirely unselected: the selection bounds expand to
     * enclose any merge they touch, so the tint and the outline land on the
     * rendered anchor.
     */
    cellClass(cell: Cell<typeof features, Shift>) {
      const base =
        cell.getRowSpan() > 1 ? 'cell-selectable span-cell' : 'cell-selectable'

      if (!cell.getIsSelected()) {
        return cell.getIsFocused() ? `${base} cell-focused` : base
      }

      const edges = cell.getSelectionEdges()

      return [
        base,
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

    // Alpine cannot call chained methods cleanly from directives, so the
    // per-cell handlers are exposed here.
    onCellMouseDown(cell: Cell<typeof features, Shift>, event: MouseEvent) {
      cell.getSelectionStartHandler()(event)
    },
    onCellMouseEnter(cell: Cell<typeof features, Shift>, event: MouseEvent) {
      cell.getSelectionExtendHandler()(event)
    },

    sortIndicator(header: Header<typeof features, Shift, unknown>) {
      const sorted = header.column.getIsSorted()
      return sorted === 'asc' ? ' 🔼' : sorted === 'desc' ? ' 🔽' : ''
    },

    columnLabel(columnId: string) {
      return String(table.getColumn(columnId)!.columnDef.header)
    },

    statusFilterValue() {
      return (
        (table.getColumn('status')!.getFilterValue() as string | undefined) ??
        ''
      )
    },
    setStatusFilter(value: string) {
      table.getColumn('status')!.setFilterValue(value || undefined)
    },

    employeeFilterValue() {
      return (
        (table.getColumn('employee')!.getFilterValue() as string | undefined) ??
        ''
      )
    },
    setEmployeeFilter(value: string) {
      table.getColumn('employee')!.setFilterValue(value || undefined)
    },

    pageLabel() {
      const { pageIndex } = table.store.get().pagination
      return `Page ${pageIndex + 1} of ${table.getPageCount()}`
    },
    pageSize() {
      return table.store.get().pagination.pageSize
    },

    stringifiedState() {
      return JSON.stringify(table.store.get(), null, 2)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
