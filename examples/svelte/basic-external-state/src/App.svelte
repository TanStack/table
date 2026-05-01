<script lang="ts">
  // This example demonstrates managing table state externally via Svelte's createTableState
  // instead of letting the table manage its own state internally.

  import {
    createColumnHelper,
    createPaginatedRowModel,
    createSortedRowModel,
    createTable,
    createTableState,
    FlexRender,
    rowPaginationFeature,
    rowSortingFeature,
    sortFns,
    tableFeatures,
  } from '@tanstack/svelte-table'
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

  let data = $state(makeData(1_000))
  const refreshData = () => { data = makeData(1_000) }
  const stressTest = () => { data = makeData(100_000) }

  const [sorting, setSorting] = createTableState<SortingState>([])
  const [pagination, setPagination] = createTableState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = createTable({
    debugTable: true,
    _features,
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns,
    get data() {
      return data
    },
    state: {
      get sorting() {
        return sorting()
      },
      get pagination() {
        return pagination()
      },
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  })
</script>

<div class="demo-root">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (100k rows)</button>
  </div>
  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)
      }
        <tr>
          {#each headerGroup.headers as header (header.id)}
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
                <div
                  class={header.column.getCanSort()
                    ? 'sortable-header'
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
  <div class="spacer-sm"></div>
  <div class="controls">
    <button
      class="demo-button demo-button-sm"
      onclick={() => table.setPageIndex(0)
      }
      disabled={!table.getCanPreviousPage()}
    >
      {'<<'}
    </button>
    <button
      class="demo-button demo-button-sm"
      onclick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      {'<'}
    </button>
    <button
      class="demo-button demo-button-sm"
      onclick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      {'>'}
    </button>
    <button
      class="demo-button demo-button-sm"
      onclick={() => table.setPageIndex(table.getPageCount() - 1)}
      disabled={!table.getCanNextPage()}
    >
      {'>>'}
    </button>
    <span class="inline-controls">
      <div>Page</div>
      <strong>
        {(pagination().pageIndex + 1).toLocaleString()} of {table.getPageCount().toLocaleString()}
      </strong>
    </span>
    <span class="inline-controls">
      | Go to page:
      <input
        type="number"
        min="1"
        max={table.getPageCount()}
        value={pagination().pageIndex + 1}
        oninput={(e) => {
          const page = e.currentTarget.value
            ? Number(e.currentTarget.value) - 1
            : 0
          table.setPageIndex(page)
        }}
        class="page-size-input"
      />
    </span>
    <select
      value={pagination().pageSize}
      onchange={(e) => {
        table.setPageSize(Number(e.currentTarget.value))
      }}
    >
      {#each [10, 20, 30, 40, 50] as pageSize}
        <option value={pageSize}>Show {pageSize}</option>
      {/each}
    </select>
  </div>
  <div class="spacer-md"></div>
  <pre>
    {JSON.stringify(
      { sorting: sorting(), pagination: pagination() },
      null,
      2,
    )}
  </pre>
</div>
