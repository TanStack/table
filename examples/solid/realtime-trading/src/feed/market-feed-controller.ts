import { createSignal, onCleanup, onMount } from 'solid-js'
import { normalizeFeedSampleRate } from './feed-sample-rates'
import { initialMarketFeedConfig } from './market-feed-config'
import { applyMarketUpdates, hydrateMarketQuotes } from './market-data'
import type {
  MarketFeedCommand,
  MarketFeedEvent,
} from './worker/market-feed-protocol'
import type { MarketQuote } from './market-data'

export interface MarketFeedBatch {
  tickCount: number
  updateCount: number
  supersededUpdateCount: number
}

export interface MarketFeedObserver {
  messageReceived?: () => void
  mutationStarted?: () => void
  batchApplied?: (batch: MarketFeedBatch) => void
  renderCommitted?: () => void
}

export function createMarketFeedController() {
  const [workerReady, setWorkerReady] = createSignal(false)
  const [running, setRunning] = createSignal(true)
  const [instrumentCount, setInstrumentCount] = createSignal(
    initialMarketFeedConfig.instrumentCount,
  )
  const [targetTicksPerSecond, setTargetTicksPerSecond] = createSignal(
    initialMarketFeedConfig.targetSamplesPerSecond,
  )
  const [publishIntervalMs, setPublishIntervalMsState] = createSignal(
    initialMarketFeedConfig.publishIntervalMs,
  )
  const [updateSparklines, setUpdateSparklines] = createSignal(
    initialMarketFeedConfig.updateSparklines,
  )
  const [sparklineSampleIntervalMs, setSparklineSampleIntervalMs] =
    createSignal(initialMarketFeedConfig.sparklineSampleIntervalMs)
  const [quotes, setQuotes] = createSignal<Array<MarketQuote>>([])
  const observers = new Set<MarketFeedObserver>()
  const runtime = {
    worker: null as Worker | null,
    feedSessionId: 0,
    renderPending: false,
    quoteIndexBySymbol: new Map<string, number>(),
  }

  const post = (command: MarketFeedCommand): void =>
    runtime.worker?.postMessage(command)

  const startMutation = (): void => {
    runtime.renderPending = true
    for (const observer of observers) {
      observer.mutationStarted?.()
    }
  }

  const completeRender = (): void => {
    if (!runtime.renderPending) return

    runtime.renderPending = false
    for (const observer of observers) {
      observer.renderCommitted?.()
    }
  }

  const handleWorkerMessage = ({
    data,
  }: MessageEvent<MarketFeedEvent>): void => {
    if (data.type === 'snapshot') {
      runtime.feedSessionId = data.sessionId
      startMutation()
      const nextQuotes = hydrateMarketQuotes(data.quotes)
      runtime.quoteIndexBySymbol = new Map(
        nextQuotes.map((quote, index) => [quote.symbol, index]),
      )
      setQuotes(nextQuotes)
      setWorkerReady(true)
      return
    }

    if (data.sessionId !== runtime.feedSessionId) return

    for (const observer of observers) {
      observer.messageReceived?.()
    }
    startMutation()
    setQuotes((currentQuotes) =>
      applyMarketUpdates(currentQuotes, data.updates),
    )
    const batch = {
      tickCount: data.tickCount,
      updateCount: data.updates.length,
      supersededUpdateCount: data.coalescedUpdateCount,
    }
    for (const observer of observers) {
      observer.batchApplied?.(batch)
    }
  }

  const handleWorkerError = (error: ErrorEvent): void => {
    setWorkerReady(false)
    setRunning(false)
    console.error('Market feed worker failed', error)
  }

  const reset = (): void => {
    setWorkerReady(false)
    post({ type: 'reset', rowCount: instrumentCount() })
  }

  onMount(() => {
    runtime.worker = new Worker(
      new URL('./worker/market-feed.worker.ts', import.meta.url),
      { type: 'module' },
    )
    runtime.worker.addEventListener('message', handleWorkerMessage)
    runtime.worker.addEventListener('error', handleWorkerError)
    post({
      type: 'start',
      rowCount: instrumentCount(),
      running: running(),
      ticksPerSecond: targetTicksPerSecond(),
      publishIntervalMs: publishIntervalMs(),
      updateSparklines: updateSparklines(),
      sparklineSampleIntervalMs: sparklineSampleIntervalMs(),
    })
  })

  onCleanup(() => {
    runtime.worker?.removeEventListener('message', handleWorkerMessage)
    runtime.worker?.removeEventListener('error', handleWorkerError)
    runtime.worker?.terminate()
    runtime.worker = null
    observers.clear()
  })

  const actions = {
    toggle(): void {
      const nextRunning = !running()
      setRunning(nextRunning)
      post({ type: 'set-running', running: nextRunning })
    },
    setInstrumentCount(count: number): void {
      setInstrumentCount(count)
      reset()
    },
    setTargetRate(rate: number): void {
      const sampleRate = normalizeFeedSampleRate(rate)
      setTargetTicksPerSecond(sampleRate)
      post({ type: 'set-rate', ticksPerSecond: sampleRate })
    },
    setPublishInterval(intervalMs: number): void {
      setPublishIntervalMsState(intervalMs)
      post({ type: 'set-publish-interval', intervalMs })
    },
    setSparklineUpdates(enabled: boolean): void {
      setUpdateSparklines(enabled)
      post({ type: 'set-sparklines', enabled })
    },
    setSparklineSampleInterval(intervalMs: number): void {
      setSparklineSampleIntervalMs(intervalMs)
      post({ type: 'set-sparkline-interval', intervalMs })
    },
    runBurst(): void {
      post({ type: 'burst', tickCount: 25_000 })
    },
    reset,
  }

  return {
    state: {
      workerReady,
      running,
      instrumentCount,
      targetTicksPerSecond,
      publishIntervalMs,
      updateSparklines,
      sparklineSampleIntervalMs,
      quotes,
    },
    actions,
    observe(observer: MarketFeedObserver): () => void {
      observers.add(observer)
      return () => observers.delete(observer)
    },
    getQuoteBySymbol(symbol: string | null): MarketQuote | null {
      if (symbol === null) return null

      const index = runtime.quoteIndexBySymbol.get(symbol)
      return index === undefined ? null : (quotes()[index] ?? null)
    },
    completeRender,
  }
}

export type MarketFeedController = ReturnType<typeof createMarketFeedController>
