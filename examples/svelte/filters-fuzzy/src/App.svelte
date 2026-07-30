<script lang="ts">
  import {
    FlexRender,
    createColumnHelper,
    createTable,
  } from '@tanstack/svelte-table'
  import DebouncedInput from './DebouncedInput.svelte'
  import './index.css'
  import { features } from './features'
  import { makeData, type Person } from './makeData'
  import type { Column } from '@tanstack/svelte-table'

  const columnHelper = createColumnHelper<typeof features, Person>()

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
      sortFn: 'fuzzy',
    }),
  ])

  let data = $state<Array<Person>>(makeData(1_000))
  const refreshData = () => { data = makeData(1_000) }
  const stressTest = () => { data = makeData(1_000_000) }

  const table = createTable(
    {
      features,
      columns,
      get data() {
        return data
      },
      globalFilterFn: 'fuzzy',
      // initialState: { columnFilters: [{ id: 'firstName', value: 'Jane' }], globalFilter: 'Jane' }, // set filters once
      // atoms: { columnFilters: columnFiltersAtom, globalFilter: globalFilterAtom }, // preferred external ownership
      // state: { columnFilters, globalFilter }, // classic controlled state; pair with the callbacks below
      // onColumnFiltersChange: setColumnFilters,
      // onGlobalFilterChange: setGlobalFilter,
      // enableFilters: false, // disable all column and global filtering; default true
      // enableColumnFilters: false, // disable per-column filters; default true
      // filterFromLeafRows: true, // keep parents whose descendants match; default filters from parents down
      // maxLeafRowFilterDepth: 1, // only filter through this nested-row depth; default 100
      // manualFiltering: true, // pass data that is already filtered, for example from a server
      // enableGlobalFilter: false, // disable the global filter input; default true
      // getColumnCanGlobalFilter: column => column.id !== 'status', // opt a column out of global filtering
      debugTable: true,
      debugHeaders: true,
      debugColumns: false,
    },
  )
  const pagination = $derived(table.atoms.pagination.get())
  const globalFilter = $derived(table.atoms.globalFilter.get())

  $effect(() => {
    if (table.atoms.columnFilters.get()[0]?.id === 'fullName') {
      if (table.atoms.sorting.get()[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false
        }])
      }
    }
  })
</script>

<div class="demo-root">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (1M rows)</button>
  </div>
  <div>
    <DebouncedInput
      value={(globalFilter ?? '') as string}
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
        {(pagination.pageIndex + 1).toLocaleString()} of{' '}
        {table.getPageCount().toLocaleString()}
      </strong>
    </span>
    <span class="inline-controls">
      | Go to page:
      <input
        type="number"
        value={pagination.pageIndex + 1}
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
      value={pagination.pageSize}
      onchange={(e) => table.setPageSize(Number(e.currentTarget.value))}
    >
      {#each [10, 20, 30, 40, 50] as pageSize}
        <option value={pageSize}>Show {pageSize}</option>
      {/each}
    </select>
  </div>
  <div>{table.getPrePaginatedRowModel().rows.length.toLocaleString()} Rows</div>
  <pre data-testid="table-state">{JSON.stringify(table.store.get(), null, 2)}</pre>
</div>
