import {
  FlexRender,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  sortFn_basic,
  stockFeatures,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useLayoutEffect, useRef } from 'react'
import { useTableBenchmark } from '../benchmark/use-table-benchmark'
import {
  useMarketFeedController,
  useMarketFeedState,
  useTradingShellController,
  useTradingShellState,
} from '../shell/trading-shell-context'
import {
  TradingRow,
  readMeasuredRows,
  tradingColumns,
} from './table-config/trading-table-config'
import {
  handleCellNavigation,
  reorderColumnIds,
  sortAriaValue,
  sortIndicator,
} from './table-interactions'
import { useTradingGridPointer } from './use-trading-grid-pointer'
import {
  TRADING_ROW_HEIGHT,
  TRADING_ROW_OVERSCAN,
  resolveVirtualScrollMode,
} from './trading-row-virtualizer'
import type { VirtualScrollMode } from './trading-row-virtualizer'
import type {
  CellSelectionBounds,
  CellSelectionState,
} from '@tanstack/react-table'
import type { VirtualItem } from '@tanstack/react-virtual'
import type { MarketQuote } from '../feed/market-data'
import type { CoreTableState } from './table-config/trading-table-config'

export {
  TRADING_COLUMN_COUNT,
  rowModelDiagnostics,
} from './table-config/trading-table-config'
export type {
  CoreTableState,
  RendererMode,
} from './table-config/trading-table-config'
export type { VirtualScrollMode } from './trading-row-virtualizer'

const features = tableFeatures({
  ...stockFeatures,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { basic: sortFn_basic },
})

export function TradingTable() {
  const controller = useTradingShellController()
  const feed = useMarketFeedController()
  const quotes = useMarketFeedState((state) => state.quotes)
  const requestedVirtualScrollMode = useTradingShellState(
    (state) => state.requestedVirtualScrollMode,
  )
  const instrumentCount = useMarketFeedState((state) => state.instrumentCount)
  const virtualScrollMode = resolveVirtualScrollMode(
    requestedVirtualScrollMode,
    instrumentCount,
  )

  useLayoutEffect(() => feed.completeRender())
  useTableBenchmark(controller)
  const table = useTradingTable({ quotes })
  const layoutRefs = useTradingTableLayout(table)

  return (
    <table.Subscribe
      selector={(state) => ({
        sorting: state.sorting,
        columnFilters: state.columnFilters,
        columnOrder: state.columnOrder,
      })}
    >
      {(coreState) => (
        <TradingTableViewport
          table={table}
          rows={readRows(table, quotes, coreState)}
          sourceRowCount={quotes.length}
          layoutRefs={layoutRefs}
          virtualScrollMode={virtualScrollMode}
          reportRenderedRowCount={controller.actions.setRenderedRowCount}
        />
      )}
    </table.Subscribe>
  )
}

type TradingTableInstance = ReturnType<typeof useTradingTable>

interface ColumnDragRuntime {
  columnId: string | null
  sourceElement: HTMLTableCellElement | null
  targetElement: HTMLTableCellElement | null
}

function clearColumnDrag(runtime: ColumnDragRuntime): void {
  runtime.sourceElement?.classList.remove('is-column-dragging')
  runtime.targetElement?.classList.remove('is-column-drop-target')
  runtime.columnId = null
  runtime.sourceElement = null
  runtime.targetElement = null
}

function showColumnDropTarget(
  runtime: ColumnDragRuntime,
  targetColumnId: string,
  targetElement: HTMLTableCellElement | null,
): void {
  runtime.targetElement?.classList.remove('is-column-drop-target')
  runtime.targetElement = null
  if (runtime.columnId === targetColumnId || !targetElement) return
  targetElement.classList.add('is-column-drop-target')
  runtime.targetElement = targetElement
}

