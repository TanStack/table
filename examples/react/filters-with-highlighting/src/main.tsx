import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'

import {
  Column,
  Table,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'

import { makeData, VehicleOwner } from './makeData'
import {
  columnFilterWithHighlighting,
  ColumnFilterWithHighlightingConfig,
  globalFilterWithHighlighting,
  GlobalFilterWithHighlightingConfig,
} from './filtersWithHighlighting'
import { cellWithHighlighting } from './cellWithHighlighting'

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState<
    GlobalFilterWithHighlightingConfig | undefined
  >(undefined)

  const [highlightAll, setHighlightAll] = React.useState<boolean>(true)
  const [ignoreNewlines, setIgnoreNewlines] = React.useState<boolean>(false)
  const [multiterm, setGlobalFilterMultiterm] = React.useState<boolean>(true)

  React.useEffect(() => {
    setColumnFilters(prev =>
      prev.map(filter => ({
        ...filter,
        value: filter.value
          ? { ...filter.value, highlightAll, ignoreNewlines }
          : undefined,
      }))
    )
    setGlobalFilter(prev =>
      prev ? { ...prev, highlightAll, ignoreNewlines, multiterm } : undefined
    )
  }, [highlightAll, ignoreNewlines, multiterm])

  const columns = React.useMemo<ColumnDef<VehicleOwner, any>[]>(
    () => [
      {
        accessorKey: 'vehicle',
        cell: cellWithHighlighting,
        filterFn: columnFilterWithHighlighting,
      },
      {
        accessorKey: 'vehicleId',
        cell: cellWithHighlighting,
        filterFn: columnFilterWithHighlighting,
      },
      {
        accessorKey: 'vehicleRegMark',
        cell: cellWithHighlighting,
        filterFn: columnFilterWithHighlighting,
      },
      {
        accessorKey: 'buyLocation',
        cell: cellWithHighlighting,
        filterFn: columnFilterWithHighlighting,
      },
      {
        accessorKey: 'ownerName',
        cell: cellWithHighlighting,
        filterFn: columnFilterWithHighlighting,
      },
      {
        accessorKey: 'ownerContacts',
        cell: cellWithHighlighting,
        filterFn: columnFilterWithHighlighting,
      },

      {
        accessorKey: 'comment',
        cell: cellWithHighlighting,
        filterFn: columnFilterWithHighlighting,
      },
    ],
    []
  )

  const [data, setData] = React.useState<VehicleOwner[]>(() => makeData(50000))
  const refreshData = () => setData(old => makeData(50000))

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: globalFilterWithHighlighting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  return (
    <div className="p-2">
      <div>
        <div>
          <input
            type="checkbox"
            id="highlightAllCheckbox"
            checked={highlightAll}
            onChange={() => {
              setHighlightAll(prev => !prev)
            }}
          />{' '}
          <label htmlFor="highlightAllCheckbox">Highlight All</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="ignoreNewlinesCheckbox"
            checked={ignoreNewlines}
            onChange={() => {
              setIgnoreNewlines(prev => !prev)
            }}
          />{' '}
          <label htmlFor="ignoreNewlinesCheckbox">Ignore Newlines</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="globalFilterMultitermCheckbox"
            checked={multiterm}
            onChange={() => {
              setGlobalFilterMultiterm(prev => !prev)
            }}
          />{' '}
          <label htmlFor="globalFilterMultitermCheckbox">
            Global Filter Multiterm
          </label>
        </div>
      </div>
      <div>
        <DebouncedInput
          value={globalFilter?.term ?? ''}
          onChange={value => {
            const valueStr = String(value)
            const good = multiterm
              ? !!valueStr && !/^\s+$/.test(valueStr)
              : !!valueStr
            setGlobalFilter(
              good
                ? {
                    highlightAll,
                    ignoreNewlines,
                    multiterm,
                    term: valueStr,
                  }
                : undefined
            )
          }}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search all columns..."
        />
      </div>
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter
                              column={header.column}
                              table={table}
                              highlightAll={highlightAll}
                              ignoreNewlines={ignoreNewlines}
                            />
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
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id} className="border">
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
    </div>
  )
}

function Filter({
  column,
  table,
  highlightAll,
  ignoreNewlines,
}: {
  column: Column<any, unknown>
  table: Table<any>
  highlightAll: boolean
  ignoreNewlines: boolean
}) {
  const filterValue = column.getFilterValue() as
    | ColumnFilterWithHighlightingConfig
    | undefined
  return (
    <>
      <div>
        <DebouncedInput
          type="text"
          value={filterValue?.term ?? ''}
          onChange={value =>
            column.setFilterValue(
              value
                ? ({
                    highlightAll,
                    ignoreNewlines,
                    term: value,
                  } as ColumnFilterWithHighlightingConfig)
                : undefined
            )
          }
          placeholder="Search..."
          className="w-36 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </>
  )
}

// A debounced input react component
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
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
