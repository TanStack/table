import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import { htmlSafe } from '@ember/template'
import { modifier } from 'ember-modifier'
import {
  FlexRenderCell,
  FlexRenderHeader,
  useTable,
  type Header,
  type Row,
  type Table,
} from '@tanstack/ember-table'
import {
  Virtualizer,
  elementScroll,
  observeElementOffset,
  observeElementRect,
  type VirtualItem,
} from '@tanstack/virtual-core'
import {
  createTradingColumns,
  readMeasuredRows,
  type RendererMode,
} from '../../table/table-config/trading-columns.gts'
import { tradingFeatures } from '../../table/trading-features'
import {
  TradingGridPointerController,
  handleCellNavigation,
  reorderColumnIds,
  sortAriaValue,
  sortIndicator,
} from '../../table/table-interactions'
import {
  TRADING_ROW_HEIGHT,
  TRADING_ROW_OVERSCAN,
  resolveVirtualScrollMode,
} from '../../table/trading-row-virtualizer'
import { observeValue, registerCleanup } from '../../utils/subscriptions'
import type Owner from '@ember/owner'
import type { MarketQuote } from '../../feed/market-data'
import type {
  MarketFeedController,
  MarketFeedState,
} from '../../feed/market-feed-controller'
import type {
  TradingBenchmarkController,
  TradingBenchmarkState,
} from '../../benchmark/trading-benchmark-controller'

interface Signature {
  Args: { controller: TradingBenchmarkController; feed: MarketFeedController }
}
type TradingRow = Row<typeof tradingFeatures, MarketQuote>
type TradingHeader = Header<typeof tradingFeatures, MarketQuote>
interface RenderedRow {
  row: TradingRow
  cells: ReturnType<TradingRow['getVisibleCells']>
  virtual: VirtualItem | null
}

const captureElement = modifier(
  (
    element: HTMLElement,
    [capture]: [(element: HTMLElement | null) => void],
  ) => {
    capture(element)
    return () => capture(null)
  },
)

export default class TradingTable extends Component<Signature> {
  @tracked feedState: MarketFeedState
  @tracked benchmark: TradingBenchmarkState
  @tracked rendererMode: RendererMode
  @tracked selectedSymbol: string | null
  @tracked virtualVersion = 0
  readonly pointer = new TradingGridPointerController()
  readonly layout = { manuallyResized: false }
  readonly drag = {
    columnId: null as string | null,
    source: null as HTMLTableCellElement | null,
    target: null as HTMLTableCellElement | null,
  }
  @tracked columns: ReturnType<typeof createTradingColumns>
  scrollElement: HTMLDivElement | null = null
  tableElement: HTMLTableElement | null = null
  bodyElement: HTMLTableSectionElement | null = null
  virtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement> | null = null
  stopVirtualizer: (() => void) | null = null
  resizeObserver: ResizeObserver | null = null
  mutationObserver: MutationObserver | null = null

