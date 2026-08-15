import { batch, createAtom, createStore } from '@tanstack/react-store'
import {
  TRADING_COLUMN_COUNT,
  rowModelDiagnostics,
} from '../table/trading-table'
import {
  BenchmarkMonitor,
  initialMetrics,
  longAnimationFramesSupported,
  markBenchmarkAction,
} from './benchmark-monitor'
import type { FeedMetrics, ScrollStressMode } from './benchmark-monitor'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { MarketQuote } from '../feed/market-data'
import type {
  CoreRowModelMode,
  CoreTableState,
  RendererMode,
} from '../table/trading-table'

export interface TradingBenchmarkState {
  coreRowModelMode: CoreRowModelMode
  coreFilterValue: string
  scrollStressMode: ScrollStressMode
  rendererMode: RendererMode
  selectedSymbol: string | null
  metrics: FeedMetrics
  displayQuotes: Array<MarketQuote>
  selectedQuote: MarketQuote | null
  mountedCells: number
  liveComponents: number
  longAnimationFramesSupported: boolean
}

export interface TradingBenchmarkActions {
  resetViewState: () => void
  setCoreRowModelMode: (mode: CoreRowModelMode) => void
  setCoreFilterValue: (value: string) => void
  setScrollStressMode: (mode: ScrollStressMode) => void
  setRendererMode: (mode: RendererMode) => void
  selectSymbol: (symbol: string | null) => void
  resetMarket: () => void
}

const initialState: TradingBenchmarkState = {
  coreRowModelMode: 'none',
  coreFilterValue: 'ALP',
  scrollStressMode: 'off',
  rendererMode: 'stable',
  selectedSymbol: null,
  metrics: initialMetrics,
  displayQuotes: [],
  selectedQuote: null,
  mountedCells: 0,
  liveComponents: 0,
  longAnimationFramesSupported,
}

export class TradingBenchmarkController {
  readonly store = createStore<TradingBenchmarkState>(initialState)
  readonly tableAtoms = {
    sorting: createAtom<CoreTableState['sorting']>([]),
    columnFilters: createAtom<CoreTableState['columnFilters']>([]),
  }
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
    feedSubscription: null as { unsubscribe: () => void } | null,
    stopObservingFeed: null as (() => void) | null,
    lastFeedQuotes: null as Array<MarketQuote> | null,
  }

  constructor(feed: MarketFeedController) {
    this.feed = feed
    this.actions = {
      resetViewState: () => {
        batch(() => {
          this.#setSelectionState({ selectedSymbol: null })
          this.renderAtoms.selectedSymbol.set(null)
        })
      },
      setCoreRowModelMode: (mode) => {
        markBenchmarkAction('core-row-model-change', { mode })
        batch(() => {
          this.#setSelectionState({
            coreRowModelMode: mode,
            selectedSymbol: null,
          })
          this.#syncCoreTableAtoms(mode, this.store.get().coreFilterValue)
          this.renderAtoms.selectedSymbol.set(null)
        })
      },
      setCoreFilterValue: (value) => {
        batch(() => {
          this.#patch({ coreFilterValue: value })
          this.#syncCoreTableAtoms(this.store.get().coreRowModelMode, value)
        })
      },
      setScrollStressMode: (mode) => {
        this.#patch({ scrollStressMode: mode })
      },
      setRendererMode: (mode) => {
        batch(() => {
          this.#patch({ rendererMode: mode })
          this.renderAtoms.rendererMode.set(mode)
        })
      },
      selectSymbol: (symbol) => {
        batch(() => {
          this.#setSelectionState({ selectedSymbol: symbol })
          this.renderAtoms.selectedSymbol.set(symbol)
        })
      },
      resetMarket: () => {
        batch(() => {
          this.monitor.reset()
          this.store.setState((state) => ({
            ...state,
            selectedSymbol: null,
            selectedQuote: null,
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
    this.#runtime.feedSubscription = this.feed.store.subscribe((state) => {
      if (state.quotes === this.#runtime.lastFeedQuotes) return

      this.#runtime.lastFeedQuotes = state.quotes
      this.#setQuotes(state.quotes)
    })
    const initialQuotes = this.feed.store.get().quotes
    this.#runtime.lastFeedQuotes = initialQuotes
    this.#setQuotes(initialQuotes)
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
    this.#runtime.feedSubscription?.unsubscribe()
    this.#runtime.stopObservingFeed?.()
    this.#runtime.longAnimationFrameObserver = null
    this.#runtime.feedSubscription = null
    this.#runtime.stopObservingFeed = null
    this.#runtime.lastFeedQuotes = null
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

  #setQuotes(quotes: Array<MarketQuote>): void {
    this.store.setState((state) => {
      return {
        ...state,
        displayQuotes: quotes,
        selectedQuote: findSelectedQuote(quotes, state.selectedSymbol),
      }
    })
  }

  #setSelectionState(
    patch: Partial<
      Pick<TradingBenchmarkState, 'coreRowModelMode' | 'selectedSymbol'>
    >,
  ): void {
    this.store.setState((state) => {
      const nextState = { ...state, ...patch }
      return {
        ...nextState,
        selectedQuote: findSelectedQuote(
          nextState.displayQuotes,
          nextState.selectedSymbol,
        ),
      }
    })
  }

  #publishMetrics(metrics: FeedMetrics): void {
    const visibleRows = rowModelDiagnostics.hasMeasurement
      ? rowModelDiagnostics.lastRowCount
      : this.store.get().displayQuotes.length
    this.#patch({
      metrics,
      mountedCells: visibleRows * TRADING_COLUMN_COUNT,
      liveComponents: metrics.componentsCreated - metrics.componentsDestroyed,
    })
  }

  #syncCoreTableAtoms(mode: CoreRowModelMode, filterValue: string): void {
    const sorts = mode === 'sort' || mode === 'sort-filter'
    const trimmedFilter = filterValue.trim()
    const filters =
      (mode === 'filter' || mode === 'sort-filter') && trimmedFilter.length > 0
    this.tableAtoms.sorting.set(() =>
      sorts ? [{ id: 'price', desc: true }] : [],
    )
    this.tableAtoms.columnFilters.set(() =>
      filters ? [{ id: 'symbol', value: trimmedFilter }] : [],
    )
  }
}

function findSelectedQuote(
  quotes: Array<MarketQuote>,
  selectedSymbol: string | null,
): MarketQuote | null {
  return quotes.find((quote) => quote.symbol === selectedSymbol) ?? null
}
