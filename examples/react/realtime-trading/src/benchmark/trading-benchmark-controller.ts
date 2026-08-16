import { batch, createAtom, createStore } from '@tanstack/react-store'
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
import type { VirtualScrollMode } from '../table/trading-row-virtualizer'

export interface TradingBenchmarkState {
  requestedVirtualScrollMode: VirtualScrollMode
  metrics: FeedMetrics
  mountedCells: number
  liveComponents: number
  longAnimationFramesSupported: boolean
}

export interface TradingBenchmarkActions {
  resetViewState: () => void
  setRendererMode: (mode: RendererMode) => void
  setVirtualScrollEnabled: (enabled: boolean) => void
  setRenderedRowCount: (count: number) => void
  selectSymbol: (symbol: string | null) => void
  resetMarket: () => void
}

const initialState: TradingBenchmarkState = {
  requestedVirtualScrollMode: 'none',
  metrics: initialMetrics,
  mountedCells: 0,
  liveComponents: 0,
  longAnimationFramesSupported,
}

export class TradingBenchmarkController {
  readonly store = createStore<TradingBenchmarkState>(initialState)
  readonly renderAtoms = {
    selectedSymbol: createAtom<string | null>(null),
    rendererMode: createAtom<RendererMode>('stable'),
  }
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
        this.renderAtoms.selectedSymbol.set(null)
      },
      setRendererMode: (mode) => {
        this.renderAtoms.rendererMode.set(mode)
      },
      setVirtualScrollEnabled: (enabled) => {
        if (
          this.feed.store.get().instrumentCount >=
          FORCED_VIRTUALIZATION_ROW_COUNT
        ) {
          return
        }
        this.#patch({
          requestedVirtualScrollMode: enabled ? 'tanstack' : 'none',
        })
      },
      setRenderedRowCount: (count) => {
        const mountedCells = count * TRADING_COLUMN_COUNT
        if (mountedCells !== this.store.get().mountedCells) {
          this.#patch({ mountedCells })
        }
      },
      selectSymbol: (symbol) => {
        this.renderAtoms.selectedSymbol.set(symbol)
      },
      resetMarket: () => {
        batch(() => {
          this.monitor.reset()
          this.store.setState((state) => ({
            ...state,
            metrics: { ...initialMetrics },
            mountedCells: 0,
            liveComponents: 0,
          }))
          this.renderAtoms.selectedSymbol.set(null)
          this.feed.actions.reset()
        })
      },
    }
  }

  start(): () => void {
    const longAnimationFrameObserver = longAnimationFramesSupported
      ? new PerformanceObserver((entries) => {
          for (const entry of entries.getEntries()) {
            this.monitor.recordLongAnimationFrame(entry.duration)
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
      buffered: true,
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
    this.monitor.recordAnimationFrame()
    if (this.monitor.shouldPublish(now)) {
      this.#publishMetrics(this.monitor.publish(now))
    }
    this.#runtime.animationFrameId = requestAnimationFrame(this.#benchmarkFrame)
  }

  #patch(patch: Partial<TradingBenchmarkState>): void {
    this.store.setState((state) => ({ ...state, ...patch }))
  }

  #publishMetrics(metrics: FeedMetrics): void {
    this.#patch({
      metrics,
      liveComponents: metrics.componentsCreated - metrics.componentsDestroyed,
    })
  }
}
