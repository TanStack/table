import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { VirtualizerController } from '@tanstack/lit-virtual'
import {
  FlexRender,
  TableController,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  sortFn_basic,
  stockFeatures,
  tableFeatures,
} from '@tanstack/lit-table'
import { startTableBenchmark } from '../benchmark/table-benchmark'
import { ControllerElement } from '../shell/controller-element'
import {
  createTradingColumns,
  readMeasuredRows,
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
import './table-config/quote-cells'
import type { Ref } from 'lit/directives/ref.js'
import type { LitTable } from '@tanstack/lit-table'
import type { MarketQuote } from '../feed/market-data'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

const features = tableFeatures({
  ...stockFeatures,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { basic: sortFn_basic },
})
interface SelectedTableState {
  sorting: unknown
  columnFilters: unknown
  columnOrder: unknown
  rowSelection: unknown
  cellSelection: unknown
}
type TradingTableInstance = LitTable<
  typeof features,
  MarketQuote,
  SelectedTableState
>

@customElement('trading-data-table')
export class TradingTable extends ControllerElement {
  @property({ attribute: false }) controller!: TradingBenchmarkController
  @property({ attribute: false }) feed!: MarketFeedController
  readonly #tableController = new TableController<typeof features, MarketQuote>(
    this,
  )
  readonly #scrollRef: Ref<HTMLDivElement> = createRef()
  readonly #tableRef: Ref<HTMLTableElement> = createRef()
  readonly #virtualizer = new VirtualizerController<
    HTMLDivElement,
    HTMLTableRowElement
  >(this, {
    count: 0,
    getScrollElement: () => this.#scrollRef.value ?? null,
    estimateSize: () => TRADING_ROW_HEIGHT,
    overscan: TRADING_ROW_OVERSCAN,
  })
  readonly #pointer = new TradingGridPointerController()
  readonly #drag = {
    columnId: null as string | null,
    source: null as HTMLTableCellElement | null,
    target: null as HTMLTableCellElement | null,
  }
  readonly #layout = { manuallyResized: false }
  #table?: TradingTableInstance
  #columns?: ReturnType<typeof createTradingColumns<typeof features>>
  #cleanup: Array<() => void> = []
  #domCommitScheduled = false

  protected firstUpdated() {
    this.observe(this.feed.quotes)
    this.observe(this.feed.instrumentCount)
    this.observe(this.controller.store)
    this.observe(this.controller.renderAtoms.rendererMode)
    this.observe(this.controller.renderAtoms.selectedSymbol)
    const table = this.#table
    if (!table) return
    const sizing = table.atoms.columnSizing.subscribe(() =>
      this.#writeColumnSizes(),
    )
    const order = table.atoms.columnOrder.subscribe(() =>
      this.#writeColumnSizes(),
    )
    const resizing = table.atoms.columnResizing.subscribe((state) => {
      if (state.isResizingColumn !== false) this.#layout.manuallyResized = true
    })
    const resizeObserver = new ResizeObserver(() => this.#fitAvailableWidth())
    if (this.#scrollRef.value) resizeObserver.observe(this.#scrollRef.value)
    this.#cleanup.push(
      () => sizing.unsubscribe(),
      () => order.unsubscribe(),
      () => resizing.unsubscribe(),
      () => resizeObserver.disconnect(),
      startTableBenchmark(this.controller),
    )
    this.#writeColumnSizes()
    this.#fitAvailableWidth()
    this.#scheduleDomCommit()
  }
  protected updated() {
    this.#writeColumnSizes()
    this.#scheduleDomCommit()
  }
  disconnectedCallback() {
    for (const cleanup of this.#cleanup) cleanup()
    this.#cleanup.length = 0
    super.disconnectedCallback()
  }

  #writeColumnSizes() {
    const element = this.#tableRef.value
    const table = this.#table
    if (!element || !table) return
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

  #scheduleDomCommit() {
    if (this.#domCommitScheduled) return

    this.#domCommitScheduled = true
    queueMicrotask(() => {
      this.#domCommitScheduled = false
      if (this.isConnected) this.feed.completeRender()
    })
  }
  #fitAvailableWidth() {
    const container = this.#scrollRef.value
    const table = this.#table
    if (!container || !table || this.#layout.manuallyResized) return
    const width = table.getTotalSize()
    if (container.clientWidth <= width + 1 || width <= 0) return
    const ratio = container.clientWidth / width
    table.setColumnSizing(
      Object.fromEntries(
        table
          .getVisibleLeafColumns()
          .map((column) => [column.id, column.getSize() * ratio]),
      ),
    )
  }
  #clearDrag = () => {
    this.#drag.source?.classList.remove('is-column-dragging')
    this.#drag.target?.classList.remove('is-column-drop-target')
    this.#drag.columnId = null
    this.#drag.source = null
    this.#drag.target = null
  }
  #showDrop(columnId: string, element: HTMLTableCellElement | null) {
    this.#drag.target?.classList.remove('is-column-drop-target')
    this.#drag.target = null
    if (this.#drag.columnId === columnId || !element) return
    element.classList.add('is-column-drop-target')
    this.#drag.target = element
  }

  protected render() {
    this.#columns ??= createTradingColumns<typeof features>(this.controller)
    const table = this.#tableController.table(
      {
        key: 'lit-realtime-trading',
        features,
        columns: this.#columns,
        data: this.feed.quotes.get(),
        getRowId: (row) => row.id,
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
    this.#table = table
    const rows = readMeasuredRows(() => table.getRowModel().rows)
    const benchmark = this.controller.store.get()
    const virtualMode = resolveVirtualScrollMode(
      benchmark.requestedVirtualScrollMode,
      this.feed.instrumentCount.get(),
    )
    const virtualizer = this.#virtualizer.getVirtualizer()
    virtualizer.setOptions({
      ...virtualizer.options,
      count: rows.length,
      enabled: virtualMode === 'tanstack',
      getItemKey: (index) => rows[index]?.id ?? index,
    })
    const virtualRows = virtualizer.getVirtualItems()
    this.controller.actions.setRenderedRowCount(
      virtualMode === 'tanstack' ? virtualRows.length : rows.length,
    )
    const range = virtualizer.range
    const visibleRange =
      virtualMode === 'tanstack' && range && rows.length
        ? {
            start: Math.min(range.startIndex, rows.length - 1),
            end: Math.min(range.endIndex, rows.length - 1),
          }
        : null
    const renderRow = (
      row: (typeof rows)[number],
      virtualRow?: (typeof virtualRows)[number],
    ) =>
      html`<tr
        class=${virtualRow ? 'virtual-table-row' : ''}
        style=${virtualRow ? `transform:translateY(${virtualRow.start}px)` : ''}
        data-virtual-index=${virtualRow?.index ?? undefined}
        data-symbol=${row.original.symbol}
        data-row-id=${row.original.id}
        data-symbol-selected=${this.controller.renderAtoms.selectedSymbol.get() === row.original.symbol ? 'true' : undefined}
        title=${row.original.company}
        aria-selected=${row.getIsSelected()}
      >
        ${repeat(
          row.getVisibleCells(),
          (cell) => cell.id,
          (cell) => {
            const edges = cell.getSelectionEdges()
            return html`<td
              style="width:calc(var(--col-${cell.column.id}-size) * 1px)"
              data-column-id=${cell.column.id}
              data-cell-focused=${cell.getIsFocused() ? 'true' : undefined}
              data-selection-top=${edges.top ? 'true' : undefined}
              data-selection-right=${edges.right ? 'true' : undefined}
              data-selection-bottom=${edges.bottom ? 'true' : undefined}
              data-selection-left=${edges.left ? 'true' : undefined}
              aria-selected=${cell.getIsSelected()}
              tabindex=${cell.getTabIndex()}
            >
              ${FlexRender({ cell })}
            </td>`
          },
        )}
      </tr>`
    return html`<div
        ${ref(this.#scrollRef)}
        class="table-scroll ${virtualMode === 'tanstack' ? 'is-virtualized' : ''}"
        data-trading-table
      >
        <table
          ${ref(this.#tableRef)}
          class="trading-data-grid ${virtualMode === 'tanstack' ? 'virtual-table' : ''}"
          data-testid="trading-table"
          role="grid"
          aria-multiselectable="true"
          tabindex="0"
          @keydown=${(event: KeyboardEvent) => handleCellNavigation(table, event)}
        >
          <thead>
            ${repeat(
              table.getHeaderGroups(),
              (group) => group.id,
              (group) =>
                html`<tr>
                  ${repeat(
                    group.headers,
                    (header) => header.id,
                    (header) => {
                      const leaf = header.subHeaders.length === 0
                      const sorted = header.column.getIsSorted()
                      return html`<th
                        colspan=${header.colSpan}
                        style="width:calc(var(--header-${header.id}-size) * 1px)"
                        aria-sort=${leaf ? sortAriaValue(sorted) : undefined}
                        class="${!leaf ? 'column-group-header' : ''} ${leaf && !['market', 'name', 'symbol'].includes(header.column.id) ? 'numeric-header' : ''}"
                      >
                        ${
                          !header.isPlaceholder
                            ? leaf
                              ? html`<div
                                    class="leaf-header-content"
                                    @dragover=${(event: DragEvent) => {
                                  event.preventDefault()
                                  this.#showDrop(
                                    header.column.id,
                                    (
                                      event.currentTarget as HTMLElement
                                    ).closest('th'),
                                  )
                                }}
                                    @drop=${(event: DragEvent) => {
                                  event.preventDefault()
                                  const source =
                                    event.dataTransfer?.getData('text/plain') ||
                                    this.#drag.columnId
                                  if (source)
                                    table.setColumnOrder(
                                      reorderColumnIds(
                                        table
                                          .getVisibleLeafColumns()
                                          .map((column) => column.id),
                                        source,
                                        header.column.id,
                                      ),
                                    )
                                  this.#clearDrag()
                                }}
                                  >
                                    <button
                                      type="button"
                                      class="column-drag-handle"
                                      draggable="true"
                                      aria-label="Move ${header.column.id} column"
                                      @dragstart=${(event: DragEvent) => {
                                    this.#drag.columnId = header.column.id
                                    this.#drag.source = (
                                      event.currentTarget as HTMLElement
                                    ).closest('th')
                                    this.#drag.source?.classList.add(
                                      'is-column-dragging',
                                    )
                                    if (event.dataTransfer) {
                                      event.dataTransfer.effectAllowed = 'move'
                                      event.dataTransfer.setData(
                                        'text/plain',
                                        header.column.id,
                                      )
                                    }
                                  }}
                                      @dragend=${this.#clearDrag}
                                    >
                                      ⋮⋮</button
                                    ><button
                                      type="button"
                                      class="sort-header-button ${header.column.getCanSort() ? 'is-sortable' : ''}"
                                      ?disabled=${!header.column.getCanSort()}
                                      @click=${header.column.getToggleSortingHandler()}
                                    >
                                      <span class="header-label"
                                        >${FlexRender({ header })}</span
                                      >${header.column.getCanSort() ? html`<span class="sort-indicator ${sorted ? 'is-active' : ''}" aria-hidden="true">${sortIndicator(sorted)}</span>` : null}
                                    </button>
                                  </div>
                                  ${header.column.getCanResize() ? html`<div class="column-resize-handle ${header.column.getIsResizing() ? 'is-resizing' : ''}" role="separator" aria-orientation="vertical" @dblclick=${() => header.column.resetSize()} @mousedown=${header.getResizeHandler()} @touchstart=${header.getResizeHandler()}></div>` : null}`
                              : FlexRender({ header })
                            : null
                        }
                      </th>`
                    },
                  )}
                </tr>`,
            )}
          </thead>
          <tbody
            class=${virtualMode === 'tanstack' ? 'virtual-table-body' : ''}
            style=${virtualMode === 'tanstack' ? `height:${virtualizer.getTotalSize()}px` : ''}
            data-source-row-count=${this.feed.quotes.get().length}
            @mousedown=${(event: MouseEvent) => this.#pointer.handleMouseDown(table, event, this.controller.actions.selectSymbol)}
            @pointerover=${(event: MouseEvent) => this.#pointer.handlePointerOver(table, event)}
            @mouseleave=${() => this.#pointer.resetPointerCell()}
            @click=${(event: MouseEvent) => this.#pointer.handleClick(table, event)}
          >
            ${
              virtualMode === 'tanstack'
                ? repeat(
                    virtualRows,
                    (item) => item.key,
                    (item) => renderRow(rows[item.index], item),
                  )
                : repeat(
                    rows,
                    (row) => row.id,
                    (row) => renderRow(row),
                  )
            }
          </tbody>
        </table>
      </div>
      ${virtualMode === 'tanstack' ? html`<footer class="virtual-scroll-footer" data-testid="virtual-scroll-footer"><span>TanStack · Total · ${rows.length} rows · ${table.getVisibleLeafColumns().length} columns</span><span data-testid="visible-row-range">${visibleRange ? `Current · rows ${visibleRange.start}..${visibleRange.end}` : 'Current · rows —'}</span></footer>` : null}`
  }
}
