<script lang="ts">
  import {
    columnFilteringFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    createTable,
    filterFns,
    rowPaginationFeature,
    rowSortingFeature,
    sortFns,
    tableFeatures,
    FlexRender,
  } from '@tanstack/svelte-table'
  import type { Column, Table } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type { Person } from './makeData'
  import './index.css'

  const _features = tableFeatures({
    columnFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
  })

  const columnHelper = createColumnHelper<typeof _features, Person>()

  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      cell: (info) => info.getValue(),
      header: () => 'Last Name',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('visits', {
      header: () => 'Visits',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: (props) => props.column.id,
    }),
  ])

  let data = $state(makeData(1_000))
  const refreshData = () => { data = makeData(1_000) }
  const stressTest = () => { data = makeData(100_000) }

  const table = createTable(
    {
      _features,
      _rowModels: {
        sortedRowModel: createSortedRowModel(sortFns),
        filteredRowModel: createFilteredRowModel(filterFns),
        paginatedRowModel: createPaginatedRowModel(),
      },
      columns,
      get data() {
        return data
      },
      debugTable: true,
    },
    (state) => state,
  )

  function getFilterValue(column: Column<typeof _features, Person>): unknown {
    return column.getFilterValue()
  }

  function getFirstValue(
    table: Table<typeof _features, Person>,
    columnId: string,
  ): unknown {
    return table.getPreFilteredRowModel().flatRows[0]?.getValue(columnId)
  }
</script>

{#snippet filterSnippet(column: Column<typeof _features, Person>)}
  {@const firstValue = getFirstValue(table, column.id)}
  {@const filterValue = getFilterValue(column)}
  {#if typeof firstValue === 'number'}
    <div class="filter-row">
      <input
        type="number"
        value={((filterValue as [number, number] | undefined)?.[0] ?? '') as any}
        oninput={(e: Event) =>
          column.setFilterValue((old: [number, number]) => [
            (e.target as HTMLInputElement).value,
            old?.[1],
          ])}
        placeholder="Min"
        class="filter-input"
      />
      <input
        type="number"
        value={((filterValue as [number, number] | undefined)?.[1] ?? '') as any}
        oninput={(e: Event) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            (e.target as HTMLInputElement).value,
          ])}
        placeholder="Max"
        class="filter-input"
      />
    </div>
  {:else}
    <input
      class="filter-select"
      oninput={(e: Event) =>
        column.setFilterValue((e.target as HTMLInputElement).value)}
      onclick={(e: MouseEvent) => e.stopPropagation()}
      placeholder="Search..."
      type="text"
      value={(filterValue ?? '') as string}
    />
  {/if}
{/snippet}

<div class="demo-root">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (100k rows)</button>
  </div>
  <div class="spacer-sm"></div>
  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)
      }
        <tr>
          {#each headerGroup.headers as header (header.id)}
            <th colSpan={header.colSpan}>
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
                {#if !header.isPlaceholder}
                  <FlexRender header={header} />
                {/if}
                {#if header.column.getIsSorted() === 'asc'}
                  {' '}🔼
                {:else if header.column.getIsSorted() === 'desc'}
                  {' '}🔽
                {/if}
                {#if header.column.getCanFilter()}
                  <div>
                    {@render filterSnippet(header.column)}
                  </div>
                {/if}
              </div>
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
      onclick={() => table.firstPage()
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
      onclick={() => table.lastPage()}
      disabled={!table.getCanNextPage()}
    >
      {'>>'}
    </button>
    <span class="inline-controls">
      <div>Page</div>
      <strong>
        {(table.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
        {table.getPageCount().toLocaleString()}
      </strong>
    </span>
    <span class="inline-controls">
      | Go to page:
      <input
        type="number"
        min="1"
        max={table.getPageCount()}
        value={table.state.pagination.pageIndex + 1}
        oninput={(e: Event) => {
          const page = (e.target as HTMLInputElement).value
            ? Number((e.target as HTMLInputElement).value) - 1
            : 0
          table.setPageIndex(page)
        }}
        class="page-size-input"
      />
    </span>
    <select
      value={table.state.pagination.pageSize}
      onchange={(e: Event) => {
        table.setPageSize(Number((e.target as HTMLSelectElement).value))
      }}
    >
      {#each [10, 20, 30, 40, 50] as pageSize}
        <option value={pageSize}>Show {pageSize}</option>
      {/each}
    </select>
  </div>
  <div>
    Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
    {table.getRowCount().toLocaleString()} Rows
  </div>
  <hr />
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (100k rows)</button>
  </div>
  <pre>{JSON.stringify(table.state, null, 2)}</pre>
</div>
