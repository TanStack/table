import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'
import {
  BenchmarkMonitor,
  initialMetrics,
  longAnimationFramesSupported,
} from '../benchmark/benchmark-monitor'
import {
  deriveBenchmarkQuotes,
  feedLoadRates,
  rowWorkloadLabel,
} from '../benchmark-profiles'
import { applyMarketUpdates, hydrateMarketQuotes } from '../market-data'
import { TRADING_COLUMN_COUNT } from '../trading-table'
import type { FeedLoadProfile, RowWorkloadMode } from '../benchmark-profiles'
import type { MarketFeedCommand, MarketFeedEvent } from '../market-feed-protocol'
import type { MarketQuote } from '../market-data'
import type { RendererMode, TableAdapter } from '../trading-table'

export function createTradingBenchmarkController() {
  const [workerReady, setWorkerReady] = createSignal(false)
  const [running, setRunning] = createSignal(true)
  const [tableAdapter, setTableAdapter] = createSignal<TableAdapter>('local')
  const [instrumentCount, setInstrumentCount] = createSignal(250)
  const [feedLoadProfile, setFeedLoadProfile] =
    createSignal<FeedLoadProfile>('high')
  const [targetEventsPerSecond, setTargetEventsPerSecond] = createSignal(10_000)
  const [rowWorkloadMode, setRowWorkloadMode] =
    createSignal<RowWorkloadMode>('stable')
  const [rowWorkloadEpoch, setRowWorkloadEpoch] = createSignal(0)
  const [rendererMode, setRendererMode] = createSignal<RendererMode>('stable')
  const [updateSparklines, setUpdateSparklines] = createSignal(true)
  const [updateQuoteAges, setUpdateQuoteAges] = createSignal(true)
  const [quoteClock, setQuoteClock] = createSignal(Date.now())
  const [quotes, setQuotes] = createSignal<Array<MarketQuote>>([])
  const [selectedSymbol, setSelectedSymbol] = createSignal<string | null>(null)
  const [metrics, setMetrics] = createSignal(initialMetrics)
  const monitor = new BenchmarkMonitor()
  const runtime = {
    worker: null as Worker | null,
    animationFrameId: 0,
    longAnimationFrameObserver: null as PerformanceObserver | null,
    feedGeneration: 0,
    lastAgeClockAt: performance.now(),
    lastRowWorkloadAt: performance.now(),
  }

  const postToWorker = (command: MarketFeedCommand) =>
    runtime.worker?.postMessage(command)

  createEffect(() => {
    quotes()
    quoteClock()
    monitor.recordCompletedRender(postToWorker)
  })

  createEffect(() => {
    tableAdapter()
    const tableBody = document.querySelector(
      '.market-panel [data-table-adapter] tbody',
    )
    if (!tableBody) {
      return
    }

    monitor.resetDomMutations()
    const observer = new MutationObserver((records) => {
      monitor.recordDomMutations(records.length)
    })
    observer.observe(tableBody, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
    onCleanup(() => observer.disconnect())
  })

  const handleWorkerMessage = ({
    data,
  }: MessageEvent<MarketFeedEvent>): void => {
    if (data.type === 'ready') {
      runtime.feedGeneration = data.generation
      monitor.setPendingAck(null)
      monitor.markRenderPending()
      setQuotes(hydrateMarketQuotes(data.quotes))
      setWorkerReady(true)
      return
    }

    if (data.generation !== runtime.feedGeneration) {
      postToWorker({
        type: 'ack',
        generation: data.generation,
        sequence: data.sequence,
      })
      return
    }

    monitor.markRenderPending()
    setQuotes((currentQuotes) =>
      applyMarketUpdates(currentQuotes, data.updates),
    )
    monitor.recordBatch(data.eventCount, data.updates.length)
    monitor.setPendingAck({
      generation: data.generation,
      sequence: data.sequence,
    })
  }

  const handleWorkerError = (error: ErrorEvent): void => {
    setWorkerReady(false)
    setRunning(false)
    console.error('Market feed worker failed', error)
  }

  const feedFrame = (now: number): void => {
    monitor.recordAnimationFrame()

    if (updateQuoteAges() && now - runtime.lastAgeClockAt >= 100) {
      monitor.markRenderPending()
      runtime.lastAgeClockAt = now
      setQuoteClock(Date.now())
    }

    if (
      running() &&
      (rowWorkloadMode() === 'rotating-filter' ||
        rowWorkloadMode() === 'identity-churn') &&
      now - runtime.lastRowWorkloadAt >= 1_000
    ) {
      monitor.markRenderPending()
      runtime.lastRowWorkloadAt = now
      setRowWorkloadEpoch((epoch) => epoch + 1)
    }

    if (monitor.shouldPublish(now)) {
      setMetrics(monitor.publish(now))
    }

    runtime.animationFrameId = requestAnimationFrame(feedFrame)
  }

  onMount(() => {
    runtime.worker = new Worker(
      new URL('../market-feed.worker.ts', import.meta.url),
      { type: 'module' },
    )
    runtime.worker.addEventListener('message', handleWorkerMessage)
    runtime.worker.addEventListener('error', handleWorkerError)

    if (longAnimationFramesSupported) {
      runtime.longAnimationFrameObserver = new PerformanceObserver((entries) => {
        for (const entry of entries.getEntries()) {
          monitor.recordLongAnimationFrame(entry.duration)
        }
      })
      runtime.longAnimationFrameObserver.observe({
        type: 'long-animation-frame',
        buffered: true,
      })
    }

    postToWorker({
      type: 'initialize',
      rowCount: instrumentCount(),
      seed: 42 + instrumentCount(),
      running: running(),
      targetEventsPerSecond: targetEventsPerSecond(),
      updateSparklines: updateSparklines(),
    })
    runtime.animationFrameId = requestAnimationFrame(feedFrame)
  })

  onCleanup(() => {
    cancelAnimationFrame(runtime.animationFrameId)
    runtime.longAnimationFrameObserver?.disconnect()
    runtime.worker?.terminate()
    runtime.worker = null
  })

  const resetWorkerMarket = (rowCount: number): void => {
    setWorkerReady(false)
    monitor.setPendingAck(null)
    postToWorker({
      type: 'reset',
      rowCount,
      seed: 42 + rowCount,
    })
  }

  const actions = {
    toggleFeed(): void {
      const nextRunning = !running()
      setRunning(nextRunning)
      postToWorker({ type: 'configure', running: nextRunning })
    },
    setInstrumentCount(count: number): void {
      setInstrumentCount(count)
      setRowWorkloadEpoch(0)
      resetWorkerMarket(count)
    },
    setFeedLoadProfile(profile: FeedLoadProfile): void {
      setFeedLoadProfile(profile)
      if (profile === 'custom') {
        return
      }
      const rate = feedLoadRates[profile]
      setTargetEventsPerSecond(rate)
      postToWorker({ type: 'configure', targetEventsPerSecond: rate })
    },
    setTargetEventsPerSecond(rate: number): void {
      setFeedLoadProfile('custom')
      setTargetEventsPerSecond(rate)
      postToWorker({ type: 'configure', targetEventsPerSecond: rate })
    },
    setRowWorkloadMode(mode: RowWorkloadMode): void {
      setRowWorkloadMode(mode)
      setRowWorkloadEpoch(0)
      runtime.lastRowWorkloadAt = performance.now()
      setSelectedSymbol(null)
    },
    setTableAdapter,
    setRendererMode,
    setUpdateQuoteAges,
    setUpdateSparklines(enabled: boolean): void {
      setUpdateSparklines(enabled)
      postToWorker({ type: 'configure', updateSparklines: enabled })
    },
    selectSymbol: setSelectedSymbol,
    runBurst(): void {
      postToWorker({ type: 'burst', eventCount: 25_000 })
    },
    resetMarket(): void {
      setSelectedSymbol(null)
      monitor.reset()
      runtime.lastRowWorkloadAt = performance.now()
      setRowWorkloadEpoch(0)
      setQuoteClock(Date.now())
      setMetrics({ ...initialMetrics })
      resetWorkerMarket(instrumentCount())
    },
  }

  const displayQuotes = createMemo(() =>
    deriveBenchmarkQuotes(quotes(), rowWorkloadMode(), rowWorkloadEpoch()),
  )
  const selectedQuote = createMemo(
    () =>
      displayQuotes().find((quote) => quote.symbol === selectedSymbol()) ??
      null,
  )
  const mountedCells = createMemo(
    () => displayQuotes().length * TRADING_COLUMN_COUNT,
  )
  const liveComponents = createMemo(
    () => metrics().componentsCreated - metrics().componentsDestroyed,
  )
  const adapterLabel = createMemo(() =>
    tableAdapter() === 'local' ? 'LOCAL V9' : 'V8.21.3',
  )
  const workloadLabel = createMemo(() =>
    rowWorkloadLabel(rowWorkloadMode()),
  )

  return {
    state: {
      workerReady,
      running,
      tableAdapter,
      instrumentCount,
      feedLoadProfile,
      targetEventsPerSecond,
      rowWorkloadMode,
      rendererMode,
      updateSparklines,
      updateQuoteAges,
      quoteClock,
      quotes,
      selectedSymbol,
      metrics,
      displayQuotes,
      selectedQuote,
      mountedCells,
      liveComponents,
      adapterLabel,
      workloadLabel,
    },
    actions,
  }
}

export type TradingBenchmarkController = ReturnType<
  typeof createTradingBenchmarkController
>
