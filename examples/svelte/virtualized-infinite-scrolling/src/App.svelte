<script lang="ts">
  import {
    FlexRender,
    columnSizingFeature,
    createColumnHelper,
    createSortedRowModel,
    createTable,
    rowSortingFeature,
    sortFns,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import {
    createInfiniteQuery,
    keepPreviousData,
  } from '@tanstack/svelte-query'
  import { createVirtualizer } from '@tanstack/svelte-virtual'
  import { get } from 'svelte/store'
  import { onMount } from 'svelte'
  import { fetchData } from './makeData'
  import type { Person, PersonApiResponse } from './makeData'
  import type { SortingState } from '@tanstack/svelte-table'
  import './index.css'

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
      header: 'Last Name',
    }),
    columnHelper.accessor('age', {
      header: 'Age',
      size: 50,
    }),
    columnHelper.accessor('visits', {
      header: 'Visits',
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

  // Manage sorting state externally for the manual sorting + infinite query pattern
  let sorting = $state<SortingState>([])

  let tableContainerRef = $state<HTMLDivElement | undefined>(undefined)

  const query = createInfiniteQuery<PersonApiResponse>(() => ({
    queryKey: ['people', sorting],
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) * fetchSize
      return fetchData(start, fetchSize, sorting)
    },
    initialPageParam: 0,
    getNextPageParam: (
      _lastGroup: PersonApiResponse,
      groups: Array<PersonApiResponse>,
    ) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  }))

  const flatData = $derived(
    query.data?.pages.flatMap((page: PersonApiResponse) => page.data) ?? [],
  )
  const totalDBRowCount = $derived(
    query.data?.pages[0]?.meta?.totalRowCount ?? 0,
  )
  const totalFetched = $derived(flatData.length)

  const fetchMoreOnBottomReached = (
    containerRefElement?: HTMLDivElement | null,
  ) => {
    if (containerRefElement) {
      const { scrollHeight, scrollTop, clientHeight } = containerRefElement
      if (
        scrollHeight - scrollTop - clientHeight < 500 &&
        !query.isFetching &&
        totalFetched < totalDBRowCount
      ) {
        void query.fetchNextPage()
      }
    }
  }

  // Check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  onMount(() => {
    fetchMoreOnBottomReached(tableContainerRef)
  })

  const table = createTable({
    _features,
    _rowModels: { sortedRowModel: createSortedRowModel(sortFns) },
    get data() {
      return flatData
    },
    columns,
    state: {
      get sorting() {
        return sorting
      },
    },
    onSortingChange: (updater) => {
      sorting = typeof updater === 'function' ? updater(sorting) : updater
    },
    manualSorting: true,
    debugTable: true,
  })

  const rows = $derived(table.getRowModel().rows)

  // Important: The virtualizer and the scroll container ref must be in the same component scope.
  const rowVirtualizer = createVirtualizer<
    HTMLDivElement,
    HTMLTableRowElement
  >({
    get count() {
      return rows.length
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

  // When the container ref becomes available, update the virtualizer
  // so it picks up the scroll element and sets up scroll observers.
  $effect(() => {
    if (tableContainerRef) {
      get(rowVirtualizer).setOptions({
        getScrollElement: () => tableContainerRef ?? null,
      })
    }
  })

  // When row count changes (new pages fetched), push the new count to the virtualizer.
  // The svelte-virtual store adapter doesn't reactively track getter options.
  $effect(() => {
    get(rowVirtualizer).setOptions({ count: rows.length })
  })

  // Svelte action to measure dynamic row heights via the virtualizer
  function measureElement(node: HTMLTableRowElement) {
    get(rowVirtualizer).measureElement(node)
  }
</script>

<div class="app">
  {#if import.meta.env.DEV}
    <p>
      <strong>Notice:</strong> You are currently running Svelte in development mode.
      Virtualized rendering performance will be slightly degraded until this
      application is built for production.
    </p>
  {/if}
  ({totalFetched.toLocaleString()} of {totalDBRowCount.toLocaleString()} rows fetched)
  <div
    class="container"
    onscroll={(e) => fetchMoreOnBottomReached(e.currentTarget as HTMLDivElement)}
    bind:this={tableContainerRef}
    style="overflow: auto; position: relative; height: 600px;"
  >
    <table style="display: grid;">
      <thead style="display: grid; position: sticky; top: 0px; z-index: 1;">
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <tr style="display: flex; width: 100%;">
            {#each headerGroup.headers as header (header.id)}
              <th style="display: flex; width: {header.getSize()}px;">
                <div
                  class={header.column.getCanSort()
                    ? 'cursor-pointer select-none'
                    : ''}
                  role="button"
                  tabindex="0"
                  onclick={header.column.getToggleSortingHandler()}
                  onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      header.column.getToggleSortingHandler()?.(e)
                    }
                  }}
                >
                  <FlexRender header={header} />
                  {#if header.column.getIsSorted() === 'asc'}
                    {' '}🔼
                  {:else if header.column.getIsSorted() === 'desc'}
                    {' '}🔽
                  {/if}
                </div>
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody
        style="display: grid; height: {$rowVirtualizer.getTotalSize()}px; position: relative;"
      >
        {#each $rowVirtualizer.getVirtualItems() as virtualRow (virtualRow.index)}
          {@const row = rows[virtualRow.index]}
          <tr
            data-index={virtualRow.index}
            use:measureElement
            style="display: flex; position: absolute; transform: translateY({virtualRow.start}px); width: 100%;"
          >
            {#each row.getAllCells() as cell (cell.id)}
              <td style="display: flex; width: {cell.column.getSize()}px;">
                <FlexRender cell={cell} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if query.isFetching}
    <div>Fetching More...</div>
  {/if}
</div>
