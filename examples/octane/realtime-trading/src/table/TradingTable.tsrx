import { useLayoutEffect, useMemo, useRef } from 'octane'
import {
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  sortFn_basic,
  stockFeatures,
  tableFeatures,
  useTable,
} from '@tanstack/octane-table'
import { startTableBenchmark } from '../benchmark/table-benchmark'
import { useSelector } from '@tanstack/octane-store'
import { createTradingColumns, readMeasuredRows } from './table-config/trading-columns.tsrx'
import { handleCellNavigation, reorderColumnIds, sortAriaValue, sortIndicator } from './table-interactions'
import { TRADING_ROW_HEIGHT, TRADING_ROW_OVERSCAN, resolveVirtualScrollMode, useVirtualizer } from './trading-row-virtualizer'
import { useTradingGridPointer } from './use-trading-grid-pointer'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { MarketQuote } from '../feed/market-data'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'
import type { TradingBenchmarkState } from '../benchmark/trading-benchmark-controller'

const features = tableFeatures({
  ...stockFeatures,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { basic: sortFn_basic },
})

const selectRequestedVirtualScrollMode = (state: TradingBenchmarkState) =>
  state.requestedVirtualScrollMode

interface TradingTableProps {
  controller: TradingBenchmarkController
  feed: MarketFeedController
}

