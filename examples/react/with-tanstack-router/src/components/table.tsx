import {
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useEffect } from 'react'
import { DebouncedInput } from './debouncedInput'
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
  TableOptions_RowPagination,
} from '@tanstack/react-table'
import type { Filters } from '../api/types'

export const _features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
})

export const DEFAULT_PAGE_INDEX = 0
export const DEFAULT_PAGE_SIZE = 10

type Props<TData extends Record<string, string | number>> = {
  data: Array<TData>
  columns: Array<ColumnDef<typeof _features, TData>>
  pagination: PaginationState
  paginationOptions: Pick<
    TableOptions_RowPagination,
    'onPaginationChange' | 'rowCount'
  >
  filters: Filters<TData>
  onFilterChange: (dataFilters: Partial<TData>) => void
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
}

export default function Table<T extends Record<string, string | number>>({
  columns,
  data,
  filters,
  onFilterChange,
  onSortingChange,
  pagination,
  paginationOptions,
  sorting,
}: Props<T>) {
  const table = useTable(
    {
      debugTable: true,
      _features,
      _rowModels: {}, // no client-side row models since we're doing server-side sorting, filtering, and pagination
      columns,
      data,
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      onSortingChange,
      ...paginationOptions,
    },
    (state) => state,
  )

  // Sync controlled state with per-slice base atoms
  useEffect(() => {
    table.baseAtoms.pagination.set(pagination)
    table.baseAtoms.sorting.set(sorting)
  }, [table, pagination, sorting])

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const fieldMeta = header.column.columnDef.meta
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={
                            header.column.getCanSort() ? 'sortable-header' : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                            false: ' 🔃',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() &&
                        fieldMeta?.filterKey !== undefined ? (
                          <DebouncedInput
                            className="filter-select"
                            onChange={(value) => {
                              onFilterChange({
                                [fieldMeta.filterKey as keyof T]: value,
                              } as Partial<T>)
                            }}
                            placeholder="Search..."
                            type={
                              fieldMeta.filterVariant === 'number'
                                ? 'number'
                                : 'text'
                            }
                            value={filters[fieldMeta.filterKey] ?? ''}
                          />
                        ) : null}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getAllCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="controls pagination-controls">
        <button
          className="demo-button demo-button-sm disabled-button"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="demo-button demo-button-sm disabled-button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="demo-button demo-button-sm disabled-button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="demo-button demo-button-sm disabled-button"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="inline-controls">
          <div>Page</div>
          <strong>
            {(table.store.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="inline-controls">
          | Go to page:
          <input
            type="number"
            value={table.store.state.pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="page-size-input"
          />
        </span>
        <select
          value={table.store.state.pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
