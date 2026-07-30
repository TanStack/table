<script lang="ts">
  import { FlexRender, createTable } from '@tanstack/svelte-table'
  import ColumnFilter from './ColumnFilter.svelte'
  import './index.css'
  import { features } from './features'
  import { makeData, type Account } from './makeData'
  import { createBucketFilter, formatBytes, getBucket, lastLoginBuckets, storageBuckets } from './buckets'
  import type { ColumnDef } from '@tanstack/svelte-table'

  const columns: Array<ColumnDef<typeof features, Account>> = [
    { accessorKey: 'name', header: 'Account', filterFn: 'includesString', meta: { filterVariant: 'text' } },
    {
      accessorKey: 'lastLogin',
      header: 'Last login',
      cell: (info) => (info.getValue() as Date).toLocaleString(),
      getUniqueValues: (row) => [getBucket(row.lastLogin, lastLoginBuckets)],
      filterFn: createBucketFilter(lastLoginBuckets),
      meta: { filterVariant: 'facets', facetOptions: lastLoginBuckets },
    },
    {
      accessorKey: 'storageBytes',
      header: 'Storage',
      cell: (info) => formatBytes(info.getValue() as number),
      getUniqueValues: (row) => [getBucket(row.storageBytes, storageBuckets)],
      filterFn: createBucketFilter(storageBuckets),
      meta: { filterVariant: 'facets', facetOptions: storageBuckets },
    },
    { accessorKey: 'files', header: 'Files', enableColumnFilter: false, cell: (info) => (info.getValue() as number).toLocaleString() },
  ]

  let data = $state(makeData(5_000))
  const refreshData = () => { data = makeData(5_000) }
  const stressTest = () => { data = makeData(1_000_000) }

  const table = createTable(
    {
      features,
      get data() { return data },
      columns,
      debugTable: true,
      debugHeaders: true,
      debugColumns: false,
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
                <FlexRender header={header} />
                {#if header.column.getCanFilter()}
                  <div>
                    <ColumnFilter column={header.column} {table} />
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
      value={pagination.pageSize}
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
    {table.getPrePaginatedRowModel().rows.length.toLocaleString()} Rows
  </div>
  <pre data-testid="table-state">{JSON.stringify(table.store.get(), null, 2)}</pre>
</div>
