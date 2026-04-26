<script lang="ts">
  import {
    FlexRender,
    columnSizingFeature,
    createSortedRowModel,
    createTable,
    rowSortingFeature,
    sortFns,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import type { ColumnDef } from '@tanstack/svelte-table'
  import { createVirtualizer } from '@tanstack/svelte-virtual'
  import { get } from 'svelte/store'
  import { makeData } from './makeData'
  import type { Person } from './makeData'
  import './index.css'

  const _features = tableFeatures({ columnSizingFeature, rowSortingFeature })

  // This is a dynamic row height example, which is more complicated, but allows for a more realistic table.
  // See https://tanstack.com/virtual/v3/docs/examples/svelte/table for a simpler fixed row height example.
  const columns: Array<ColumnDef<typeof _features, Person>> = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 60,
    },
    {
      accessorKey: 'firstName',
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row.lastName,
      id: 'lastName',
      cell: (info) => info.getValue(),
      header: 'Last Name',
    },
    {
      accessorKey: 'age',
      header: 'Age',
      size: 50,
    },
    {
      accessorKey: 'visits',
      header: 'Visits',
      size: 50,
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'progress',
      header: 'Profile Progress',
      size: 80,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: (info) => info.getValue<Date>().toLocaleString(),
      size: 250,
    },
  ]

  let data = $state(makeData(100_000))
  const refreshData = () => { data = makeData(100_000) }
  const stressTest = () => { data = makeData(1_000_000) }

  const table = createTable({
    _features,
    _rowModels: { sortedRowModel: createSortedRowModel(sortFns) },
    columns,
    get data() {
      return data
    },
    debugTable: true,
  })

  let tableContainerRef = $state<HTMLDivElement | undefined>(undefined)

  const rows = $derived(table.getRowModel().rows)

  const rowVirtualizer = createVirtualizer({
    get count() {
      return rows.length
    },
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef ?? null,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  // When the container ref becomes available, update the virtualizer options
  // so it picks up the scroll element and sets up scroll observers.
  $effect(() => {
    if (tableContainerRef) {
      get(rowVirtualizer).setOptions({
        getScrollElement: () => tableContainerRef ?? null,
      })
    }
  })

  // When row count changes (e.g. data refresh), push the new count to the virtualizer.
  // The svelte-virtual store adapter doesn't reactively track getter options.
  $effect(() => {
    get(rowVirtualizer).setOptions({ count: rows.length })
  })

  // Svelte action to measure dynamic row heights via the virtualizer
  function measureElement(node: HTMLTableRowElement) {
    get(rowVirtualizer).measureElement(node)
  }
</script>

<div class="app">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (1M rows)</button>
  </div>
  ({data.length.toLocaleString()} rows)
  <div
    class="container"
    bind:this={tableContainerRef}
    style="overflow: auto; position: relative; height: 800px;"
  >
    <!-- Even though we're still using semantic table tags, we must use CSS grid and flexbox for dynamic row heights -->
    <table style="display: grid;">
      <thead style="display: grid; position: sticky; top: 0px; z-index: 1;">
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <tr style="display: flex; width: 100%;">
            {#each headerGroup.headers as header (header.id)}
              <th style="display: flex; width: {header.getSize()}px;">
                <div
                  class={header.column.getCanSort()
                    ? 'cursor-pointer select-none'
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
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody
        style="display: grid; height: {$rowVirtualizer.getTotalSize()}px; position: relative;"
      >
        {#each $rowVirtualizer.getVirtualItems() as virtualRow (virtualRow.index)}
          {@const row = rows[virtualRow.index]}
          <tr
            data-index={virtualRow.index}
            use:measureElement
            style="display: flex; position: absolute; transform: translateY({virtualRow.start}px); width: 100%;"
          >
            {#each row.getAllCells() as cell (cell.id)}
              <td style="display: flex; width: {cell.column.getSize()}px;">
                <FlexRender cell={cell} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
