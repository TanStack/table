import {
  FlexRender,
  columnSizingFeature,
  createColumnHelper,
  createSortedRowModel,
  createTable,
  getInitialTableState,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/solid-query'
import { createStore, useSelector } from '@tanstack/solid-store'
import { createVirtualizer } from '@tanstack/solid-virtual'
import { For, Show, createMemo, onMount } from 'solid-js'
import { fetchData } from './makeData'
import type { Person, PersonApiResponse } from './makeData'
import type { Virtualizer } from '@tanstack/solid-virtual'

const fetchSize = 50

const _features = tableFeatures({ columnSizingFeature, rowSortingFeature })

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: 'ID',
    size: 60,
  }),
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    size: 50,
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
    size: 50,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    size: 80,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => info.getValue<Date>().toLocaleString(),
    size: 200,
  }),
])

// Use an external store to avoid the infinite loop that occurs when createTable's
// internal createComputed cascades signal writes during async query resolution.
// This matches the pattern used in the with-tanstack-query example.
const tableStore = createStore(
  getInitialTableState(_features, {
    sorting: [],
  }),
)

function App() {
  let tableContainerRef: HTMLDivElement | undefined

  const state = useSelector(tableStore)

  const query = useInfiniteQuery<PersonApiResponse>(() => ({
    queryKey: ['people', state().sorting],
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) * fetchSize
      return fetchData(start, fetchSize, state().sorting)
    },
    initialPageParam: 0,
    getNextPageParam: (
      _lastGroup: PersonApiResponse,
      groups: Array<PersonApiResponse>,
    ) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  }))

  const flatData = createMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
  )
  const totalDBRowCount = () => query.data?.pages[0]?.meta?.totalRowCount ?? 0
  const totalFetched = () => flatData().length

  const fetchMoreOnBottomReached = (
    containerRefElement?: HTMLDivElement | null,
  ) => {
    if (containerRefElement) {
      const { scrollHeight, scrollTop, clientHeight } = containerRefElement
      if (
        scrollHeight - scrollTop - clientHeight < 500 &&
        !query.isFetching &&
        totalFetched() < totalDBRowCount()
      ) {
        void query.fetchNextPage()
      }
    }
  }

  // Check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  onMount(() => {
    fetchMoreOnBottomReached(tableContainerRef)
  })

  // Declare before table so the onSortingChange closure can reference it
  let rowVirtualizer!: Virtualizer<HTMLDivElement, HTMLTableRowElement>

  const table = createTable({
    _features,
    _rowModels: { sortedRowModel: createSortedRowModel(sortFns) },
    get data() {
      return flatData()
    },
    columns,
    store: tableStore,
    manualSorting: true,
    debugTable: true,
  })

  const rows = () => table.getRowModel().rows

  // Important: The virtualizer and the scroll container ref must be in the same
  // component scope, and NOT inside a <Show> wrapper. <Show> creates a reactive
  // boundary that disrupts the virtualizer's onMount timing.
  rowVirtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    get count() {
      return rows().length
    },
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef ?? null,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  return (
    <div class="app">
      <Show when={import.meta.env.DEV}>
        <p>
          <strong>Notice:</strong> You are currently running Solid in
          development mode. Virtualized rendering performance will be slightly
          degraded until this application is built for production.
        </p>
      </Show>
      ({totalFetched()} of {totalDBRowCount()} rows fetched)
      <div
        class="container"
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
        ref={tableContainerRef}
        style={{
          overflow: 'auto',
          position: 'relative',
          height: '600px',
        }}
      >
        <table style={{ display: 'grid' }}>
          <thead
            style={{
              display: 'grid',
              position: 'sticky',
              top: '0px',
              'z-index': 1,
            }}
          >
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr style={{ display: 'flex', width: '100%' }}>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th
                        style={{
                          display: 'flex',
                          width: `${header.getSize()}px`,
                        }}
                      >
                        <div
                          class={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <FlexRender header={header} />
                          {(
                            {
                              asc: ' 🔼',
                              desc: ' 🔽',
                            } as Record<string, string>
                          )[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody
            style={{
              display: 'grid',
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            <For each={rowVirtualizer.getVirtualItems()}>
              {(virtualRow) => {
                const row = rows()[virtualRow.index]
                return (
                  <tr
                    data-index={virtualRow.index}
                    ref={(node) => rowVirtualizer.measureElement(node)}
                    style={{
                      display: 'flex',
                      position: 'absolute',
                      transform: `translateY(${virtualRow.start}px)`,
                      width: '100%',
                    }}
                  >
                    <For each={row.getAllCells()}>
                      {(cell) => (
                        <td
                          style={{
                            display: 'flex',
                            width: `${cell.column.getSize()}px`,
                          }}
                        >
                          <FlexRender cell={cell} />
                        </td>
                      )}
                    </For>
                  </tr>
                )
              }}
            </For>
          </tbody>
        </table>
      </div>
      <Show when={query.isFetching}>
        <div>Fetching More...</div>
      </Show>
    </div>
  )
}

export default App