function useTradingTableLayout(table: TradingTableInstance) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const fitRuntime = useRef({ manuallyResized: false })

  useLayoutEffect(() => {
    const writeColumnSizes = () => {
      const tableElement = tableRef.current
      if (!tableElement) return
      for (const header of table.getFlatHeaders()) {
        tableElement.style.setProperty(
          `--header-${header.id}-size`,
          String(header.getSize()),
        )
        tableElement.style.setProperty(
          `--col-${header.column.id}-size`,
          String(header.column.getSize()),
        )
      }
      tableElement.style.width = `${table.getTotalSize()}px`
    }

    writeColumnSizes()
    const sizingSubscription =
      table.atoms.columnSizing.subscribe(writeColumnSizes)
    const orderSubscription =
      table.atoms.columnOrder.subscribe(writeColumnSizes)
    const fitAvailableWidth = () => {
      const scrollElement = scrollRef.current
      if (!scrollElement || fitRuntime.current.manuallyResized) return
      const currentWidth = table.getTotalSize()
      const availableWidth = scrollElement.clientWidth
      if (availableWidth <= currentWidth + 1 || currentWidth <= 0) return

      const ratio = availableWidth / currentWidth
      table.setColumnSizing(
        Object.fromEntries(
          table
            .getVisibleLeafColumns()
            .map((column) => [column.id, column.getSize() * ratio]),
        ),
      )
    }
    const resizeObserver = new ResizeObserver(fitAvailableWidth)
    const resizingSubscription = table.atoms.columnResizing.subscribe(
      (state) => {
        if (state.isResizingColumn !== false) {
          fitRuntime.current.manuallyResized = true
        }
      },
    )
    if (scrollRef.current) resizeObserver.observe(scrollRef.current)
    fitAvailableWidth()

    return () => {
      sizingSubscription.unsubscribe()
      orderSubscription.unsubscribe()
      resizingSubscription.unsubscribe()
      resizeObserver.disconnect()
    }
  }, [table])

  return { scrollRef, tableRef }
}

function TradingTableHeader(props: { table: TradingTableInstance }) {
  const dragRuntime = useRef<ColumnDragRuntime>({
    columnId: null,
    sourceElement: null,
    targetElement: null,
  })

  return (
    <props.table.Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        sorting: state.sorting,
      })}
    >
      {() => (
        <thead>
          {props.table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isLeaf = header.subHeaders.length === 0
                const sorted = header.column.getIsSorted()
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: `calc(var(--header-${header.id}-size) * 1px)`,
                    }}
                    className={getHeaderClassName(header)}
                    aria-sort={isLeaf ? sortAriaValue(sorted) : undefined}
                  >
                    {!header.isPlaceholder &&
                      (isLeaf ? (
                        <>
                          <div
                            className="leaf-header-content"
                            onDragOver={(event) => {
                              event.preventDefault()
                              showColumnDropTarget(
                                dragRuntime.current,
                                header.column.id,
                                event.currentTarget.closest('th'),
                              )
                            }}
                            onDrop={(event) => {
                              event.preventDefault()
                              const sourceId =
                                event.dataTransfer.getData('text/plain') ||
                                dragRuntime.current.columnId
                              if (sourceId) {
                                props.table.setColumnOrder(
                                  reorderColumnIds(
                                    props.table
                                      .getVisibleLeafColumns()
                                      .map((column) => column.id),
                                    sourceId,
                                    header.column.id,
                                  ),
                                )
                              }
                              clearColumnDrag(dragRuntime.current)
                            }}
                          >
                            <button
                              type="button"
                              className="column-drag-handle"
                              draggable
                              aria-label={`Move ${header.column.id} column`}
                              onDragStart={(event) => {
                                const runtime = dragRuntime.current
                                runtime.columnId = header.column.id
                                runtime.sourceElement =
                                  event.currentTarget.closest('th')
                                runtime.sourceElement?.classList.add(
                                  'is-column-dragging',
                                )
                                event.dataTransfer.effectAllowed = 'move'
                                event.dataTransfer.setData(
                                  'text/plain',
                                  header.column.id,
                                )
                              }}
                              onDragEnd={() => {
                                clearColumnDrag(dragRuntime.current)
                              }}
                            >
                              ⋮⋮
                            </button>
                            <button
                              type="button"
                              className={`sort-header-button${
                                header.column.getCanSort() ? ' is-sortable' : ''
                              }`}
                              disabled={!header.column.getCanSort()}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span className="header-label">
                                <FlexRender header={header} />
                              </span>
                              {header.column.getCanSort() && (
                                <span
                                  className={`sort-indicator${
                                    sorted ? ' is-active' : ''
                                  }`}
                                  aria-hidden="true"
                                >
                                  {sortIndicator(sorted)}
                                </span>
                              )}
                            </button>
                          </div>
                          {header.column.getCanResize() && (
                            <props.table.Subscribe
                              selector={(state) =>
                                state.columnResizing.isResizingColumn ===
                                header.column.id
                              }
                            >
                              {(isResizing) => (
                                <div
                                  className={`column-resize-handle${
                                    isResizing ? ' is-resizing' : ''
                                  }`}
                                  role="separator"
                                  aria-orientation="vertical"
                                  onDoubleClick={() =>
                                    header.column.resetSize()
                                  }
                                  onMouseDown={header.getResizeHandler()}
                                  onTouchStart={header.getResizeHandler()}
                                />
                              )}
                            </props.table.Subscribe>
                          )}
                        </>
                      ) : (
                        <FlexRender header={header} />
                      ))}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
      )}
    </props.table.Subscribe>
  )
}

