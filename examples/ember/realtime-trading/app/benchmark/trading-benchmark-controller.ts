import { cached, tracked } from '@glimmer/tracking'
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
  @tracked requestedVirtualScrollMode: VirtualScrollPreference = 'auto'
  @tracked metrics: FeedMetrics = initialMetrics
  @tracked mountedCells = 0
  @tracked selectedSymbol: string | null = null
  @tracked rendererMode: RendererMode = 'stable'
  @cached
  get liveComponents(): number {
    const metrics = this.metrics
    return metrics.componentsCreated - metrics.componentsDestroyed
  }
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
        this.selectedSymbol = null
      },
      setRendererMode: (mode) => {
        this.rendererMode = mode
      },
      setVirtualScrollEnabled: (enabled) => {
        if (
          this.feed.instrumentCount >= FORCED_VIRTUALIZATION_ROW_COUNT
        ) {
          return
        }
        this.requestedVirtualScrollMode = enabled ? 'tanstack' : 'none'
      },
      setRenderedRowCount: (count) => {
        const mountedCells = count * TRADING_COLUMN_COUNT
        if (mountedCells !== this.mountedCells) {
          this.mountedCells = mountedCells
        }
      },
      selectSymbol: (symbol) => {
        this.selectedSymbol = symbol
      },
      resetMarket: () => {
        this.monitor.reset()
        this.metrics = { ...initialMetrics }
        this.mountedCells = 0
        this.selectedSymbol = null
        this.feed.actions.reset()
      },
    }
  }

  start(): () => void {
    const longAnimationFrameObserver = longAnimationFramesSupported
      ? new PerformanceObserver((entries) => {
          for (const entry of entries.getEntries()) {
            this.monitor.recordLongAnimationFrame(entry.duration, entry.startTime)
          }
        })
      : null

    this.#runtime.longAnimationFrameObserver = longAnimationFrameObserver
    this.#runtime.stopObservingFeed = this.feed.observe({
      messageReceived: () => this.monitor.recordWorkerMessage(),
      mutationStarted: () => this.monitor.markRenderPending(),
      batchApplied: ({ tickCount, updateCount, supersededUpdateCount }) =>
        this.monitor.recordBatch(tickCount, updateCount, supersededUpdateCount),
      renderCommitted: () => this.monitor.recordCompletedRender(),
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
    this.metrics = metrics
  }
}
