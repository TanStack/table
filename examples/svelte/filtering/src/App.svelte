<script lang="ts">
  import { rankItem } from '@tanstack/match-sorter-utils'
  import type { ColumnDef, FilterFn } from '@tanstack/svelte-table'
  import {
    FlexRender,
    columnFilteringFeature,
    columnVisibilityFeature,
    createFilteredRowModel,
    createPaginatedRowModel,
    createTable,
    globalFilteringFeature,
    isFunction,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { type Updater } from 'svelte/store'
  import './index.css'
  import { makeData, type Person } from './makeData'

  const _features = tableFeatures({
    columnVisibilityFeature,
    globalFilteringFeature,
    columnFilteringFeature,
  })

  const fuzzyFilter: FilterFn<typeof _features, Person> = (
    row,
    columnId,
    value,
    addMeta,
  ) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta?.({ itemRank })

    // Return if the item should be filtered in/out
    return itemRank.passed
  }

  const columns: ColumnDef<any, Person>[] = [
    {
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      id: 'fullName',
      header: 'Name',
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
      filterFn: 'fuzzy',
    },
  ]

  let globalFilter = $state('')

  function setGlobalFilter(updater: Updater<string>) {
    if (isFunction(updater)) {
      globalFilter = updater(globalFilter)
    } else globalFilter = updater
  }

  const table = createTable({
    _features,
    _rowModels: {
      filteredRowModel: createFilteredRowModel(),
      paginatedRowModel: createPaginatedRowModel(),
    },
    _rowModelFns: {
      filterFns: {
        fuzzy: fuzzyFilter,
      },
    },
    data: makeData(25),
    columns,
    state: {
      get globalFilter() {
        return globalFilter
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    enableMultiRowSelection: true,
  })

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
<div class="h-2"></div>
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
<div class="h-2"></div>
<pre>"globalFilter": "{table.getState().globalFilter}"</pre>
