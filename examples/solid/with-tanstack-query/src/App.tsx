import { For, createSignal } from 'solid-js'
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/solid-query'
import {
  FlexRender,
  columnFilteringFeature,
  createColumnHelper,
  createTable,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/solid-table'
import { useTanStackTableDevtools } from '@tanstack/solid-table-devtools'
import { fetchData, fetchInfiniteData } from './fetchData'
import type {
  PaginationState,
  SolidTable,
  SortingState,
} from '@tanstack/solid-table'
import type { Person } from './fetchData'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  // Server-side filtering, sorting, and pagination do not need client row models.
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

const defaultData: Array<Person> = []

function PersonTable(props: { table: SolidTable<typeof features, Person> }) {
  return (
    <table>
      <thead>
        <For each={props.table.getHeaderGroups()}>
          {(headerGroup) => (
            <tr>
              <For each={headerGroup.headers}>
                {(header) => (
                  <th colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        class={
                          header.column.getCanSort() ? 'sortable-header' : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <FlexRender header={header} />
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                )}
              </For>
            </tr>
          )}
        </For>
      </thead>
      <tbody>
        <For each={props.table.getRowModel().rows}>
          {(row) => (
            <tr>
              <For each={row.getAllCells()}>
                {(cell) => (
                  <td>
                    <FlexRender cell={cell} />
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  )
}

function PageSizeSelect(props: {
  pageSize: number
  onChange: (pageSize: number) => void
}) {
  return (
    <select
      aria-label="Rows per page"
      value={props.pageSize}
      onChange={(event) => props.onChange(Number(event.currentTarget.value))}
    >
      <For each={[10, 20, 30, 40, 50]}>
        {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
      </For>
      <option value={Infinity}>Show All</option>
    </select>
  )
}

function UseQueryApp() {
  const [sorting, setSorting] = createSignal<SortingState>([])
  const [globalFilter, setGlobalFilter] = createSignal('')
  const [pagination, setPagination] = createSignal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const dataQuery = useQuery(() => ({
    queryKey: [
      'people',
      'offset',
      pagination().pageIndex,
      pagination().pageSize === Infinity ? 'all' : pagination().pageSize,
      sorting(),
      globalFilter(),
    ],
    queryFn: () =>
      fetchData({
        pagination: pagination(),
        sorting: sorting(),
        globalFilter: globalFilter(),
      }),
    placeholderData: keepPreviousData,
  }))

  const table = createTable({
    key: 'with-tanstack-query-offset',
    features,
    columns,
    get data() {
      return dataQuery.data?.rows ?? defaultData
    },
    get rowCount() {
      return dataQuery.data?.rowCount
    },
    getRowId: (row) => String(row.id),
    state: {
      get sorting() {
        return sorting()
      },
      get globalFilter() {
        return globalFilter()
      },
      get pagination() {
        return pagination()
      },
    },
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
  })

  useTanStackTableDevtools(table)

  return (
    <div>
      <input
        aria-label="Search useQuery data"
        value={globalFilter()}
        onInput={(event) => table.setGlobalFilter(event.currentTarget.value)}
        class="summary-panel"
        placeholder="Search all columns..."
      />
      <div class="spacer-sm" />
      <PersonTable table={table} />
      <div class="spacer-sm" />
      <div class="controls">
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanLastPage()}
        >
          {'>>'}
        </button>
        <span class="inline-controls">
          <span>Page</span>
          <strong data-testid="offset-page-number">
            {(pagination().pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="inline-controls">
          | Go to page:
          <input
            aria-label="Go to useQuery page"
            type="number"
            min="1"
            max={table.getPageCount()}
            value={pagination().pageIndex + 1}
            onInput={(event) =>
              table.setPageIndex(
                event.currentTarget.value
                  ? Number(event.currentTarget.value) - 1
                  : 0,
              )
            }
            class="page-size-input"
          />
        </span>
        <PageSizeSelect
          pageSize={pagination().pageSize}
          onChange={(pageSize) => table.setPageSize(pageSize)}
        />
        {dataQuery.isFetching ? 'Loading...' : null}
      </div>
      <div data-testid="offset-status">
        Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
        {dataQuery.data?.rowCount.toLocaleString() ?? 0} rows
      </div>
      <pre data-testid="use-query-table-state">
        {JSON.stringify(table.store.get(), null, 2)}
      </pre>
    </div>
  )
}

function UseInfiniteQueryApp() {
  const [sorting, setSorting] = createSignal<SortingState>([])
  const [globalFilter, setGlobalFilter] = createSignal('')
  const [pagination, setPagination] = createSignal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const dataQuery = useInfiniteQuery(() => ({
    queryKey: [
      'people',
      'cursor',
      pagination().pageSize === Infinity ? 'all' : pagination().pageSize,
      sorting(),
      globalFilter(),
    ],
    queryFn: ({ pageParam }) =>
      fetchInfiniteData({
        cursor: pageParam,
        pageSize: pagination().pageSize,
        sorting: sorting(),
        globalFilter: globalFilter(),
      }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }))
  const currentPage = () => dataQuery.data?.pages[pagination().pageIndex]
  const canNextPage = () =>
    Boolean(dataQuery.data?.pages[pagination().pageIndex + 1]) ||
    Boolean(currentPage()?.hasNextPage)

  const table = createTable({
    key: 'with-tanstack-query-cursor',
    features,
    columns,
    get data() {
      return currentPage()?.rows ?? defaultData
    },
    pageCount: -1,
    getRowId: (row) => String(row.id),
    state: {
      get sorting() {
        return sorting()
      },
      get globalFilter() {
        return globalFilter()
      },
      get pagination() {
        return pagination()
      },
    },
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
  })

  useTanStackTableDevtools(table)

  const goToNextPage = async () => {
    const nextPageIndex = pagination().pageIndex + 1
    if (dataQuery.data?.pages[nextPageIndex]) return table.nextPage()
    if (!currentPage()?.hasNextPage || dataQuery.isFetchingNextPage) return
    const result = await dataQuery.fetchNextPage()
    if (result.data?.pages[nextPageIndex]) table.nextPage()
  }

  return (
    <div>
      <input
        aria-label="Search useInfiniteQuery data"
        value={globalFilter()}
        onInput={(event) => table.setGlobalFilter(event.currentTarget.value)}
        class="summary-panel"
        placeholder="Search all columns..."
      />
      <div class="spacer-sm" />
      <PersonTable table={table} />
      <div class="spacer-sm" />
      <div class="controls">
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={goToNextPage}
          disabled={!canNextPage() || dataQuery.isFetchingNextPage}
        >
          {'>'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanLastPage()}
          title="The last page is unavailable when the page count is unknown"
        >
          {'>>'}
        </button>
        <span class="inline-controls">
          <span>Page</span>
          <strong data-testid="cursor-page-number">
            {(pagination().pageIndex + 1).toLocaleString()}
          </strong>
        </span>
        <PageSizeSelect
          pageSize={pagination().pageSize}
          onChange={(pageSize) => setPagination({ pageIndex: 0, pageSize })}
        />
        {dataQuery.isFetching ? 'Loading...' : null}
      </div>
      <div data-testid="cursor-status">
        Showing {table.getRowModel().rows.length.toLocaleString()} rows.{' '}
        {currentPage()?.nextCursor === undefined
          ? 'No next cursor'
          : `Next cursor: ${currentPage()?.nextCursor}`}
      </div>
      <pre data-testid="use-infinite-query-table-state">
        {JSON.stringify(table.store.get(), null, 2)}
      </pre>
    </div>
  )
}

export default function App() {
  return (
    <main class="demo-root">
      <section class="query-example" data-testid="use-query-example">
        <h1>useQuery</h1>
        <p>Page-index pagination with a known total row count.</p>
        <UseQueryApp />
      </section>
      <section class="query-example" data-testid="use-infinite-query-example">
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
