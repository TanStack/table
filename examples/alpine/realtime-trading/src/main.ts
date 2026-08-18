import Alpine from 'alpinejs'
import {
  FlexRender,
  createFilteredRowModel,
  createSortedRowModel,
  createTable,
  filterFn_includesString,
  sortFn_basic,
  stockFeatures,
  tableFeatures,
} from '@tanstack/alpine-table'
import {
  Virtualizer,
  elementScroll,
  observeElementOffset,
  observeElementRect,
} from '@tanstack/virtual-core'
import { TradingBenchmarkController } from './benchmark/trading-benchmark-controller'
import { MarketFeedController } from './feed/market-feed-controller'
import {
  feedSampleRateAt,
  feedSampleRateIndex,
  feedSampleRateOptions,
} from './feed/feed-sample-rates'
import { configuratorOptions } from './shell/configurator-options'
import {
  createTradingColumns,
  readMeasuredRows,
} from './table/table-config/trading-columns'
import {
  TradingGridPointerController,
  handleCellNavigation,
  reorderColumnIds,
  sortAriaValue,
  sortIndicator,
} from './table/table-interactions'
import {
  TRADING_ROW_HEIGHT,
  TRADING_ROW_OVERSCAN,
  resolveVirtualScrollMode,
} from './table/trading-row-virtualizer'
import './table/table-config/quote-cells'
import './index.css'
import type { AlpineTable } from '@tanstack/alpine-table'
import type { VirtualItem } from '@tanstack/virtual-core'
import type { MarketQuote } from './feed/market-data'

const features = tableFeatures({
  ...stockFeatures,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { basic: sortFn_basic },
})
type Table = AlpineTable<typeof features, MarketQuote>
const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const rate = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const ms = (number: number) => `${number.toFixed(2)} ms`

