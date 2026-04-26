/**
 * Table-level components that use useTableContext
 *
 * These components can be used via the pre-bound tableComponents
 * directly on the table object, e.g., <table.PaginationControls />
 */
import { For, createMemo } from 'solid-js'
import { useTableContext } from '../hooks/table'

/**
 * Pagination controls for the table
 */
export function PaginationControls() {
  const table = useTableContext()

  const pagination = createMemo(() => table.store.state.pagination)

  return (
    <div class="pagination">
      <button
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </button>
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <button
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </button>
      <span>
        Page{' '}
        <strong>
          {(pagination().pageIndex + 1).toLocaleString()} of{' '}
          {table.getPageCount().toLocaleString()}
        </strong>
      </span>
      <span>
        | Go to page:
        <input
          type="number"
          min="1"
          max={table.getPageCount()}
          value={pagination().pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            table.setPageIndex(page)
          }}
        />
      </span>
      <select
        value={pagination().pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value))
        }}
      >
        <For each={[10, 20, 30, 40, 50]}>
          {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
        </For>
      </select>
    </div>
  )
}

/**
 * Row count display
 */
export function RowCount() {
  const table = useTableContext()

  return (
    <div class="row-count">
      Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
      {table.getRowCount().toLocaleString()} rows
    </div>
  )
}

/**
 * Table toolbar with title and actions
 */
export function TableToolbar({
  title,
  onRefresh,
}: {
  title: string
  onRefresh?: () => void
}) {
  const table = useTableContext()

  return (
    <div class="table-toolbar">
      <h2>{title}</h2>
      <div>
        <button onClick={() => table.resetColumnFilters()}>
          Clear Filters
        </button>
        <button onClick={() => table.resetSorting()}>Clear Sorting</button>
        {onRefresh && <button onClick={onRefresh}>Regenerate Data</button>}
      </div>
    </div>
  )
}
