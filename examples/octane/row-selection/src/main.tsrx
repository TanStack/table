import { useEffect, useMemo, useRef, useState } from 'octane'
import { createRoot } from 'octane'
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_inNumberRange,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from '@tanstack/octane-table'
import { useCreateAtom } from '@tanstack/octane-store'
import { makeData } from './makeData'
import type {
  Column,
  RowSelectionState,
  Table,
} from '@tanstack/octane-table'
import type { Person } from './makeData'
import './index.css'

const features = tableFeatures({
  rowPaginationFeature,
  rowSelectionFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()

function App() @{
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: 'select',
          header: () => {
            return (
              <IndeterminateCheckbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />
            )
          },
          cell: ({ row }) => (
            <div className="column-toggle-row">
              <IndeterminateCheckbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                indeterminate={row.getIsSomeSelected()}
                onClick={row.getToggleSelectedHandler({
                  // selectChildren: false
                })}
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
  const stressTest = () => setData(() => makeData(1_000_000))

  const rowSelectionAtom = useCreateAtom<RowSelectionState>({})

  const table = useTable(
    {
      features,
      atoms: {
        rowSelection: rowSelectionAtom,
      },
      columns,
      data,
      getRowId: (row) => row.id,
      enableRowSelection: true, // enable row selection for all rows
      // enableRowSelection: row => row.original.age > 18, // or enable selection conditionally
      // initialState: { rowSelection: { '0': true } }, // select rows on first render
      // state: { rowSelection }, // classic controlled state; pair with onRowSelectionChange
      // onRowSelectionChange: setRowSelection,
      // enableMultiRowSelection: false, // allow only one selected row at a time; default true
      // enableRowRangeSelection: false, // disable Shift-click range selection; default true
      // enableSubRowSelection: false, // do not select a parent's subrows with it; default true
      // isRowRangeSelectionEvent: event => Boolean(event.metaKey), // use Meta instead of Shift
      debugTable: true,
    },
    (state) => state, // default selector
  )

  <>
      <div className="demo-root">
        <div>
          <button onClick={() => refreshData()}>Regenerate Data</button>
          <button onClick={() => stressTest()}>Stress Test (1M rows)</button>
        </div>
        <div>
          <input
            value={table.state.globalFilter ?? ''}
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
                <IndeterminateCheckbox
                  checked={table.getIsAllPageRowsSelected()}
                  indeterminate={table.getIsSomePageRowsSelected()}
                  onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
              </td>
              <td colSpan={20}>
                Page Rows ({table.getRowModel().rows.length.toLocaleString()})
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
              {(table.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span className="inline-controls">
            | Go to page:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              value={table.state.pagination.pageIndex + 1}
              onInput={(e) => {
                const page = (e.target as HTMLInputElement).value
                  ? Number((e.target as HTMLInputElement).value) - 1
                  : 0
                table.setPageIndex(page)
              }}
              className="page-size-input"
            />
          </span>
          <select
            value={table.state.pagination.pageSize}
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
        <br />
        <div>
          <>
            {Object.keys(table.state.rowSelection).length.toLocaleString()}{' '}
            of{' '}
          </>
          {table.getPreFilteredRowModel().rows.length.toLocaleString()} Total
          Rows Selected
        </div>
        <hr />
        <br />
        <div></div>
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
          <pre data-testid="table-state">
            {JSON.stringify(table.state, null, 2)}
          </pre>
        </div>
      </div>
    </>
}

function Filter({
  column,
  table,
}: {
  column: Column<typeof features, Person>
  table: Table<typeof features, Person>
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
} & Record<string, any>) @{
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !checked && indeterminate
    }
  }, [ref, indeterminate, checked])

  <input
      type="checkbox"
      ref={ref}
      className={className + ' sortable-header'}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      {...rest}
    />
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

createRoot(rootElement).render(App)
