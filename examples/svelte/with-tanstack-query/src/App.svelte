<script lang="ts">
  import { createQuery, keepPreviousData } from '@tanstack/svelte-query'
  import {
    createColumnHelper,
    createTable,
    FlexRender,
    rowPaginationFeature,
    Subscribe,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import type { PaginationState } from '@tanstack/svelte-table'
  import { fetchData } from './fetchData'
  import type { Person } from './fetchData'
  import './index.css'

  const _features = tableFeatures({
    rowPaginationFeature,
  })

  const columnHelper = createColumnHelper<typeof _features, Person>()

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

  let pagination: PaginationState = $state({ pageIndex: 0, pageSize: 10 })

  const defaultData: Array<Person> = []

  const dataQuery = createQuery<{
    rows: Array<Person>
    pageCount: number
    rowCount: number
  }>(() => ({
    queryKey: ['data', pagination],
    queryFn: () => fetchData(pagination),
    placeholderData: keepPreviousData,
  }))

  const table = createTable(
    {
      _features,
      _rowModels: {},
      columns,
      get data() {
        return dataQuery.data?.rows ?? defaultData
      },
      get rowCount() {
        return dataQuery.data?.rowCount
      },
      state: {
        get pagination() {
          return pagination
        },
      },
      onPaginationChange: (updater) => {
        pagination =
          typeof updater === 'function' ? updater(pagination) : updater
      },
      manualPagination: true,
      debugTable: true,
    },
    (state) => state,
  )
</script>

<div class="p-2">
  <div class="h-2"></div>
  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <tr>
          {#each headerGroup.headers as header (header.id)}
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
                <FlexRender header={header} />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each table.getRowModel().rows as row (row.id)}
        <tr>
          {#each row.getAllCells() as cell (cell.id)}
            <td>
              <FlexRender cell={cell} />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <div class="h-2"></div>
  <div class="flex items-center gap-2">
    <button
      class="border rounded p-1"
      onclick={() => table.firstPage()}
      disabled={!table.getCanPreviousPage()}
    >
      {'<<'}
    </button>
    <button
      class="border rounded p-1"
      onclick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      {'<'}
    </button>
    <button
      class="border rounded p-1"
      onclick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      {'>'}
    </button>
    <button
      class="border rounded p-1"
      onclick={() => table.lastPage()}
      disabled={!table.getCanNextPage()}
    >
      {'>>'}
    </button>
    <span class="flex items-center gap-1">
      <div>Page</div>
      <strong>
        {pagination.pageIndex + 1} of{' '}
        {table.getPageCount().toLocaleString()}
      </strong>
    </span>
    <span class="flex items-center gap-1">
      | Go to page:
      <input
        type="number"
        min="1"
        max={table.getPageCount()}
        value={pagination.pageIndex + 1}
        oninput={(e: Event) => {
          const page = (e.target as HTMLInputElement).value
            ? Number((e.target as HTMLInputElement).value) - 1
            : 0
          table.setPageIndex(page)
        }}
        class="border p-1 rounded w-16"
      />
    </span>
    <select
      value={pagination.pageSize}
      onchange={(e: Event) => {
        table.setPageSize(Number((e.target as HTMLSelectElement).value))
      }}
    >
      {#each [10, 20, 30, 40, 50] as pageSize}
        <option value={pageSize}>Show {pageSize}</option>
      {/each}
    </select>
    {#if dataQuery.isFetching}
      Loading...
    {/if}
  </div>
  <div>
    Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
    {dataQuery.data?.rowCount?.toLocaleString() ?? 0} Rows
  </div>
  <Subscribe selector={(state) => state} {table}>
    {#snippet children(state)}
      <pre>{JSON.stringify(state, null, 2)}</pre>
    {/snippet}
  </Subscribe>
</div>
