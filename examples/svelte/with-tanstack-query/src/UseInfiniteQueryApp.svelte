<script lang="ts">
  import { onDestroy } from 'svelte'
  import { createInfiniteQuery } from '@tanstack/svelte-query'
  import { createTable } from '@tanstack/svelte-table'
  import { createTableDevtoolsRegistrationManager } from '@tanstack/table-devtools'
  import PageSizeSelect from './PageSizeSelect.svelte'
  import PersonTable from './PersonTable.svelte'
  import { fetchInfiniteData } from './fetchData'
  import { columns, features } from './table'
  import type { PaginationState, SortingState } from '@tanstack/svelte-table'
  import type { Person } from './fetchData'

  let sorting = $state<SortingState>([])
  let globalFilter = $state('')
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const defaultData: Array<Person> = []

  const dataQuery = createInfiniteQuery(() => ({
    queryKey: [
      'people',
      'cursor',
      pagination.pageSize === Infinity ? 'all' : pagination.pageSize,
      sorting,
      globalFilter,
    ],
    queryFn: ({ pageParam }) =>
      fetchInfiniteData({
        cursor: pageParam,
        pageSize: pagination.pageSize,
        sorting,
        globalFilter,
      }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }))
  const currentPage = $derived(dataQuery.data?.pages[pagination.pageIndex])
  const canNextPage = $derived(
    Boolean(dataQuery.data?.pages[pagination.pageIndex + 1]) ||
      Boolean(currentPage?.hasNextPage),
  )

  const table = createTable({
    key: 'with-tanstack-query-cursor',
    features,
    columns,
    get data() {
      return currentPage?.rows ?? defaultData
    },
    pageCount: -1,
    getRowId: (row) => String(row.id),
    state: {
      get sorting() {
        return sorting
      },
      get globalFilter() {
        return globalFilter
      },
      get pagination() {
        return pagination
      },
    },
    onSortingChange: (updater) => {
      sorting = typeof updater === 'function' ? updater(sorting) : updater
      pagination = { ...pagination, pageIndex: 0 }
    },
    onGlobalFilterChange: (updater) => {
      globalFilter =
        typeof updater === 'function' ? updater(globalFilter) : updater
      pagination = { ...pagination, pageIndex: 0 }
    },
    onPaginationChange: (updater) => {
      pagination = typeof updater === 'function' ? updater(pagination) : updater
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
  })

  const tableDevtools = createTableDevtoolsRegistrationManager()
  tableDevtools.update(table)
  onDestroy(() => tableDevtools.dispose())

  async function goToNextPage() {
    const nextPageIndex = pagination.pageIndex + 1
    if (dataQuery.data?.pages[nextPageIndex]) return table.nextPage()
    if (!currentPage?.hasNextPage || dataQuery.isFetchingNextPage) return
    const result = await dataQuery.fetchNextPage()
    if (result.data?.pages[nextPageIndex]) table.nextPage()
  }
</script>

<div>
  <input
    aria-label="Search useInfiniteQuery data"
    value={globalFilter}
    oninput={(event) => table.setGlobalFilter(event.currentTarget.value)}
    class="summary-panel"
    placeholder="Search all columns..."
  />
  <div class="spacer-sm"></div>
  <PersonTable {table} />
  <div class="spacer-sm"></div>
  <div class="controls">
    <button
      class="demo-button demo-button-sm"
      onclick={() => table.firstPage()}
      disabled={!table.getCanPreviousPage()}>{'<<'}</button
    >
    <button
      class="demo-button demo-button-sm"
      onclick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}>{'<'}</button
    >
    <button
      class="demo-button demo-button-sm"
      onclick={goToNextPage}
      disabled={!canNextPage || dataQuery.isFetchingNextPage}>{'>'}</button
    >
    <button
      class="demo-button demo-button-sm"
      onclick={() => table.lastPage()}
      disabled={!table.getCanLastPage()}
      title="The last page is unavailable when the page count is unknown"
      >{'>>'}</button
    >
    <span class="inline-controls"
      ><span>Page</span><strong data-testid="cursor-page-number"
        >{(pagination.pageIndex + 1).toLocaleString()}</strong
      ></span
    >
    <PageSizeSelect
      pageSize={pagination.pageSize}
      onPageSizeChange={(pageSize) => {
        pagination = { pageIndex: 0, pageSize }
      }}
    />
    {#if dataQuery.isFetching}Loading...{/if}
  </div>
  <div data-testid="cursor-status">
    Showing {table.getRowModel().rows.length.toLocaleString()} rows. {currentPage?.nextCursor ===
    undefined
      ? 'No next cursor'
      : `Next cursor: ${currentPage.nextCursor}`}
  </div>
  <pre data-testid="use-infinite-query-table-state">{JSON.stringify(
      table.store.get(),
      null,
      2,
    )}</pre>
</div>
