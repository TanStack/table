<script lang="ts">
  import { get } from 'svelte/store'
  import { onMount, tick } from 'svelte'
  import { useSelector } from '@tanstack/svelte-store'
  import { FlexRender, createFilteredRowModel, createSortedRowModel, createTable, filterFn_includesString, sortFn_basic, stockFeatures, tableFeatures } from '@tanstack/svelte-table'
  import { createVirtualizer } from '@tanstack/svelte-virtual'
  import { startTableBenchmark } from '../benchmark/table-benchmark'
  import { useMarketFeedController, useTradingShellController } from '../shell/trading-shell-context'
  import { TRADING_COLUMN_COUNT, readMeasuredRows, rowModelDiagnostics, tradingColumns } from './table-config/trading-columns'
  import { TradingGridPointerController, handleCellNavigation, reorderColumnIds, sortAriaValue, sortIndicator } from './table-interactions'
  import { TRADING_ROW_HEIGHT, TRADING_ROW_OVERSCAN, resolveVirtualScrollMode } from './trading-row-virtualizer'
  import type { MarketQuote } from '../feed/market-data'
  import type { VirtualItem } from '@tanstack/svelte-virtual'

  export { TRADING_COLUMN_COUNT, rowModelDiagnostics }

  const features = tableFeatures({
    ...stockFeatures,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns: { includesString: filterFn_includesString },
    sortFns: { basic: sortFn_basic },
  })
  const controller = useTradingShellController()
  const feed = useMarketFeedController()
  const feedState = useSelector(feed.store)
  const benchmarkState = useSelector(controller.store)
  const selectedSymbol = useSelector(controller.renderAtoms.selectedSymbol)
  const table = createTable({
    key: 'svelte-realtime-trading',
    features,
    columns: tradingColumns,
    get data() { return feedState.current.quotes },
    getRowId: (row: MarketQuote) => row.id,
    columnResizeMode: 'onChange',
    defaultColumn: { minSize: 56, maxSize: 800 },
    autoResetCellSelection: false,
  })
  const tableState = useSelector(table.store, (state) => ({
    sorting: state.sorting,
    columnFilters: state.columnFilters,
    columnOrder: state.columnOrder,
    rowSelection: state.rowSelection,
    cellSelection: state.cellSelection,
  }))
  const virtualScrollMode = $derived(resolveVirtualScrollMode(benchmarkState.current.requestedVirtualScrollMode, feedState.current.instrumentCount))
  const rows = $derived.by(() => {
    void feedState.current.quotes
    void tableState.current
    return readMeasuredRows(() => table.getRowModel().rows)
  })
  const refs = $state<{ scroll: HTMLDivElement | null; table: HTMLTableElement | null }>({ scroll: null, table: null })
  const rowVirtualizer = createVirtualizer({
    count: 0,
    estimateSize: () => TRADING_ROW_HEIGHT,
    getScrollElement: () => refs.scroll,
    getItemKey: (index) => rows[index]?.id ?? index,
    overscan: TRADING_ROW_OVERSCAN,
    enabled: false,
  })
  const virtualRows = $derived($rowVirtualizer.getVirtualItems())
  const visibleRange = $derived.by(() => {
    const range = $rowVirtualizer.range
    if (virtualScrollMode !== 'tanstack' || rows.length === 0 || range === null) return null
    const lastIndex = rows.length - 1
    const start = Math.min(range.startIndex, lastIndex)
    return { start, end: Math.min(Math.max(start, range.endIndex), lastIndex) }
  })
  const pointerInteractions = new TradingGridPointerController()
  const drag = { columnId: null as string | null, sourceElement: null as HTMLTableCellElement | null, targetElement: null as HTMLTableCellElement | null }
  const layout = { manuallyResized: false }

  $effect(() => {
    get(rowVirtualizer).setOptions({
      count: rows.length,
      estimateSize: () => TRADING_ROW_HEIGHT,
      getScrollElement: () => refs.scroll,
      getItemKey: (index) => rows[index]?.id ?? index,
      overscan: TRADING_ROW_OVERSCAN,
      enabled: virtualScrollMode === 'tanstack',
    })
  })
  $effect(() => { controller.actions.setRenderedRowCount(virtualScrollMode === 'tanstack' ? virtualRows.length : rows.length) })
  $effect(() => { void feedState.current.quotes; tick().then(() => feed.completeRender()) })

  const writeColumnSizes = (): void => {
    if (!refs.table) return
    for (const header of table.getFlatHeaders()) {
      refs.table.style.setProperty(`--header-${header.id}-size`, String(header.getSize()))
      refs.table.style.setProperty(`--col-${header.column.id}-size`, String(header.column.getSize()))
    }
    refs.table.style.width = `${table.getTotalSize()}px`
  }
  const fitAvailableWidth = (): void => {
    if (!refs.scroll || layout.manuallyResized) return
    const width = table.getTotalSize()
    if (refs.scroll.clientWidth <= width + 1 || width <= 0) return
    const ratio = refs.scroll.clientWidth / width
    table.setColumnSizing(Object.fromEntries(table.getVisibleLeafColumns().map((column) => [column.id, column.getSize() * ratio])))
  }
  const clearColumnDrag = (): void => {
    drag.sourceElement?.classList.remove('is-column-dragging')
    drag.targetElement?.classList.remove('is-column-drop-target')
    drag.columnId = null; drag.sourceElement = null; drag.targetElement = null
  }
  const showColumnDropTarget = (columnId: string, element: HTMLTableCellElement | null): void => {
    drag.targetElement?.classList.remove('is-column-drop-target')
    drag.targetElement = null
    if (drag.columnId === columnId || !element) return
    element.classList.add('is-column-drop-target')
    drag.targetElement = element
  }
  const isTextColumn = (columnId: string): boolean => columnId === 'market' || columnId === 'name' || columnId === 'symbol'

  onMount(() => {
    const resizeObserver = new ResizeObserver(fitAvailableWidth)
    const sizing = table.atoms.columnSizing.subscribe(writeColumnSizes)
    const order = table.atoms.columnOrder.subscribe(writeColumnSizes)
    const resizing = table.atoms.columnResizing.subscribe((state) => { if (state.isResizingColumn !== false) layout.manuallyResized = true })
    tick().then(() => { writeColumnSizes(); fitAvailableWidth(); if (refs.scroll) resizeObserver.observe(refs.scroll) })
    const stopBenchmark = startTableBenchmark(controller)
    feed.completeRender()
    return () => { sizing.unsubscribe(); order.unsubscribe(); resizing.unsubscribe(); resizeObserver.disconnect(); stopBenchmark() }
  })
