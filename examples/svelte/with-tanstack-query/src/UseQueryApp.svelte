<script lang="ts">
  import { createQuery, keepPreviousData } from '@tanstack/svelte-query'
  import { createTable } from '@tanstack/svelte-table'
  import PageSizeSelect from './PageSizeSelect.svelte'
  import PersonTable from './PersonTable.svelte'
  import { fetchData } from './fetchData'
  import { columns, features } from './table'
  import type { PaginationState, SortingState } from '@tanstack/svelte-table'
  import type { Person } from './fetchData'

  let sorting = $state<SortingState>([])
  let globalFilter = $state('')
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const defaultData: Array<Person> = []

  const dataQuery = createQuery(() => ({
    queryKey: [
      'people',
      'offset',
      pagination.pageIndex,
      pagination.pageSize === Infinity ? 'all' : pagination.pageSize,
      sorting,
      globalFilter,
    ],
    queryFn: () => fetchData({ pagination, sorting, globalFilter }),
    placeholderData: keepPreviousData,
  }))

  const table = createTable({
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
</script>

<div>
  <input
    aria-label="Search useQuery data"
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
      onclick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}>{'>'}</button
    >
    <button
      class="demo-button demo-button-sm"
      onclick={() => table.lastPage()}
      disabled={!table.getCanLastPage()}>{'>>'}</button
    >
    <span class="inline-controls"
      ><span>Page</span><strong data-testid="offset-page-number"
        >{(pagination.pageIndex + 1).toLocaleString()} of {table
          .getPageCount()
          .toLocaleString()}</strong
      ></span
    >
    <span class="inline-controls"
      >| Go to page:<input
        aria-label="Go to useQuery page"
        type="number"
        min="1"
        max={table.getPageCount()}
        value={pagination.pageIndex + 1}
        oninput={(event) =>
          table.setPageIndex(
            event.currentTarget.value
              ? Number(event.currentTarget.value) - 1
              : 0,
          )}
        class="page-size-input"
      /></span
    >
    <PageSizeSelect
      pageSize={pagination.pageSize}
      onPageSizeChange={(pageSize) => table.setPageSize(pageSize)}
    />
    {#if dataQuery.isFetching}Loading...{/if}
  </div>
  <div data-testid="offset-status">
    Showing {table.getRowModel().rows.length.toLocaleString()} of {dataQuery.data?.rowCount.toLocaleString() ??
      0} rows
  </div>
  <pre data-testid="use-query-table-state">{JSON.stringify(
      table.store.get(),
      null,
      2,
    )}</pre>
</div>