function useTradingTable(props: { quotes: Array<MarketQuote> }) {
  return useTable(
    {
      key: 'react-realtime-trading',
      features,
      columns: tradingColumns,
      data: props.quotes,
      getRowId: (row) => row.id,
      columnResizeMode: 'onChange',
      defaultColumn: { minSize: 56, maxSize: 800 },
      autoResetCellSelection: false,
    },
    () => null,
  )
}

function TradingTableViewport(props: {
  table: ReturnType<typeof useTradingTable>
  rows: ReturnType<ReturnType<typeof useTradingTable>['getRowModel']>['rows']
  sourceRowCount: number
  layoutRefs: ReturnType<typeof useTradingTableLayout>
  virtualScrollMode: VirtualScrollMode
  reportRenderedRowCount: (count: number) => void
}) {
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: props.rows.length,
    estimateSize: () => TRADING_ROW_HEIGHT,
    getScrollElement: () => props.layoutRefs.scrollRef.current,
    getItemKey: (index) => props.rows[index]?.id ?? index,
    overscan: TRADING_ROW_OVERSCAN,
    enabled: props.virtualScrollMode === 'tanstack',
  })
  const virtualRows = rowVirtualizer.getVirtualItems()
  const renderedRowCount =
    props.virtualScrollMode === 'tanstack'
      ? virtualRows.length
      : props.rows.length
  const visibleRange = readVisibleRange(
    rowVirtualizer.range,
    props.rows.length,
    props.virtualScrollMode,
  )

  useLayoutEffect(() => {
    props.reportRenderedRowCount(renderedRowCount)
  }, [props.reportRenderedRowCount, renderedRowCount])

  return (
    <>
      <div
        ref={props.layoutRefs.scrollRef}
        className={`table-scroll${
          props.virtualScrollMode === 'tanstack' ? ' is-virtualized' : ''
        }`}
        data-trading-table
        tabIndex={0}
        onKeyDown={(event) => handleCellNavigation(props.table, event)}
      >
        <table
          ref={props.layoutRefs.tableRef}
          className={`trading-data-grid${
            props.virtualScrollMode === 'tanstack' ? ' virtual-table' : ''
          }`}
          data-testid="trading-table"
          role="grid"
          aria-multiselectable="true"
        >
          <TradingTableHeader table={props.table} />
          <TradingRows
            table={props.table}
            rows={props.rows}
            sourceRowCount={props.sourceRowCount}
            virtualRows={virtualRows}
            virtualScrollMode={props.virtualScrollMode}
          />
        </table>
      </div>
      {props.virtualScrollMode === 'tanstack' && (
        <footer
          className="virtual-scroll-footer"
          data-testid="virtual-scroll-footer"
        >
          <span>
            TanStack · Total · {props.rows.length} rows ·{' '}
            {props.table.getVisibleLeafColumns().length} columns
          </span>
          <span data-testid="visible-row-range">
            {visibleRange
              ? `Current · rows ${visibleRange.start}..${visibleRange.end}`
              : 'Current · rows —'}
          </span>
        </footer>
      )}
    </>
  )
}

