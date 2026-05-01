<script lang="ts">
  import {
    aggregationFns,
    columnFilteringFeature,
    columnGroupingFeature,
    createExpandedRowModel,
    createFilteredRowModel,
    createGroupedRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    createTableHook,
    filterFns,
    FlexRender,
    rowExpandingFeature,
    rowPaginationFeature,
    rowSortingFeature,
    sortFns,
  } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type { Person } from './makeData'
  import './index.css'

  const { createAppTable, createAppColumnHelper } = createTableHook({
    _features: {
      columnFilteringFeature,
      columnGroupingFeature,
      rowExpandingFeature,
      rowPaginationFeature,
      rowSortingFeature,
    },
    _rowModels: {
      expandedRowModel: createExpandedRowModel(),
      filteredRowModel: createFilteredRowModel(filterFns),
      groupedRowModel: createGroupedRowModel(aggregationFns),
      paginatedRowModel: createPaginatedRowModel(),
      sortedRowModel: createSortedRowModel(sortFns),
    },
  })

  const columnHelper = createAppColumnHelper<Person>()

  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: (info) => info.getValue(),
      /**
       * override the value used for row grouping
       * (otherwise, defaults to the value derived from accessorKey / accessorFn)
       */
      getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      header: () => 'Last Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      aggregatedCell: ({ getValue }) =>
        Math.round(getValue<number>() * 100) / 100,
      aggregationFn: 'median',
    }),
    columnHelper.accessor('visits', {
      header: () => 'Visits',
      aggregationFn: 'sum',
      aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      cell: ({ getValue }) => Math.round(getValue<number>() * 100) / 100 + '%',
      aggregationFn: 'mean',
      aggregatedCell: ({ getValue }) =>
        Math.round(getValue<number>() * 100) / 100 + '%',
    }),
  ])

  let data = $state(makeData(1_000))
  const refreshData = () => { data = makeData(1_000) }
  const stressTest = () => { data = makeData(100_000) }

  const table = createAppTable(
    {
      columns,
      get data() {
        return data
      },
      debugTable: true,
    },
    (state) => state,
  )
</script>

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
              {#if !header.isPlaceholder}
                <div>
                  {#if header.column.getCanGroup()}
                    <button
                      onclick={header.column.getToggleGroupingHandler()}
                      style:cursor="pointer"
                    >
                      {#if header.column.getIsGrouped()}
                        🛑({header.column.getGroupedIndex()})
                      {:else}
                        👊
                      {/if}
                    </button>
                  {/if}
                  {' '}
                  <FlexRender header={header} />
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
            <td
              style:background={cell.getIsGrouped()
                ? '#0aff0082'
                : cell.getIsAggregated()
                  ? '#ffa50078'
                  : cell.getIsPlaceholder()
                    ? '#ff000042'
                    : 'white'}
            >
              {#if cell.getIsGrouped()}
                <button
                  onclick={row.getToggleExpandedHandler()}
                  style:cursor={row.getCanExpand() ? 'pointer' : 'normal'}
                >
                  {#if row.getIsExpanded()}
                    👇
                  {:else}
                    👉
                  {/if}
                  {' '}
                  <FlexRender cell={cell} />
                  {' '}({row.subRows.length.toLocaleString()})
                </button>
              {:else if cell.getIsAggregated()}
                <FlexRender
                  content={cell.column.columnDef.aggregatedCell as any}
                  context={cell.getContext()}
                />
              {:else if !cell.getIsPlaceholder()}
                <FlexRender cell={cell} />
              {/if}
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
        oninput={(e) => {
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
      onchange={(e) => table.setPageSize(Number((e.target as HTMLSelectElement).value))}
    >
      {#each [10, 20, 30, 40, 50] as pageSize}
        <option value={pageSize}>Show {pageSize}</option>
      {/each}
    </select>
  </div>
  <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (100k rows)</button>
  </div>
  <pre>{JSON.stringify(table.state, null, 2)}</pre>
</div>
