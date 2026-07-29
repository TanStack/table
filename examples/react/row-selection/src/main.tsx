import React from 'react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import ReactDOM from 'react-dom/client'
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
} from '@tanstack/react-table'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/react-table-devtools'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { useCreateAtom } from '@tanstack/react-store'
import { makeData } from './makeData'
import type { HTMLProps } from 'react'
import type { Person } from './makeData'
import type { Column, RowSelectionState, Table } from '@tanstack/react-table'
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

function App() {
  const columns = React.useMemo(
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
                onChange={row.getToggleSelectedHandler({
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

  const [data, setData] = React.useState(() => makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(1_000_000))

  // optionally, raise the selection state to your own atom
  const rowSelectionAtom = useCreateAtom<RowSelectionState>({})

  const table = useTable(
    {
      key: 'row-selection', // needed for devtools
      features,
      atoms: {
        rowSelection: rowSelectionAtom,
      },
      columns,
      data,
      getRowId: (row) => row.id,
      enableRowSelection: true, // enable row selection for all rows
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

  useTanStackTableDevtools(table)

  return (
    <>
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
            Stress Test (1M rows)
          </button>
        </div>
        <div>
          <DebouncedInput
            value={table.state.globalFilter ?? ''}
            onChange={(value) => table.setGlobalFilter(value)}
            className="summary-panel"
            placeholder="Search all columns..."
          />
        </div>
        <div className="spacer-sm" />
        <p>Hold Shift while selecting rows to select or deselect a range.</p>
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
            onClick={() => table.firstPage()}
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
            onClick={() => table.lastPage()}
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
              defaultValue={table.state.pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              className="page-size-input"
            />
          </span>
          <select
            value={table.state.pagination.pageSize}
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
          <label>State:</label>
          <pre data-testid="table-state">
            {JSON.stringify(table.state, null, 2)}
          </pre>
        </div>
      </div>
    </>
  )
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
      <DebouncedInput
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? '') as string}
        onChange={(value) =>
          column.setFilterValue((old: any) => [value, old?.[1]])
        }
        placeholder={`Min`}
        className="filter-input"
      />
      <DebouncedInput
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? '') as string}
        onChange={(value) =>
          column.setFilterValue((old: any) => [old?.[0], value])
        }
        placeholder={`Max`}
        className="filter-input"
      />
    </div>
  ) : (
    <DebouncedInput
      type="text"
      value={(column.getFilterValue() ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      className="filter-select"
    />
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

  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        debouncedOnChange(e.target.value)
      }}
    />
  )
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
    // `checked` belongs here too: `getIsSomePageRowsSelected` stays true when
    // every page row is selected, so deselecting one only changes `checked`.
  }, [ref, indeterminate, rest.checked])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' selection-checkbox'}
      {...rest}
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
  </React.StrictMode>,
)
