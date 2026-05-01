/**
 * This example demonstrates the useLegacyTable hook which provides
 * a v8-style API for easier migration from TanStack Table v8 to v9.
 *
 * Key differences from the v9 useTable hook:
 * - No need to define _features - all stock features are included
 * - Uses v8-style get*RowModel() options instead of _rowModels
 * - Subscribes to all state automatically (like v8 behavior)
 *
 * NOTE: useLegacyTable is deprecated and intended only as a migration aid.
 * New code should use useTable with explicit _features and _rowModels.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { flexRender } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  legacyCreateColumnHelper,
  useLegacyTable,
} from '@tanstack/react-table/legacy'
import { makeData } from './makeData'
import type {
  CellData,
  ColumnFiltersState,
  PaginationState,
  RowData,
  SortingState,
  TableFeatures,
} from '@tanstack/react-table'
import type { LegacyColumn } from '@tanstack/react-table/legacy' // legacy types
import type { Person } from './makeData'

declare module '@tanstack/react-table' {
  // allows us to define custom properties for our columns
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }
}

const columnHelper = legacyCreateColumnHelper<Person>()

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => <span>Last Name</span>,
        }),
        columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
          id: 'fullName',
          header: 'Full Name',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
          meta: {
            filterVariant: 'range',
          },
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
          meta: {
            filterVariant: 'range',
          },
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          meta: {
            filterVariant: 'select',
          },
        }),
        columnHelper.accessor('progress', {
          header: 'Profile Progress',
          meta: {
            filterVariant: 'range',
          },
        }),
      ]),
    [],
  )

  const [data, setData] = React.useState<Array<Person>>(() => makeData(5_000))
  const refreshData = () => setData((_old) => makeData(50_000)) // stress test

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Using useLegacyTable with the v8-style API!
  // Notice how we use get*RowModel() options instead of _rowModels
  // and we don't need to define _features
  const table = useLegacyTable({
    columns,
    data,
    // V8-style row model options (these are mapped to v9 _rowModels under the hood)
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // client side filtering
    getSortedRowModel: getSortedRowModel(), // client side sorting
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
      pagination,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    // Debug options work the same
    debugTable: true,
    debugColumns: true,
  })

  return (
    <div className="demo-root">
      <div className="warning-panel">
        <strong>Migration Example:</strong> This example uses the deprecated{' '}
        <code>useLegacyTable</code> hook with v8-style API. See the{' '}
        <a href="../filters" className="demo-link">
          filters example
        </a>{' '}
        for the recommended v9 approach.
      </div>

      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
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
                          {/* With useLegacyTable, we use flexRender instead of table.FlexRender */}
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="spacer-sm" />
      <div className="controls">
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="inline-controls">
          <div>Page</div>
          <strong>
            {(pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="page-size-input"
          />
        </span>
        <select
          value={pagination.pageSize}
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
      <div>
        {table.getPrePaginatedRowModel().rows.length.toLocaleString()} Rows
      </div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <div className="state-section">
        <h4 className="state-heading">Current State:</h4>
        <pre className="code-block">
          {JSON.stringify(table.getState(), null, 2)}
        </pre>
      </div>
    </div>
  )
}

function Filter({ column }: { column: LegacyColumn<Person> }) {
  const columnFilterValue = column.getFilterValue()
  const { filterVariant } = column.columnDef.meta ?? {}

  return filterVariant === 'range' ? (
    <div>
      <div className="filter-row">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number] | undefined)?.[0] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number] | undefined) => [
              value,
              old?.[1],
            ])
          }
          placeholder={`Min`}
          className="filter-input"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number] | undefined)?.[1] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number] | undefined) => [
              old?.[0],
              value,
            ])
          }
          placeholder={`Max`}
          className="filter-input"
        />
      </div>
      <div className="spacer-xs" />
    </div>
  ) : filterVariant === 'select' ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      <option value="complicated">complicated</option>
      <option value="relationship">relationship</option>
      <option value="single">single</option>
    </select>
  ) : (
    <DebouncedInput
      className="filter-select"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
    // See faceted column filters example for datalist search suggestions
  )
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
