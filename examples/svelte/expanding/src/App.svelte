<script lang="ts">
  import {
    columnFilteringFeature,
    createColumnHelper,
    createExpandedRowModel,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    createTable,
    filterFns,
    FlexRender,
    rowExpandingFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortFns,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import type { Column, SvelteTable } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type { Person } from './makeData'
  import './index.css'

  const _features = tableFeatures({
    columnFilteringFeature,
    rowExpandingFeature,
    rowPaginationFeature,
    rowSortingFeature,
    rowSelectionFeature,
  })

  const columnHelper = createColumnHelper<typeof _features, Person>()

  // Svelte action to set indeterminate property on checkbox inputs
  function setIndeterminate(node: HTMLInputElement, value: boolean) {
    node.indeterminate = value
    return {
      update(newValue: boolean) {
        node.indeterminate = newValue
      },
    }
  }

  let data = $state(makeData(100, 5, 3))
  const refreshData = () => { data = makeData(100, 5, 3) }
  const stressTest = () => { data = makeData(10_000, 5, 3) }

  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: () => 'firstName',
      cell: ({ row, getValue }) => getValue<string>(),
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
      filterFn: 'between',
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

  const table = createTable(
    {
      _features,
      _rowModels: {
        expandedRowModel: createExpandedRowModel(),
        filteredRowModel: createFilteredRowModel(filterFns),
        paginatedRowModel: createPaginatedRowModel(),
        sortedRowModel: createSortedRowModel(sortFns),
      },
      columns,
      get data() {
        return data
      },
      getSubRows: (row) => row.subRows,
      debugTable: true,
    },
    (state) => ({
      expanded: state.expanded,
      pagination: state.pagination,
      rowSelection: state.rowSelection,
      columnFilters: state.columnFilters,
      sorting: state.sorting,
    }),
  )
</script>

<div class="demo-root">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (10k rows)</button>
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
                  {#if header.id === 'firstName'}
                    <input
                      type="checkbox"
                      checked={table.getIsAllRowsSelected()}
                      use:setIndeterminate={!table.getIsAllRowsSelected() && table.getIsSomeRowsSelected()}
                      onchange={table.getToggleAllRowsSelectedHandler()}
                      class="sortable-header"
                    />
                    {' '}
                    <button onclick={table.getToggleAllRowsExpandedHandler()}>
                      {table.getIsAllRowsExpanded() ? '\u{1F447}' : '\u{1F449}'}
                    </button>
                    {' '}
                    First Name
                  {:else}
                    <FlexRender header={header} />
                  {/if}
                  {#if header.column.getCanFilter()}
                    <div>
                      {@render Filter(header.column, table)}
                    </div>
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
              {#if cell.column.id === 'firstName'}
                <div style="padding-left: {row.depth * 2}rem">
                  <div>
                    <input
                      type="checkbox"
                      checked={row.getIsSelected()}
                      use:setIndeterminate={!row.getIsSelected() && row.getIsSomeSelected()}
                      onchange={row.getToggleSelectedHandler()}
                      class="sortable-header"
                    />
                    {' '}
                    {#if row.getCanExpand()}
                      <button
                        onclick={row.getToggleExpandedHandler()}
                        style="cursor: pointer"
                      >
                        {row.getIsExpanded() ? '\u{1F447}' : '\u{1F449}'}
                      </button>
                    {:else}
                      {'\u{1F535}'}
                    {/if}
                    {' '}
                    <FlexRender cell={cell} />
                  </div>
                </div>
              {:else}
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
      onchange={(e) => {
        table.setPageSize(Number((e.target as HTMLSelectElement).value))
      }}
    >
      {#each [10, 20, 30, 40, 50] as pageSize}
        <option value={pageSize}>Show {pageSize}</option>
      {/each}
    </select>
  </div>
  <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (10k rows)</button>
  </div>
  <pre>{JSON.stringify(table.state, null, 2)}</pre>
</div>

{#snippet Filter(column: Column<typeof _features, Person>, table: SvelteTable<typeof _features, Person>)}
  {@const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)}

  {#if typeof firstValue === 'number'}
    <div class="filter-row">
      <input
        type="number"
        value={((column.getFilterValue() as [number, number] | undefined)?.[0] ?? '') as string}
        oninput={(e) =>
          column.setFilterValue((old: [number, number] | undefined) => [
            (e.target as HTMLInputElement).value,
            old?.[1],
          ])
        }
        placeholder="Min"
        class="filter-input"
      />
      <input
        type="number"
        value={((column.getFilterValue() as [number, number] | undefined)?.[1] ?? '') as string}
        oninput={(e) =>
          column.setFilterValue((old: [number, number] | undefined) => [
            old?.[0],
            (e.target as HTMLInputElement).value,
          ])
        }
        placeholder="Max"
        class="filter-input"
      />
    </div>
  {:else}
    <input
      type="text"
      value={(column.getFilterValue() ?? '') as string}
      oninput={(e) => column.setFilterValue((e.target as HTMLInputElement).value)}
      placeholder="Search..."
      class="filter-select"
    />
  {/if}
{/snippet}
