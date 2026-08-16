import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watchEffect,
} from 'vue'
import { useSelector } from '@tanstack/vue-store'
import {
  FlexRender,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  sortFn_basic,
  stockFeatures,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useTableBenchmark } from '../benchmark/use-table-benchmark'
import {
  useMarketFeedController,
  useMarketFeedState,
  useTradingShellController,
  useTradingShellState,
} from '../shell/trading-shell-context'
import {
  TRADING_COLUMN_COUNT,
  readMeasuredRows,
  rowModelDiagnostics,
  tradingColumns,
} from './table-config/trading-columns'
import {
  TradingGridPointerController,
  handleCellNavigation,
  reorderColumnIds,
  sortAriaValue,
  sortIndicator,
} from './table-interactions'
import {
  TRADING_ROW_HEIGHT,
  TRADING_ROW_OVERSCAN,
  resolveVirtualScrollMode,
} from './trading-row-virtualizer'
import type { PropType } from 'vue'
import type { VirtualItem } from '@tanstack/vue-virtual'
import type { MarketQuote } from '../feed/market-data'

export { TRADING_COLUMN_COUNT, rowModelDiagnostics }
export type {
  CoreTableState,
  RendererMode,
} from './table-config/trading-columns'
export type { VirtualScrollMode } from './trading-row-virtualizer'

const features = tableFeatures({
  ...stockFeatures,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { basic: sortFn_basic },
})

type TradingTableInstance = ReturnType<typeof useTable<typeof features, MarketQuote>>
type TradingRow = ReturnType<TradingTableInstance['getRowModel']>['rows'][number]

interface ColumnDragRuntime {
  columnId: string | null
  sourceElement: HTMLTableCellElement | null
  targetElement: HTMLTableCellElement | null
}

const TradingRowView = defineComponent({
  name: 'TradingRowView',
  props: {
    row: { type: Object as PropType<TradingRow>, required: true },
    virtualRow: Object as PropType<VirtualItem>,
  },
  setup(props, { slots }) {
    const selectedSymbol = useSelector(
      useTradingShellController().renderAtoms.selectedSymbol,
    )
    return () => (
      <tr
        class={props.virtualRow ? 'virtual-table-row' : undefined}
        style={
          props.virtualRow
            ? { transform: `translateY(${props.virtualRow.start}px)` }
            : undefined
        }
        data-virtual-index={props.virtualRow?.index}
        data-symbol={props.row.original.symbol}
        data-row-id={props.row.original.id}
        data-symbol-selected={
          selectedSymbol.value === props.row.original.symbol
            ? 'true'
            : undefined
        }
        title={props.row.original.company}
        aria-selected={props.row.getIsSelected()}
      >
        {slots.default?.()}
      </tr>
    )
  },
})

