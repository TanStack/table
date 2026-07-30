<script lang="ts">
  import {
    rowAggregationFeature,
    aggregationFn_mean,
    aggregationFn_median,
    aggregationFn_sum,
    columnFilteringFeature,
    columnGroupingFeature,
    createExpandedRowModel,
    createFilteredRowModel,
    createGroupedRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    createTableHook,
    FlexRender,
    rowExpandingFeature,
    rowPaginationFeature,
    rowSortingFeature,
  } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type { Person } from './makeData'
  import './index.css'

  const { createAppTable, createAppColumnHelper } = createTableHook({
    features: {
      rowAggregationFeature,
      columnFilteringFeature,
      columnGroupingFeature,
      rowExpandingFeature,
      rowPaginationFeature,
      rowSortingFeature,
      expandedRowModel: createExpandedRowModel(),
      filteredRowModel: createFilteredRowModel(),
      groupedRowModel: createGroupedRowModel(),
      paginatedRowModel: createPaginatedRowModel(),
      sortedRowModel: createSortedRowModel(),
      // register only the aggregation fns referenced by name in the column definitions
      aggregationFns: {
        mean: aggregationFn_mean,
        median: aggregationFn_median,
        sum: aggregationFn_sum,
      },
    },
  })

  const columnHelper = createAppColumnHelper<Person>()

  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
      footer: 'Grand Total',
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
      footer: ({ column }) => {
        const value = column.getAggregationValue<number | undefined>()
        return value === undefined ? '' : Math.round(value * 100) / 100
      },
    }),
    columnHelper.accessor('visits', {
      header: () => 'Visits',
      aggregationFn: 'sum',
      aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
      footer: ({ column }) =>
        column.getAggregationValue<number>().toLocaleString(),
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
      footer: ({ column }) => {
        const value = column.getAggregationValue<number | undefined>()
        return value === undefined ? '' : `${Math.round(value * 100) / 100}%`
      },
    }),
  ])

  let data = $state(makeData(1_000))
  const refreshData = () => { data = makeData(1_000) }
  const stressTest = () => { data = makeData(1_000_000) }

  const table = createAppTable(
    {
      columns,
      get data() {
        return data
      },
      // initialState: { grouping: ['status'] }, // group by a column on first render
      // atoms: { grouping: groupingAtom }, // preferred: own grouping state with an external atom
      // state: { grouping }, // classic controlled state; pair with onGroupingChange
      // onGroupingChange: setGrouping,
      // enableGrouping: false, // disable grouping for every column; default true
      // groupedColumnMode: 'remove', // remove grouped columns instead of moving them to the start; default 'reorder'
      // manualGrouping: true, // pass rows that are already grouped and aggregated, for example from a server
      debugTable: true,
    },
  )
  const pagination = $derived(table.atoms.pagination.get())
</script>

<div class="demo-root">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (1M rows)</button>
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
    <tfoot>
      {#each table.getFooterGroups() as footerGroup (footerGroup.id)}
        <tr>
          {#each footerGroup.headers as header (header.id)}
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
                <FlexRender footer={header} />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </tfoot>
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
        {(pagination.pageIndex + 1).toLocaleString()} of{' '}
        {table.getPageCount().toLocaleString()}
      </strong>
    </span>
    <span class="inline-controls">
      | Go to page:
      <input
        type="number"
        min="1"
        max={table.getPageCount()}
        value={pagination.pageIndex + 1}
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
      value={pagination.pageSize}
      onchange={(e) => table.setPageSize(Number((e.target as HTMLSelectElement).value))}
    >
      {#each [10, 20, 30, 40, 50] as pageSize}
        <option value={pageSize}>Show {pageSize}</option>
      {/each}
    </select>
  </div>
  <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
  <pre data-testid="table-state">{JSON.stringify(table.store.get(), null, 2)}</pre>
</div>