export function TradingTable({ controller, feed }: TradingTableProps) @{
  const quotes = useSelector(feed.quotes)
  const instrumentCount = useSelector(feed.instrumentCount)
  const requestedVirtualScrollMode = useSelector(
    controller.store,
    selectRequestedVirtualScrollMode,
    { compare: Object.is },
  )
  const rendererMode = useSelector(controller.renderAtoms.rendererMode)
  const selectedSymbol = useSelector(controller.renderAtoms.selectedSymbol)
  const columns = useMemo(
    () => createTradingColumns<typeof features>(controller, rendererMode),
    [controller, rendererMode],
  )
  const table = useTable(
    {
      features,
      columns,
      data: quotes,
      getRowId: (row: MarketQuote) => row.id,
      columnResizeMode: 'onChange',
      defaultColumn: { minSize: 56, maxSize: 800 },
      autoResetCellSelection: false,
    },
    (state) => ({
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnOrder: state.columnOrder,
      rowSelection: state.rowSelection,
      cellSelection: state.cellSelection,
    }),
  )
  const rows = readMeasuredRows(() => table.getRowModel().rows)
  const virtualMode = resolveVirtualScrollMode(
    requestedVirtualScrollMode,
    instrumentCount,
  )
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const tableRef = useRef<HTMLTableElement | null>(null)
  const bodyRef = useRef<HTMLTableSectionElement | null>(null)
  const manuallyResized = useRef(false)
  const pointer = useTradingGridPointer(table, controller.actions.selectSymbol)
  const drag = useRef({
    columnId: null as string | null,
    source: null as HTMLTableCellElement | null,
    target: null as HTMLTableCellElement | null,
  })
  const virtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => TRADING_ROW_HEIGHT,
    overscan: TRADING_ROW_OVERSCAN,
    enabled: virtualMode === 'tanstack',
    getItemKey: (index) => rows[index]?.id ?? index,
  })
  const virtualRows = virtualMode === 'tanstack' ? virtualizer.getVirtualItems() : []
  const renderedRowCount = virtualMode === 'tanstack' ? virtualRows.length : rows.length
  const range = virtualizer.range
  const visibleRange = virtualMode === 'tanstack' && range && rows.length > 0
    ? { start: Math.min(range.startIndex, rows.length - 1), end: Math.min(range.endIndex, rows.length - 1) }
    : null

  useLayoutEffect(() => {
    controller.actions.setRenderedRowCount(renderedRowCount)
    feed.completeRender()
  }, null)

  useLayoutEffect(() => {
    const writeColumnSizes = () => {
      const element = tableRef.current
      if (!element) return
      for (const header of table.getFlatHeaders()) {
        element.style.setProperty(`--header-${header.id}-size`, String(header.getSize()))
        element.style.setProperty(`--col-${header.column.id}-size`, String(header.column.getSize()))
      }
      element.style.width = `${table.getTotalSize()}px`
    }
    const fitAvailableWidth = () => {
      const container = scrollRef.current
      if (!container || manuallyResized.current) return
      const width = table.getTotalSize()
      if (container.clientWidth <= width + 1 || width <= 0) return
      const ratio = container.clientWidth / width
      table.setColumnSizing(Object.fromEntries(
        table.getVisibleLeafColumns().map((column) => [column.id, column.getSize() * ratio]),
      ))
    }
    const sizing = table.atoms.columnSizing.subscribe(writeColumnSizes)
    const order = table.atoms.columnOrder.subscribe(writeColumnSizes)
    const resizing = table.atoms.columnResizing.subscribe((state) => {
      if (state.isResizingColumn !== false) manuallyResized.current = true
    })
    const resizeObserver = new ResizeObserver(fitAvailableWidth)
    if (scrollRef.current) resizeObserver.observe(scrollRef.current)
    writeColumnSizes()
    fitAvailableWidth()
    const stopBenchmark = startTableBenchmark(controller, bodyRef.current)
    return () => {
      sizing.unsubscribe()
      order.unsubscribe()
      resizing.unsubscribe()
      resizeObserver.disconnect()
      stopBenchmark()
    }
  }, [controller, table.store])

  const clearDrag = () => {
    drag.current.source?.classList.remove('is-column-dragging')
    drag.current.target?.classList.remove('is-column-drop-target')
    drag.current.columnId = null
    drag.current.source = null
    drag.current.target = null
  }
  const showDropTarget = (columnId: string, element: HTMLTableCellElement | null) => {
    drag.current.target?.classList.remove('is-column-drop-target')
    drag.current.target = null
    if (drag.current.columnId === columnId || !element) return
    element.classList.add('is-column-drop-target')
    drag.current.target = element
  }
  const renderRow = (
    row: (typeof rows)[number],
    virtualRow?: { index: number; start: number },
  ) => (
    <tr
      key={row.id}
      className={virtualRow ? 'virtual-table-row' : undefined}
      style={virtualRow ? { transform: `translateY(${virtualRow.start}px)` } : undefined}
      data-virtual-index={virtualRow?.index}
      data-symbol={row.original.symbol}
      data-row-id={row.original.id}
      data-symbol-selected={selectedSymbol === row.original.symbol ? 'true' : undefined}
      title={row.original.company}
      aria-selected={row.getIsSelected()}
    >
      @for (const cell of row.getVisibleCells(); key cell.id) {
        const edges = cell.getSelectionEdges()
        <td
          style={{ width: `calc(var(--col-${cell.column.id}-size) * 1px)` }}
          data-column-id={cell.column.id}
          data-cell-focused={cell.getIsFocused() ? 'true' : undefined}
          data-selection-top={edges.top ? 'true' : undefined}
          data-selection-right={edges.right ? 'true' : undefined}
          data-selection-bottom={edges.bottom ? 'true' : undefined}
          data-selection-left={edges.left ? 'true' : undefined}
          aria-selected={cell.getIsSelected()}
          tabIndex={cell.getTabIndex()}
        >
          <table.FlexRender cell={cell} />
        </td>
      }
    </tr>
  )

  <>
    <div
      ref={scrollRef}
      className={`table-scroll${virtualMode === 'tanstack' ? ' is-virtualized' : ''}`}
      data-trading-table
    >
      <table
        ref={tableRef}
        className={`trading-data-grid${virtualMode === 'tanstack' ? ' virtual-table' : ''}`}
        data-testid="trading-table"
        role="grid"
        aria-multiselectable="true"
        tabIndex={0}
        onKeyDown={(event) => handleCellNavigation(table, event)}
      >
        <thead>
          @for (const group of table.getHeaderGroups(); key group.id) {
            <tr>
              @for (const header of group.headers; key header.id) {
                const leaf = header.subHeaders.length === 0
                const sorted = header.column.getIsSorted()
                <th
                  colSpan={header.colSpan}
                  style={{ width: `calc(var(--header-${header.id}-size) * 1px)` }}
                  aria-sort={leaf ? sortAriaValue(sorted) : undefined}
                  className={`${!leaf ? 'column-group-header' : ''} ${leaf && !['market', 'name', 'symbol'].includes(header.column.id) ? 'numeric-header' : ''}`}
                >
                  {!header.isPlaceholder && (leaf ? <>
                    <div
                      className="leaf-header-content"
                      onDragOver={(event) => {
                        event.preventDefault()
                        showDropTarget(header.column.id, event.currentTarget.closest('th'))
                      }}
                      onDrop={(event) => {
                        event.preventDefault()
                        const source = event.dataTransfer?.getData('text/plain') || drag.current.columnId
                        if (source) {
                          table.setColumnOrder(reorderColumnIds(
                            table.getVisibleLeafColumns().map((column) => column.id),
                            source,
                            header.column.id,
                          ))
                        }
                        clearDrag()
                      }}
                    >
                      <button
                        type="button"
                        className="column-drag-handle"
                        draggable
                        aria-label={`Move ${header.column.id} column`}
                        onDragStart={(event) => {
                          drag.current.columnId = header.column.id
                          drag.current.source = event.currentTarget.closest('th')
                          drag.current.source?.classList.add('is-column-dragging')
                          if (event.dataTransfer) {
                            event.dataTransfer.effectAllowed = 'move'
                            event.dataTransfer.setData('text/plain', header.column.id)
                          }
                        }}
                        onDragEnd={clearDrag}
                      >⋮⋮</button>
                      <button
                        type="button"
                        className={`sort-header-button ${header.column.getCanSort() ? 'is-sortable' : ''}`}
                        disabled={!header.column.getCanSort()}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="header-label"><table.FlexRender header={header} /></span>
                        {header.column.getCanSort() && <span className={`sort-indicator ${sorted ? 'is-active' : ''}`} aria-hidden="true">{sortIndicator(sorted)}</span>}
                      </button>
                    </div>
                    {header.column.getCanResize() && <div
                      className={`column-resize-handle ${header.column.getIsResizing() ? 'is-resizing' : ''}`}
                      role="separator"
                      aria-orientation="vertical"
                      onDoubleClick={() => header.column.resetSize()}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                    />}
                  </> : <table.FlexRender header={header} />)}
                </th>
              }
            </tr>
          }
        </thead>
        <tbody
          ref={bodyRef}
          className={virtualMode === 'tanstack' ? 'virtual-table-body' : undefined}
          style={virtualMode === 'tanstack' ? { height: `${virtualizer.getTotalSize()}px` } : undefined}
          data-source-row-count={quotes.length}
          onMouseDown={pointer.onMouseDown}
          onPointerOver={pointer.onPointerOver}
          onMouseLeave={pointer.onMouseLeave}
          onClick={pointer.onClick}
        >
          {virtualMode === 'tanstack'
            ? virtualRows.map((item) => renderRow(rows[item.index]!, item))
            : rows.map((row) => renderRow(row))}
        </tbody>
      </table>
    </div>
    {virtualMode === 'tanstack' && <footer className="virtual-scroll-footer" data-testid="virtual-scroll-footer">
      <span>TanStack · Total · {rows.length} rows · {table.getVisibleLeafColumns().length} columns</span>
      <span data-testid="visible-row-range">{visibleRange ? `Current · rows ${visibleRange.start}..${visibleRange.end}` : 'Current · rows —'}</span>
    </footer>}
  </>
}
