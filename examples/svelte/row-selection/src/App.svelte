<script lang="ts">
  import {
    columnFilteringFeature,
    createFilteredRowModel,
    createPaginatedRowModel,
    createTable,
    filterFns,
    flexRender,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type { Person } from './makeData'
  import type {
    Column,
    ColumnDef,
    SvelteTable,
  } from '@tanstack/svelte-table'
  import './index.css'

  const _features = tableFeatures({
    rowPaginationFeature,
    rowSelectionFeature,
    columnFilteringFeature,
    globalFilteringFeature,
  })

  let data = $state(makeData(1_000))
  const refreshData = () => {
    data = makeData(100_000) // stress test
  }

  // Create table with selector to track specific state
  const table = createTable(
    {
      _features,
      _rowModels: {
        filteredRowModel: createFilteredRowModel(filterFns),
        paginatedRowModel: createPaginatedRowModel(),
      },
      get data() {
        return data
      },
      columns: [
        {
          id: 'select',
          header: () => 'select',
          cell: ({ row }) => row.getIsSelected(),
        },
        {
          header: 'Name',
          footer: (props) => props.column.id,
          columns: [
            {
              accessorKey: 'firstName',
              cell: (info) => info.getValue(),
              footer: (props) => props.column.id,
            },
            {
              accessorFn: (row) => row.lastName,
              id: 'lastName',
              cell: (info) => info.getValue(),
              header: () => 'Last Name',
              footer: (props) => props.column.id,
            },
          ],
        },
        {
          header: 'Info',
          footer: (props) => props.column.id,
          columns: [
            {
              accessorKey: 'age',
              header: () => 'Age',
              footer: (props) => props.column.id,
            },
            {
              header: 'More Info',
              columns: [
                {
                  accessorKey: 'visits',
                  header: () => 'Visits',
                  footer: (props) => props.column.id,
                },
                {
                  accessorKey: 'status',
                  header: 'Status',
                  footer: (props) => props.column.id,
                },
                {
                  accessorKey: 'progress',
                  header: 'Profile Progress',
                  footer: (props) => props.column.id,
                },
              ],
            },
          ],
        },
      ],
      getRowId: (row) => row.id,
      enableRowSelection: true,
      debugTable: true,
    },
    (state) => ({
      rowSelection: state.rowSelection,
      globalFilter: state.globalFilter,
      pagination: state.pagination,
    }),
  )

  // Access selected state reactively
  $effect(() => {
    // Access table.state to create reactive dependency
    table.state
  })
</script>

<div class="p-2">
  <div>
    <input
      value={table.state.globalFilter ?? ''}
      oninput={(e) => table.setGlobalFilter(e.target.value)}
      class="p-2 font-lg shadow border border-block"
      placeholder="Search all columns..."
    />
  </div>
  <div class="h-2" />
  <table>
    <thead>
      {#each table.getHeaderGroups() as headerGroup}
        <tr>
          {#each headerGroup.headers as header}
            <th colSpan={header.colSpan}>
              {#if !header.isPlaceholder}
                {#if header.id === 'select'}
                  <IndeterminateCheckbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                  />
                {:else}
                  <flexRender
                    content={header.column.columnDef.header}
                    context={header.getContext()}
                  />
                {/if}
                {#if header.column.getCanFilter()}
                  <div>
                    <Filter column={header.column} {table} />
                  </div>
                {/if}
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each table.getRowModel().rows as row}
        <tr>
          {#each row.getAllCells() as cell}
            <td>
              {#if cell.column.id === 'select'}
                <IndeterminateCheckbox
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  indeterminate={row.getIsSomeSelected()}
                  onChange={row.getToggleSelectedHandler()}
                />
              {:else}
                <flexRender
                  content={cell.column.columnDef.cell}
                  context={cell.getContext()}
                />
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <td class="p-1">
          <IndeterminateCheckbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        </td>
        <td colSpan={20}>Page Rows ({table.getRowModel().rows.length})</td>
      </tr>
    </tfoot>
  </table>
  <div class="h-2" />
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
        {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
      </strong>
    </span>
    <span class="flex items-center gap-1">
      | Go to page:
      <input
        type="number"
        min="1"
        max={table.getPageCount()}
        value={table.state.pagination.pageIndex + 1}
        oninput={(e) => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0
          table.setPageIndex(page)
        }}
        class="border p-1 rounded w-16"
      />
    </span>
    <select
      value={table.state.pagination.pageSize}
      onchange={(e) => {
        table.setPageSize(Number(e.target.value))
      }}
    >
      {#each [10, 20, 30, 40, 50] as pageSize}
        <option value={pageSize}>Show {pageSize}</option>
      {/each}
    </select>
  </div>
  <br />
  <div>
    {Object.keys(table.state.rowSelection).length} of{' '}
    {table.getPreFilteredRowModel().rows.length} Total Rows Selected
  </div>
  <hr />
  <br />
  <div>
    <button class="border rounded p-2 mb-2" onclick={() => refreshData()}>
      Refresh Data
    </button>
  </div>
  <div>
    <button
      class="border rounded p-2 mb-2"
      onclick={() =>
        console.info(
          'table.getSelectedRowModel().flatRows',
          table.getSelectedRowModel().flatRows,
        )
      }
    >
      Log table.getSelectedRowModel().flatRows
    </button>
  </div>
  <div>
    <label>Row Selection State:</label>
    <pre>{JSON.stringify(table.state, null, 2)}</pre>
  </div>
</div>

{#snippet Filter({ column, table }: { column: Column<typeof _features, Person>; table: SvelteTable<typeof _features, Person> })}
  {@const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)}

  {#if typeof firstValue === 'number'}
    <div class="flex space-x-2">
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? '') as string}
        oninput={(e) =>
          column.setFilterValue((old: any) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        class="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? '') as string}
        oninput={(e) =>
          column.setFilterValue((old: any) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        class="w-24 border shadow rounded"
      />
    </div>
  {:else}
    <input
      type="text"
      value={(column.getFilterValue() ?? '') as string}
      oninput={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      class="w-36 border shadow rounded"
    />
  {/if}
{/snippet}

{#snippet IndeterminateCheckbox({ indeterminate, class: className = '', checked, disabled, onChange }: { indeterminate?: boolean; class?: string; checked?: boolean; disabled?: boolean; onChange?: (event: Event) => void })}
  {@const ref = $state<HTMLInputElement | null>(null)}

  $effect(() => {
    if (typeof indeterminate === 'boolean' && ref) {
      ref.indeterminate = !checked && indeterminate
    }
  })

  <input
    type="checkbox"
    bind:this={ref}
    class={className + ' cursor-pointer'}
    {checked}
    {disabled}
    {onChange}
  />
{/snippet}
