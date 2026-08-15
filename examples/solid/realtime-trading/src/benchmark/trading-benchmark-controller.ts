import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'
import { TRADING_COLUMN_COUNT } from '../table/trading-table'
import {
  BenchmarkMonitor,
  initialMetrics,
  longAnimationFramesSupported,
} from './benchmark-monitor'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { RendererMode } from '../table/trading-table'

export function createTradingBenchmarkController(feed: MarketFeedController) {
  const [rendererMode, setRendererMode] = createSignal<RendererMode>('stable')
  const [selectedSymbol, setSelectedSymbol] = createSignal<string | null>(null)
  const [metrics, setMetrics] = createSignal(initialMetrics)
  const monitor = new BenchmarkMonitor()
  const runtime = {
    animationFrameId: 0,
    longAnimationFrameObserver: null as PerformanceObserver | null,
  }

  const stopObservingFeed = feed.observe({
    messageReceived: () => monitor.recordWorkerMessage(),
    mutationStarted: () => monitor.markRenderPending(),
    batchApplied: ({ tickCount, updateCount, supersededUpdateCount }) =>
      monitor.recordBatch(tickCount, updateCount, supersededUpdateCount),
    renderCommitted: () => monitor.recordCompletedRender(),
  })

  createEffect(() => {
    const tableBody = document.querySelector(
      '.market-panel [data-trading-table] tbody',
    )
    if (!tableBody) return

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

  const benchmarkFrame = (now: number): void => {
    monitor.recordAnimationFrame()
    if (monitor.shouldPublish(now)) {
      setMetrics(monitor.publish(now))
    }
    runtime.animationFrameId = requestAnimationFrame(benchmarkFrame)
  }

  onMount(() => {
    if (longAnimationFramesSupported) {
      runtime.longAnimationFrameObserver = new PerformanceObserver(
        (entries) => {
          for (const entry of entries.getEntries()) {
            monitor.recordLongAnimationFrame(entry.duration)
          }
        },
      )
      runtime.longAnimationFrameObserver.observe({
        type: 'long-animation-frame',
        buffered: true,
      })
    }
    runtime.animationFrameId = requestAnimationFrame(benchmarkFrame)
  })

  onCleanup(() => {
    stopObservingFeed()
    cancelAnimationFrame(runtime.animationFrameId)
    runtime.longAnimationFrameObserver?.disconnect()
  })

  const resetViewState = (): void => {
    setSelectedSymbol(null)
  }

  const actions = {
    resetViewState,
    setRendererMode,
    selectSymbol: setSelectedSymbol,
    resetMarket(): void {
      monitor.reset()
      resetViewState()
      setMetrics({ ...initialMetrics })
      feed.actions.reset()
    },
  }

  const displayQuotes = feed.state.quotes
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

  return {
    feed,
    state: {
      rendererMode,
      selectedSymbol,
      metrics,
      displayQuotes,
      selectedQuote,
      mountedCells,
      liveComponents,
    },
    actions,
    monitor,
  }
}

export type TradingBenchmarkController = ReturnType<
  typeof createTradingBenchmarkController
>
