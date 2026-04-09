import { useEffect, useMemo, useReducer, useRef, useState } from 'preact/hooks'
import { render } from 'preact'
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/preact-table-devtools'
import { TanStackDevtools } from '@tanstack/preact-devtools'
import { makeData } from './makeData'
import type { JSX } from 'preact'
import type { Person } from './makeData'
import type { Column, Table } from '@tanstack/preact-table'
import './index.css'

const _features = tableFeatures({
  rowPaginationFeature,
  rowSelectionFeature,
  columnFilteringFeature,
  globalFilteringFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

function App() {
  const rerender = useReducer(() => ({}), {})[1]

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: 'select',
          header: () => {
            return (
              <table.Subscribe selector={(state) => state.rowSelection}>
                {() => (
                  <IndeterminateCheckbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                  />
                )}
              </table.Subscribe>
            )
          },
          cell: ({ row }) => (
            <div className="px-1">
              <IndeterminateCheckbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                indeterminate={row.getIsSomeSelected()}
                onChange={row.getToggleSelectedHandler()}
              />
            </div>
          ),
        }),
        columnHelper.accessor('firstName', {
          header: 'First Name',
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          header: () => <span>Last Name</span>,
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('progress', {
          header: 'Profile Progress',
          footer: (props) => props.column.id,
        }),
      ]),
    [],
  )

  const [data, setData] = useState(() => makeData(1_000))
  const refreshData = () => setData(() => makeData(100_000)) // stress test

  const table = useTable(
    {
      _features,
      _rowModels: {
        filteredRowModel: createFilteredRowModel(filterFns),
        paginatedRowModel: createPaginatedRowModel(),
      },
      columns,
      data,
      getRowId: (row) => row.id,
      enableRowSelection: true, // enable row selection for all rows
      // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
      debugTable: true,
    },
    // (state) => state, // uncomment to subscribe to the entire table state (this is how v8 used to work by default)
  )

  useTanStackTableDevtools(table, 'Row Selection Example')

  return (
    <>
      <table.Subscribe
        selector={(state) => ({
          // don't include row selection state to optimize re-renders
          columnFilters: state.columnFilters,
          globalFilter: state.globalFilter,
          pagination: state.pagination,
        })}
      >
        {(state) => (
          <div className="p-2">
            <div>
              <input
                value={state.globalFilter ?? ''}
                onChange={(e) =>
                  table.setGlobalFilter((e.target as HTMLInputElement).value)
                }
                className="p-2 font-lg shadow border border-block"
                placeholder="Search all columns..."
              />
            </div>
            <div className="h-2" />
            <table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <>
                              <table.FlexRender header={header} />
                              {header.column.getCanFilter() ? (
                                <div>
                                  <Filter
                                    column={header.column}
                                    table={table}
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
                {table.getRowModel().rows.map((row) => {
                  return (
                    <table.Subscribe
                      key={row.id}
                      selector={(state) => state.rowSelection[row.id]} // only re-render row when row selection changes (could down move to cell render too)
                    >
                      {() => (
                        <tr key={row.id}>
                          {row.getAllCells().map((cell) => {
                            return (
                              <td key={cell.id}>
                                <table.FlexRender cell={cell} />
                              </td>
                            )
                          })}
                        </tr>
                      )}
                    </table.Subscribe>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td className="p-1">
                    <table.Subscribe selector={(state) => state.rowSelection}>
                      {() => (
                        <IndeterminateCheckbox
                          checked={table.getIsAllPageRowsSelected()}
                          indeterminate={table.getIsSomePageRowsSelected()}
                          onChange={table.getToggleAllPageRowsSelectedHandler()}
                        />
                      )}
                    </table.Subscribe>
                  </td>
                  <td colSpan={20}>
                    Page Rows ({table.getRowModel().rows.length})
                  </td>
                </tr>
              </tfoot>
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
                  {table.store.state.pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                | Go to page:
                <input
                  type="number"
                  min="1"
                  max={table.getPageCount()}
                  defaultValue={table.store.state.pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = (e.target as HTMLInputElement).value
                      ? Number((e.target as HTMLInputElement).value) - 1
                      : 0
                    table.setPageIndex(page)
                  }}
                  className="border p-1 rounded w-16"
                />
              </span>
              <select
                value={table.store.state.pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(
                    Number((e.target as HTMLInputElement).value),
                  )
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <br />
            <div>
              <table.Subscribe
                selector={(state) => ({
                  numSelected: Object.keys(state.rowSelection).length,
                })}
              >
                {({ numSelected }) => <>{numSelected} of </>}
              </table.Subscribe>
              {table.getPreFilteredRowModel().rows.length} Total Rows Selected
            </div>
            <hr />
            <br />
            <div>
              <button
                className="border rounded p-2 mb-2"
                onClick={() => rerender(0)}
              >
                Force Rerender
              </button>
            </div>
            <div>
              <button
                className="border rounded p-2 mb-2"
                onClick={() => refreshData()}
              >
                Refresh Data
              </button>
            </div>
            <div>
              <button
                className="border rounded p-2 mb-2"
                onClick={() =>
                  console.info(
                    'table.getSelectedRowModel().flatRows',
                    table.getSelectedRowModel().flatRows,
                  )
                }
              >
                Log table.getSelectedRowModel().flatRows
              </button>
            </div>
            <div>
              <label>Row Selection State:</label>
              <table.Subscribe selector={(state) => state}>
                {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
              </table.Subscribe>
            </div>
          </div>
        )}
      </table.Subscribe>
    </>
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<typeof _features, Person>
  table: Table<typeof _features, Person>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? '') as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [
            (e.target as HTMLInputElement).value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? '') as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [
            old?.[0],
            (e.target as HTMLInputElement).value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(column.getFilterValue() ?? '') as string}
      onChange={(e) =>
        column.setFilterValue((e.target as HTMLInputElement).value)
      }
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  )
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  checked,
  onChange,
  disabled,
  ...rest
}: {
  indeterminate?: boolean
  checked?: boolean
  disabled?: boolean
  onChange?: (event: Event) => void
} & Record<string, any>) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !checked && indeterminate
    }
  }, [ref, indeterminate, checked])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      {...rest}
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(
  <>
    <App />
    <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
  </>,
  rootElement,
)
