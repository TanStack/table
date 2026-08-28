import { createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { TRADING_COLUMN_COUNT } from '../table/table-config/trading-columns'
import {
  FORCED_VIRTUALIZATION_ROW_COUNT,
  resolveVirtualScrollMode,
} from '../table/trading-row-virtualizer'
import {
  BenchmarkMonitor,
  initialMetrics,
  longAnimationFramesSupported,
} from './benchmark-monitor'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { RendererMode } from '../table/table-config/trading-columns'
import type { VirtualScrollPreference } from '../table/trading-row-virtualizer'

export function createTradingBenchmarkController(feed: MarketFeedController) {
  const [rendererMode, setRendererMode] = createSignal<RendererMode>('stable')
  const [requestedVirtualScrollMode, setRequestedVirtualScrollMode] =
    createSignal<VirtualScrollPreference>('auto')
  const [renderedRowCount, setRenderedRowCount] = createSignal(0)
  const [selectedSymbol, setSelectedSymbol] = createSignal<string | null>(null)
  const [metrics, setMetrics] = createSignal(initialMetrics)
  const monitor = new BenchmarkMonitor()
  const runtime = {
    animationFrameId: 0,
    longAnimationFrameObserver: null as PerformanceObserver | null,
    mutationObserver: null as MutationObserver | null,
  }

  const stopObservingFeed = feed.observe({
    messageReceived: () => monitor.recordWorkerMessage(),
    mutationStarted: () => monitor.markCommitPending(),
    batchApplied: ({ tickCount, updateCount, supersededUpdateCount }) =>
      monitor.recordBatch(tickCount, updateCount, supersededUpdateCount),
    renderCommitted: () => monitor.recordDomCommit(),
  })

  const observeTableMutations = (): void => {
    const tableBody = document.querySelector(
      '.market-panel [data-trading-table] tbody',
    )
    if (!tableBody) return

    monitor.resetDomMutations()
    runtime.mutationObserver = new MutationObserver((records) => {
      monitor.recordDomMutations(records.length)
    })
    runtime.mutationObserver.observe(tableBody, {
      attributes: true,
      attributeFilter: ['class', 'style'],
      characterData: true,
      childList: true,
      subtree: true,
    })
  }

  const benchmarkFrame = (now: number): void => {
    monitor.recordAnimationFrame(now)
    if (monitor.shouldPublish(now)) {
      setMetrics(monitor.publish(now))
    }
    runtime.animationFrameId = requestAnimationFrame(benchmarkFrame)
  }

  onMount(() => {
    observeTableMutations()
    if (longAnimationFramesSupported) {
      runtime.longAnimationFrameObserver = new PerformanceObserver(
        (entries) => {
          for (const entry of entries.getEntries()) {
            monitor.recordLongAnimationFrame(entry.duration, entry.startTime)
          }
        },
      )
      runtime.longAnimationFrameObserver.observe({
        type: 'long-animation-frame',
      })
    }
    runtime.animationFrameId = requestAnimationFrame(benchmarkFrame)
  })

  onCleanup(() => {
    stopObservingFeed()
    cancelAnimationFrame(runtime.animationFrameId)
    runtime.longAnimationFrameObserver?.disconnect()
    runtime.mutationObserver?.disconnect()
  })

  const resetViewState = (): void => {
    setSelectedSymbol(null)
    setRequestedVirtualScrollMode('auto')
  }

  const actions = {
    resetViewState,
    setRendererMode,
    setVirtualScrollEnabled(enabled: boolean): void {
      if (feed.state.instrumentCount() >= FORCED_VIRTUALIZATION_ROW_COUNT)
        return
      setRequestedVirtualScrollMode(enabled ? 'tanstack' : 'none')
    },
    setRenderedRowCount,
    selectSymbol: setSelectedSymbol,
    resetMarket(): void {
      monitor.reset()
      resetViewState()
      setMetrics({ ...initialMetrics })
      feed.actions.reset()
    },
  }

  const virtualScrollForced = createMemo(
    () => feed.state.instrumentCount() >= FORCED_VIRTUALIZATION_ROW_COUNT,
  )
  const virtualScrollMode = createMemo(() =>
    resolveVirtualScrollMode(
      requestedVirtualScrollMode(),
      feed.state.instrumentCount(),
    ),
  )
  const mountedCells = createMemo(
    () => renderedRowCount() * TRADING_COLUMN_COUNT,
  )
  const liveComponents = createMemo(
    () => metrics().componentsCreated - metrics().componentsDestroyed,
  )

  return {
    feed,
    state: {
      rendererMode,
      requestedVirtualScrollMode,
      virtualScrollForced,
      virtualScrollMode,
      renderedRowCount,
      selectedSymbol,
      metrics,
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
