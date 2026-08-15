import {
  FlexRender,
  createSortedRowModel,
  createTable,
  stockFeatures,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, Show, createMemo, onCleanup, onMount } from 'solid-js'
import { createTradingColumns } from './table-config/trading-columns'
import {
  handleCellNavigation,
  reorderColumnIds,
  selectRowFromPointer,
  sortAriaValue,
  sortIndicator,
} from './table-interactions'
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

  return (
    <div
      ref={(element) => {
        layoutRuntime.scrollElement = element
      }}
      class="table-scroll"
      data-trading-table
      tabindex={0}
      onKeyDown={(event) => handleCellNavigation(table, event)}
    >
      <table
        class="trading-data-grid"
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
                            isLeaf() && !isIdentityColumn(header.column.id),
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
                                  'is-resizing': header.column.getIsResizing(),
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
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr
                classList={{
                  'is-symbol-selected':
                    props.selectedSymbol === row.original.symbol,
                  'is-row-selected': row.getIsSelected(),
                }}
                data-symbol={row.original.symbol}
                data-row-id={row.original.id}
                title={row.original.company}
                aria-selected={row.getIsSelected()}
                onMouseDown={(event) => {
                  if (event.button === 0) {
                    props.onSelectSymbol(row.original.symbol)
                  }
                }}
                onClick={(event) => selectRowFromPointer(table, row, event)}
              >
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td
                      style={{
                        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                      }}
                      classList={{
                        'numeric-cell': !isIdentityColumn(cell.column.id),
                        'market-cell': cell.column.id === 'market',
                        'name-cell': cell.column.id === 'name',
                        'symbol-cell': cell.column.id === 'symbol',
                        'is-cell-selected': cell.getIsSelected(),
                        'is-cell-focused': cell.getIsFocused(),
                        'selection-top': cell.getSelectionEdges().top,
                        'selection-right': cell.getSelectionEdges().right,
                        'selection-bottom': cell.getSelectionEdges().bottom,
                        'selection-left': cell.getSelectionEdges().left,
                      }}
                      aria-selected={cell.getIsSelected()}
                      tabindex={cell.getTabIndex()}
                      onMouseDown={cell.getSelectionStartHandler()}
                      onMouseEnter={cell.getSelectionExtendHandler()}
                    >
                      <FlexRender cell={cell} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
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

function isIdentityColumn(columnId: string): boolean {
  return columnId === 'market' || columnId === 'name' || columnId === 'symbol'
}
