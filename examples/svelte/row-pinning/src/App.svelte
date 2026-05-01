<script lang="ts">
  import {
    columnFilteringFeature,
    columnSizingFeature,
    createExpandedRowModel,
    createFilteredRowModel,
    createPaginatedRowModel,
    createTable,
    createTableState,
    filterFns,
    FlexRender,
    rowExpandingFeature,
    rowPaginationFeature,
    rowPinningFeature,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type {
    Column,
    ExpandedState,
    RowPinningState,
    SvelteTable,
  } from '@tanstack/svelte-table'
  import type { Person } from './makeData'
  import './index.css'

  const _features = tableFeatures({
    columnSizingFeature,
    rowPinningFeature,
    rowExpandingFeature,
    columnFilteringFeature,
    rowPaginationFeature,
  })

  const [rowPinning, setRowPinning] = createTableState<RowPinningState>({
    top: [],
    bottom: [],
  })
  const [expanded, setExpanded] = createTableState<ExpandedState>({})

  let keepPinnedRows = $state(true)
  let includeLeafRows = $state(true)
  let includeParentRows = $state(false)
  let copyPinnedRows = $state(false)

  let data = $state(makeData(1_000, 2, 2))
  const refreshData = () => { data = makeData(1_000, 2, 2) }
  const stressTest = () => { data = makeData(100_000, 2, 2) }

  const table = createTable(
    {
      debugTable: true,
      _features,
      _rowModels: {
        filteredRowModel: createFilteredRowModel(filterFns),
        expandedRowModel: createExpandedRowModel(),
        paginatedRowModel: createPaginatedRowModel(),
      },
      columns: [
        {
          id: 'pin',
          header: () => 'Pin',
          cell: ({ row }) => {
            if (row.getIsPinned()) {
              return 'pinned'
            }
            return 'not-pinned'
          },
        },
        {
          accessorKey: 'firstName',
          header: () => 'First Name',
          cell: ({ getValue }) => getValue(),
          footer: (props) => props.column.id,
        },
        {
          accessorFn: (row) => row.lastName,
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => 'Last Name',
        },
        { accessorKey: 'age', header: () => 'Age', size: 50 },
        { accessorKey: 'visits', header: () => 'Visits', size: 50 },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'progress', header: 'Profile Progress', size: 80 },
      ],
      get data() {
        return data
      },
      initialState: { pagination: { pageSize: 20, pageIndex: 0 } },
      get state() {
        return {
          expanded: expanded(),
          rowPinning: rowPinning(),
        }
      },
      onExpandedChange: setExpanded,
      onRowPinningChange: setRowPinning,
      getSubRows: (row) => row.subRows,
      get keepPinnedRows() {
        return keepPinnedRows
      },
      debugAll: true,
    },
    (state) => ({
      pagination: state.pagination,
      rowPinning: state.rowPinning,
      expanded: state.expanded,
    }),
  )
</script>