  table: Table<typeof tradingFeatures, MarketQuote>

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args)
    this.feedState = args.feed.store.get()
    this.benchmark = args.controller.store.get()
    this.rendererMode = args.controller.renderAtoms.rendererMode.get()
    this.selectedSymbol = args.controller.renderAtoms.selectedSymbol.get()
    this.columns = createTradingColumns(args.controller, this.rendererMode)
    this.table = useTable(this, () => ({
      features: tradingFeatures,
      columns: this.columns,
      data: this.feedState.quotes,
      getRowId: (row: MarketQuote) => row.id,
      columnResizeMode: 'onChange' as const,
      defaultColumn: { minSize: 56, maxSize: 800 },
      autoResetCellSelection: false,
    }))
    observeValue(this, args.feed.store, (state) => {
      this.feedState = state
      this.table.setOptions((options) => ({ ...options, data: state.quotes }))
      queueMicrotask(() => args.feed.completeRender())
    })
    observeValue(this, args.controller.store, (state) => {
      this.benchmark = state
    })
    observeValue(this, args.controller.renderAtoms.selectedSymbol, (symbol) => {
      this.selectedSymbol = symbol
    })
    observeValue(this, args.controller.renderAtoms.rendererMode, (mode) => {
      this.rendererMode = mode
      this.columns = createTradingColumns(args.controller, mode)
      this.table.setOptions((options) => ({
        ...options,
        columns: this.columns,
      }))
    })
    const sizing = this.table.atoms.columnSizing.subscribe(() =>
      this.writeColumnSizes(),
    )
    const order = this.table.atoms.columnOrder.subscribe(() =>
      this.writeColumnSizes(),
    )
    const resizing = this.table.atoms.columnResizing.subscribe((state) => {
      if (state.isResizingColumn !== false) this.layout.manuallyResized = true
    })
    registerCleanup(this, () => {
      sizing.unsubscribe()
      order.unsubscribe()
      resizing.unsubscribe()
      this.stopVirtualizer?.()
      this.resizeObserver?.disconnect()
      this.mutationObserver?.disconnect()
    })
  }

  get rows(): Array<TradingRow> {
    return readMeasuredRows(() => this.table.getRowModel().rows)
  }
  get headerGroups() {
    return this.table.getHeaderGroups()
  }
  get visibleLeafColumnCount() {
    return this.table.getVisibleLeafColumns().length
  }
  get virtualMode() {
    return resolveVirtualScrollMode(
      this.benchmark.requestedVirtualScrollMode,
      this.feedState.instrumentCount,
    )
  }
  get renderedRows(): Array<RenderedRow> {
    void this.virtualVersion
    const rows = this.rows
    this.syncVirtualizer(rows)
    const result =
      this.virtualMode === 'tanstack' && this.virtualizer
        ? this.virtualizer
            .getVirtualItems()
            .map((item) => ({
              row: rows[item.index]!,
              cells: rows[item.index]!.getVisibleCells(),
              virtual: item,
            }))
        : rows.map((row) => ({
            row,
            cells: row.getVisibleCells(),
            virtual: null,
          }))
    queueMicrotask(() =>
      this.args.controller.actions.setRenderedRowCount(result.length),
    )
    return result
  }
  get totalVirtualHeight() {
    void this.virtualVersion
    return (
      this.virtualizer?.getTotalSize() ?? this.rows.length * TRADING_ROW_HEIGHT
    )
  }
  get visibleRangeText() {
    void this.virtualVersion
    const range = this.virtualizer?.range
    const rowCount = this.rows.length
    return !range || this.virtualMode !== 'tanstack' || rowCount === 0
      ? 'Current · rows —'
      : `Current · rows ${Math.min(range.startIndex, rowCount - 1)}..${Math.min(range.endIndex, rowCount - 1)}`
  }

  captureScroll = (element: HTMLElement | null) => {
    this.scrollElement = element as HTMLDivElement | null
    if (!this.scrollElement) return
    this.virtualizer = new Virtualizer({
      count: 0,
      getScrollElement: () => this.scrollElement,
      estimateSize: () => TRADING_ROW_HEIGHT,
      overscan: TRADING_ROW_OVERSCAN,
      observeElementRect,
      observeElementOffset,
      scrollToFn: elementScroll,
      onChange: () => {
        this.virtualVersion++
      },
    })
    this.stopVirtualizer = this.virtualizer._didMount()
    this.resizeObserver = new ResizeObserver(() => this.fitAvailableWidth())
    this.resizeObserver.observe(this.scrollElement)
    queueMicrotask(() => {
      this.writeColumnSizes()
      this.fitAvailableWidth()
      this.virtualVersion++
    })
  }
  captureTable = (element: HTMLElement | null) => {
    this.tableElement = element as HTMLTableElement | null
    if (this.tableElement) queueMicrotask(() => this.writeColumnSizes())
  }
  captureBody = (element: HTMLElement | null) => {
    this.mutationObserver?.disconnect()
    this.bodyElement = element as HTMLTableSectionElement | null
    if (!this.bodyElement) return
    this.args.controller.monitor.resetDomMutations()
    this.mutationObserver = new MutationObserver((records) =>
      this.args.controller.monitor.recordDomMutations(records.length),
    )
    this.mutationObserver.observe(this.bodyElement, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
  }

  syncVirtualizer(rows: Array<TradingRow>) {
    if (!this.virtualizer) return
    this.virtualizer.setOptions({
      ...this.virtualizer.options,
      count: rows.length,
      enabled: this.virtualMode === 'tanstack',
      getItemKey: (index) => rows[index]?.id ?? index,
    })
    this.virtualizer._willUpdate()
  }
  writeColumnSizes() {
    if (!this.tableElement) return
    for (const header of this.table.getFlatHeaders()) {
      this.tableElement.style.setProperty(
        `--header-${header.id}-size`,
        String(header.getSize()),
      )
      this.tableElement.style.setProperty(
        `--col-${header.column.id}-size`,
        String(header.column.getSize()),
      )
    }
    this.tableElement.style.width = `${this.table.getTotalSize()}px`
  }
  fitAvailableWidth() {
    if (!this.scrollElement || this.layout.manuallyResized) return
    const width = this.table.getTotalSize()
    if (this.scrollElement.clientWidth <= width + 1 || width <= 0) return
    const ratio = this.scrollElement.clientWidth / width
    this.table.setColumnSizing(
      Object.fromEntries(
        this.table
          .getVisibleLeafColumns()
          .map((column) => [column.id, column.getSize() * ratio]),
      ),
    )
  }

  onGridKeyDown = (event: KeyboardEvent) =>
    handleCellNavigation(this.table, event)
  onBodyMouseDown = (event: MouseEvent) =>
    this.pointer.handleMouseDown(
      this.table,
      event,
      this.args.controller.actions.selectSymbol,
    )
  onBodyPointerOver = (event: MouseEvent) =>
    this.pointer.handlePointerOver(this.table, event)
  onBodyClick = (event: MouseEvent) =>
    this.pointer.handleClick(this.table, event)
  resetPointer = () => this.pointer.resetPointerCell()
  clearDrag = () => {
    this.drag.source?.classList.remove('is-column-dragging')
    this.drag.target?.classList.remove('is-column-drop-target')
    this.drag.columnId = null
    this.drag.source = null
    this.drag.target = null
  }
  dragStart = (header: TradingHeader) => (event: DragEvent) => {
    this.drag.columnId = header.column.id
    this.drag.source = (event.currentTarget as HTMLElement).closest('th')
    this.drag.source?.classList.add('is-column-dragging')
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', header.column.id)
    }
  }
  dragOver = (header: TradingHeader) => (event: DragEvent) => {
    event.preventDefault()
    this.drag.target?.classList.remove('is-column-drop-target')
    this.drag.target = null
    const element = (event.currentTarget as HTMLElement).closest('th')
    if (this.drag.columnId !== header.column.id && element) {
      element.classList.add('is-column-drop-target')
      this.drag.target = element
    }
  }
  drop = (header: TradingHeader) => (event: DragEvent) => {
    event.preventDefault()
    const source =
      event.dataTransfer?.getData('text/plain') || this.drag.columnId
    if (source)
      this.table.setColumnOrder(
        reorderColumnIds(
          this.table.getVisibleLeafColumns().map((column) => column.id),
          source,
          header.column.id,
        ),
      )
    this.clearDrag()
  }

  <template>
    <div
      class='table-scroll
        {{if (eq this.virtualMode "tanstack") "is-virtualized"}}'
      data-trading-table
      {{captureElement this.captureScroll}}
    >
      <table
        class='trading-data-grid
          {{if (eq this.virtualMode "tanstack") "virtual-table"}}'
        data-testid='trading-table'
        role='grid'
        aria-multiselectable='true'
        tabindex='0'
        {{captureElement this.captureTable}}
        {{on 'keydown' this.onGridKeyDown}}
      >
        <thead>
          {{#each this.headerGroups as |group|}}
            <tr>{{#each group.headers as |header|}}<th
                  colspan={{header.colSpan}}
                  style={{headerStyle header}}
                  aria-sort={{sortAria header}}
                  class='{{headerClass header}}'
                >
                  {{#unless header.isPlaceholder}}
                    {{#if (isLeaf header)}}
                      <div
                        class='leaf-header-content'
                        {{on 'dragover' (this.dragOver header)}}
                        {{on 'drop' (this.drop header)}}
                      >
                        <button
                          type='button'
                          class='column-drag-handle'
                          draggable='true'
                          aria-label='Move {{header.column.id}} column'
                          {{on 'dragstart' (this.dragStart header)}}
                          {{on 'dragend' this.clearDrag}}
                        >⋮⋮</button>
                        <button
                          type='button'
                          class='sort-header-button
                            {{if (canSort header) "is-sortable"}}'
                          disabled={{not (canSort header)}}
                          {{on 'click' (toggleSort header)}}
                        ><span class='header-label'><FlexRenderHeader
                              @header={{header}}
                            /></span>{{#if (canSort header)}}<span
                              class='sort-indicator
                                {{if (isSorted header) "is-active"}}'
                              aria-hidden='true'
                            >{{indicator header}}</span>{{/if}}</button>
                      </div>
                      {{#if (canResize header)}}<div
                          class='column-resize-handle
                            {{if (isResizing header) "is-resizing"}}'
                          role='separator'
                          aria-orientation='vertical'
                          {{on 'dblclick' (resetSize header)}}
                          {{on 'mousedown' (resizeHandler header)}}
                          {{on 'touchstart' (resizeHandler header)}}
                        ></div>{{/if}}
                    {{else}}<FlexRenderHeader @header={{header}} />{{/if}}
                  {{/unless}}
                </th>{{/each}}</tr>
          {{/each}}
        </thead>
        <tbody
          class={{if (eq this.virtualMode 'tanstack') 'virtual-table-body'}}
          style={{bodyStyle this.virtualMode this.totalVirtualHeight}}
          data-source-row-count={{this.feedState.quotes.length}}
          {{captureElement this.captureBody}}
          {{on 'mousedown' this.onBodyMouseDown}}
          {{on 'pointerover' this.onBodyPointerOver}}
          {{on 'mouseleave' this.resetPointer}}
          {{on 'click' this.onBodyClick}}
        >
          {{#each this.renderedRows key='row.id' as |item|}}
            <tr
              class={{if item.virtual 'virtual-table-row'}}
              style={{rowStyle item.virtual}}
              data-virtual-index={{virtualIndex item.virtual}}
              data-symbol={{item.row.original.symbol}}
              data-row-id={{item.row.original.id}}
              data-symbol-selected={{if
                (eq this.selectedSymbol item.row.original.symbol)
                'true'
              }}
              title={{item.row.original.company}}
              aria-selected={{rowSelected item.row}}
            >
              {{#each item.cells key='id' as |cell|}}<td
                  style={{cellStyle cell.column.id}}
                  data-column-id={{cell.column.id}}
                  data-cell-focused={{cellFocused cell}}
                  data-selection-top={{edgeAttr cell 'top'}}
                  data-selection-right={{edgeAttr cell 'right'}}
                  data-selection-bottom={{edgeAttr cell 'bottom'}}
                  data-selection-left={{edgeAttr cell 'left'}}
                  aria-selected={{cellSelected cell}}
                  tabindex={{cellTabIndex cell}}
                ><FlexRenderCell @cell={{cell}} /></td>{{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>
    </div>
    {{#if (eq this.virtualMode 'tanstack')}}<footer
        class='virtual-scroll-footer'
        data-testid='virtual-scroll-footer'
      ><span>TanStack · Total ·
          {{this.rows.length}}
          rows ·
          {{this.visibleLeafColumnCount}}
          columns</span><span
          data-testid='visible-row-range'
        >{{this.visibleRangeText}}</span></footer>{{/if}}
  </template>
}

const isLeaf = (header: TradingHeader): boolean =>
  header.subHeaders.length === 0
const canSort = (header: TradingHeader): boolean => header.column.getCanSort()
const isSorted = (header: TradingHeader): boolean =>
  header.column.getIsSorted() !== false
const canResize = (header: TradingHeader): boolean =>
  header.column.getCanResize()
const isResizing = (header: TradingHeader): boolean =>
  header.column.getIsResizing()
const toggleSort = (header: TradingHeader) =>
  header.column.getToggleSortingHandler() ?? (() => undefined)
const resetSize = (header: TradingHeader) => () => header.column.resetSize()
const resizeHandler = (header: TradingHeader) => (event: Event) =>
  header.getResizeHandler()?.(event)
const indicator = (header: TradingHeader): string =>
  sortIndicator(header.column.getIsSorted())
const sortAria = (header: TradingHeader) =>
  isLeaf(header) ? sortAriaValue(header.column.getIsSorted()) : undefined
const headerStyle = (header: TradingHeader) =>
  htmlSafe(`width:calc(var(--header-${header.id}-size) * 1px)`)
const headerClass = (header: TradingHeader): string =>
  `${isLeaf(header) ? '' : 'column-group-header'} ${isLeaf(header) && !['market', 'name', 'symbol'].includes(header.column.id) ? 'numeric-header' : ''}`
const cellStyle = (columnId: string) =>
  htmlSafe(`width:calc(var(--col-${columnId}-size) * 1px)`)
const bodyStyle = (mode: string, height: number) =>
  mode === 'tanstack' ? htmlSafe(`height:${height}px`) : undefined
const rowStyle = (virtual: VirtualItem | null) =>
  virtual ? htmlSafe(`transform:translateY(${virtual.start}px)`) : undefined
const edgeAttr = (
  cell: {
    getSelectionEdges: () => {
      top: boolean
      right: boolean
      bottom: boolean
      left: boolean
    }
  },
  edge: 'top' | 'right' | 'bottom' | 'left',
): string | undefined => (cell.getSelectionEdges()[edge] ? 'true' : undefined)
const rowSelected = (row: TradingRow): boolean => row.getIsSelected()
const cellSelected = (
  cell: ReturnType<TradingRow['getVisibleCells']>[number],
): boolean => cell.getIsSelected()
const cellFocused = (
  cell: ReturnType<TradingRow['getVisibleCells']>[number],
): string | undefined => (cell.getIsFocused() ? 'true' : undefined)
const cellTabIndex = (
  cell: ReturnType<TradingRow['getVisibleCells']>[number],
): number => cell.getTabIndex()
const virtualIndex = (virtual: VirtualItem | null): number | undefined =>
  virtual?.index
const eq = (left: unknown, right: unknown): boolean => left === right
const not = (value: boolean): boolean => !value
