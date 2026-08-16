import {
  FlexRender,
  createSortedRowModel,
  createTable,
  stockFeatures,
  tableFeatures,
} from '@tanstack/solid-table'
import { createVirtualizer } from '@tanstack/solid-virtual'
import {
  For,
  Index,
  Show,
  createEffect,
  createMemo,
  onCleanup,
  onMount,
} from 'solid-js'
import { useMarketFeedController } from '../shell/trading-shell-context'
import { createTradingColumns } from './table-config/trading-columns'
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
} from './trading-row-virtualizer'
import type { VirtualItem } from '@tanstack/solid-virtual'
import type { Accessor } from 'solid-js'
import type { TradingTableProps } from './table-config/trading-columns'

const features = tableFeatures({
  ...stockFeatures,
  sortedRowModel: createSortedRowModel(),
})

export { TRADING_COLUMN_COUNT } from './table-config/trading-columns'
export type {
  RendererMode,
  TradingTableProps,
} from './table-config/trading-columns'

export function TradingTable(props: TradingTableProps) {
  const feed = useMarketFeedController()
  const pointerInteractions = new TradingGridPointerController()
  const columns = createTradingColumns(props)
  const dragRuntime: ColumnDragRuntime = {
    columnId: null,
    sourceElement: null,
    targetElement: null,
  }
  const layoutRuntime: TableLayoutRuntime = {
    manuallyResized: false,
    scrollElement: null,
  }
  const table = createTable({
    key: 'solid-realtime-trading',
    features,
    columnResizeMode: 'onChange',
    defaultColumn: { minSize: 56, maxSize: 800 },
    autoResetCellSelection: false,
    columns,
    get data() {
      return props.quotes
    },
    getRowId: (row) => row.id,
  })
  type TradingRow = ReturnType<typeof table.getRowModel>['rows'][number]
  const tableStyle = createMemo(() => {
    void table.atoms.columnSizing.get()
    void table.atoms.columnOrder.get()
    const styles: Record<string, string> = {
      width: `${table.getTotalSize()}px`,
    }
    for (const header of table.getFlatHeaders()) {
      styles[`--header-${header.id}-size`] = `${header.getSize()}`
      styles[`--col-${header.column.id}-size`] = `${header.column.getSize()}`
    }
    return styles
  })
  const rows = createMemo(() => table.getRowModel().rows)
  const rowVirtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>(
    {
      get count() {
        return rows().length
      },
      estimateSize: () => TRADING_ROW_HEIGHT,
      getScrollElement: () => layoutRuntime.scrollElement,
      getItemKey: (index) => rows()[index]?.id ?? index,
      overscan: TRADING_ROW_OVERSCAN,
      get enabled() {
        return props.virtualScrollMode === 'tanstack'
      },
    },
  )
  const virtualRows = rowVirtualizer.getVirtualItems
  const visibleRange = createMemo(() => {
    void virtualRows()
    const rowCount = rows().length
    const range = rowVirtualizer.range
    if (
      props.virtualScrollMode !== 'tanstack' ||
      rowCount === 0 ||
      range === null
    ) {
      return null
    }

    const lastRowIndex = rowCount - 1
    const start = Math.min(range.startIndex, lastRowIndex)
    return {
      start,
      end: Math.min(Math.max(start, range.endIndex), lastRowIndex),
    }
  })
  createEffect(() => {
    props.quotes
    feed.completeRender()
  })
  createEffect(() => {
    props.onRenderedRowCount(
      props.virtualScrollMode === 'tanstack'
        ? virtualRows().length
        : rows().length,
    )
  })
  onMount(() => {
    const fitAvailableWidth = () => {
      const scrollElement = layoutRuntime.scrollElement
      if (!scrollElement || layoutRuntime.manuallyResized) return
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
          layoutRuntime.manuallyResized = true
        }
      },
    )
    if (layoutRuntime.scrollElement) {
      resizeObserver.observe(layoutRuntime.scrollElement)
    }
    fitAvailableWidth()

    onCleanup(() => {
      resizeObserver.disconnect()
      resizingSubscription.unsubscribe()
    })
  })

  const renderRow = (
    row: Accessor<TradingRow>,
    virtualRow?: Accessor<VirtualItem>,
  ) => (
    <tr
      classList={{ 'virtual-table-row': virtualRow !== undefined }}
      style={
        virtualRow
          ? { transform: `translateY(${virtualRow().start}px)` }
          : undefined
      }
      data-virtual-index={virtualRow?.().index}
      data-symbol={row().original.symbol}
      data-row-id={row().original.id}
      data-symbol-selected={
        props.selectedSymbol === row().original.symbol ? 'true' : undefined
      }
      title={virtualRow ? undefined : row().original.company}
      aria-selected={row().getIsSelected()}
    >
      <Index each={row().getVisibleCells()}>
        {(cell) => {
          const selectionEdges = createMemo(() =>
            cell().getSelectionEdges(),
          )
          return (
            <td
              style={{
                width: `calc(var(--col-${cell().column.id}-size) * 1px)`,
              }}
              data-column-id={cell().column.id}
              data-cell-focused={
                cell().getIsFocused() ? 'true' : undefined
              }
              data-selection-top={selectionEdges().top ? 'true' : undefined}
              data-selection-right={
                selectionEdges().right ? 'true' : undefined
              }
              data-selection-bottom={
                selectionEdges().bottom ? 'true' : undefined
              }
              data-selection-left={
                selectionEdges().left ? 'true' : undefined
              }
              aria-selected={cell().getIsSelected()}
              tabindex={cell().getTabIndex()}
            >
              <FlexRender cell={cell()} />
            </td>
          )
        }}
      </Index>
    </tr>
  )

  return (
    <>
      <div
        ref={(element) => {
          layoutRuntime.scrollElement = element
        }}
        class="table-scroll"
        classList={{ 'is-virtualized': props.virtualScrollMode === 'tanstack' }}
        data-trading-table
        tabindex={0}
        onKeyDown={(event) => handleCellNavigation(table, event)}
      >
        <table
          class="trading-data-grid"
          classList={{
            'virtual-table': props.virtualScrollMode === 'tanstack',
          }}
          data-testid="trading-table"
          role="grid"
          aria-multiselectable="true"
          style={tableStyle()}
        >
          <thead>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => {
                      const isLeaf = () => header.subHeaders.length === 0
                      const sorted = () => header.column.getIsSorted()
                      return (
                        <th
                          colSpan={header.colSpan}
                          style={{
                            width: `calc(var(--header-${header.id}-size) * 1px)`,
                          }}
                          aria-sort={
                            isLeaf() ? sortAriaValue(sorted()) : undefined
                          }
                          classList={{
                            'column-group-header': !isLeaf(),
                            'numeric-header':
                              isLeaf() && !isTextColumn(header.column.id),
                          }}
                        >
                          <Show when={!header.isPlaceholder}>
                            <Show
                              when={isLeaf()}
                              fallback={<FlexRender header={header} />}
                            >
                              <div
                                class="leaf-header-content"
                                onDragOver={(event) => {
                                  event.preventDefault()
                                  showColumnDropTarget(
                                    dragRuntime,
                                    header.column.id,
                                    event.currentTarget.closest('th'),
                                  )
                                }}
                                onDrop={(event) => {
                                  event.preventDefault()
                                  const sourceId =
                                    event.dataTransfer?.getData('text/plain') ||
                                    dragRuntime.columnId
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
                                  clearColumnDrag(dragRuntime)
                                }}
                              >
                                <button
                                  type="button"
                                  class="column-drag-handle"
                                  draggable={true}
                                  aria-label={`Move ${header.column.id} column`}
                                  onDragStart={(event) => {
                                    dragRuntime.columnId = header.column.id
                                    dragRuntime.sourceElement =
                                      event.currentTarget.closest('th')
                                    dragRuntime.sourceElement?.classList.add(
                                      'is-column-dragging',
                                    )
                                    const dataTransfer = event.dataTransfer
                                    if (!dataTransfer) return
                                    dataTransfer.effectAllowed = 'move'
                                    dataTransfer.setData(
                                      'text/plain',
                                      header.column.id,
                                    )
                                  }}
                                  onDragEnd={() => {
                                    clearColumnDrag(dragRuntime)
                                  }}
                                >
                                  ⋮⋮
                                </button>
                                <button
                                  type="button"
                                  class="sort-header-button"
                                  classList={{
                                    'is-sortable': header.column.getCanSort(),
                                  }}
                                  disabled={!header.column.getCanSort()}
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  <span class="header-label">
                                    <FlexRender header={header} />
                                  </span>
                                  <Show when={header.column.getCanSort()}>
                                    <span
                                      class="sort-indicator"
                                      classList={{ 'is-active': !!sorted() }}
                                      aria-hidden="true"
                                    >
                                      {sortIndicator(sorted())}
                                    </span>
                                  </Show>
                                </button>
                              </div>
                              <Show when={header.column.getCanResize()}>
                                <div
                                  class="column-resize-handle"
                                  classList={{
                                    'is-resizing':
                                      header.column.getIsResizing(),
                                  }}
                                  role="separator"
                                  aria-orientation="vertical"
                                  onDblClick={() => header.column.resetSize()}
                                  onMouseDown={header.getResizeHandler()}
                                  onTouchStart={header.getResizeHandler()}
                                />
                              </Show>
                            </Show>
                          </Show>
                        </th>
                      )
                    }}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody
            classList={{
              'virtual-table-body': props.virtualScrollMode === 'tanstack',
            }}
            style={
              props.virtualScrollMode === 'tanstack'
                ? { height: `${rows().length * TRADING_ROW_HEIGHT}px` }
                : undefined
            }
            onMouseDown={(event) =>
              pointerInteractions.handleMouseDown(
                table,
                event,
                props.onSelectSymbol,
              )
            }
            onPointerOver={(event) =>
              pointerInteractions.handlePointerOver(table, event)
            }
            onMouseLeave={() => pointerInteractions.resetPointerCell()}
            onClick={(event) =>
              pointerInteractions.handleClick(table, event)
            }
          >
            <Show
              when={props.virtualScrollMode === 'tanstack'}
              fallback={<Index each={rows()}>{(row) => renderRow(row)}</Index>}
            >
              <Index each={virtualRows()}>
                {(virtualRow) => {
                  const row = createMemo(() => rows()[virtualRow().index])
                  return renderRow(row, virtualRow)
                }}
              </Index>
            </Show>
          </tbody>
        </table>
      </div>
      <Show when={props.virtualScrollMode === 'tanstack'}>
        <footer
          class="virtual-scroll-footer"
          data-testid="virtual-scroll-footer"
        >
          <span>
            TanStack · Total · {rows().length} rows ·{' '}
            {table.getVisibleLeafColumns().length} columns
          </span>
          <span data-testid="visible-row-range">
            <Show when={visibleRange()} fallback={'Current · rows —'}>
              {(range) => `Current · rows ${range().start}..${range().end}`}
            </Show>
          </span>
        </footer>
      </Show>
    </>
  )
}

interface ColumnDragRuntime {
  columnId: string | null
  sourceElement: HTMLTableCellElement | null
  targetElement: HTMLTableCellElement | null
}

interface TableLayoutRuntime {
  manuallyResized: boolean
  scrollElement: HTMLDivElement | null
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

function isTextColumn(columnId: string): boolean {
  return columnId === 'market' || columnId === 'name' || columnId === 'symbol'
}
