<script lang="ts">
  import './index.css';
  import { writable } from 'svelte/store';

import './index.css';

  import {
    createSvelteTable,
    flexRender,
    getCoreRowModel,
	  getFilteredRowModel,
	  getPaginationRowModel,
    type FilterFn
  } from '@tanstack/svelte-table';

  import { type RankingInfo, rankItem } from '@tanstack/match-sorter-utils';

  import { makeData, type Person } from './makeData';

  declare module '@tanstack/table-core' {
    interface FilterFns {
      fuzzy: FilterFn<unknown>;
    }
    interface FilterMeta {
      itemRank: RankingInfo;
    }
  }

  let globalFilter = ''

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({ itemRank })

    // Return if the item should be filtered in/out
    return itemRank.passed
  }

  const options = writable<TableOptions<any>>({
    data: makeData(25),
    columns: [
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: 'fullName',
        header: 'Name',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        filterFn: 'fuzzy',
      },
    ],
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableMultiRowSelection: true,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
  })

  const table = createSvelteTable(options)
</script>
<input type="text" placeholder="Global filter" class="border w-full p-1" bind:value={globalFilter} on:keyup={(e) => $table.setGlobalFilter(String(e.target.value))} />
<div class="h-2" />
<table class="w-full">
  <thead>
    {#each $table.getHeaderGroups() as headerGroup}
      <tr>
        {#each headerGroup.headers as header, idx}
          <th scope="col">
            {#if !header.isPlaceholder}
              <svelte:component
                this={flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              />
            {/if}
          </th>
        {/each}
      </tr>
    {/each}
  </thead>
  <tbody>
    {#each $table.getRowModel().rows as row}
      <tr>
        {#each row.getVisibleCells() as cell}
          <td>
            <svelte:component
              this={flexRender(cell.column.columnDef.cell, cell.getContext())}
            />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
<div class="h-2" />
<pre>"globalFilter": "{$table.getState().globalFilter}"</pre>