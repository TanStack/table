import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { makeData } from './makeData'
import type { Person } from './makeData'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, Person>()

function App() {
  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: 'rowNumber',
          header: '#',
          cell: ({ row }) => row.getDisplayIndex() + 1,
        }),
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => <span>Last Name</span>,
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

  return (
    <>
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1M rows)</button>
      </div>
      <MyTable data={data} columns={columns} />
      <hr />
      <div></div>
    </>
  )
}

function MyTable({
  data,
  columns,
}: {
  data: Array<Person>
  columns: ReturnType<typeof columnHelper.columns>
}) {
  const table = useTable(
    {
      features,
      columns,
      data,
      // initialState: { pagination: { pageIndex: 1, pageSize: 20 } }, // set the initial page once
      // atoms: { pagination: paginationAtom }, // preferred: own pagination state with an external atom
      // state: { pagination }, // classic controlled state; pair with onPaginationChange
      // onPaginationChange: setPagination,
      // autoResetPageIndex: false, // keep the current page after page-altering changes; default true
      // autoResetAll: false, // turn off every feature's automatic reset, including page index
      // manualPagination: true, // pass data that is already paginated, for example from a server
      // pageCount: 10, // total pages for manual pagination; use -1 when unknown
      // rowCount: 1_000, // total rows for manual pagination; pageCount is calculated from this and pageSize
      debugTable: true,
    },
    (state) => state, // default selector
  )

  return (
    <div className="demo-root">
      <div className="spacer-sm" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    <div>
                      <table.FlexRender header={header} />
                    </div>
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
            value={table.state.pagination.pageIndex + 1}
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
      <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
        {table.getRowCount().toLocaleString()} Rows
      </div>
      <pre data-testid="table-state">
        {JSON.stringify(table.state, null, 2)}
      </pre>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