{#snippet PinCell(row: ReturnType<typeof table.getRowModel>['rows'][0])}
  {#if row.getIsPinned()}
    <button
      onclick={() =>
        row.pin(false, includeLeafRows, includeParentRows)
      }
    >
      X
    </button>
  {:else}
    <div style="display: flex; gap: 4px">
      <button
        onclick={() =>
          row.pin('top', includeLeafRows, includeParentRows)
        }
      >
        Up
      </button>
      <button
        onclick={() =>
          row.pin('bottom', includeLeafRows, includeParentRows)
        }
      >
        Down
      </button>
    </div>
  {/if}
{/snippet}

{#snippet ExpandCell(row: ReturnType<typeof table.getRowModel>['rows'][0])}
  <div style="padding-left: {row.depth * 2}rem">
    {#if row.getCanExpand()}
      <button
        onclick={row.getToggleExpandedHandler()}
        style="cursor: pointer"
      >
        {row.getIsExpanded() ? 'v' : '>'}
      </button>
    {:else}
      *
    {/if}
  </div>
{/snippet}

{#snippet ExpandAllButton()}
  <button onclick={table.getToggleAllRowsExpandedHandler()}>
    {table.getIsAllRowsExpanded() ? 'v' : '>'}{' '}First Name
  </button>
{/snippet}

{#snippet PinnedRow(row: ReturnType<typeof table.getRowModel>['rows'][0])}
  <tr
    style="background-color: lightblue; position: sticky; top: {row.getIsPinned() === 'top' ? `${row.getPinnedIndex() * 26 + 48}px` : 'auto'}; bottom: {row.getIsPinned() === 'bottom' ? `${(table.getBottomRows().length - 1 - row.getPinnedIndex()) * 26}px` : 'auto'}"
  >
    {#each row.getAllCells() as cell (cell.id)}
      <td>
        {#if cell.column.id === 'pin'}
          {@render PinCell(row)}
        {:else if cell.column.id === 'firstName'}
          {@render ExpandCell(row)}
          <FlexRender cell={cell} />
        {:else}
          <FlexRender cell={cell} />
        {/if}
      </td>
    {/each}
  </tr>
{/snippet}

{#snippet Filter(column: Column<typeof _features, Person>, tableRef: SvelteTable<typeof _features, Person, any>)}
  {@const firstValue = tableRef
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)}

  {#if typeof firstValue === 'number'}
    <div class="filter-row">
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? '') as string}
        oninput={(e) =>
          column.setFilterValue((old: any) => [(e.target as HTMLInputElement).value, old?.[1]])
        }
        placeholder="Min"
        class="filter-input"
      />
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? '') as string}
        oninput={(e) =>
          column.setFilterValue((old: any) => [old?.[0], (e.target as HTMLInputElement).value])
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

<div class="app">
  <div class="demo-root container">
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
                  {#if header.column.id === 'firstName'}
                    {@render ExpandAllButton()}
                  {:else}
                    <FlexRender header={header} />
                  {/if}
                  {#if header.column.getCanFilter()}
                    <div>
                      {@render Filter(header.column, table)}
                    </div>
                  {/if}
                {/if}
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each table.getTopRows() as row (row.id)}
          {@render PinnedRow(row)}
        {/each}
        {#each copyPinnedRows ? table.getRowModel().rows : table.getCenterRows() as row (row.id)}
          <tr>
            {#each row.getAllCells() as cell (cell.id)}
              <td>
                {#if cell.column.id === 'pin'}
                  {@render PinCell(row)}
                {:else if cell.column.id === 'firstName'}
                  {@render ExpandCell(row)}
                  <FlexRender cell={cell} />
                {:else}
                  <FlexRender cell={cell} />
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
        {#each table.getBottomRows() as row (row.id)}
          {@render PinnedRow(row)}
        {/each}
      </tbody>
    </table>
  </div>

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
  <div class="spacer-sm"></div>
  <hr />
  <br />
  <div class="vertical-options">
    <div>
      <label class="label-offset">
        <input
          type="checkbox"
          checked={keepPinnedRows}
          onchange={() => keepPinnedRows = !keepPinnedRows}
        />
        Keep/Persist Pinned Rows across Pagination and Filtering
      </label>
    </div>
    <div>
      <label class="label-offset">
        <input
          type="checkbox"
          checked={includeLeafRows}
          onchange={() => includeLeafRows = !includeLeafRows}
        />
        Include Leaf Rows When Pinning Parent
      </label>
    </div>
    <div>
      <label class="label-offset">
        <input
          type="checkbox"
          checked={includeParentRows}
          onchange={() => includeParentRows = !includeParentRows}
        />
        Include Parent Rows When Pinning Child
      </label>
    </div>
    <div>
      <label class="label-offset">
        <input
          type="checkbox"
          checked={copyPinnedRows}
          onchange={() => copyPinnedRows = !copyPinnedRows}
        />
        Duplicate/Keep Pinned Rows in main table
      </label>
    </div>
  </div>
  <div>
    <button class="demo-button demo-button-spaced" onclick={() => refreshData()
    }>
      Regenerate Data
    </button>
    <button class="demo-button demo-button-spaced" onclick={() => stressTest()}>
      Stress Test (100k rows)
    </button>
  </div>
  <div>{JSON.stringify(table.state.rowPinning, null, 2)}</div>
</div>
