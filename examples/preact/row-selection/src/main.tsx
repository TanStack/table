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
import { useCreateAtom } from '@tanstack/preact-store'
import { makeData } from './makeData'
import type {
  Column,
  PreactTable,
  RowSelectionState,
  Table,
} from '@tanstack/preact-table'
import type { JSX } from 'preact'
import type { Person } from './makeData'
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
              <table.Subscribe
                source={table.atoms.rowSelection} // slice atom only — not the full derived store
              >
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
            <div className="column-toggle-row">
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
  const refreshData = () => setData(() => makeData(1_000))
  const stressTest = () => setData(() => makeData(100_000))

  const rowSelectionAtom = useCreateAtom<RowSelectionState>({})

  const table = useTable(
    {
      _features,
      _rowModels: {
        filteredRowModel: createFilteredRowModel(filterFns),
        paginatedRowModel: createPaginatedRowModel(),
      },
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
    // (state) => state, // uncomment to subscribe to the entire table state (this is how v8 used to work by default)
  )

  useTanStackTableDevtools(table, 'Row Selection Example')

  return (
    <>
      <table.Subscribe
        selector={(state) => ({
          // Store mode: multiple slices — must use table.store + explicit selector
          columnFilters: state.columnFilters,
          globalFilter: state.globalFilter,
          pagination: state.pagination,
        })}
      >
        {(state) => (
          <div className="demo-root">
            <div>
              <button onClick={() => refreshData()}>Regenerate Data</button>
              <button onClick={() => stressTest()}>
                Stress Test (100k rows)
              </button>
            </div>
            <div>
              <input
                value={state.globalFilter ?? ''}
                onInput={(e) =>
                  table.setGlobalFilter((e.target as HTMLInputElement).value)
                }
                className="summary-panel"
                placeholder="Search all columns..."
              />
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
                      source={rowSelectionAtom}
                      selector={(rowSelection) => rowSelection?.[row.id]} // optional: narrow to this row id
                    >
                      {(_isRowSelected) => (
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
                  <td className="cell-padding">
                    <table.Subscribe source={table.atoms.rowSelection}>
                      {(_rowSelection) => (
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
                  {(
                    table.store.state.pagination.pageIndex + 1
                  ).toLocaleString()}{' '}
                  of {table.getPageCount().toLocaleString()}
                </strong>
              </span>
              <span className="inline-controls">
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
                  className="page-size-input"
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
                {({ numSelected }) => <>{numSelected.toLocaleString()} of </>}
              </table.Subscribe>
              {table.getPreFilteredRowModel().rows.length.toLocaleString()}{' '}
              Total Rows Selected
            </div>
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
    <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
  </>,
  rootElement,
)
