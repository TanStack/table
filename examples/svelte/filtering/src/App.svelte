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
    filterFns,
    globalFilteringFeature,
    tableFeatures,
  } from '@tanstack/svelte-table'
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

  const columns: ColumnDef<typeof _features, Person>[] = [
    {
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      id: 'fullName',
      header: 'Name',
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
      filterFn: 'fuzzy',
    },
  ]

  const table = createTable(
    {
      _features,
      _rowModels: {
        filteredRowModel: createFilteredRowModel({
          ...filterFns,
          fuzzy: fuzzyFilter,
        }),
        paginatedRowModel: createPaginatedRowModel(),
      },
      data: makeData(25),
      columns,
      globalFilterFn: fuzzyFilter,
    },
    (state) => ({
      globalFilter: state.globalFilter,
    }),
  )

  // Access selected state reactively
  $effect(() => {
    // Access table.state to create reactive dependency
    table.state
  })
</script>

<input
  type="text"
  placeholder="Global filter"
  class="border w-full p-1"
  value={table.state.globalFilter ?? ''}
  oninput={(e) => table.setGlobalFilter(e.target.value)}
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
<pre>"globalFilter": "{table.state.globalFilter}"</pre>
