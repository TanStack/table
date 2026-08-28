import Component from '@glimmer/component'
import { cached, tracked } from '@glimmer/tracking'
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
  createTradingColumns,
  readMeasuredRows,
} from '../../table/table-config/trading-columns.gts'
import { tradingFeatures } from '../../table/trading-features'
import {
  TradingGridPointerController,
  handleCellNavigation,
  reorderColumnIds,
  sortAriaValue,
  sortIndicator,
} from '../../table/table-interactions'
import { registerCleanup } from '../../utils/subscriptions'
import { run } from '@ember/runloop'
import type Owner from '@ember/owner'
import type { MarketQuote } from '../../feed/market-data'
import type { MarketFeedController } from '../../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../../benchmark/trading-benchmark-controller'

interface Signature {
  Args: {
    controller: TradingBenchmarkController
    feed: MarketFeedController
  }
}
interface TableView {
  quotes: Array<MarketQuote>
}
type TradingRow = Row<typeof tradingFeatures, MarketQuote>
type TradingHeader = Header<typeof tradingFeatures, MarketQuote>
interface RenderedRow {
  id: string
  row: TradingRow
  cells: ReturnType<TradingRow['getVisibleCells']>
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

const markRenderCommitted = modifier(
  (
    _element: HTMLElement,
    [feed, quotes]: [MarketFeedController, Array<MarketQuote>],
  ) => {
    void quotes
    queueMicrotask(() => feed.completeRender())
  },
)

export default class TradingTable extends Component<Signature> {
  @tracked viewGeneration = 0
  tableView: TableView = {
    quotes: [],
  }
  readonly pointer = new TradingGridPointerController()
  readonly layout = { manuallyResized: false }
  readonly drag = {
    columnId: null as string | null,
    source: null as HTMLTableCellElement | null,
    target: null as HTMLTableCellElement | null,
  }
  scrollElement: HTMLDivElement | null = null
  bodyElement: HTMLTableSectionElement | null = null
  resizeObserver: ResizeObserver | null = null
  mutationObserver: MutationObserver | null = null

  table: Table<typeof tradingFeatures, MarketQuote> = useTable(this, () => ({
    features: tradingFeatures,
    columns: this.columns,
    data: this.data,
    getRowId: (row: MarketQuote) => row.id,
    columnResizeMode: 'onChange' as const,
    defaultColumn: { minSize: 56, maxSize: 800 },
    autoResetCellSelection: false,
  }))

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args)
    this.args.controller.invalidateTable = this.queueSync
    const stopObserving = this.args.feed.observe({
      viewChanged: this.queueSync,
    })
    this.queueSync()
    registerCleanup(this, () => {
      this.args.controller.invalidateTable = null
      stopObserving()
      this.resizeObserver?.disconnect()
      this.mutationObserver?.disconnect()
    })
  }

  queueSync = () => {
    queueMicrotask(() => {
      run(() => this.syncView())
    })
  }

  syncView = () => {
    this.tableView = {
      quotes: this.args.feed.quotes,
    }
    this.viewGeneration++
  }

  @cached
  get columns(): ReturnType<typeof createTradingColumns> {
    return createTradingColumns(
      this.args.controller,
      this.args.controller.rendererMode,
    )
  }
  get data(): Array<MarketQuote> {
    void this.viewGeneration
    return this.tableView.quotes
  }
  get selectedSymbol() {
    return this.args.controller.selectedSymbol
  }

  get rows(): Array<TradingRow> {
    // The table-core memo compares `table.options.data` internally. Consume the
    // Ember source explicitly as well so this template getter owns the Glimmer
    // tag that schedules the row-block update for an external worker message.
    void this.data
    return readMeasuredRows(() => this.table.getRowModel().rows)
  }
  get headerGroups() {
    return this.table.getHeaderGroups()
  }
  get sourceRowCount() {
    void this.viewGeneration
    return this.tableView.quotes.length
  }
  get renderedRows(): Array<RenderedRow> {
    void this.viewGeneration
    const result = this.rows.map((row) => ({
      id: row.id,
      row,
      cells: row.getVisibleCells(),
    }))
    queueMicrotask(() =>
      this.args.controller.actions.setRenderedRowCount(result.length),
    )
    return result
  }

  captureScroll = (element: HTMLElement | null) => {
    this.scrollElement = element as HTMLDivElement | null
    if (!this.scrollElement) return
    this.resizeObserver?.disconnect()
    this.resizeObserver = new ResizeObserver(() => this.fitAvailableWidth())
    this.resizeObserver.observe(this.scrollElement)
    queueMicrotask(() => {
      run(() => this.fitAvailableWidth())
    })
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
      attributeFilter: ['class', 'style'],
      characterData: true,
      childList: true,
      subtree: true,
    })
  }

  @cached
  get columnSizeVars(): string {
    void this.table.store.state.columnSizing
    void this.table.store.state.columnOrder
    return this.table
      .getFlatHeaders()
      .flatMap((header) => [
        `--header-${header.id}-size:${header.getSize()}`,
        `--col-${header.column.id}-size:${header.column.getSize()}`,
      ])
      .join(';')
  }
  get tableStyle() {
    return htmlSafe(
      `${this.columnSizeVars};width:${this.table.getTotalSize()}px`,
    )
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

  resizeColumn = (header: TradingHeader) => (event: Event) => {
    this.layout.manuallyResized = true
    header.getResizeHandler()?.(event)
  }
  resetColumnSize = (header: TradingHeader) => () => {
    this.layout.manuallyResized = true
    header.column.resetSize()
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
      class='table-scroll'
      data-trading-table
      {{captureElement this.captureScroll}}
    >
      <table
        class='trading-data-grid'
        data-testid='trading-table'
        role='grid'
        aria-multiselectable='true'
        tabindex='0'
        style={{this.tableStyle}}
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
                          {{on 'dblclick' (this.resetColumnSize header)}}
                          {{on 'mousedown' (this.resizeColumn header)}}
                          {{on 'touchstart' (this.resizeColumn header)}}
                        ></div>{{/if}}
                    {{else}}<FlexRenderHeader @header={{header}} />{{/if}}
                  {{/unless}}
                </th>{{/each}}</tr>
          {{/each}}
        </thead>
        <tbody
          data-source-row-count={{this.sourceRowCount}}
          {{captureElement this.captureBody}}
          {{markRenderCommitted @feed this.data}}
          {{on 'mousedown' this.onBodyMouseDown}}
          {{on 'pointerover' this.onBodyPointerOver}}
          {{on 'mouseleave' this.resetPointer}}
          {{on 'click' this.onBodyClick}}
        >
          {{#each this.renderedRows as |item|}}
            <tr
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
const eq = (left: unknown, right: unknown): boolean => left === right
const not = (value: boolean): boolean => !value
