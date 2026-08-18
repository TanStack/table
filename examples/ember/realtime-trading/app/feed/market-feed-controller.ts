import { tracked } from '@glimmer/tracking'
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

export interface MarketFeedActions {
  toggle: () => void
  setInstrumentCount: (count: number) => void
  setTargetRate: (rate: number) => void
  setPublishInterval: (intervalMs: number) => void
  setSparklineUpdates: (enabled: boolean) => void
  setSparklineSampleInterval: (intervalMs: number) => void
  runBurst: () => void
  reset: () => void
}

export class MarketFeedController {
  @tracked workerReady = false
  @tracked running = true
  @tracked instrumentCount = initialMarketFeedConfig.instrumentCount
  @tracked targetTicksPerSecond =
    initialMarketFeedConfig.targetSamplesPerSecond
  @tracked publishIntervalMs = initialMarketFeedConfig.publishIntervalMs
  @tracked updateSparklines = initialMarketFeedConfig.updateSparklines
  @tracked sparklineSampleIntervalMs =
    initialMarketFeedConfig.sparklineSampleIntervalMs
  @tracked quotes: Array<MarketQuote> = []
  readonly actions: MarketFeedActions
  readonly #observers = new Set<MarketFeedObserver>()
  readonly #runtime = {
    worker: null as Worker | null,
    feedSessionId: 0,
    renderPending: false,
    resetWaitingForCommit: false,
    resetSnapshotReady: false,
    quoteIndexBySymbol: new Map<string, number>(),
  }

  constructor() {
    this.actions = {
      toggle: () => {
        const running = !this.running
        this.running = running
        this.#post({ type: 'set-running', running })
      },
      setInstrumentCount: (count) => {
        this.instrumentCount = count
        this.#resetWorker(count)
      },
      setTargetRate: (rate) => {
        const sampleRate = normalizeFeedSampleRate(rate)
        this.targetTicksPerSecond = sampleRate
        this.#post({ type: 'set-rate', ticksPerSecond: sampleRate })
      },
      setPublishInterval: (publishIntervalMs) => {
        this.publishIntervalMs = publishIntervalMs
        this.#post({
          type: 'set-publish-interval',
          intervalMs: publishIntervalMs,
        })
      },
      setSparklineUpdates: (enabled) => {
        this.updateSparklines = enabled
        this.#post({ type: 'set-sparklines', enabled })
      },
      setSparklineSampleInterval: (intervalMs) => {
        this.sparklineSampleIntervalMs = intervalMs
        this.#post({ type: 'set-sparkline-interval', intervalMs })
      },
      runBurst: () => this.#post({ type: 'burst', tickCount: 25_000 }),
      reset: () => this.#resetWorker(this.instrumentCount),
    }
  }

  start(): () => void {
    const worker = new Worker(
      new URL('./worker/market-feed.worker.ts', import.meta.url),
      { type: 'module' },
    )
    this.#runtime.worker = worker
    worker.addEventListener('message', this.#handleWorkerMessage)
    worker.addEventListener('error', this.#handleWorkerError)
    this.#post({
      type: 'start',
      rowCount: this.instrumentCount,
      running: this.running,
      ticksPerSecond: this.targetTicksPerSecond,
      publishIntervalMs: this.publishIntervalMs,
      updateSparklines: this.updateSparklines,
      sparklineSampleIntervalMs: this.sparklineSampleIntervalMs,
    })
    return () => this.stop()
  }

  stop(): void {
    this.#runtime.worker?.removeEventListener(
      'message',
      this.#handleWorkerMessage,
    )
    this.#runtime.worker?.removeEventListener('error', this.#handleWorkerError)
    this.#runtime.worker?.terminate()
    this.#runtime.worker = null
    this.#observers.clear()
  }

  observe(observer: MarketFeedObserver): () => void {
    this.#observers.add(observer)
    return () => this.#observers.delete(observer)
  }

  getQuoteBySymbol(
    quotes: Array<MarketQuote>,
    symbol: string | null,
  ): MarketQuote | null {
    if (symbol === null) return null

    const index = this.#runtime.quoteIndexBySymbol.get(symbol)
    return index === undefined ? null : (quotes[index] ?? null)
  }

  completeRender(): void {
    if (!this.#runtime.renderPending) return

    this.#runtime.renderPending = false
    for (const observer of this.#observers) {
      observer.renderCommitted?.()
    }
    if (
      this.#runtime.resetWaitingForCommit &&
      this.#runtime.resetSnapshotReady
    ) {
      this.#runtime.resetWaitingForCommit = false
      this.#runtime.resetSnapshotReady = false
      this.#post({ type: 'set-running', running: this.running })
    }
  }

  readonly #handleWorkerMessage = ({
    data,
  }: MessageEvent<MarketFeedEvent>): void => {
    if (data.type === 'snapshot') {
      this.#runtime.feedSessionId = data.sessionId
      if (this.#runtime.resetWaitingForCommit) {
        this.#runtime.resetSnapshotReady = true
      }
      this.#startMutation()
      const quotes = hydrateMarketQuotes(data.quotes)
      this.#runtime.quoteIndexBySymbol = new Map(
        quotes.map((quote, index) => [quote.symbol, index]),
      )
      this.quotes = quotes
      this.workerReady = true
      return
    }

    if (data.sessionId !== this.#runtime.feedSessionId) return

    for (const observer of this.#observers) {
      observer.messageReceived?.()
    }
    this.#startMutation()
    const quotes = applyMarketUpdates(this.quotes, data.updates)
    this.quotes = quotes
    const feedBatch = {
      tickCount: data.tickCount,
      updateCount: data.updates.length,
      supersededUpdateCount: data.coalescedUpdateCount,
    }
    for (const observer of this.#observers) {
      observer.batchApplied?.(feedBatch)
    }
  }

  readonly #handleWorkerError = (error: ErrorEvent): void => {
    this.workerReady = false
    this.running = false
    console.error('Market feed worker failed', error)
  }

  #resetWorker(rowCount: number): void {
    this.workerReady = false
    this.#runtime.resetWaitingForCommit = true
    this.#runtime.resetSnapshotReady = false
    this.#post({ type: 'set-running', running: false })
    this.#post({ type: 'reset', rowCount })
  }

  #startMutation(): void {
    this.#runtime.renderPending = true
    for (const observer of this.#observers) {
      observer.mutationStarted?.()
    }
  }

  #post(command: MarketFeedCommand): void {
    this.#runtime.worker?.postMessage(command)
  }
}