function TradingRows(props: {
  table: ReturnType<typeof useTradingTable>
  rows: ReturnType<ReturnType<typeof useTradingTable>['getRowModel']>['rows']
  sourceRowCount: number
  virtualRows: Array<VirtualItem>
  virtualScrollMode: VirtualScrollMode
}) {
  const { selectSymbol } = useTradingShellController().actions
  const pointerInteractions = useTradingGridPointer(props.table, selectSymbol)

  return (
    <tbody
      className={
        props.virtualScrollMode === 'tanstack'
          ? 'virtual-table-body'
          : undefined
      }
      style={
        props.virtualScrollMode === 'tanstack'
          ? { height: `${props.rows.length * TRADING_ROW_HEIGHT}px` }
          : undefined
      }
      data-source-row-count={props.sourceRowCount}
      {...pointerInteractions}
    >
      {props.virtualScrollMode === 'tanstack'
        ? props.virtualRows.map((virtualRow) => {
            const row = props.rows[virtualRow.index]
            return (
              <TradingRowBoundary
                key={row.id}
                table={props.table}
                row={row}
                virtualRow={virtualRow}
              />
            )
          })
        : props.rows.map((row) => (
            <TradingRowBoundary key={row.id} table={props.table} row={row} />
          ))}
    </tbody>
  )
}

type TradingTableRow = ReturnType<
  ReturnType<typeof useTradingTable>['getRowModel']
>['rows'][number]

function TradingRowBoundary(props: {
  table: ReturnType<typeof useTradingTable>
  row: TradingTableRow
  virtualRow?: VirtualItem
}) {
  const { row, table, virtualRow } = props

  return (
    <table.Subscribe
      selector={(state) =>
        `${row.id in state.rowSelection ? 1 : 0}:${cellSelectionRowKey(
          state.cellSelection,
          table.getCellSelectionBounds(),
          row.getDisplayIndex(),
          row.id,
        )}`
      }
    >
      {() => (
        <TradingRow
          quote={row.original}
          rowSelected={row.getIsSelected()}
          virtualRow={virtualRow}
        >
          {row.getVisibleCells().map((cell) => {
            const edges = cell.getSelectionEdges()

            return (
              <td
                key={cell.id}
                style={{
                  width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                }}
                data-column-id={cell.column.id}
                data-cell-focused={cell.getIsFocused() ? 'true' : undefined}
                data-selection-top={edges.top ? 'true' : undefined}
                data-selection-right={edges.right ? 'true' : undefined}
                data-selection-bottom={edges.bottom ? 'true' : undefined}
                data-selection-left={edges.left ? 'true' : undefined}
                aria-selected={cell.getIsSelected()}
                tabIndex={cell.getTabIndex()}
              >
                <FlexRender cell={cell} />
              </td>
            )
          })}
        </TradingRow>
      )}
    </table.Subscribe>
  )
}

function getHeaderClassName(header: {
  subHeaders: ReadonlyArray<unknown>
  column: { id: string }
}): string | undefined {
  if (header.subHeaders.length > 0) return 'column-group-header'
  return isTextColumn(header.column.id) ? undefined : 'numeric-header'
}

function isTextColumn(columnId: string): boolean {
  return columnId === 'market' || columnId === 'name' || columnId === 'symbol'
}

function readVisibleRange(
  range: { startIndex: number; endIndex: number } | null,
  rowCount: number,
  virtualScrollMode: VirtualScrollMode,
): { start: number; end: number } | null {
  if (virtualScrollMode !== 'tanstack' || rowCount === 0 || range === null) {
    return null
  }

  const lastRowIndex = rowCount - 1
  const start = Math.min(range.startIndex, lastRowIndex)
  return {
    start,
    end: Math.min(Math.max(start, range.endIndex), lastRowIndex),
  }
}

function readRows(
  table: ReturnType<typeof useTradingTable>,
  quoteSnapshot: Array<MarketQuote>,
  coreState: CoreTableState,
) {
  void quoteSnapshot
  void coreState
  return readMeasuredRows(() => table.getRowModel().rows)
}

function cellSelectionRowKey(
  ranges: CellSelectionState,
  bounds: Array<CellSelectionBounds>,
  rowIndex: number,
  rowId: string,
): string {
  const active = ranges.at(-1)
  const initial =
    active?.anchorRowId === rowId ? `f${active.anchorColumnId}` : ''

  return bounds.reduce((key, bound) => {
    const self = rowIndex >= bound.minRowIndex && rowIndex <= bound.maxRowIndex
    const above =
      rowIndex - 1 >= bound.minRowIndex && rowIndex - 1 <= bound.maxRowIndex
    const below =
      rowIndex + 1 >= bound.minRowIndex && rowIndex + 1 <= bound.maxRowIndex
    if (!self && !above && !below) return key
    return `${key}|${self ? 1 : 0}${above ? 1 : 0}${below ? 1 : 0}:${bound.minColumnIndex}-${bound.maxColumnIndex}`
  }, initial)
}