</script>

{#snippet renderRow(row: (typeof rows)[number], virtualRow?: VirtualItem)}
  <tr class:virtual-table-row={Boolean(virtualRow)} style:transform={virtualRow ? `translateY(${virtualRow.start}px)` : undefined} data-virtual-index={virtualRow?.index} data-symbol={row.original.symbol} data-row-id={row.original.id} data-symbol-selected={selectedSymbol.current === row.original.symbol ? 'true' : undefined} title={row.original.company} aria-selected={row.getIsSelected()}>
    {#each row.getVisibleCells() as cell (cell.id)}{@const edges = cell.getSelectionEdges()}<td style:width={`calc(var(--col-${cell.column.id}-size) * 1px)`} data-column-id={cell.column.id} data-cell-focused={cell.getIsFocused() || undefined} data-selection-top={edges.top || undefined} data-selection-right={edges.right || undefined} data-selection-bottom={edges.bottom || undefined} data-selection-left={edges.left || undefined} aria-selected={cell.getIsSelected()} tabindex={cell.getTabIndex()}><FlexRender {cell} /></td>{/each}
  </tr>
{/snippet}

<div bind:this={refs.scroll} class:is-virtualized={virtualScrollMode === 'tanstack'} class="table-scroll" data-trading-table>
  <table bind:this={refs.table} class:virtual-table={virtualScrollMode === 'tanstack'} class="trading-data-grid" data-testid="trading-table" role="grid" aria-multiselectable="true" tabindex="0" onkeydown={(event) => handleCellNavigation(table, event)}>
    <thead>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}<tr>
        {#each headerGroup.headers as header (header.id)}
          {@const isLeaf = header.subHeaders.length === 0}{@const sorted = header.column.getIsSorted()}
          <th colspan={header.colSpan} style:width={`calc(var(--header-${header.id}-size) * 1px)`} aria-sort={isLeaf ? sortAriaValue(sorted) : undefined} class:column-group-header={!isLeaf} class:numeric-header={isLeaf && !isTextColumn(header.column.id)}>
            {#if !header.isPlaceholder}
              {#if isLeaf}
                <div role="group" class="leaf-header-content" ondragover={(event) => { event.preventDefault(); showColumnDropTarget(header.column.id, (event.currentTarget as HTMLElement).closest('th')) }} ondrop={(event) => { event.preventDefault(); const sourceId = event.dataTransfer?.getData('text/plain') || drag.columnId; if (sourceId) table.setColumnOrder(reorderColumnIds(table.getVisibleLeafColumns().map((column) => column.id), sourceId, header.column.id)); clearColumnDrag() }}>
                  <button type="button" class="column-drag-handle" draggable="true" aria-label={`Move ${header.column.id} column`} ondragstart={(event) => { drag.columnId = header.column.id; drag.sourceElement = (event.currentTarget as HTMLElement).closest('th'); drag.sourceElement?.classList.add('is-column-dragging'); if (event.dataTransfer) { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', header.column.id) } }} ondragend={clearColumnDrag}>⋮⋮</button>
                  <button type="button" class:is-sortable={header.column.getCanSort()} class="sort-header-button" disabled={!header.column.getCanSort()} onclick={header.column.getToggleSortingHandler()}><span class="header-label"><FlexRender {header} /></span>{#if header.column.getCanSort()}<span class:is-active={Boolean(sorted)} class="sort-indicator" aria-hidden="true">{sortIndicator(sorted)}</span>{/if}</button>
                </div>
                {#if header.column.getCanResize()}<!-- svelte-ignore a11y_no_noninteractive_element_interactions --><div class:is-resizing={header.column.getIsResizing()} class="column-resize-handle" role="separator" aria-orientation="vertical" tabindex="-1" ondblclick={() => header.column.resetSize()} onmousedown={header.getResizeHandler()} ontouchstart={header.getResizeHandler()}></div>{/if}
              {:else}<FlexRender {header} />{/if}
            {/if}
          </th>
        {/each}
      </tr>{/each}
    </thead>
    <!-- Delegated table-grid pointer handling intentionally lives on one tbody. -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <tbody class:virtual-table-body={virtualScrollMode === 'tanstack'} style:height={virtualScrollMode === 'tanstack' ? `${rows.length * TRADING_ROW_HEIGHT}px` : undefined} data-source-row-count={feedState.current.quotes.length} onmousedown={(event) => pointerInteractions.handleMouseDown(table, event, controller.actions.selectSymbol)} onpointerover={(event) => pointerInteractions.handlePointerOver(table, event)} onmouseleave={() => pointerInteractions.resetPointerCell()} onclick={(event) => pointerInteractions.handleClick(table, event)}>
      {#if virtualScrollMode === 'tanstack'}
        {#each virtualRows as virtualRow (virtualRow.key)}{@render renderRow(rows[virtualRow.index], virtualRow)}{/each}
      {:else}
        {#each rows as row (row.id)}{@render renderRow(row)}{/each}
      {/if}
    </tbody>
  </table>
</div>
{#if virtualScrollMode === 'tanstack'}<footer class="virtual-scroll-footer" data-testid="virtual-scroll-footer"><span>TanStack · Total · {rows.length} rows · {table.getVisibleLeafColumns().length} columns</span><span data-testid="visible-row-range">{visibleRange ? `Current · rows ${visibleRange.start}..${visibleRange.end}` : 'Current · rows —'}</span></footer>{/if}
