import Alpine from 'alpinejs'
import { shallow } from '@tanstack/store'
import { FlexRender, createTable } from '@tanstack/alpine-table'
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
import { tradingFeatures } from './table/trading-features'
import {
  TradingGridPointerController,
  handleCellNavigation,
  reorderColumnIds,
  sortAriaValue,
  sortIndicator,
} from './table/table-interactions'
import './table/table-config/quote-cells'
import './index.css'
import type { AlpineTable } from '@tanstack/alpine-table'
import type { MarketQuote } from './feed/market-data'

type Table = AlpineTable<typeof tradingFeatures, MarketQuote>
const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const rate = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const ms = (number: number) => `${number.toFixed(2)} ms`

function applyCellMarkup(element: HTMLElement, markup: unknown) {
  const html = markup == null ? '' : String(markup)
  const existing = element.firstElementChild as HTMLElement | null
  if (existing && html.startsWith('<')) {
    const closeIndex = html.indexOf('>')
    const startTag = closeIndex === -1 ? html : html.slice(1, closeIndex)
    const tagName = startTag.split(/\s/, 1)[0]?.replace(/\/$/, '')
    if (tagName && existing.tagName.toLowerCase() === tagName) {
      for (const match of startTag.matchAll(/([^\s=]+)="([^"]*)"/g)) {
        const name = match[1]!
        const value = match[2]!
        if (existing.getAttribute(name) !== value) {
          existing.setAttribute(name, value)
        }
      }
      return
    }
  }
  if (element.innerHTML !== html) {
    element.innerHTML = html
  }
}

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
    tableVersion: 0,
    quotesVersion: 0,
  })
  const columns = createTradingColumns(() => local.rendererMode)
  const table = createTable(
    {
      key: 'alpine-realtime-trading',
      features: tradingFeatures,
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
    cleanups: [] as Array<() => void>,
    manuallyResized: false,
    dragColumnId: null as string | null,
    dragSource: null as HTMLTableCellElement | null,
    dragTarget: null as HTMLTableCellElement | null,
    cachedRows: [] as ReturnType<Table['getRowModel']>['rows'],
    cachedFeed: null as Array<MarketQuote> | null,
    cachedTableVersion: -1,
    lastRenderedRowCount: -1,
    lastTableUi: null as {
      sorting: unknown
      columnFilters: unknown
      columnOrder: unknown
      rowSelection: unknown
      cellSelection: unknown
    } | null,
    domCommitScheduled: false,
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
  const renderRows = () => {
    void local.quotesVersion
    const currentRows = rows()
    if (runtime.lastRenderedRowCount !== currentRows.length) {
      runtime.lastRenderedRowCount = currentRows.length
      queueMicrotask(() =>
        controller.actions.setRenderedRowCount(runtime.lastRenderedRowCount),
      )
    }
    return currentRows
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
  const scheduleDomCommit = () => {
    if (runtime.domCommitScheduled) return

    runtime.domCommitScheduled = true
    Alpine.nextTick(() => {
      runtime.domCommitScheduled = false
      feed.completeRender()
    })
  }

  return {
    table,
    FlexRender,
    applyCellMarkup,
    local,
    feed,
    controller,
    feedSampleRateOptions,
    configuratorOptions,
    init(this: { $refs: Record<string, HTMLElement> }) {
      const scroll = this.$refs.scroll as HTMLDivElement
      const tableElement = this.$refs.table as HTMLTableElement
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
        attributeFilter: ['class', 'style'],
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
          const lengthChanged = quotes.length !== local.feed.quotes.length
          runtime.cachedFeed = null
          local.feed.quotes = quotes
          if (lengthChanged) {
            local.quotesVersion++
            local.tableVersion++
          }
          table.setOptions((previous) => ({ ...previous, data: quotes }))
          scheduleDomCommit()
        }),
        controller.store.subscribe((state) => {
          const current = local.benchmark
          if (current.mountedCells !== state.mountedCells) {
            current.mountedCells = state.mountedCells
          }
          if (current.liveComponents !== state.liveComponents) {
            current.liveComponents = state.liveComponents
          }
          current.metrics = state.metrics
        }),
        controller.renderAtoms.selectedSymbol.subscribe((symbol) => {
          local.selectedSymbol = symbol
        }),
        controller.renderAtoms.rendererMode.subscribe((mode) => {
          local.rendererMode = mode
          local.tableVersion++
        }),
        table.store.subscribe(() => {
          const state = table.store.state
          const next = {
            sorting: state.sorting,
            columnFilters: state.columnFilters,
            columnOrder: state.columnOrder,
            rowSelection: state.rowSelection,
            cellSelection: state.cellSelection,
          }
          if (runtime.lastTableUi && shallow(runtime.lastTableUi, next)) {
            return
          }
          runtime.lastTableUi = next
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
        stopFeed,
        stopBenchmark,
        () => resizeObserver.disconnect(),
        () => mutationObserver.disconnect(),
        ...subscriptions.map(
          (subscription) => () => subscription.unsubscribe(),
        ),
      )
      Alpine.nextTick(() => writeSizes(tableElement))
      scheduleDomCommit()
    },
    destroy() {
      for (const cleanup of runtime.cleanups) cleanup()
      runtime.cleanups.length = 0
    },
    rows,
    renderRows,
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
          'FRAME RATE (EST.)',
          metrics.rafCallbacksPerSecond.toFixed(1),
          'rAF callbacks/s · rolling 1 s',
          'frame-rate',
        ],
        [
          'AVG COMMIT',
          ms(metrics.averageCommitLatencyMs),
          'snapshot → DOM · rolling 3 s',
          'average-commit-latency',
        ],
        [
          'LONG FRAMES',
          local.benchmark.longAnimationFramesSupported
            ? String(metrics.longAnimationFrames)
            : 'N/A',
          local.benchmark.longAnimationFramesSupported
            ? `since reset · worst ${ms(metrics.worstLongAnimationFrameMs)}`
            : 'unsupported',
          'long-frame-count',
        ],
        [
          'THROUGHPUT',
          `${rate.format(metrics.rowUpdatesPerSecond)} rows/s`,
          `${metrics.stateApplicationsPerSecond.toFixed(1)} snapshots/s · rows deduplicated per snapshot`,
          'throughput-rate',
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
        [
          'Worker-generated samples / s',
          rate.format(metrics.actualTicksPerSecond),
          'actual-rate',
        ],
        [
          'Changed rows / s',
          rate.format(metrics.rowUpdatesPerSecond),
          'row-update-rate',
        ],
        [
          'Worker messages / s',
          metrics.workerMessagesPerSecond.toFixed(1),
          'message-rate',
        ],
        [
          'Snapshots applied / s',
          metrics.stateApplicationsPerSecond.toFixed(1),
          'state-apply-rate',
        ],
        [
          'DOM commits / s',
          metrics.tableCommitsPerSecond.toFixed(1),
          'table-render-rate',
        ],
        [
          'Commit latency p95 / max (10 s)',
          `${ms(metrics.p95CommitLatencyMs)} / ${ms(metrics.maxCommitLatencyMs)}`,
          '',
        ],
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
          'Observed MutationRecords / s',
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
        [
          'Commits > 16.7 ms (since reset)',
          integer.format(metrics.slowCommits),
          '',
        ],
        [
          'JS heap (current, GC-sensitive)',
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
