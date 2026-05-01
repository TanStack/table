<script lang="ts">
  import {
    FlexRender,
    columnSizingFeature,
    columnVisibilityFeature,
    createSortedRowModel,
    createTable,
    rowSortingFeature,
    sortFns,
    tableFeatures,
  } from '@tanstack/svelte-table'
  import { createVirtualizer } from '@tanstack/svelte-virtual'
  import { get } from 'svelte/store'
  import { makeColumns, makeData } from './makeData'
  import type { Person } from './makeData'
  import './index.css'

  const _features = tableFeatures({
    columnSizingFeature,
    columnVisibilityFeature,
    rowSortingFeature,
  })

  const columns = makeColumns(1_000)
  let data = $state(makeData(1_000, columns))
  const refreshData = () => { data = makeData(1_000, columns) }
  const stressTest = () => { data = makeData(10_000, columns) }

  const table = createTable({
    _features,
    _rowModels: { sortedRowModel: createSortedRowModel(sortFns) },
    columns,
    get data() {
      return data
    },
    debugTable: true,
  })

  // Important: Keep both virtualizers and the scroll container ref in the same component.
  let tableContainerRef = $state<HTMLDivElement | undefined>(undefined)

  const visibleColumns = $derived(table.getVisibleLeafColumns())
  const rows = $derived(table.getRowModel().rows)

  // We are using a slightly different virtualization strategy for columns (compared to virtual rows)
  // in order to support dynamic row heights.
  const columnVirtualizer = createVirtualizer<
    HTMLDivElement,
    HTMLTableCellElement
  >({
    get count() {
      return visibleColumns.length
    },
    estimateSize: (index) => visibleColumns[index].getSize(), // estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef ?? null,
    horizontal: true,
    overscan: 3, // how many columns to render on each side off screen (adjust this for performance)
  })

  // dynamic row height virtualization - alternatively you could use a simpler fixed row height strategy without `measureElement`
  const rowVirtualizer = createVirtualizer<
    HTMLDivElement,
    HTMLTableRowElement
  >({
    get count() {
      return rows.length
    },
    estimateSize: () => 33, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef ?? null,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  // When the container ref becomes available, update both virtualizers
  // so they pick up the scroll element and set up scroll observers.
  $effect(() => {
    if (tableContainerRef) {
      const getEl = () => tableContainerRef ?? null
      get(columnVirtualizer).setOptions({ getScrollElement: getEl })
      get(rowVirtualizer).setOptions({ getScrollElement: getEl })
    }
  })

  // When row/column counts change, push the new counts to the virtualizers.
  // The svelte-virtual store adapter doesn't reactively track getter options.
  $effect(() => {
    get(rowVirtualizer).setOptions({ count: rows.length })
  })
  $effect(() => {
    get(columnVirtualizer).setOptions({ count: visibleColumns.length })
  })

  // Different virtualization strategy for columns - instead of absolute and translateY,
  // we add empty columns to the left and right
  const virtualPaddingLeft = $derived.by(() => {
    const vcs = $columnVirtualizer.getVirtualItems()
    return vcs.length ? (vcs[0]?.start ?? 0) : undefined
  })

  const virtualPaddingRight = $derived.by(() => {
    const vcs = $columnVirtualizer.getVirtualItems()
    if (!vcs.length) return undefined
    return $columnVirtualizer.getTotalSize() - (vcs[vcs.length - 1]?.end ?? 0)
  })

  // Svelte action to measure dynamic row heights via the virtualizer
  function measureElement(node: HTMLTableRowElement) {
    get(rowVirtualizer).measureElement(node)
  }
</script>

<div class="app">
  <div>
    <button onclick={() => refreshData()}>Regenerate Data</button>
    <button onclick={() => stressTest()}>Stress Test (10k rows)</button>
  </div>
  <div>({columns.length.toLocaleString()} columns)</div>
  <div>({data.length.toLocaleString()} rows)</div>
  <div
    class="container"
    bind:this={tableContainerRef}
    style="overflow: auto; position: relative; height: 800px;"
  >
    <!-- Even though we're still using semantic table tags, we must use CSS grid and flexbox for dynamic row heights -->
    <table style="display: grid;">
      <thead style="display: grid; position: sticky; top: 0px; z-index: 1;">
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)
        }
          <tr style="display: flex; width: 100%;">
            {#if virtualPaddingLeft}
              <!-- fake empty column to the left for virtualization scroll padding -->
              <th style="display: flex; width: {virtualPaddingLeft}px;"></th>
            {/if}
            {#each $columnVirtualizer.getVirtualItems() as virtualColumn (virtualColumn.index)}
              {@const header = headerGroup.headers[virtualColumn.index]}
              <th style="display: flex; width: {header.getSize()}px;">
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
              </th>
            {/each}
            {#if virtualPaddingRight}
              <!-- fake empty column to the right for virtualization scroll padding -->
              <th style="display: flex; width: {virtualPaddingRight}px;"></th>
            {/if}
          </tr>
        {/each}
      </thead>
      <tbody
        style="display: grid; height: {$rowVirtualizer.getTotalSize()}px; position: relative;"
      >
        {#each $rowVirtualizer.getVirtualItems() as virtualRow (virtualRow.index)}
          {@const row = rows[virtualRow.index]}
          {@const visibleCells = row.getVisibleCells()}
          <tr
            data-index={virtualRow.index}
            use:measureElement
            style="display: flex; position: absolute; transform: translateY({virtualRow.start}px); width: 100%;"
          >
            {#if virtualPaddingLeft}
              <!-- fake empty column to the left for virtualization scroll padding -->
              <td style="display: flex; width: {virtualPaddingLeft}px;"></td>
            {/if}
            {#each $columnVirtualizer.getVirtualItems() as virtualColumn (virtualColumn.index)}
              {@const cell = visibleCells[virtualColumn.index]}
              <td style="display: flex; width: {cell.column.getSize()}px;">
                <FlexRender cell={cell} />
              </td>
            {/each}
            {#if virtualPaddingRight}
              <!-- fake empty column to the right for virtualization scroll padding -->
              <td style="display: flex; width: {virtualPaddingRight}px;"></td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
