import { batch, createAtom, createStore } from '@tanstack/react-store'
import {
  BenchmarkMonitor,
  initialMetrics,
  longAnimationFramesSupported,
  markBenchmarkAction,
} from '../benchmark/benchmark-monitor'
import {
  deriveBenchmarkQuotes,
  feedLoadRates,
  rowWorkloadLabel,
} from '../benchmark-profiles'
import { applyMarketUpdates, hydrateMarketQuotes } from '../market-data'
import { TRADING_COLUMN_COUNT, rowModelDiagnostics } from '../trading-table'
import type {
  FeedMetrics,
  ScrollStressMode,
} from '../benchmark/benchmark-monitor'
import type { FeedLoadProfile, RowWorkloadMode } from '../benchmark-profiles'
import type {
  MarketFeedCommand,
  MarketFeedEvent,
} from '../market-feed-protocol'
import type { MarketQuote } from '../market-data'
import type {
  CoreRowModelMode,
  CoreTableState,
  RendererMode,
  TableAdapter,
} from '../trading-table'

export interface TradingBenchmarkState {
  workerReady: boolean
  running: boolean
  tableAdapter: TableAdapter
  instrumentCount: number
  feedLoadProfile: FeedLoadProfile
  targetEventsPerSecond: number
  rowWorkloadMode: RowWorkloadMode
  rowWorkloadEpoch: number
  coreRowModelMode: CoreRowModelMode
  coreFilterValue: string
  scrollStressMode: ScrollStressMode
  rendererMode: RendererMode
  updateSparklines: boolean
  updateQuoteAges: boolean
  quoteClock: number
  quotes: Array<MarketQuote>
  selectedSymbol: string | null
  metrics: FeedMetrics
  displayQuotes: Array<MarketQuote>
  selectedQuote: MarketQuote | null
  mountedCells: number
  liveComponents: number
  adapterLabel: string
  workloadLabel: string
  longAnimationFramesSupported: boolean
}

export interface TradingBenchmarkActions {
  toggleFeed: () => void
  setInstrumentCount: (count: number) => void
  setFeedLoadProfile: (profile: FeedLoadProfile) => void
  setTargetEventsPerSecond: (rate: number) => void
  setRowWorkloadMode: (mode: RowWorkloadMode) => void
  setTableAdapter: (adapter: TableAdapter) => void
  setCoreRowModelMode: (mode: CoreRowModelMode) => void
  setCoreFilterValue: (value: string) => void
  setScrollStressMode: (mode: ScrollStressMode) => void
  setRendererMode: (mode: RendererMode) => void
  setUpdateQuoteAges: (enabled: boolean) => void
  setUpdateSparklines: (enabled: boolean) => void
  selectSymbol: (symbol: string | null) => void
  runBurst: () => void
  resetMarket: () => void
}

