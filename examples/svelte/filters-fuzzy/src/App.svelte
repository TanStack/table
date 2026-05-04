<script lang="ts">
  import {
    FlexRender,
    columnFilteringFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    createTable,
    filterFns,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
    sortFns,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
  import DebouncedInput from './DebouncedInput.svelte'
  import './index.css'
  import { makeData, type Person } from './makeData'
  import type { Column, FilterFn, SortFn } from '@tanstack/svelte-table'

  const _features = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    rowSortingFeature,
    rowPaginationFeature,
  })

  const columnHelper = createColumnHelper<typeof _features, Person>()

  const fuzzyFilter: FilterFn<typeof _features, Person> = (
    row,
    columnId,
    value,
    addMeta,
  ) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta?.({ itemRank })
    return itemRank.passed
  }

  const fuzzySort: SortFn<typeof _features, Person> = (
    rowA,
    rowB,
    columnId,
  ) => {
    let dir = 0
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (rowA.columnFiltersMeta[columnId]) {
      dir = compareItems(
        rowA.columnFiltersMeta[columnId].itemRank!,
        rowB.columnFiltersMeta[columnId].itemRank!,
      )
    }
    return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
  }

  const columns = columnHelper.columns([
    columnHelper.accessor('id', {
      filterFn: 'equalsString',
    }),
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(),
      filterFn: 'includesStringSensitive',
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      cell: (info) => info.getValue(),
      header: () => 'Last Name',
      filterFn: 'includesString',
    }),
    columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
      id: 'fullName',
      header: 'Full Name',
      cell: (info) => info.getValue(),
      filterFn: 'fuzzy',
      sortFn: fuzzySort,
    }),
  ])

  let data = $state<Array<Person>>(makeData(1_000))
  const refreshData = () => { data = makeData(1_000) }
  const stressTest = () => { data = makeData(200_000) }

  const table = createTable(
    {
      _features,
      _rowModels: {
        filteredRowModel: createFilteredRowModel({
          ...filterFns,
          fuzzy: fuzzyFilter,
        }),
        paginatedRowModel: createPaginatedRowModel(),
        sortedRowModel: createSortedRowModel(sortFns),
      },
      columns,
      get data() {
        return data
      },
      globalFilterFn: 'fuzzy',
      debugTable: true,
      debugHeaders: true,
      debugColumns: false,
    },
    (state) => state,
  )

  $effect(() => {
    if (table.store.state.columnFilters[0]?.id === 'fullName') {
      if (table.store.state.sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false
        }])
      }
    }
  })
</script>

<div class="demo-root">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (200k rows)</button>
  </div>
  <div>
    <DebouncedInput
      value={(table.state.globalFilter ?? '') as string}
      onchange={(value) => table.setGlobalFilter(String(value))}
      class="summary-panel"
      placeholder="Search all columns..."
    />
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
                {#if header.column.getCanFilter()}
                  <div>
                    <DebouncedInput
                      type="text"
                      value={(header.column.getFilterValue() ?? '') as string}
                      onchange={(value) => header.column.setFilterValue(value)}
                      placeholder="Search..."
                      class="filter-select"
                    />
                  </div>
                {/if}
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
        {(table.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
        {table.getPageCount().toLocaleString()}
      </strong>
    </span>
    <span class="inline-controls">
      | Go to page:
      <input
        type="number"
        value={table.state.pagination.pageIndex + 1}
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
      value={table.state.pagination.pageSize}
      onchange={(e) => table.setPageSize(Number(e.currentTarget.value))}
    >
      {#each [10, 20, 30, 40, 50] as pageSize}
        <option value={pageSize}>Show {pageSize}</option>
      {/each}
    </select>
  </div>
  <div>{table.getPrePaginatedRowModel().rows.length.toLocaleString()} Rows</div>
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (200k rows)</button>
  </div>
  <pre>{JSON.stringify(table.state, null, 2)}</pre>
</div>
