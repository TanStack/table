import {
  columnFilteringFeature,
  createTable,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, Show, createEffect } from 'solid-js'
import { DebouncedInput } from './debouncedInput'
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
  TableOptions_RowPagination,
} from '@tanstack/solid-table'
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

export default function Table<T extends Record<string, string | number>>(
  props: Props<T>,
) {
  const table = createTable(
    {
      debugTable: true,
      _features,
      _rowModels: {},
      get columns() {
        return props.columns
      },
      get data() {
        return props.data
      },
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      get onSortingChange() {
        return props.onSortingChange
      },
      get onPaginationChange() {
        return props.paginationOptions.onPaginationChange
      },
      get rowCount() {
        return props.paginationOptions.rowCount
      },
    },
    (state) => state,
  )

  // Sync controlled state with table store
  createEffect(() => {
    table.baseStore.setState((prev) => ({
      ...prev,
      pagination: props.pagination,
      sorting: props.sorting,
    }))
  })

  return (
    <div>
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => {
                    const fieldMeta = header.column.columnDef.meta
                    return (
                      <th colSpan={header.colSpan}>
                        <Show when={!header.isPlaceholder}>
                          <>
                            <div
                              class={
                                header.column.getCanSort()
                                  ? 'cursor-pointer select-none'
                                  : ''
                              }
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <table.FlexRender header={header} />
                              {(
                                {
                                  asc: ' 🔼',
                                  desc: ' 🔽',
                                  false: ' 🔃',
                                } as Record<string, string>
                              )[header.column.getIsSorted() as string] ?? null}
                            </div>
                            <Show
                              when={
                                header.column.getCanFilter() &&
                                fieldMeta?.filterKey !== undefined
                              }
                            >
                              <DebouncedInput
                                class="w-36 border shadow rounded"
                                onChange={(value) => {
                                  props.onFilterChange({
                                    [fieldMeta!.filterKey as keyof T]: value,
                                  } as Partial<T>)
                                }}
                                placeholder="Search..."
                                type={
                                  fieldMeta?.filterVariant === 'number'
                                    ? 'number'
                                    : 'text'
                                }
                                value={
                                  (props.filters[fieldMeta!.filterKey!] as
                                    | string
                                    | number) ?? ''
                                }
                              />
                            </Show>
                          </>
                        </Show>
                      </th>
                    )
                  }}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr>
                <For each={row.getAllCells()}>
                  {(cell) => (
                    <td>
                      <table.FlexRender cell={cell} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <div class="flex items-center gap-2 my-2">
        <button
          class="border rounded p-1 disabled:text-gray-500 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          class="border rounded p-1 disabled:text-gray-500 disabled:cursor-not-allowed"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          class="border rounded p-1 disabled:text-gray-500 disabled:cursor-not-allowed"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          class="border rounded p-1 disabled:text-gray-500 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span class="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {(table.store.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            value={table.store.state.pagination.pageIndex + 1}
            onInput={(e) => {
              const page = e.currentTarget.value
                ? Number(e.currentTarget.value) - 1
                : 0
              table.setPageIndex(page)
            }}
            class="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.store.state.pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.currentTarget.value))
          }}
        >
          <For each={[10, 20, 30, 40, 50]}>
            {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
          </For>
        </select>
      </div>
    </div>
  )
}
