import { computed, defineComponent, ref } from 'vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { useTable } from '@tanstack/vue-table'
import { fetchInfiniteData } from './fetchData'
import { PageSizeSelect, PersonTable, columns, features } from './table'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/vue-table'
import type { Person } from './fetchData'

const defaultData: Array<Person> = []

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (old: T) => T)(previous)
    : updater
}

export const UseInfiniteQueryApp = defineComponent({
  name: 'UseInfiniteQueryApp',
  setup() {
    const sorting = ref<SortingState>([])
    const globalFilter = ref('')
    const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })
    const dataQuery = useInfiniteQuery(() => ({
      queryKey: [
        'people',
        'cursor',
        pagination.value.pageSize === Infinity
          ? 'all'
          : pagination.value.pageSize,
        sorting.value,
        globalFilter.value,
      ],
      queryFn: ({ pageParam }) =>
        fetchInfiniteData({
          cursor: pageParam,
          pageSize: pagination.value.pageSize,
          sorting: sorting.value,
          globalFilter: globalFilter.value,
        }),
      initialPageParam: null as number | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }))
    const currentPage = computed(
      () => dataQuery.data.value?.pages[pagination.value.pageIndex],
    )
    const tableData = computed(() => currentPage.value?.rows ?? defaultData)
    const canNextPage = computed(
      () =>
        Boolean(dataQuery.data.value?.pages[pagination.value.pageIndex + 1]) ||
        Boolean(currentPage.value?.hasNextPage),
    )
    const table = useTable({
      features,
      columns,
      data: tableData,
      pageCount: -1,
      getRowId: (row: Person) => String(row.id),
      state: {
        get sorting() {
          return sorting.value
        },
        get globalFilter() {
          return globalFilter.value
        },
        get pagination() {
          return pagination.value
        },
      },
      onSortingChange: (updater) => {
        sorting.value = resolveUpdater(updater, sorting.value)
        pagination.value = { ...pagination.value, pageIndex: 0 }
      },
      onGlobalFilterChange: (updater) => {
        globalFilter.value = resolveUpdater(updater, globalFilter.value)
        pagination.value = { ...pagination.value, pageIndex: 0 }
      },
      onPaginationChange: (updater) => {
        pagination.value = resolveUpdater(updater, pagination.value)
      },
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
    })

    const goToNextPage = async () => {
      const nextPageIndex = pagination.value.pageIndex + 1
      if (dataQuery.data.value?.pages[nextPageIndex]) return table.nextPage()
      if (!currentPage.value?.hasNextPage || dataQuery.isFetchingNextPage.value)
        return
      const result = await dataQuery.fetchNextPage()
      if (result.data?.pages[nextPageIndex]) table.nextPage()
    }

    return () => (
      <div>
        <input
          aria-label="Search useInfiniteQuery data"
          value={globalFilter.value}
          onInput={(event: Event) =>
            table.setGlobalFilter(
              (event.currentTarget as HTMLInputElement).value,
            )
          }
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
            disabled={!canNextPage.value || dataQuery.isFetchingNextPage.value}
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
              {(pagination.value.pageIndex + 1).toLocaleString()}
            </strong>
          </span>
          <PageSizeSelect
            pageSize={pagination.value.pageSize}
            onPageSizeChange={(pageSize) => {
              pagination.value = { pageIndex: 0, pageSize }
            }}
          />
          {dataQuery.isFetching.value ? 'Loading...' : null}
        </div>
        <div data-testid="cursor-status">
          Showing {table.getRowModel().rows.length.toLocaleString()} rows.{' '}
          {currentPage.value?.nextCursor === undefined
            ? 'No next cursor'
            : `Next cursor: ${currentPage.value.nextCursor}`}
        </div>
        <pre data-testid="use-infinite-query-table-state">
          {JSON.stringify(table.store.get(), null, 2)}
        </pre>
      </div>
    )
  },
})
