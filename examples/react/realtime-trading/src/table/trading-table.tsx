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
import { useLayoutEffect, useRef } from 'react'
import { useTableBenchmark } from '../benchmark/use-table-benchmark'
import {
  useMarketFeedController,
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
  selectRowFromPointer,
  sortAriaValue,
  sortIndicator,
} from './table-interactions'
import type {
  CellSelectionBounds,
  CellSelectionState,
} from '@tanstack/react-table'
import type { MarketQuote } from '../feed/market-data'
import type { CoreTableState } from './table-config/trading-table-config'

export {
  TRADING_COLUMN_COUNT,
  getCoreTableState,
  rowModelDiagnostics,
} from './table-config/trading-table-config'
export type {
  CoreRowModelMode,
  CoreTableState,
  RendererMode,
  TradingTableProps,
} from './table-config/trading-table-config'

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
  const quotes = useTradingShellState((state) => state.displayQuotes)
  const scrollStressMode = useTradingShellState(
    (state) => state.scrollStressMode,
  )

  useLayoutEffect(() => feed.completeRender())
  useTableBenchmark(controller, scrollStressMode)
  const table = useTradingTable({
    quotes,
    tableAtoms: controller.tableAtoms,
  })
  const layoutRefs = useTradingTableLayout(table)

  return (
    <div
      ref={layoutRefs.scrollRef}
      className="table-scroll"
      data-trading-table
      tabIndex={0}
      onKeyDown={(event) => handleCellNavigation(table, event)}
    >
      <table
        ref={layoutRefs.tableRef}
        className="trading-data-grid"
        role="grid"
        aria-multiselectable="true"
      >
        <TradingTableHeader table={table} />
        <TradingTableBody table={table} quotes={quotes} />
      </table>
    </div>
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

function useTradingTable(props: {
  quotes: Array<MarketQuote>
  tableAtoms: ReturnType<typeof useTradingShellController>['tableAtoms']
}) {
  return useTable(
    {
      key: 'react-realtime-trading',
      features,
      columns: tradingColumns,
      data: props.quotes,
      getRowId: (row) => row.id,
      atoms: props.tableAtoms,
      columnResizeMode: 'onChange',
      defaultColumn: { minSize: 56, maxSize: 800 },
      autoResetCellSelection: false,
    },
    () => null,
  )
}

function TradingTableBody(props: {
  table: ReturnType<typeof useTradingTable>
  quotes: Array<MarketQuote>
}) {
  return (
    <props.table.Subscribe
      selector={(state) => ({
        sorting: state.sorting,
        columnFilters: state.columnFilters,
        columnOrder: state.columnOrder,
      })}
    >
      {(coreState) => (
        <TradingRows
          table={props.table}
          quoteSnapshot={props.quotes}
          coreState={coreState}
        />
      )}
    </props.table.Subscribe>
  )
}

function TradingRows(props: {
  table: ReturnType<typeof useTradingTable>
  quoteSnapshot: Array<MarketQuote>
  coreState: CoreTableState
}) {
  const { selectSymbol } = useTradingShellController().actions
  const rows = readRows(props.table, props.quoteSnapshot, props.coreState)

  return (
    <tbody data-source-row-count={props.quoteSnapshot.length}>
      {rows.map((row) => (
        <props.table.Subscribe
          key={row.id}
          selector={(state) =>
            `${row.id in state.rowSelection ? 1 : 0}:${cellSelectionRowKey(
              state.cellSelection,
              props.table.getCellSelectionBounds(),
              row.getDisplayIndex(),
              row.id,
            )}`
          }
        >
          {() => (
            <TradingRow
              quote={row.original}
              rowSelected={row.getIsSelected()}
              onMouseDown={(event) => {
                if (event.button === 0) selectSymbol(row.original.symbol)
              }}
              onClick={(event) => selectRowFromPointer(props.table, row, event)}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                  }}
                  className={getCellClassName(cell)}
                  aria-selected={cell.getIsSelected()}
                  tabIndex={cell.getTabIndex()}
                  onMouseDown={cell.getSelectionStartHandler()}
                  onMouseEnter={cell.getSelectionExtendHandler()}
                >
                  <FlexRender cell={cell} />
                </td>
              ))}
            </TradingRow>
          )}
        </props.table.Subscribe>
      ))}
    </tbody>
  )
}

function getHeaderClassName(header: {
  subHeaders: ReadonlyArray<unknown>
  column: { id: string }
}): string | undefined {
  if (header.subHeaders.length > 0) return 'column-group-header'
  return isIdentityColumn(header.column.id) ? undefined : 'numeric-header'
}

function getCellClassName(cell: {
  column: { id: string }
  getIsFocused: () => boolean
  getIsSelected: () => boolean
  getSelectionEdges: () => {
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean
  }
}): string {
  const columnId = cell.column.id
  const edges = cell.getSelectionEdges()
  const classes = [
    columnId === 'market'
      ? 'market-cell'
      : columnId === 'name'
        ? 'name-cell'
        : columnId === 'symbol'
          ? 'symbol-cell'
          : 'numeric-cell',
  ]
  if (cell.getIsSelected()) classes.push('is-cell-selected')
  if (cell.getIsFocused()) classes.push('is-cell-focused')
  if (edges.top) classes.push('selection-top')
  if (edges.right) classes.push('selection-right')
  if (edges.bottom) classes.push('selection-bottom')
  if (edges.left) classes.push('selection-left')
  return classes.join(' ')
}

function isIdentityColumn(columnId: string): boolean {
  return columnId === 'market' || columnId === 'name' || columnId === 'symbol'
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
