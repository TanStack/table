import { For, Loading, createSignal } from 'solid-js'
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
import { fetchData, fetchInfiniteData } from './fetchData'
import type {
  PaginationState,
  SolidTable,
  SortingState,
} from '@tanstack/solid-table'
import type { InfiniteDataPage, Person } from './fetchData'

const defaultData: Array<Person> = []

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

function PersonTable(props: { table: SolidTable<typeof features, Person> }) {
  return (
    <table>
      <thead>
        <For each={props.table.getHeaderGroups()}>
          {(headerGroup) => (
            <tr>
              <For each={headerGroup.headers}>
                {(header) => (
                  <th colspan={header.colSpan}>
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

  // Query data is async in Solid 2: reads wait under the `<Loading>` boundary
  // in `App` until the first page arrives.
  const dataQuery = useQuery(() => {
    // Read the query inputs here, where they are tracked, not in `queryFn`.
    const variables = {
      pagination: pagination(),
      sorting: sorting(),
      globalFilter: globalFilter(),
    }
    return {
      queryKey: [
        'people',
        'offset',
        variables.pagination.pageIndex,
        variables.pagination.pageSize === Infinity
          ? 'all'
          : variables.pagination.pageSize,
        variables.sorting,
        variables.globalFilter,
      ],
      queryFn: () => fetchData(variables),
      placeholderData: keepPreviousData,
    }
  })

  const table = createTable({
    key: 'with-tanstack-query-offset',
    features,
    columns,
    get data() {
      return dataQuery.data.rows
    },
    get rowCount() {
      return dataQuery.data.rowCount
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
        {dataQuery.data.rowCount.toLocaleString()} rows
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
  const dataQuery = useInfiniteQuery(() => {
    // Read the query inputs here, where they are tracked, not in `queryFn`.
    const variables = {
      pageSize: pagination().pageSize,
      sorting: sorting(),
      globalFilter: globalFilter(),
    }
    return {
      queryKey: [
        'people',
        'cursor',
        variables.pageSize === Infinity ? 'all' : variables.pageSize,
        variables.sorting,
        variables.globalFilter,
      ],
      queryFn: ({ pageParam }: { pageParam: number | null }) =>
        fetchInfiniteData({ cursor: pageParam, ...variables }),
      initialPageParam: null as number | null,
      getNextPageParam: (lastPage: InfiniteDataPage) => lastPage.nextCursor,
    }
  })
  // A page index past the loaded pages has no page yet.
  const pageAt = (index: number): InfiniteDataPage | undefined =>
    dataQuery.data.pages[index]
  const currentPage = () => pageAt(pagination().pageIndex)
  const canNextPage = () =>
    Boolean(pageAt(pagination().pageIndex + 1)) ||
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

  const goToNextPage = async () => {
    const nextPageIndex = pagination().pageIndex + 1
    if (pageAt(nextPageIndex)) return table.nextPage()
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
        <Loading fallback={<p>Loading...</p>}>
          <UseQueryApp />
        </Loading>
      </section>
      <section class="query-example" data-testid="use-infinite-query-example">
        <h1>useInfiniteQuery</h1>
        <p>
          Cursor pagination with an unknown total. Each next cursor is the last
          row ID from the current page.
        </p>
        <Loading fallback={<p>Loading...</p>}>
          <UseInfiniteQueryApp />
        </Loading>
      </section>
    </main>
  )
}
