import { For, Show, createSignal } from 'solid-js'
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
} from '@tanstack/solid-table'
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
  const [data, setData] = createSignal(makeData())
  const [summaryData] = createSignal(makeSummaryData())
  const [spanningEnabled, setSpanningEnabled] = createSignal(true)
  const refreshData = () => setData(makeData())

  const table = createTable({
    debugTable: true,
    features,
    columns,
    get data() {
      return data()
    },
    get enableCellSpanning() {
      return spanningEnabled()
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 12 },
    },
  })

  const summaryTable = createTable({
    debugTable: true,
    features: summaryFeatures,
    columns: summaryColumns,
    get data() {
      return summaryData()
    },
  })

  const renderHead = () => (
    <thead>
      <For each={table.getHeaderGroups()}>
        {(headerGroup) => (
          <tr>
            <For each={headerGroup.headers}>
              {(header) => (
                <th colSpan={header.colSpan}>
                  <button
                    type="button"
                    class="sortable-header header-sort-button"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <FlexRender header={header} />
                    {{ asc: ' 🔼', desc: ' 🔽' }[
                      header.column.getIsSorted() as string
                    ] ?? null}
                  </button>
                </th>
              )}
            </For>
          </tr>
        )}
      </For>
    </thead>
  )

  return (
    <div class="demo-root">
      <div class="controls">
        <button onClick={() => refreshData()} class="demo-button">
          Regenerate Data
        </button>
        <label>
          <input
            type="checkbox"
            checked={spanningEnabled()}
            onChange={(event) =>
              setSpanningEnabled(event.currentTarget.checked)
            }
          />{' '}
          Row spanning
        </label>
        <For each={['team', 'shift']}>
          {(columnId) => (
            <label>
              <input
                type="checkbox"
                checked={table.getColumn(columnId)!.getIsVisible()}
                onChange={table
                  .getColumn(columnId)!
                  .getToggleVisibilityHandler()}
              />{' '}
              {String(table.getColumn(columnId)!.columnDef.header)}
            </label>
          )}
        </For>
        <select
          data-testid="status-filter"
          value={
            (table.getColumn('status')!.getFilterValue() as
              string | undefined) ?? ''
          }
          onChange={(event) =>
            table
              .getColumn('status')!
              .setFilterValue(event.currentTarget.value || undefined)
          }
        >
          <option value="">All statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          data-testid="employee-filter"
          class="filter-input"
          placeholder="Filter employees..."
          value={
            (table.getColumn('employee')!.getFilterValue() as
              string | undefined) ?? ''
          }
          onInput={(event) =>
            table
              .getColumn('employee')!
              .setFilterValue(event.currentTarget.value || undefined)
          }
        />
      </div>
      <div class="spacer-sm" />
      <div class="controls">
        <button
          class="demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          class="demo-button-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <span>
          Page {table.store.get().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <select
          data-testid="page-size"
          value={table.store.get().pagination.pageSize}
          onChange={(event) =>
            table.setPageSize(Number(event.currentTarget.value))
          }
        >
          <For each={[10, 12, 36]}>
            {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
          </For>
        </select>
        <span>
          Visible columns:{' '}
          <span data-testid="visible-leaf-count">
            {table.getVisibleLeafColumns().length}
          </span>
        </span>
        <span>
          Selected cells:{' '}
          <span data-testid="selected-count">
            {table.getSelectedCellCount()}
          </span>
        </span>
      </div>
      <div class="spacer-md" />
      {/* The panels wrap into a grid whenever the viewport is wide enough. */}
      <div class="example-grid">
        <section class="example-panel">
          <h2 class="section-title">Row Spanning</h2>
          <table data-testid="span-table">
            {renderHead()}
            <tbody>
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <tr>
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        // A span of 0 means this cell is covered by a cell
                        // above or to its left. Skip it. Do NOT render
                        // `rowspan="0"`: in HTML that means "span to the end
                        // of the row group", so forgetting this check merges
                        // the cell down the whole tbody instead of rendering
                        // nothing.
                        <Show
                          when={
                            cell.getRowSpan() !== 0 && cell.getColSpan() !== 0
                          }
                        >
                          <td
                            rowSpan={cell.getRowSpan()}
                            colSpan={cell.getColSpan()}
                            class={getCellClassName(cell)}
                            onMouseDown={cell.getSelectionStartHandler()}
                            onMouseEnter={cell.getSelectionExtendHandler()}
                          >
                            <FlexRender cell={cell} />
                          </td>
                        </Show>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </section>

        <section class="example-panel">
          <h2 class="section-title">Reference (no spanning)</h2>
          {/* The same table instance rendered flat. Under every sort, filter,
              and page combination the merged panel must describe exactly this
              grid. */}
          <table data-testid="reference-table">
            {renderHead()}
            <tbody>
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <tr>
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        <td>
                          <FlexRender cell={cell} />
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </section>

        <section class="example-panel">
          <h2 class="section-title">Summary Rows (colSpan)</h2>
          <table data-testid="summary-table">
            <thead>
              <For each={summaryTable.getHeaderGroups()}>
                {(headerGroup) => (
                  <tr>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <th colSpan={header.colSpan}>
                          <FlexRender header={header} />
                        </th>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </thead>
            <tbody>
              <For each={summaryTable.getRowModel().rows}>
                {(row) => (
                  <tr
                    class={
                      row.original.kind === 'subtotal'
                        ? 'subtotal-row'
                        : undefined
                    }
                  >
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        <Show
                          when={
                            cell.getRowSpan() !== 0 && cell.getColSpan() !== 0
                          }
                        >
                          <td
                            rowSpan={cell.getRowSpan()}
                            colSpan={cell.getColSpan()}
                          >
                            <FlexRender cell={cell} />
                          </td>
                        </Show>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </section>
      </div>
      <div class="spacer-md" />
      <pre data-testid="table-state">
        {JSON.stringify(table.store.get(), null, 2)}
      </pre>
    </div>
  )
}

export default App
