import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  isDevMode,
  signal,
} from '@angular/core'
import { TRADING_COLUMN_COUNT } from '../table/table-config/trading-column-types'
import { MarketFeedService } from '../feed/market-feed.service'
import {
  FORCED_VIRTUALIZATION_ROW_COUNT,
  resolveVirtualScrollMode,
} from '../table/trading-row-virtualizer'
import { BenchmarkMonitor, initialMetrics } from './benchmark-monitor'
import type {
  VirtualScrollMode,
  VirtualScrollPreference,
} from '../table/trading-row-virtualizer'
import type { FeedMetrics } from './benchmark-monitor'
import type { RendererMode } from '../table/table-config/trading-column-types'

@Injectable({ providedIn: 'root' })
export class TradingBenchmarkController {
  readonly #destroyRef = inject(DestroyRef)
  readonly #monitor = new BenchmarkMonitor()
  readonly #feed = inject(MarketFeedService)
  readonly #longAnimationFrameObserver: PerformanceObserver | null

  readonly devMode = isDevMode()
  readonly longAnimationFramesSupported =
    PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')
  readonly tableWorkerEnabled = signal(false)
  readonly renderedRowCount = signal(0)
  readonly rendererMode = signal<RendererMode>('stable')
  readonly requestedVirtualScrollMode = signal<VirtualScrollPreference>('auto')
  readonly selectedSymbol = signal<string | null>(null)
  readonly metrics = signal<FeedMetrics>(initialMetrics)
  readonly displayQuotes = this.#feed.quotes
  readonly selectedQuote = computed(() => {
    const symbol = this.selectedSymbol()
    return symbol
      ? (this.displayQuotes().find((quote) => quote.symbol === symbol) ?? null)
      : null
  })
  readonly virtualScrollForced = computed(
    () => this.#feed.instrumentCount() >= FORCED_VIRTUALIZATION_ROW_COUNT,
  )
  readonly virtualScrollMode = computed<VirtualScrollMode>(() =>
    resolveVirtualScrollMode(
      this.requestedVirtualScrollMode(),
      this.#feed.instrumentCount(),
    ),
  )
  readonly mountedCells = computed(
    () => this.renderedRowCount() * TRADING_COLUMN_COUNT,
  )
  readonly liveComponents = computed(() => {
    const metrics = this.metrics()
    return metrics.componentsCreated - metrics.componentsDestroyed
  })

  #animationFrameId: number | null = null

  constructor() {
    const stopObservingFeed = this.#feed.observe({
      messageReceived: () => this.#monitor.recordWorkerMessage(),
      mutationStarted: () => this.#monitor.markRenderPending(),
      batchApplied: ({ tickCount, updateCount, supersededUpdateCount }) =>
        this.#monitor.recordBatch(
          tickCount,
          updateCount,
          supersededUpdateCount,
        ),
      renderCommitted: () => this.#monitor.recordCompletedRender(),
    })
    this.#longAnimationFrameObserver = this.longAnimationFramesSupported
      ? new PerformanceObserver(this.#recordLongAnimationFrames)
      : null
    this.#longAnimationFrameObserver?.observe({
      type: 'long-animation-frame',
      buffered: true,
    })
    this.#animationFrameId = requestAnimationFrame(this.#benchmarkFrame)
    this.#destroyRef.onDestroy(() => {
      stopObservingFeed()
      if (this.#animationFrameId !== null) {
        cancelAnimationFrame(this.#animationFrameId)
      }
      this.#longAnimationFrameObserver?.disconnect()
    })
  }

  setRendererMode(shouldSwap: boolean): void {
    this.rendererMode.set(shouldSwap ? 'swap' : 'stable')
  }

  setTableWorkerEnabled(enabled: boolean): void {
    this.tableWorkerEnabled.set(enabled)
  }

  setVirtualScrollEnabled(enabled: boolean): void {
    if (this.virtualScrollForced()) return
    this.requestedVirtualScrollMode.set(enabled ? 'tanstack' : 'none')
  }

  setRenderedRowCount(count: number): void {
    this.renderedRowCount.set(count)
  }

  resetViewState(): void {
    this.selectedSymbol.set(null)
  }

  resetMarket(): void {
    this.#monitor.reset()
    this.resetViewState()
    this.metrics.set(initialMetrics)
    this.#feed.reset()
  }

  readonly #benchmarkFrame = (now: number): void => {
    this.#monitor.recordAnimationFrame()
    if (this.#monitor.shouldPublish(now)) {
      this.metrics.set(this.#monitor.publish(now))
    }
    this.#animationFrameId = requestAnimationFrame(this.#benchmarkFrame)
  }

  readonly #recordLongAnimationFrames = (
    entries: PerformanceObserverEntryList,
  ): void => {
    for (const entry of entries.getEntries()) {
      this.#monitor.recordLongAnimationFrame(entry.duration)
    }
  }
}
