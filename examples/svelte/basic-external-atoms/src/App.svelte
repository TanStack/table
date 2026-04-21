<script lang="ts">
  // This example demonstrates managing individual slices of table state via
  // external TanStack Store atoms. Each atom is a stand-alone, subscribable
  // reactive cell — you can read, write, or subscribe to it from anywhere,
  // which makes it convenient for sharing state across components or modules.

  import {
    createColumnHelper,
    createPaginatedRowModel,
    createSortedRowModel,
    createTable,
    FlexRender,
    rowPaginationFeature,
    rowSortingFeature,
    sortFns,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { createAtom, useSelector } from '@tanstack/svelte-store'
  import { makeData } from './makeData'
  import type { PaginationState, SortingState } from '@tanstack/svelte-table'
  import type { Person } from './makeData'
  import './index.css'

  const _features = tableFeatures({
    rowPaginationFeature,
    rowSortingFeature,
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

  const data = makeData(1000)

  // Create stable external atoms for the individual state slices you want to
  // own. The table still creates internal base atoms for everything else.
  const sortingAtom = createAtom<SortingState>([])
  const paginationAtom = createAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Subscribe to each atom independently — Svelte reactivity via `.current`.
  const sorting = useSelector(sortingAtom)
  const pagination = useSelector(paginationAtom)

  const table = createTable({
    _features,
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns,
    data,
    atoms: {
      sorting: sortingAtom,
      pagination: paginationAtom,
    },
    debugTable: true,
  })
</script>

<div class="p-2">
  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <tr>
          {#each headerGroup.headers as header (header.id)}
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
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
      onclick={() => table.setPageIndex(0)}
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
      onclick={() => table.setPageIndex(table.getPageCount() - 1)}
      disabled={!table.getCanNextPage()}
    >
      {'>>'}
    </button>
    <span class="flex items-center gap-1">
      <div>Page</div>
      <strong>
        {pagination.current.pageIndex + 1} of {table.getPageCount()}
      </strong>
    </span>
    <span class="flex items-center gap-1">
      | Go to page:
      <input
        type="number"
        min="1"
        max={table.getPageCount()}
        value={pagination.current.pageIndex + 1}
        oninput={(e) => {
          const page = (e.target as HTMLInputElement).value
            ? Number((e.target as HTMLInputElement).value) - 1
            : 0
          table.setPageIndex(page)
        }}
        class="border p-1 rounded w-16"
      />
    </span>
    <select
      value={pagination.current.pageSize}
      onchange={(e) => {
        table.setPageSize(Number((e.target as HTMLSelectElement).value))
      }}
    >
      {#each [10, 20, 30, 40, 50] as pageSize}
        <option value={pageSize}>Show {pageSize}</option>
      {/each}
    </select>
  </div>
  <div class="h-4"></div>
  <pre>{JSON.stringify({ sorting: sorting.current, pagination: pagination.current }, null, 2)}</pre>
</div>
