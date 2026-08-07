import { computed, defineComponent, ref } from 'vue'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { useTable } from '@tanstack/vue-table'
import { useTanStackTableDevtools } from '@tanstack/vue-table-devtools'
import { fetchData } from './fetchData'
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

export const UseQueryApp = defineComponent({
  name: 'UseQueryApp',
  setup() {
    const sorting = ref<SortingState>([])
    const globalFilter = ref('')
    const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })
    const dataQuery = useQuery(() => ({
      queryKey: [
        'people',
        'offset',
        pagination.value.pageIndex,
        pagination.value.pageSize === Infinity
          ? 'all'
          : pagination.value.pageSize,
        sorting.value,
        globalFilter.value,
      ],
      queryFn: () =>
        fetchData({
          pagination: pagination.value,
          sorting: sorting.value,
          globalFilter: globalFilter.value,
        }),
      placeholderData: keepPreviousData,
    }))
    const tableData = computed(() => dataQuery.data.value?.rows ?? defaultData)
    const rowCount = computed(() => dataQuery.data.value?.rowCount)
    const table = useTable({
      key: 'with-tanstack-query-offset',
      features,
      columns,
      data: tableData,
      rowCount,
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

    useTanStackTableDevtools(table)

    return () => (
      <div>
        <input
          aria-label="Search useQuery data"
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
              {(pagination.value.pageIndex + 1).toLocaleString()} of{' '}
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
              value={pagination.value.pageIndex + 1}
              onInput={(event: Event) => {
                const value = (event.currentTarget as HTMLInputElement).value
                table.setPageIndex(value ? Number(value) - 1 : 0)
              }}
              class="page-size-input"
            />
          </span>
          <PageSizeSelect
            pageSize={pagination.value.pageSize}
            onPageSizeChange={(pageSize) => table.setPageSize(pageSize)}
          />
          {dataQuery.isFetching.value ? 'Loading...' : null}
        </div>
        <div data-testid="offset-status">
          Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
          {dataQuery.data.value?.rowCount.toLocaleString() ?? 0} rows
        </div>
        <pre data-testid="use-query-table-state">
          {JSON.stringify(table.store.get(), null, 2)}
        </pre>
      </div>
    )
  },
})
