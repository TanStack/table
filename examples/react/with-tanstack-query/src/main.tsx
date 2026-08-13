import React from 'react'
import ReactDOM from 'react-dom/client'
import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import {
  columnFilteringFeature,
  createColumnHelper,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/react-table-devtools'
import { fetchData, fetchInfiniteData } from './fetchData'
import './index.css'
import type {
  PaginationState,
  ReactTable,
  SortingState,
} from '@tanstack/react-table'
import type { Person } from './fetchData'

const queryClient = new QueryClient()
const defaultData: Array<Person> = []

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  // Client-side filtering, sorting, and pagination row models are not
  // required because those operations are handled manually on the server.
  // Omitting the filtered and sorted row models also omits their page-reset
  // hooks, so pagination is reset in the change handlers below.
})

const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('firstName', { header: 'First Name' }),
  columnHelper.accessor('lastName', { header: 'Last Name' }),
  columnHelper.accessor('age', { header: 'Age' }),
  columnHelper.accessor('visits', { header: 'Visits' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('progress', { header: 'Profile Progress' }),
])

function PersonTable({
  table,
}: {
  table: ReactTable<typeof features, Person>
}) {
  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : (
                  <div
                    className={
                      header.column.getCanSort() ? 'sortable-header' : ''
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <table.FlexRender header={header} />
                    {{ asc: ' 🔼', desc: ' 🔽' }[
                      header.column.getIsSorted() as string
                    ] ?? null}
                  </div>
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
  )
}

function PageSizeSelect({
  pageSize,
  onChange,
}: {
  pageSize: number
  onChange: (pageSize: number) => void
}) {
  return (
    <select
      aria-label="Rows per page"
      value={pageSize}
      onChange={(event) => onChange(Number(event.target.value))}
    >
      {[10, 20, 30, 40, 50].map((size) => (
        <option key={size} value={size}>
          Show {size}
        </option>
      ))}
      <option value={Infinity}>Show All</option>
    </select>
  )
}

function UseQueryApp() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const pageSizeQueryKey =
    pagination.pageSize === Infinity ? 'all' : pagination.pageSize
  const dataQuery = useQuery({
    queryKey: [
      'people',
      'offset',
      pagination.pageIndex,
      pageSizeQueryKey,
      sorting,
      globalFilter,
    ],
    queryFn: () => fetchData({ pagination, sorting, globalFilter }),
    placeholderData: keepPreviousData,
  })
  const table = useTable(
    {
      key: 'with-tanstack-query-offset',
      features,
      columns,
      data: dataQuery.data?.rows ?? defaultData,
      rowCount: dataQuery.data?.rowCount,
      getRowId: (row) => String(row.id),
      state: { sorting, globalFilter, pagination },
      onSortingChange: (updater) => {
        setSorting(updater)
        setPagination((previous) => ({ ...previous, pageIndex: 0 }))
      },
      onGlobalFilterChange: (updater) => {
        setGlobalFilter(updater)
        setPagination((previous) => ({ ...previous, pageIndex: 0 }))
      },
      onPaginationChange: setPagination,
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
    },
    (state) => state,
  )

  useTanStackTableDevtools(table)

  return (
    <div>
      <input
        aria-label="Search useQuery data"
        value={globalFilter}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        className="summary-panel"
        placeholder="Search all columns..."
      />
      <div className="spacer-sm" />
      <PersonTable table={table} />
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
          disabled={!table.getCanLastPage()}
        >
          {'>>'}
        </button>
        <span className="inline-controls">
          <span>Page</span>
          <strong data-testid="offset-page-number">
            {(pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="inline-controls">
          | Go to page:
          <input
            aria-label="Go to useQuery page"
            type="number"
            min="1"
            max={table.getPageCount()}
            value={pagination.pageIndex + 1}
            onChange={(event) =>
              table.setPageIndex(
                event.target.value ? Number(event.target.value) - 1 : 0,
              )
            }
            className="page-size-input"
          />
        </span>
        <PageSizeSelect
          pageSize={pagination.pageSize}
          onChange={(pageSize) => table.setPageSize(pageSize)}
        />
        {dataQuery.isFetching ? 'Loading...' : null}
      </div>
      <div data-testid="offset-status">
        Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
        {dataQuery.data?.rowCount.toLocaleString() ?? 0} rows
      </div>
      <pre data-testid="use-query-table-state">
        {JSON.stringify(table.state, null, 2)}
      </pre>
    </div>
  )
}

function UseInfiniteQueryApp() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const pageSizeQueryKey =
    pagination.pageSize === Infinity ? 'all' : pagination.pageSize
  const dataQuery = useInfiniteQuery({
    queryKey: ['people', 'cursor', pageSizeQueryKey, sorting, globalFilter],
    queryFn: ({ pageParam }) =>
      fetchInfiniteData({
        cursor: pageParam,
        pageSize: pagination.pageSize,
        sorting,
        globalFilter,
      }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
  const currentPage = dataQuery.data?.pages[pagination.pageIndex]
  const canNextPage =
    Boolean(dataQuery.data?.pages[pagination.pageIndex + 1]) ||
    Boolean(currentPage?.hasNextPage)
  const table = useTable(
    {
      key: 'with-tanstack-query-cursor',
      features,
      columns,
      data: currentPage?.rows ?? defaultData,
      pageCount: -1,
      getRowId: (row) => String(row.id),
      state: { sorting, globalFilter, pagination },
      onSortingChange: (updater) => {
        setSorting(updater)
        setPagination((previous) => ({ ...previous, pageIndex: 0 }))
      },
      onGlobalFilterChange: (updater) => {
        setGlobalFilter(updater)
        setPagination((previous) => ({ ...previous, pageIndex: 0 }))
      },
      onPaginationChange: setPagination,
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
    },
    (state) => state,
  )

  useTanStackTableDevtools(table)

  const goToNextPage = async () => {
    const nextPageIndex = pagination.pageIndex + 1
    if (dataQuery.data?.pages[nextPageIndex]) return table.nextPage()
    if (!currentPage?.hasNextPage || dataQuery.isFetchingNextPage) return
    const result = await dataQuery.fetchNextPage()
    if (result.data?.pages[nextPageIndex]) table.nextPage()
  }

  return (
    <div>
      <input
        aria-label="Search useInfiniteQuery data"
        value={globalFilter}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        className="summary-panel"
        placeholder="Search all columns..."
      />
      <div className="spacer-sm" />
      <PersonTable table={table} />
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
          onClick={goToNextPage}
          disabled={!canNextPage || dataQuery.isFetchingNextPage}
        >
          {'>'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanLastPage()}
          title="The last page is unavailable when the page count is unknown"
        >
          {'>>'}
        </button>
        <span className="inline-controls">
          <span>Page</span>
          <strong data-testid="cursor-page-number">
            {(pagination.pageIndex + 1).toLocaleString()}
          </strong>
        </span>
        <PageSizeSelect
          pageSize={pagination.pageSize}
          onChange={(pageSize) => setPagination({ pageIndex: 0, pageSize })}
        />
        {dataQuery.isFetching ? 'Loading...' : null}
      </div>
      <div data-testid="cursor-status">
        Showing {table.getRowModel().rows.length.toLocaleString()} rows.{' '}
        {currentPage?.nextCursor === undefined
          ? 'No next cursor'
          : `Next cursor: ${currentPage.nextCursor}`}
      </div>
      <pre data-testid="use-infinite-query-table-state">
        {JSON.stringify(table.state, null, 2)}
      </pre>
    </div>
  )
}

function App() {
  return (
    <main className="demo-root">
      <section className="query-example" data-testid="use-query-example">
        <h1>useQuery</h1>
        <p>Page-index pagination with a known total row count.</p>
        <UseQueryApp />
      </section>
      <section
        className="query-example"
        data-testid="use-infinite-query-example"
      >
        <h1>useInfiniteQuery</h1>
        <p>
          Cursor pagination with an unknown total. Each next cursor is the last
          row ID from the current page.
        </p>
        <UseInfiniteQueryApp />
      </section>
    </main>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <TanStackDevtools
        plugins={[
          tableDevtoolsPlugin(),
          {
            name: 'TanStack Query',
            render: <ReactQueryDevtoolsPanel />,
          },
        ]}
      />
    </QueryClientProvider>
  </React.StrictMode>,
)