const initialState: TradingBenchmarkState = {
  workerReady: false,
  running: true,
  tableAdapter: 'local',
  instrumentCount: 250,
  feedLoadProfile: 'high',
  targetEventsPerSecond: 10_000,
  rowWorkloadMode: 'stable',
  rowWorkloadEpoch: 0,
  coreRowModelMode: 'none',
  coreFilterValue: 'ALP',
  scrollStressMode: 'off',
  rendererMode: 'stable',
  updateSparklines: true,
  updateQuoteAges: true,
  quoteClock: Date.now(),
  quotes: [],
  selectedSymbol: null,
  metrics: initialMetrics,
  displayQuotes: [],
  selectedQuote: null,
  mountedCells: 0,
  liveComponents: 0,
  adapterLabel: 'LOCAL V9',
  workloadLabel: rowWorkloadLabel('stable'),
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
    quoteAge: createAtom({
      enabled: true,
      clock: initialState.quoteClock,
    }),
  }
  readonly monitor = new BenchmarkMonitor()
  readonly actions: TradingBenchmarkActions

  readonly #runtime = {
    worker: null as Worker | null,
    animationFrameId: 0,
    feedGeneration: 0,
    lastAgeClockAt: performance.now(),
    lastRowWorkloadAt: performance.now(),
    longAnimationFrameObserver: null as PerformanceObserver | null,
    resetWaitingForCommit: false,
    resetSnapshotReady: false,
  }

  constructor() {
    this.actions = {
      toggleFeed: () => {
        const nextRunning = !this.store.get().running
        this.#patch({ running: nextRunning })
        this.#postToWorker({ type: 'configure', running: nextRunning })
      },
      setInstrumentCount: (count) => {
        batch(() => {
          this.#patch({ instrumentCount: count })
          this.#setWorkloadState({ rowWorkloadEpoch: 0 })
          this.#resetWorkerMarket(count)
        })
      },
      setFeedLoadProfile: (profile) => {
        if (profile === 'custom') {
          this.#patch({ feedLoadProfile: profile })
          return
        }
        const rate = feedLoadRates[profile]
        this.#patch({
          feedLoadProfile: profile,
          targetEventsPerSecond: rate,
        })
        this.#postToWorker({
          type: 'configure',
          targetEventsPerSecond: rate,
        })
      },
      setTargetEventsPerSecond: (rate) => {
        this.#patch({
          feedLoadProfile: 'custom',
          targetEventsPerSecond: rate,
        })
        this.#postToWorker({
          type: 'configure',
          targetEventsPerSecond: rate,
        })
      },
      setRowWorkloadMode: (mode) => {
        this.#runtime.lastRowWorkloadAt = performance.now()
        batch(() => {
          this.#setWorkloadState({
            rowWorkloadMode: mode,
            rowWorkloadEpoch: 0,
            selectedSymbol: null,
          })
          this.renderAtoms.selectedSymbol.set(null)
        })
      },
      setTableAdapter: (adapter) => {
        markBenchmarkAction('adapter-change', { adapter })
        this.#patch({
          tableAdapter: adapter,
          adapterLabel: adapterLabel(adapter),
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
          this.#syncCoreTableAtoms(
            this.store.get().coreRowModelMode,
            value,
          )
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
      setUpdateQuoteAges: (enabled) => {
        batch(() => {
          this.#patch({ updateQuoteAges: enabled })
          this.renderAtoms.quoteAge.set((current) => ({
            ...current,
            enabled,
          }))
        })
      },
      setUpdateSparklines: (enabled) => {
        this.#patch({ updateSparklines: enabled })
        this.#postToWorker({
          type: 'configure',
          updateSparklines: enabled,
        })
      },
      selectSymbol: (symbol) => {
        batch(() => {
          this.#setSelectionState({ selectedSymbol: symbol })
          this.renderAtoms.selectedSymbol.set(symbol)
        })
      },
      runBurst: () => {
        this.#postToWorker({ type: 'burst', eventCount: 25_000 })
      },
      resetMarket: () => {
        batch(() => {
          this.monitor.reset()
          this.#runtime.lastRowWorkloadAt = performance.now()
          this.store.setState((state) => ({
            ...state,
            selectedSymbol: null,
            selectedQuote: null,
            rowWorkloadEpoch: 0,
            quoteClock: Date.now(),
            metrics: { ...initialMetrics },
            mountedCells: 0,
            liveComponents: 0,
          }))
          this.renderAtoms.selectedSymbol.set(null)
          this.#resetWorkerMarket(this.store.get().instrumentCount)
        })
      },
    }
  }

  start(): () => void {
    const worker = new Worker(
      new URL('../market-feed.worker.ts', import.meta.url),
      { type: 'module' },
    )
    const longAnimationFrameObserver = longAnimationFramesSupported
      ? new PerformanceObserver((entries) => {
          for (const entry of entries.getEntries()) {
            this.monitor.recordLongAnimationFrame(entry.duration)
          }
        })
      : null

    this.#runtime.worker = worker
    this.#runtime.longAnimationFrameObserver = longAnimationFrameObserver
    worker.addEventListener('message', this.#handleWorkerMessage)
    worker.addEventListener('error', this.#handleWorkerError)
    longAnimationFrameObserver?.observe({
      type: 'long-animation-frame',
      buffered: true,
    })
    worker.postMessage({
      type: 'initialize',
      rowCount: initialState.instrumentCount,
      seed: 292,
      running: initialState.running,
      targetEventsPerSecond: initialState.targetEventsPerSecond,
      updateSparklines: initialState.updateSparklines,
    } satisfies MarketFeedCommand)
    this.#runtime.animationFrameId = requestAnimationFrame(this.#feedFrame)

    return () => this.stop()
  }

  stop(): void {
    cancelAnimationFrame(this.#runtime.animationFrameId)
    this.#runtime.longAnimationFrameObserver?.disconnect()
    this.#runtime.worker?.removeEventListener(
      'message',
      this.#handleWorkerMessage,
    )
    this.#runtime.worker?.removeEventListener('error', this.#handleWorkerError)
    this.#runtime.worker?.terminate()
    this.#runtime.worker = null
    this.#runtime.longAnimationFrameObserver = null
  }

  recordCompletedRender(): void {
    this.monitor.recordCompletedRender(
      this.store.get().tableAdapter,
      this.#postToWorker,
    )
    if (
      this.#runtime.resetWaitingForCommit &&
      this.#runtime.resetSnapshotReady
    ) {
      this.#runtime.resetWaitingForCommit = false
      this.#runtime.resetSnapshotReady = false
      this.#postToWorker({
        type: 'configure',
        running: this.store.get().running,
      })
    }
  }

  readonly #postToWorker = (command: MarketFeedCommand): void => {
    this.#runtime.worker?.postMessage(command)
  }

  readonly #handleWorkerMessage = ({
    data,
  }: MessageEvent<MarketFeedEvent>): void => {
    if (data.type === 'ready') {
      this.#runtime.feedGeneration = data.generation
      if (this.#runtime.resetWaitingForCommit) {
        this.#runtime.resetSnapshotReady = true
      }
      this.monitor.setPendingAck(null)
      this.monitor.markRenderPending()
      batch(() => {
        this.#setQuotes(hydrateMarketQuotes(data.quotes))
        this.#patch({ workerReady: true })
      })
      return
    }

    if (data.generation !== this.#runtime.feedGeneration) {
      this.#postToWorker({
        type: 'ack',
        generation: data.generation,
        sequence: data.sequence,
      })
      return
    }

    this.monitor.markRenderPending()
    this.#setQuotes(applyMarketUpdates(this.store.get().quotes, data.updates))
    this.monitor.recordBatch(data.eventCount, data.updates.length)
    this.monitor.setPendingAck({
      generation: data.generation,
      sequence: data.sequence,
    })
  }

  readonly #handleWorkerError = (error: ErrorEvent): void => {
    this.#patch({ workerReady: false, running: false })
    console.error('Market feed worker failed', error)
  }

  readonly #feedFrame = (now: number): void => {
    this.monitor.recordAnimationFrame()
    const state = this.store.get()
    batch(() => {
      if (
        state.updateQuoteAges &&
        now - this.#runtime.lastAgeClockAt >= 100
      ) {
        this.#runtime.lastAgeClockAt = now
        const clock = Date.now()
        this.#patch({ quoteClock: clock })
        this.renderAtoms.quoteAge.set((current) => ({
          ...current,
          clock,
        }))
      }

      if (
        state.running &&
        (state.rowWorkloadMode === 'rotating-filter' ||
          state.rowWorkloadMode === 'identity-churn') &&
        now - this.#runtime.lastRowWorkloadAt >= 1_000
      ) {
        this.monitor.markRenderPending()
        this.#runtime.lastRowWorkloadAt = now
        this.#setWorkloadState({
          rowWorkloadEpoch: state.rowWorkloadEpoch + 1,
        })
      }

      if (this.monitor.shouldPublish(now)) {
        this.#publishMetrics(this.monitor.publish(now))
      }
    })
    this.#runtime.animationFrameId = requestAnimationFrame(this.#feedFrame)
  }

  #patch(patch: Partial<TradingBenchmarkState>): void {
    this.store.setState((state) => ({ ...state, ...patch }))
  }

  #setQuotes(quotes: Array<MarketQuote>): void {
    this.store.setState((state) => {
      const displayQuotes = deriveBenchmarkQuotes(
        quotes,
        state.rowWorkloadMode,
        state.rowWorkloadEpoch,
      )
      return {
        ...state,
        quotes,
        displayQuotes,
        selectedQuote: findSelectedQuote(
          displayQuotes,
          state.selectedSymbol,
        ),
      }
    })
  }

  #setWorkloadState(
    patch: Partial<
      Pick<
        TradingBenchmarkState,
        'rowWorkloadMode' | 'rowWorkloadEpoch' | 'selectedSymbol'
      >
    >,
  ): void {
    this.store.setState((state) => {
      const nextState = { ...state, ...patch }
      const displayQuotes = deriveBenchmarkQuotes(
        state.quotes,
        nextState.rowWorkloadMode,
        nextState.rowWorkloadEpoch,
      )
      return {
        ...nextState,
        displayQuotes,
        selectedQuote: findSelectedQuote(
          displayQuotes,
          nextState.selectedSymbol,
        ),
        workloadLabel: rowWorkloadLabel(nextState.rowWorkloadMode),
      }
    })
  }

  #setSelectionState(
    patch: Partial<
      Pick<
        TradingBenchmarkState,
        'coreRowModelMode' | 'selectedSymbol'
      >
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
      liveComponents:
        metrics.componentsCreated - metrics.componentsDestroyed,
    })
  }

  #syncCoreTableAtoms(
    mode: CoreRowModelMode,
    filterValue: string,
  ): void {
    const sorts = mode === 'sort' || mode === 'sort-filter'
    const trimmedFilter = filterValue.trim()
    const filters =
      (mode === 'filter' || mode === 'sort-filter') &&
      trimmedFilter.length > 0
    this.tableAtoms.sorting.set(() =>
      sorts ? [{ id: 'price', desc: true }] : [],
    )
    this.tableAtoms.columnFilters.set(() =>
      filters ? [{ id: 'symbol', value: trimmedFilter }] : [],
    )
  }

  #resetWorkerMarket(rowCount: number): void {
    this.#patch({ workerReady: false })
    this.monitor.setPendingAck(null)
    this.#runtime.resetWaitingForCommit = true
    this.#runtime.resetSnapshotReady = false
    this.#postToWorker({ type: 'configure', running: false })
    this.#postToWorker({ type: 'reset', rowCount, seed: 42 + rowCount })
  }
}

function findSelectedQuote(
  quotes: Array<MarketQuote>,
  selectedSymbol: string | null,
): MarketQuote | null {
  return (
    quotes.find((quote) => quote.symbol === selectedSymbol) ?? null
  )
}

function adapterLabel(adapter: TableAdapter): string {
  return adapter === 'local' ? 'LOCAL V9' : 'V8.21.3'
}