Alpine.data('tradingApp', () => {
  const feed = new MarketFeedController()
  const controller = new TradingBenchmarkController(feed)
  const local = Alpine.reactive({
    feed: {
      workerReady: feed.workerReady.get(),
      running: feed.running.get(),
      instrumentCount: feed.instrumentCount.get(),
      targetTicksPerSecond: feed.targetTicksPerSecond.get(),
      publishIntervalMs: feed.publishIntervalMs.get(),
      updateSparklines: feed.updateSparklines.get(),
      sparklineSampleIntervalMs: feed.sparklineSampleIntervalMs.get(),
      quotes: feed.quotes.get(),
    },
    benchmark: controller.store.get(),
    selectedSymbol: controller.renderAtoms.selectedSymbol.get(),
    rendererMode: controller.renderAtoms.rendererMode.get(),
    sidebarOpen: true,
    virtualVersion: 0,
    tableVersion: 0,
  })
  const columns = createTradingColumns<typeof features>(
    () => local.rendererMode,
  )
  const table = createTable(
    {
      key: 'alpine-realtime-trading',
      features,
      columns,
      get data() {
        return local.feed.quotes
      },
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
  const pointer = new TradingGridPointerController()
  const runtime = {
    virtualizer: null as Virtualizer<
      HTMLDivElement,
      HTMLTableRowElement
    > | null,
    cleanups: [] as Array<() => void>,
    manuallyResized: false,
    dragColumnId: null as string | null,
    dragSource: null as HTMLTableCellElement | null,
    dragTarget: null as HTMLTableCellElement | null,
    cachedRows: [] as ReturnType<Table['getRowModel']>['rows'],
    cachedFeed: null as Array<MarketQuote> | null,
    cachedTableVersion: -1,
  }
  const rows = () => {
    if (
      runtime.cachedFeed !== local.feed.quotes ||
      runtime.cachedTableVersion !== local.tableVersion
    ) {
      runtime.cachedFeed = local.feed.quotes
      runtime.cachedTableVersion = local.tableVersion
      runtime.cachedRows = readMeasuredRows(() => table.getRowModel().rows)
    }
    return runtime.cachedRows
  }
  const virtualMode = () =>
    resolveVirtualScrollMode(
      local.benchmark.requestedVirtualScrollMode,
      local.feed.instrumentCount,
    )
  const syncVirtualizer = () => {
    const virtualizer = runtime.virtualizer
    const currentRows = rows()
    if (!virtualizer) return
    virtualizer.setOptions({
      ...virtualizer.options,
      count: currentRows.length,
      enabled: virtualMode() === 'tanstack',
      getItemKey: (index) => currentRows[index]?.id ?? index,
    })
    virtualizer._willUpdate()
  }
  const renderRows = (): Array<{
    row: (typeof runtime.cachedRows)[number]
    virtual: VirtualItem | null
  }> => {
    void local.virtualVersion
    syncVirtualizer()
    const currentRows = rows()
    const result =
      virtualMode() === 'tanstack' && runtime.virtualizer
        ? runtime.virtualizer
            .getVirtualItems()
            .map((item) => ({ row: currentRows[item.index], virtual: item }))
        : currentRows.map((row) => ({ row, virtual: null }))
    queueMicrotask(() => controller.actions.setRenderedRowCount(result.length))
    return result
  }
  const writeSizes = (tableElement: HTMLTableElement) => {
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

  return {
    table,
    FlexRender,
    local,
    feed,
    controller,
    feedSampleRateOptions,
    configuratorOptions,
    init(this: { $refs: Record<string, HTMLElement> }) {
      const scroll = this.$refs.scroll as HTMLDivElement
      const tableElement = this.$refs.table as HTMLTableElement
      runtime.virtualizer = new Virtualizer({
        count: 0,
        getScrollElement: () => scroll,
        estimateSize: () => TRADING_ROW_HEIGHT,
        overscan: TRADING_ROW_OVERSCAN,
        observeElementRect,
        observeElementOffset,
        scrollToFn: elementScroll,
        onChange: () => {
          local.virtualVersion++
        },
      })
      const stopVirtualizer = runtime.virtualizer._didMount()
      const resizeObserver = new ResizeObserver(() => {
        if (runtime.manuallyResized) return
        const width = table.getTotalSize()
        if (scroll.clientWidth <= width + 1 || width <= 0) return
        const ratio = scroll.clientWidth / width
        table.setColumnSizing(
          Object.fromEntries(
            table
              .getVisibleLeafColumns()
              .map((column) => [column.id, column.getSize() * ratio]),
          ),
        )
      })
      resizeObserver.observe(scroll)
      const mutationObserver = new MutationObserver((records) =>
        controller.monitor.recordDomMutations(records.length),
      )
      mutationObserver.observe(tableElement.tBodies[0], {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      })
      const subscriptions = [
        feed.workerReady.subscribe((value) => {
          local.feed.workerReady = value
        }),
        feed.running.subscribe((value) => {
          local.feed.running = value
        }),
        feed.instrumentCount.subscribe((value) => {
          local.feed.instrumentCount = value
        }),
        feed.targetTicksPerSecond.subscribe((value) => {
          local.feed.targetTicksPerSecond = value
        }),
        feed.publishIntervalMs.subscribe((value) => {
          local.feed.publishIntervalMs = value
        }),
        feed.updateSparklines.subscribe((value) => {
          local.feed.updateSparklines = value
        }),
        feed.sparklineSampleIntervalMs.subscribe((value) => {
          local.feed.sparklineSampleIntervalMs = value
        }),
        feed.quotes.subscribe((quotes) => {
          local.feed.quotes = quotes
          Alpine.nextTick(() => feed.completeRender())
        }),
        controller.store.subscribe((state) => {
          local.benchmark = state
        }),
        controller.renderAtoms.selectedSymbol.subscribe((symbol) => {
          local.selectedSymbol = symbol
        }),
        controller.renderAtoms.rendererMode.subscribe((mode) => {
          local.rendererMode = mode
          local.tableVersion++
        }),
        table.store.subscribe(() => {
          local.tableVersion++
        }),
        table.atoms.columnSizing.subscribe(() => writeSizes(tableElement)),
        table.atoms.columnOrder.subscribe(() => writeSizes(tableElement)),
        table.atoms.columnResizing.subscribe((state) => {
          if (state.isResizingColumn !== false) runtime.manuallyResized = true
        }),
      ]
      const stopFeed = feed.start()
      const stopBenchmark = controller.start()
      runtime.cleanups.push(
        stopVirtualizer,
        stopFeed,
        stopBenchmark,
        () => resizeObserver.disconnect(),
        () => mutationObserver.disconnect(),
        ...subscriptions.map(
          (subscription) => () => subscription.unsubscribe(),
        ),
      )
      Alpine.nextTick(() => {
        writeSizes(tableElement)
        feed.completeRender()
      })
    },
    destroy() {
      for (const cleanup of runtime.cleanups) cleanup()
      runtime.cleanups.length = 0
    },
    rows,
    renderRows,
    virtualMode,
    tableHeight() {
      void local.virtualVersion
      return (
        runtime.virtualizer?.getTotalSize() ??
        rows().length * TRADING_ROW_HEIGHT
      )
    },
    visibleRangeText() {
      void local.virtualVersion
      const range = runtime.virtualizer?.range
      const currentRows = rows()
      if (!range || virtualMode() !== 'tanstack' || !currentRows.length)
        return 'Current · rows —'
      return `Current · rows ${Math.min(range.startIndex, currentRows.length - 1)}..${Math.min(range.endIndex, currentRows.length - 1)}`
    },
    toggleSidebar() {
      local.sidebarOpen = !local.sidebarOpen
    },
    feedStatus() {
      return !local.feed.workerReady
        ? 'FEED CONNECTING'
        : local.feed.running
          ? 'FEED LIVE'
          : 'FEED PAUSED'
    },
    setInstrumentCount(event: Event) {
      controller.actions.resetViewState()
      feed.actions.setInstrumentCount(
        Number((event.target as HTMLSelectElement).value),
      )
    },
    sampleRateIndex() {
      return feedSampleRateIndex(local.feed.targetTicksPerSecond)
    },
    setSampleRate(event: Event) {
      feed.actions.setTargetRate(
        feedSampleRateAt(Number((event.target as HTMLInputElement).value)),
      )
    },
    setPublishInterval(event: Event) {
      feed.actions.setPublishInterval(
        Number((event.target as HTMLSelectElement).value),
      )
    },
    setVirtualMode(event: Event) {
      controller.actions.setVirtualScrollEnabled(
        (event.target as HTMLSelectElement).value === 'tanstack',
      )
    },
    setRendererMode(event: Event) {
      controller.actions.setRendererMode(
        (event.target as HTMLInputElement).checked ? 'swap' : 'stable',
      )
    },
    setSparklineUpdates(event: Event) {
      feed.actions.setSparklineUpdates(
        (event.target as HTMLInputElement).checked,
      )
    },
    setSparklineInterval(event: Event) {
      feed.actions.setSparklineSampleInterval(
        Number((event.target as HTMLSelectElement).value),
      )
    },
    metricItems() {
      const metrics = local.benchmark.metrics
      return [
        [
          'WORKER SAMPLES',
          rate.format(metrics.actualTicksPerSecond),
          'generated samples/s',
          'actual-rate',
        ],
        [
          'ROW UPDATES',
          rate.format(metrics.rowUpdatesPerSecond),
          'unique rows applied/s',
          'row-update-rate',
        ],
        [
          'MESSAGES',
          metrics.workerMessagesPerSecond.toFixed(1),
          'worker messages/s',
          'message-rate',
        ],
        [
          'STATE APPLIES',
          metrics.stateApplicationsPerSecond.toFixed(1),
          'quote snapshots/s',
          'state-apply-rate',
        ],
        [
          'TABLE COMMITS',
          metrics.tableRendersPerSecond.toFixed(1),
          'completed renders/s',
          'table-render-rate',
        ],
        ['AVG RENDER', ms(metrics.averageRenderMs), 'mutation → render', ''],
        [
          'P95 RENDER',
          ms(metrics.p95RenderMs),
          `max ${ms(metrics.maxRenderMs)}`,
          '',
        ],
        [
          'LONG FRAMES',
          local.benchmark.longAnimationFramesSupported
            ? String(metrics.longAnimationFrames)
            : 'N/A',
          local.benchmark.longAnimationFramesSupported
            ? `worst ${ms(metrics.worstLongAnimationFrameMs)}`
            : 'unsupported',
          'long-frame-count',
        ],
      ]
    },
    diagnostics() {
      const metrics = local.benchmark.metrics
      const invocation = (items: typeof metrics.cellRendererRates) => {
        const active = items.filter((item) => item.callsPerSecond > 0)
        return active.length
          ? active
              .map((item) => `${item.name} ${rate.format(item.callsPerSecond)}`)
              .join(' · ')
          : '—'
      }
      return [
        ['Mounted cells', integer.format(local.benchmark.mountedCells), ''],
        ['Live components', integer.format(local.benchmark.liveComponents), ''],
        [
          'Created / destroyed',
          `${integer.format(metrics.componentsCreated)} / ${integer.format(metrics.componentsDestroyed)}`,
          '',
        ],
        [
          'Renderer callbacks / s',
          rate.format(metrics.cellRendererCallsPerSecond),
          'cell-render-rate',
        ],
        [
          'Component executions / s',
          rate.format(metrics.componentRenderCallsPerSecond),
          'component-render-rate',
        ],
        [
          'Executions by component / s',
          invocation(metrics.componentRenderRates),
          'component-render-breakdown',
        ],
        [
          'Callbacks by column / s',
          invocation(metrics.cellRendererRates),
          'cell-render-breakdown',
        ],
        [
          'DOM mutation records / s',
          rate.format(metrics.domMutationsPerSecond),
          'dom-mutation-rate',
        ],
        [
          'Core row model calls / s',
          metrics.rowModelCallsPerSecond.toFixed(1),
          'row-model-call-rate',
        ],
        [
          'Core row model avg / max',
          `${ms(metrics.rowModelAverageMs)} / ${ms(metrics.rowModelMaxMs)}`,
          'row-model-duration',
        ],
        [
          'Visible rows',
          integer.format(metrics.visibleRows),
          'visible-row-count',
        ],
        [
          'Worker messages',
          integer.format(metrics.workerMessages),
          'worker-messages',
        ],
        [
          'Worker-coalesced updates / s',
          rate.format(metrics.supersededUpdatesPerSecond),
          'superseded-update-rate',
        ],
        [
          'Last samples / updated rows',
          `${integer.format(metrics.lastBatchSize)} / ${integer.format(metrics.lastUpdateCount)}`,
          '',
        ],
        ['Renders > 16.7 ms', integer.format(metrics.slowRenders), ''],
        [
          'JS heap',
          metrics.heapMb === null ? 'N/A' : `${metrics.heapMb.toFixed(1)} MB`,
          '',
        ],
      ]
    },
    selectedQuote() {
      return feed.getQuoteBySymbol(local.feed.quotes, local.selectedSymbol)
    },
    formatInteger: (number: number) => integer.format(number),
    formatRate: (number: number) => rate.format(number),
    sortIndicator,
    sortAriaValue,
    isTextColumn(id: string) {
      return ['market', 'name', 'symbol'].includes(id)
    },
    onGridKeyDown(event: KeyboardEvent) {
      handleCellNavigation(table, event)
    },
    onBodyMouseDown(event: MouseEvent) {
      pointer.handleMouseDown(table, event, controller.actions.selectSymbol)
    },
    onBodyPointerOver(event: MouseEvent) {
      pointer.handlePointerOver(table, event)
    },
    onBodyClick(event: MouseEvent) {
      pointer.handleClick(table, event)
    },
    resetPointer() {
      pointer.resetPointerCell()
    },
    clearDrag() {
      runtime.dragSource?.classList.remove('is-column-dragging')
      runtime.dragTarget?.classList.remove('is-column-drop-target')
      runtime.dragColumnId = null
      runtime.dragSource = null
      runtime.dragTarget = null
    },
    dragStart(
      header: ReturnType<Table['getFlatHeaders']>[number],
      event: DragEvent,
    ) {
      runtime.dragColumnId = header.column.id
      runtime.dragSource = (event.currentTarget as HTMLElement).closest('th')
      runtime.dragSource?.classList.add('is-column-dragging')
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', header.column.id)
      }
    },
    dragOver(
      header: ReturnType<Table['getFlatHeaders']>[number],
      event: DragEvent,
    ) {
      event.preventDefault()
      runtime.dragTarget?.classList.remove('is-column-drop-target')
      runtime.dragTarget = null
      const element = (event.currentTarget as HTMLElement).closest('th')
      if (runtime.dragColumnId !== header.column.id && element) {
        element.classList.add('is-column-drop-target')
        runtime.dragTarget = element
      }
    },
    drop(
      header: ReturnType<Table['getFlatHeaders']>[number],
      event: DragEvent,
    ) {
      event.preventDefault()
      const source =
        event.dataTransfer?.getData('text/plain') || runtime.dragColumnId
      if (source)
        table.setColumnOrder(
          reorderColumnIds(
            table.getVisibleLeafColumns().map((column) => column.id),
            source,
            header.column.id,
          ),
        )
      this.clearDrag()
    },
  }
})

window.Alpine = Alpine
Alpine.start()
