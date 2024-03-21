<script lang="ts">
  import { rankItem } from '@tanstack/match-sorter-utils'
  import type {
    ColumnDef,
    FilterFn,
    TableOptions,
  } from '@tanstack/svelte-table'
  import {
    FlexRender,
    createSvelteTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
  } from '@tanstack/svelte-table'
  import { type Updater } from 'svelte/store'
  import './index.css'
  import { makeData, type Person } from './makeData'

  let globalFilter = $state('')

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({ itemRank })

    // Return if the item should be filtered in/out
    return itemRank.passed
  }

  let columns: ColumnDef<Person>[] = [
    {
      accessorFn: row => `${row.firstName} ${row.lastName}`,
      id: 'fullName',
      header: 'Name',
      cell: info => info.getValue(),
      footer: props => props.column.id,
      filterFn: 'fuzzy',
    },
  ]

  function setGlobalFilter(updater: Updater<string>) {
    if (updater instanceof Function) {
      globalFilter = updater(globalFilter)
    } else globalFilter = updater
  }

  const options: TableOptions<Person> = {
    data: makeData(25),
    columns,
    state: {
      get globalFilter() {
        return globalFilter
      },
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    enableMultiRowSelection: true,
  }

  const table = createSvelteTable(options)

  $effect(() => {
    table.setGlobalFilter(globalFilter)
  })
</script>

<input
  type="text"
  placeholder="Global filter"
  class="border w-full p-1"
  bind:value={globalFilter}
/>
<div class="h-2" />
<table class="w-full">
  <thead>
    {#each table.getHeaderGroups() as headerGroup}
      <tr>
        {#each headerGroup.headers as header, idx}
          <th scope="col">
            {#if !header.isPlaceholder}
              <FlexRender
                content={header.column.columnDef.header}
                context={header.getContext()}
              />
            {/if}
          </th>
        {/each}
      </tr>
    {/each}
  </thead>
  <tbody>
    {#each table.getRowModel().rows as row}
      <tr>
        {#each row.getVisibleCells() as cell}
          <td>
            <FlexRender
              content={cell.column.columnDef.cell}
              context={cell.getContext()}
            />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
<div class="h-2" />
<pre>"globalFilter": "{table.getState().globalFilter}"</pre>
