import * as React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  cellSelectionFeature,
  cellSpanningFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { makeData, makeSummaryData } from './makeData'
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

/**
 * Selection styling for the spanning table. A merged cell is always entirely
 * selected or entirely unselected: the selection bounds expand to enclose any
 * merge they touch, so the tint and the outline land on the rendered anchor.
 */
function getCellClassName(cell: {
  getRowSpan: () => number
  getIsSelected: () => boolean
  getIsFocused: () => boolean
  getSelectionEdges: () => {
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean
  }
}): string {
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
}

function App() {
  const [data, setData] = React.useState(() => makeData())
  const [summaryData] = React.useState(() => makeSummaryData())
  const [spanningEnabled, setSpanningEnabled] = React.useState(true)
  const refreshData = () => setData(makeData())

  const table = useTable(
    {
      debugTable: true,
      features,
      columns,
      data,
      enableCellSpanning: spanningEnabled,
      initialState: {
        pagination: { pageIndex: 0, pageSize: 12 },
      },
    },
    (state) => state, // default selector
  )

  const summaryTable = useTable(
    {
      debugTable: true,
      features: summaryFeatures,
      columns: summaryColumns,
      data: summaryData,
    },
    (state) => state, // default selector
  )

  const visibleLeafCount = table.getVisibleLeafColumns().length

  const renderHead = () => (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id} colSpan={header.colSpan}>
              <button
                type="button"
                className="sortable-header header-sort-button"
                onClick={header.column.getToggleSortingHandler()}
              >
                <table.FlexRender header={header} />
                {{ asc: ' 🔼', desc: ' 🔽' }[
                  header.column.getIsSorted() as string
                ] ?? null}
              </button>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )

  return (
    <div className="demo-root">
      <div className="controls">
        <button onClick={() => refreshData()} className="demo-button">
          Regenerate Data
        </button>
        <label>
          <input
            type="checkbox"
            checked={spanningEnabled}
            onChange={(event) => setSpanningEnabled(event.target.checked)}
          />{' '}
          Row spanning
        </label>
        {['team', 'shift'].map((columnId) => {
          const column = table.getColumn(columnId)!
          return (
            <label key={columnId}>
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />{' '}
              {String(column.columnDef.header)}
            </label>
          )
        })}
        <select
          data-testid="status-filter"
          value={
            (table.getColumn('status')!.getFilterValue() as
              string | undefined) ?? ''
          }
          onChange={(event) =>
            table
              .getColumn('status')!
              .setFilterValue(event.target.value || undefined)
          }
        >
          <option value="">All statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          data-testid="employee-filter"
          className="filter-input"
          placeholder="Filter employees..."
          value={
            (table.getColumn('employee')!.getFilterValue() as
              string | undefined) ?? ''
          }
          onChange={(event) =>
            table
              .getColumn('employee')!
              .setFilterValue(event.target.value || undefined)
          }
        />
      </div>
      <div className="spacer-sm" />
      <div className="controls">
        <button
          className="demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="demo-button-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <span>
          Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <select
          data-testid="page-size"
          value={table.state.pagination.pageSize}
          onChange={(event) => table.setPageSize(Number(event.target.value))}
        >
          {[10, 12, 36].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <span>
          Visible columns:{' '}
          <span data-testid="visible-leaf-count">{visibleLeafCount}</span>
        </span>
        <span>
          Selected cells:{' '}
          <span data-testid="selected-count">
            {table.getSelectedCellCount()}
          </span>
        </span>
      </div>
      <div className="spacer-md" />
      {/* The panels wrap into a grid whenever the viewport is wide enough. */}
      <div className="example-grid">
        <section className="example-panel">
          <h2 className="section-title">Row Spanning</h2>
          <table data-testid="span-table">
            {renderHead()}
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const rowSpan = cell.getRowSpan()
                    const colSpan = cell.getColSpan()

                    // A span of 0 means this cell is covered by a cell above
                    // or to its left. Skip it. Do NOT render `rowSpan={0}`:
                    // in HTML that means "span to the end of the row group",
                    // so forgetting this check merges the cell down the whole
                    // tbody instead of rendering nothing.
                    if (rowSpan === 0 || colSpan === 0) return null

                    return (
                      <td
                        key={cell.id}
                        rowSpan={rowSpan}
                        colSpan={colSpan}
                        className={getCellClassName(cell)}
                        onMouseDown={cell.getSelectionStartHandler()}
                        onMouseEnter={cell.getSelectionExtendHandler()}
                      >
                        <table.FlexRender cell={cell} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="example-panel">
          <h2 className="section-title">Reference (no spanning)</h2>
          {/* The same table instance rendered flat. Under every sort, filter,
              and page combination the merged panel must describe exactly this
              grid. */}
          <table data-testid="reference-table">
            {renderHead()}
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="example-panel">
          <h2 className="section-title">Summary Rows (colSpan)</h2>
          <table data-testid="summary-table">
            <thead>
              {summaryTable.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      <summaryTable.FlexRender header={header} />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {summaryTable.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={
                    row.original.kind === 'subtotal'
                      ? 'subtotal-row'
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const rowSpan = cell.getRowSpan()
                    const colSpan = cell.getColSpan()

                    if (rowSpan === 0 || colSpan === 0) return null

                    return (
                      <td key={cell.id} rowSpan={rowSpan} colSpan={colSpan}>
                        <summaryTable.FlexRender cell={cell} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <div className="spacer-md" />
      <pre data-testid="table-state">
        {JSON.stringify(table.state, null, 2)}
      </pre>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
