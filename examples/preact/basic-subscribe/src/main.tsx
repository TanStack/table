import { useEffect, useMemo, useReducer, useRef, useState } from 'preact/hooks'
import { render } from 'preact'
import { TanStackDevtools } from '@tanstack/preact-devtools'
import {
  Subscribe,
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
import { useCreateAtom } from '@tanstack/preact-store'
import { makeData } from './makeData'
import type {
  Column,
  PreactTable,
  RowSelectionState,
} from '@tanstack/preact-table'
import type { JSX } from 'preact'
import type { Person } from './makeData'
import './index.css'

const features = tableFeatures({
  rowPaginationFeature,
  rowSelectionFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()

/**
 * This is an example showing how to use advanced re-rendering optimizations with more fine-grained control over what is subscribed to.
 * Subscribe/table.Subscribe is a higher-order component that allows you to subscribe to the table state or individual atoms/stores.
 * This is useful for making sure that re-renders only happen at certain parts of the preact tree exactly where need to be.
 * We recommend only using these patterns when you run into specific performance issues.
 */
function App() {
  const rerender = useReducer(() => ({}), {})[1]

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: 'select',
          header: ({ table }) => {
            return (
              // just import Subscribe component if "preact" table is not available in scope and pass in the table store as source
              <Subscribe
                source={table.store}
                // It can be difficult to know what to subscribe to, unless you understand everything that can be a state dependency for internal APIs
                // Be careful to test and validate that it re-renders when you expect it to
                selector={(state) => ({
                  columnFilters: state.columnFilters,
                  globalFilter: state.globalFilter,
                  rowSelection: state.rowSelection,
                })}
              >
                {() => (
                  <IndeterminateCheckbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                  />
                )}
              </Subscribe>
            )
          },
          cell: ({ row }) => (
            <Subscribe
              source={table.atoms.rowSelection} // optimize to subscribe only to the row selection atom
              selector={(rowSelection) => rowSelection[row.id]} // optimize to only re-render when the row selection changes for this row
            >
              {(isRowSelected) => (
                <div className="column-toggle-row">
                  {/* Select only this row's selection value so toggling one row only re-renders that row's checkbox. */}
                  <IndeterminateCheckbox
                    checked={!!isRowSelected}
                    disabled={!row.getCanSelect()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                </div>
              )}
            </Subscribe>
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
  const refreshData = () => setData(() => makeData(1_000))
  const stressTest = () => setData(() => makeData(200_000))

  // optionally, raise the selection state to your own atom
  const rowSelectionAtom = useCreateAtom<RowSelectionState>({})

  const table = useTable(
    {
      key: 'basic-subscribe', // needed for devtools
      features,
      atoms: {
        rowSelection: rowSelectionAtom,
      },
      columns,
      data,
      getRowId: (row) => row.id,
      enableRowSelection: true, // enable row selection for all rows
      // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
      debugTable: true,
    },
    () => null, // subscribe to no table state by default; use table.Subscribe below for targeted updates
  )

  useTanStackTableDevtools(table)

  return (
    <div className="demo-root">
      <div>
        <button
          className="demo-button demo-button-spaced"
          onClick={() => refreshData()}
        >
          Regenerate Data
        </button>
        <button
          className="demo-button demo-button-spaced"
          onClick={() => stressTest()}
        >
          Stress Test (200k rows)
        </button>
      </div>
      <div>
        <table.Subscribe source={table.atoms.globalFilter}>
          {(globalFilter) => (
            <input
              value={globalFilter ?? ''}
              onInput={(e) =>
                table.setGlobalFilter((e.target as HTMLInputElement).value)
              }
              className="summary-panel"
              placeholder="Search all columns..."
            />
          )}
        </table.Subscribe>
      </div>
      <div className="spacer-sm" />
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
                            <Filter column={header.column} table={table} />
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
        {/* Subscribe the row model to filtering and pagination only. Row selection is handled per row below. */}
        <table.Subscribe
          selector={(state) => ({
            columnFilters: state.columnFilters,
            globalFilter: state.globalFilter,
            pagination: state.pagination,
          })}
        >
          {() => (
            <>
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
              <tfoot>
                <tr>
                  <td className="cell-padding">
                    <table.Subscribe source={table.atoms.rowSelection}>
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
                    Page Rows (
                    {table.getRowModel().rows.length.toLocaleString()})
                  </td>
                </tr>
              </tfoot>
            </>
          )}
        </table.Subscribe>
      </table>
      <div className="spacer-sm" />
      <table.Subscribe
        selector={(state) => ({
          columnFilters: state.columnFilters,
          globalFilter: state.globalFilter,
          pagination: state.pagination,
        })}
      >
        {({ pagination }) => (
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
                  const value = (e.target as HTMLInputElement).value
                  const page = value ? Number(value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="page-size-input"
              />
            </span>
            <select
              value={pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number((e.target as HTMLInputElement).value))
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        )}
      </table.Subscribe>
      <br />
      <table.Subscribe source={table.atoms.rowSelection}>
        {(rowSelection) => (
          <div>
            <>{Object.keys(rowSelection).length.toLocaleString()} of </>
            {table.getPreFilteredRowModel().rows.length.toLocaleString()} Total
            Rows Selected
          </div>
        )}
      </table.Subscribe>
      <hr />
      <br />
      <div>
        <button
          className="demo-button demo-button-spaced"
          onClick={() => rerender(0)}
        >
          Force Rerender
        </button>
      </div>
      <div>
        <button
          className="demo-button demo-button-spaced"
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
        <label>Table State:</label>
        {/* subscribe to the entire table state */}
        <table.Subscribe selector={(state) => state}>
          {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
        </table.Subscribe>
      </div>
    </div>
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<typeof features, Person>
  table: PreactTable<typeof features, Person, null>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  return (
    <table.Subscribe source={table.atoms.columnFilters}>
      {() =>
        typeof firstValue === 'number' ? (
          <div className="filter-row">
            <input
              type="number"
              value={((column.getFilterValue() as any)?.[0] ?? '') as string}
              onInput={(e) =>
                column.setFilterValue((old: any) => [
                  (e.target as HTMLInputElement).value,
                  old?.[1],
                ])
              }
              placeholder={`Min`}
              className="filter-input"
            />
            <input
              type="number"
              value={((column.getFilterValue() as any)?.[1] ?? '') as string}
              onInput={(e) =>
                column.setFilterValue((old: any) => [
                  old?.[0],
                  (e.target as HTMLInputElement).value,
                ])
              }
              placeholder={`Max`}
              className="filter-input"
            />
          </div>
        ) : (
          <input
            type="text"
            value={(column.getFilterValue() ?? '') as string}
            onInput={(e) =>
              column.setFilterValue((e.target as HTMLInputElement).value)
            }
            placeholder={`Search...`}
            className="filter-select"
          />
        )
      }
    </table.Subscribe>
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
      className={className + ' sortable-header'}
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
  </>,
  rootElement,
)