export const TradingTable = defineComponent({
  name: 'TradingTable',
  setup() {
    const controller = useTradingShellController()
    const feed = useMarketFeedController()
    const quotes = useMarketFeedState((state) => state.quotes)
    const instrumentCount = useMarketFeedState(
      (state) => state.instrumentCount,
    )
    const requestedVirtualScrollMode = useTradingShellState(
      (state) => state.requestedVirtualScrollMode,
    )
    const virtualScrollMode = computed(() =>
      resolveVirtualScrollMode(
        requestedVirtualScrollMode.value,
        instrumentCount.value,
      ),
    )
    const table = useTable({
      key: 'vue-realtime-trading',
      features,
      columns: tradingColumns,
      get data() {
        return quotes.value
      },
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
    const rows = computed(() => {
      void quotes.value
      tableState.value
      return readMeasuredRows(() => table.getRowModel().rows)
    })
    const scrollElement = ref<HTMLDivElement | null>(null)
    const tableElement = ref<HTMLTableElement | null>(null)
    const virtualizer = useVirtualizer(
      computed(() => ({
        count: rows.value.length,
        estimateSize: () => TRADING_ROW_HEIGHT,
        getScrollElement: () => scrollElement.value,
        getItemKey: (index: number) => rows.value[index]?.id ?? index,
        overscan: TRADING_ROW_OVERSCAN,
        enabled: virtualScrollMode.value === 'tanstack',
      })),
    )
    const virtualRows = computed(() => virtualizer.value.getVirtualItems())
    const visibleRange = computed(() => {
      const range = virtualizer.value.range
      if (
        virtualScrollMode.value !== 'tanstack' ||
        rows.value.length === 0 ||
        range === null
      ) {
        return null
      }
      const lastIndex = rows.value.length - 1
      const start = Math.min(range.startIndex, lastIndex)
      return {
        start,
        end: Math.min(Math.max(start, range.endIndex), lastIndex),
      }
    })
    const pointerInteractions = new TradingGridPointerController()
    const dragRuntime: ColumnDragRuntime = {
      columnId: null,
      sourceElement: null,
      targetElement: null,
    }
    const layoutRuntime = { manuallyResized: false }

    useTableBenchmark(controller)
    onUpdated(() => feed.completeRender())
    onMounted(() => feed.completeRender())

    const writeColumnSizes = (): void => {
      const element = tableElement.value
      if (!element) return
      for (const header of table.getFlatHeaders()) {
        element.style.setProperty(
          `--header-${header.id}-size`,
          String(header.getSize()),
        )
        element.style.setProperty(
          `--col-${header.column.id}-size`,
          String(header.column.getSize()),
        )
      }
      element.style.width = `${table.getTotalSize()}px`
    }
    const fitAvailableWidth = (): void => {
      const container = scrollElement.value
      if (!container || layoutRuntime.manuallyResized) return
      const currentWidth = table.getTotalSize()
      if (container.clientWidth <= currentWidth + 1 || currentWidth <= 0) return
      const ratio = container.clientWidth / currentWidth
      table.setColumnSizing(
        Object.fromEntries(
          table
            .getVisibleLeafColumns()
            .map((column) => [column.id, column.getSize() * ratio]),
        ),
      )
    }
    const resizeObserver = new ResizeObserver(fitAvailableWidth)
    const sizingSubscription = table.atoms.columnSizing.subscribe(
      writeColumnSizes,
    )
    const orderSubscription = table.atoms.columnOrder.subscribe(writeColumnSizes)
    const resizingSubscription = table.atoms.columnResizing.subscribe((state) => {
      if (state.isResizingColumn !== false) layoutRuntime.manuallyResized = true
    })
    onMounted(() => {
      nextTick(() => {
        writeColumnSizes()
        fitAvailableWidth()
        if (scrollElement.value) resizeObserver.observe(scrollElement.value)
      })
    })
    onBeforeUnmount(() => {
      sizingSubscription.unsubscribe()
      orderSubscription.unsubscribe()
      resizingSubscription.unsubscribe()
      resizeObserver.disconnect()
    })
    watchEffect(() => {
      controller.actions.setRenderedRowCount(
        virtualScrollMode.value === 'tanstack'
          ? virtualRows.value.length
          : rows.value.length,
      )
    })

    const clearColumnDrag = (): void => {
      dragRuntime.sourceElement?.classList.remove('is-column-dragging')
      dragRuntime.targetElement?.classList.remove('is-column-drop-target')
      dragRuntime.columnId = null
      dragRuntime.sourceElement = null
      dragRuntime.targetElement = null
    }
    const showColumnDropTarget = (
      columnId: string,
      element: HTMLTableCellElement | null,
    ): void => {
      dragRuntime.targetElement?.classList.remove('is-column-drop-target')
      dragRuntime.targetElement = null
      if (dragRuntime.columnId === columnId || !element) return
      element.classList.add('is-column-drop-target')
      dragRuntime.targetElement = element
    }

    const renderRow = (row: TradingRow, virtualRow?: VirtualItem) => (
      <TradingRowView key={row.id} row={row} virtualRow={virtualRow}>
        {{
          default: () =>
            row.getVisibleCells().map((cell) => {
              const edges = cell.getSelectionEdges()
              return (
                <td
                  key={cell.id}
                  style={{
                    width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                  }}
                  data-column-id={cell.column.id}
                  data-cell-focused={
                    cell.getIsFocused() ? 'true' : undefined
                  }
                  data-selection-top={edges.top ? 'true' : undefined}
                  data-selection-right={edges.right ? 'true' : undefined}
                  data-selection-bottom={edges.bottom ? 'true' : undefined}
                  data-selection-left={edges.left ? 'true' : undefined}
                  aria-selected={cell.getIsSelected()}
                  tabindex={cell.getTabIndex()}
                >
                  <FlexRender cell={cell} />
                </td>
              )
            }),
        }}
      </TradingRowView>
    )

    return () => {
      tableState.value
      const currentRows = rows.value
      const activeVirtualRows = virtualRows.value
      return (
        <>
          <div
            ref={scrollElement}
            class={[
              'table-scroll',
              virtualScrollMode.value === 'tanstack' && 'is-virtualized',
            ]}
            data-trading-table
            tabindex={0}
            onKeydown={(event) => handleCellNavigation(table, event)}
          >
            <table
              ref={tableElement}
              class={[
                'trading-data-grid',
                virtualScrollMode.value === 'tanstack' && 'virtual-table',
              ]}
              data-testid="trading-table"
              role="grid"
              aria-multiselectable="true"
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isLeaf = header.subHeaders.length === 0
                      const sorted = header.column.getIsSorted()
                      return (
                        <th
                          key={header.id}
                          colspan={header.colSpan}
                          style={{
                            width: `calc(var(--header-${header.id}-size) * 1px)`,
                          }}
                          aria-sort={isLeaf ? sortAriaValue(sorted) : undefined}
                          class={[
                            !isLeaf && 'column-group-header',
                            isLeaf &&
                              !isTextColumn(header.column.id) &&
                              'numeric-header',
                          ]}
                        >
                          {!header.isPlaceholder &&
                            (isLeaf ? (
                              <>
                                <div
                                  class="leaf-header-content"
                                  onDragover={(event) => {
                                    event.preventDefault()
                                    showColumnDropTarget(
                                      header.column.id,
                                      (
                                        event.currentTarget as HTMLElement
                                      ).closest('th'),
                                    )
                                  }}
                                  onDrop={(event) => {
                                    event.preventDefault()
                                    const sourceId =
                                      event.dataTransfer?.getData(
                                        'text/plain',
                                      ) || dragRuntime.columnId
                                    if (sourceId) {
                                      table.setColumnOrder(
                                        reorderColumnIds(
                                          table
                                            .getVisibleLeafColumns()
                                            .map((column) => column.id),
                                          sourceId,
                                          header.column.id,
                                        ),
                                      )
                                    }
                                    clearColumnDrag()
                                  }}
                                >
                                  <button
                                    type="button"
                                    class="column-drag-handle"
                                    draggable
                                    aria-label={`Move ${header.column.id} column`}
                                    onDragstart={(event) => {
                                      dragRuntime.columnId = header.column.id
                                      dragRuntime.sourceElement =
                                        (
                                          event.currentTarget as HTMLElement
                                        ).closest('th')
                                      dragRuntime.sourceElement?.classList.add(
                                        'is-column-dragging',
                                      )
                                      if (!event.dataTransfer) return
                                      event.dataTransfer.effectAllowed = 'move'
                                      event.dataTransfer.setData(
                                        'text/plain',
                                        header.column.id,
                                      )
                                    }}
                                    onDragend={clearColumnDrag}
                                  >
                                    ⋮⋮
                                  </button>
                                  <button
                                    type="button"
                                    class={[
                                      'sort-header-button',
                                      header.column.getCanSort() && 'is-sortable',
                                    ]}
                                    disabled={!header.column.getCanSort()}
                                    onClick={
                                      header.column.getToggleSortingHandler()
                                    }
                                  >
                                    <span class="header-label">
                                      <FlexRender header={header} />
                                    </span>
                                    {header.column.getCanSort() && (
                                      <span
                                        class={[
                                          'sort-indicator',
                                          sorted && 'is-active',
                                        ]}
                                        aria-hidden="true"
                                      >
                                        {sortIndicator(sorted)}
                                      </span>
                                    )}
                                  </button>
                                </div>
                                {header.column.getCanResize() && (
                                  <div
                                    class={[
                                      'column-resize-handle',
                                      header.column.getIsResizing() &&
                                        'is-resizing',
                                    ]}
                                    role="separator"
                                    aria-orientation="vertical"
                                    onDblclick={() => header.column.resetSize()}
                                    onMousedown={header.getResizeHandler()}
                                    onTouchstart={header.getResizeHandler()}
                                  />
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
              <tbody
                class={
                  virtualScrollMode.value === 'tanstack'
                    ? 'virtual-table-body'
                    : undefined
                }
                style={
                  virtualScrollMode.value === 'tanstack'
                    ? { height: `${currentRows.length * TRADING_ROW_HEIGHT}px` }
                    : undefined
                }
                data-source-row-count={quotes.value.length}
                onMousedown={(event) =>
                  pointerInteractions.handleMouseDown(
                    table,
                    event,
                    controller.actions.selectSymbol,
                  )
                }
                onPointerover={(event) =>
                  pointerInteractions.handlePointerOver(table, event)
                }
                onMouseleave={() => pointerInteractions.resetPointerCell()}
                onClick={(event) =>
                  pointerInteractions.handleClick(table, event)
                }
              >
                {virtualScrollMode.value === 'tanstack'
                  ? activeVirtualRows.map((virtualRow) =>
                      renderRow(currentRows[virtualRow.index], virtualRow),
                    )
                  : currentRows.map((row) => renderRow(row))}
              </tbody>
            </table>
          </div>
          {virtualScrollMode.value === 'tanstack' && (
            <footer
              class="virtual-scroll-footer"
              data-testid="virtual-scroll-footer"
            >
              <span>
                TanStack · Total · {currentRows.length} rows ·{' '}
                {table.getVisibleLeafColumns().length} columns
              </span>
              <span data-testid="visible-row-range">
                {visibleRange.value
                  ? `Current · rows ${visibleRange.value.start}..${visibleRange.value.end}`
                  : 'Current · rows —'}
              </span>
            </footer>
          )}
        </>
      )
    }
  },
})

function isTextColumn(columnId: string): boolean {
  return columnId === 'market' || columnId === 'name' || columnId === 'symbol'
}
