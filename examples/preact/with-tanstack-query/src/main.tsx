import { useMemo, useReducer } from 'preact/hooks'
import { render } from 'preact'
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/preact-query'
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import './index.css'
import {
  createColumnHelper,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import { fetchData } from './fetchData'
import type { PaginationState } from '@tanstack/preact-table'
import type { Person } from './fetchData'

const queryClient = new QueryClient()

const _features = tableFeatures({
  rowPaginationFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

function App() {
  const rerender = useReducer(() => ({}), {})[1]

  // Create a stable external atom for the pagination slice.
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Subscribe to the atom for reactive updates.
  const pagination = useSelector(paginationAtom, (s) => s)

  const dataQuery = useQuery({
    queryKey: ['data', pagination],
    queryFn: () => fetchData(pagination),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  })

  const defaultData = useMemo(() => [], [])

  const table = useTable({
    _features,
    _rowModels: {},
    columns,
    data: dataQuery.data?.rows ?? defaultData,
    rowCount: dataQuery.data?.rowCount,
    atoms: {
      pagination: paginationAtom,
    },
    manualPagination: true, // we're doing manual "server-side" pagination
    debugTable: true,
  })

  return (
    <div className="demo-root">
      <div className="spacer-sm" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
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
              const page = (e.target as HTMLInputElement).value
                ? Number((e.target as HTMLInputElement).value) - 1
                : 0
              table.setPageIndex(page)
            }}
            className="page-size-input"
          />
        </span>
        <select
          value={pagination.pageSize}
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
        {dataQuery.isFetching ? 'Loading...' : null}
      </div>
      <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
        {dataQuery.data?.rowCount.toLocaleString()} Rows
      </div>
      <div>
        <button onClick={() => rerender(0)}>Force Rerender</button>
      </div>
      <pre>{JSON.stringify({ pagination }, null, 2)}</pre>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  rootElement,
)
