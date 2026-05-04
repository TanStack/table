import { render } from 'preact'
import { useEffect, useMemo, useReducer, useState } from 'preact/hooks'
import './index.css'
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import { makeData } from './makeData'
import type { JSX } from 'preact'
import type {
  CellData,
  Column,
  RowData,
  TableFeatures,
} from '@tanstack/preact-table'
import type { Person } from './makeData'

declare module '@tanstack/preact-table' {
  // allows us to define custom properties for our columns
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }
}

const _features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

function App() {
  const rerender = useReducer(() => ({}), {})[1]

  const columns = useMemo(
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

  const [data, setData] = useState<Array<Person>>(() => makeData(5_000))
  const refreshData = () => setData((_old) => makeData(5_000))
  const stressTest = () => setData((_old) => makeData(200_000))

  const table = useTable({
    _features,
    _rowModels: {
      filteredRowModel: createFilteredRowModel(filterFns), // client side filtering
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns,
    data,
    debugTable: true,
    debugColumns: true,
  })

  return (
    <table.Subscribe
      selector={(state) => ({
        columnFilters: state.columnFilters,
        pagination: state.pagination,
      })}
    >
      {(state) => (
        <div className="demo-root">
          <div>
            <button onClick={() => refreshData()}>Regenerate Data</button>
            <button onClick={() => stressTest()}>
              Stress Test (200k rows)
            </button>
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
                            <div>
                              <table.FlexRender header={header} />
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
                          <table.FlexRender cell={cell} />
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
                {(state.pagination.pageIndex + 1).toLocaleString()} of{' '}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span>
            <span className="inline-controls">
              | Go to page:
              <input
                type="number"
                min="1"
                max={table.getPageCount()}
                defaultValue={state.pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = (e.target as HTMLInputElement).value
                    ? Number((e.target as HTMLInputElement).value) - 1
                    : 0
                  table.setPageIndex(page)
                }}
                className="page-size-input"
              />
            </span>
            <select
              value={state.pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number((e.target as HTMLSelectElement).value))
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
            <button onClick={() => rerender(0)}>Force Rerender</button>
          </div>
          <table.Subscribe selector={(state) => state}>
            {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
          </table.Subscribe>
        </div>
      )}
    </table.Subscribe>
  )
}

function Filter({
  column,
}: {
  column: Column<typeof _features, Person, unknown>
}) {
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
      onChange={(e) =>
        column.setFilterValue((e.target as HTMLSelectElement).value)
      }
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

// A typical debounced input preact component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Record<string, any>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onInput={(e) => setValue((e.target as HTMLInputElement).value)}
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(<App />, rootElement)
