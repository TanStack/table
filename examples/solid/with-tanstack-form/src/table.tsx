import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, Show, createMemo, createSignal } from 'solid-js'
import type { JSX } from 'solid-js'

function SortIndicator() {
  const header = useHeaderContext()
  const sorted = () => header.column.getIsSorted()

  return (
    <Show when={sorted()}>
      {(sorted) => <>{sorted() === 'asc' ? ' 🔼' : ' 🔽'}</>}
    </Show>
  )
}

function ColumnFilter() {
  const header = useHeaderContext()
  const table = useTableContext()

  const firstValue = () =>
    table.getPreFilteredRowModel().flatRows[0]?.getValue(header.column.id)

  const columnFilterValue = () => header.column.getFilterValue()

  return (
    <Show when={header.column.getCanFilter()}>
      <div onClick={(e) => e.stopPropagation()}>
        <Show
          when={typeof firstValue() === 'number'}
          fallback={
            <DebouncedInput
              type="text"
              value={(columnFilterValue() ?? '') as string}
              onChange={(value) => header.column.setFilterValue(value)}
              placeholder="Search..."
              class="filter-select"
            />
          }
        >
          <div class="filter-row">
            <DebouncedInput
              type="number"
              value={
                (columnFilterValue() as [number, number] | undefined)?.[0] ??
                ''
              }
              onChange={(value) =>
                header.column.setFilterValue(
                  (old: [number, number] | undefined) => [value, old?.[1]],
                )
              }
              placeholder="Min"
              class="filter-input"
            />
            <DebouncedInput
              type="number"
              value={
                (columnFilterValue() as [number, number] | undefined)?.[1] ??
                ''
              }
              onChange={(value) =>
                header.column.setFilterValue(
                  (old: [number, number] | undefined) => [old?.[0], value],
                )
              }
              placeholder="Max"
              class="filter-input"
            />
          </div>
        </Show>
      </div>
    </Show>
  )
}

function PaginationControls() {
  const table = useTableContext()
  const pagination = createMemo(() => table.atoms.pagination.get())

  return (
    <>
      <div class="spacer-sm" />
      <div class="controls">
        <button
          type="button"
          class="demo-button demo-button-sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          type="button"
          class="demo-button demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          type="button"
          class="demo-button demo-button-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          type="button"
          class="demo-button demo-button-sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span class="inline-controls">
          <div>Page</div>
          <strong>
            {(pagination().pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={pagination().pageIndex + 1}
            onChange={(e) => {
              const page = e.currentTarget.value
                ? Number(e.currentTarget.value) - 1
                : 0
              table.setPageIndex(page)
            }}
            class="page-size-input"
          />
        </span>
        <select
          value={pagination().pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.currentTarget.value))
          }}
        >
          <For each={[10, 20, 30, 40, 50]}>
            {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
          </For>
        </select>
      </div>
    </>
  )
}

function RowCount() {
  const table = useTableContext()

  return (
    <div>
      Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
      {table.getRowCount().toLocaleString()} Rows
    </div>
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = createSignal(initialValue)
  let timeout: ReturnType<typeof setTimeout> | undefined

  return (
    <input
      {...props}
      value={value()}
      onInput={(e) => {
        const nextValue = e.currentTarget.value
        setValue(nextValue)
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => onChange(nextValue), debounce)
      }}
    />
  )
}

export const {
  appFeatures,
  createAppColumnHelper,
  createAppTable,
  useHeaderContext,
  useTableContext,
} = createTableHook({
  features: tableFeatures({
    rowPaginationFeature,
    columnFilteringFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns,
    sortFns,
  }),
  tableComponents: {
    PaginationControls,
    RowCount,
  },
  headerComponents: {
    SortIndicator,
    ColumnFilter,
  },
  cellComponents: {},
})
