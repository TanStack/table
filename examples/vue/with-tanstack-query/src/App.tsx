import { computed, defineComponent, ref, watchEffect } from 'vue'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import {
  FlexRender,
  columnFilteringFeature,
  createColumnHelper,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { fetchData } from './fetchData'
import type { Person } from './fetchData'
import type {
  Cell,
  Header,
  HeaderGroup,
  PaginationState,
  Row,
  SortingState,
  Updater,
} from '@tanstack/vue-table'

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

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (old: T) => T)(previous)
    : updater
}

export default defineComponent({
  name: 'WithTanStackQueryExample',
  setup() {
    const sorting = ref<SortingState>([])
    const globalFilter = ref('')
    const pagination = ref<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })
    const defaultData: Array<Person> = []

    const dataQuery = useQuery(() => ({
      queryKey: ['data', pagination.value, sorting.value, globalFilter.value],
      queryFn: () =>
        fetchData({
          pagination: pagination.value,
          sorting: sorting.value,
          globalFilter: globalFilter.value,
        }),
      placeholderData: keepPreviousData,
    }))

    const tableData = computed<Array<Person>>(
      () => dataQuery.data.value?.rows ?? defaultData,
    )

    const rowCount = ref(0)

    watchEffect(() => {
      const nextRowCount = dataQuery.data.value?.rowCount
      if (nextRowCount != null) {
        rowCount.value = nextRowCount
      }
    })

    const table = useTable({
      features,
      columns,
      data: tableData,
      rowCount,
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
      debugTable: true,
    })

    return () => (
      <div class="demo-root">
        <input
          value={globalFilter.value}
          onInput={(event: Event) => {
            const target = event.currentTarget as HTMLInputElement
            table.setGlobalFilter(target.value)
          }}
          class="summary-panel"
          placeholder="Search all columns..."
        />
        <div class="spacer-sm" />
        <table>
          <thead>
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<typeof features, Person>) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<typeof features, Person, unknown>) => (
                      <th key={header.id} colspan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div
                            class={
                              header.column.getCanSort()
                                ? 'sortable-header'
                                : ''
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
                    ),
                  )}
                </tr>
              ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.map((row: Row<typeof features, Person>) => (
                <tr key={row.id}>
                  {row
                    .getAllCells()
                    .map((cell: Cell<typeof features, Person, unknown>) => (
                      <td key={cell.id}>
                        <FlexRender cell={cell} />
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
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
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span class="inline-controls">
            <div>Page</div>
            <strong>
              {(pagination.value.pageIndex + 1).toLocaleString()} of{' '}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span class="inline-controls">
            | Go to page:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              value={pagination.value.pageIndex + 1}
              onInput={(event: Event) => {
                const target = event.currentTarget as HTMLInputElement
                const page = target.value ? Number(target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              class="page-size-input"
            />
          </span>
          <select
            value={pagination.value.pageSize}
            onChange={(event: Event) => {
              const target = event.currentTarget as HTMLSelectElement
              table.setPageSize(Number(target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          {dataQuery.isFetching.value ? 'Loading...' : null}
        </div>
        <div>
          Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
          {dataQuery.data.value?.rowCount.toLocaleString()} Rows
        </div>
        <pre data-testid="table-state">
          {JSON.stringify(table.store.get(), null, 2)}
        </pre>
      </div>
    )
  },
})
