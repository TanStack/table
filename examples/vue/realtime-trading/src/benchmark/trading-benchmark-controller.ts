import { ref, shallowRef } from 'vue'
import { TRADING_COLUMN_COUNT } from '../table/trading-table'
import { FORCED_VIRTUALIZATION_ROW_COUNT } from '../table/trading-row-virtualizer'
import {
  BenchmarkMonitor,
  initialMetrics,
  longAnimationFramesSupported,
} from './benchmark-monitor'
import type { FeedMetrics } from './benchmark-monitor'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { RendererMode } from '../table/trading-table'
import type { VirtualScrollPreference } from '../table/trading-row-virtualizer'

export interface TradingBenchmarkActions {
  resetViewState: () => void
  setRendererMode: (mode: RendererMode) => void
  setVirtualScrollEnabled: (enabled: boolean) => void
  setRenderedRowCount: (count: number) => void
  selectSymbol: (symbol: string | null) => void
  resetMarket: () => void
}

export class TradingBenchmarkController {
  readonly requestedVirtualScrollMode = ref<VirtualScrollPreference>('auto')
  readonly metrics = shallowRef<FeedMetrics>(initialMetrics)
  readonly mountedCells = ref(0)
  readonly liveComponents = ref(0)
  readonly selectedSymbol = ref<string | null>(null)
  readonly rendererMode = ref<RendererMode>('stable')
  readonly longAnimationFramesSupported = longAnimationFramesSupported
  readonly monitor = new BenchmarkMonitor()
  readonly feed: MarketFeedController
  readonly actions: TradingBenchmarkActions

  readonly #runtime = {
    animationFrameId: 0,
    longAnimationFrameObserver: null as PerformanceObserver | null,
    stopObservingFeed: null as (() => void) | null,
  }

  constructor(feed: MarketFeedController) {
    this.feed = feed
    this.actions = {
      resetViewState: () => {
        this.selectedSymbol.value = null
      },
      setRendererMode: (mode) => {
        this.rendererMode.value = mode
      },
      setVirtualScrollEnabled: (enabled) => {
        if (
          this.feed.instrumentCount.value >= FORCED_VIRTUALIZATION_ROW_COUNT
        ) {
          return
        }
        this.requestedVirtualScrollMode.value = enabled ? 'tanstack' : 'none'
      },
      setRenderedRowCount: (count) => {
        const mountedCells = count * TRADING_COLUMN_COUNT
        if (mountedCells !== this.mountedCells.value) {
          this.mountedCells.value = mountedCells
        }
      },
      selectSymbol: (symbol) => {
        this.selectedSymbol.value = symbol
      },
      resetMarket: () => {
        this.monitor.reset()
        this.metrics.value = { ...initialMetrics }
        this.mountedCells.value = 0
        this.liveComponents.value = 0
        this.selectedSymbol.value = null
        this.feed.actions.reset()
      },
    }
  }

  start(): () => void {
    const longAnimationFrameObserver = longAnimationFramesSupported
      ? new PerformanceObserver((entries) => {
          for (const entry of entries.getEntries()) {
            this.monitor.recordLongAnimationFrame(
              entry.duration,
              entry.startTime,
            )
          }
        })
      : null

    this.#runtime.longAnimationFrameObserver = longAnimationFrameObserver
    this.#runtime.stopObservingFeed = this.feed.observe({
      messageReceived: () => this.monitor.recordWorkerMessage(),
      mutationStarted: () => this.monitor.markCommitPending(),
      batchApplied: ({ tickCount, updateCount, supersededUpdateCount }) =>
        this.monitor.recordBatch(tickCount, updateCount, supersededUpdateCount),
      renderCommitted: () => this.monitor.recordDomCommit(),
    })
    longAnimationFrameObserver?.observe({
      type: 'long-animation-frame',
    })
    this.#runtime.animationFrameId = requestAnimationFrame(this.#benchmarkFrame)

    return () => this.stop()
  }

  stop(): void {
    cancelAnimationFrame(this.#runtime.animationFrameId)
    this.#runtime.longAnimationFrameObserver?.disconnect()
    this.#runtime.stopObservingFeed?.()
    this.#runtime.longAnimationFrameObserver = null
    this.#runtime.stopObservingFeed = null
  }

  readonly #benchmarkFrame = (now: number): void => {
    this.monitor.recordAnimationFrame(now)
    if (this.monitor.shouldPublish(now)) {
      this.#publishMetrics(this.monitor.publish(now))
    }
    this.#runtime.animationFrameId = requestAnimationFrame(this.#benchmarkFrame)
  }

  #publishMetrics(metrics: FeedMetrics): void {
    this.metrics.value = metrics
    this.liveComponents.value =
      metrics.componentsCreated - metrics.componentsDestroyed
  }
}
