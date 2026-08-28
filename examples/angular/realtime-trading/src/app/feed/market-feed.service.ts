import {
  DestroyRef,
  Injectable,
  afterEveryRender,
  inject,
  signal,
} from '@angular/core'
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

@Injectable({ providedIn: 'root' })
export class MarketFeedService {
  readonly #destroyRef = inject(DestroyRef)
  readonly #worker = new Worker(
    new URL('./worker/market-feed.worker', import.meta.url),
    { type: 'module' },
  )
  readonly #observers = new Set<MarketFeedObserver>()

  readonly workerReady = signal(false)
  readonly running = signal(true)
  readonly instrumentCount = signal(initialMarketFeedConfig.instrumentCount)
  readonly targetTicksPerSecond = signal(
    initialMarketFeedConfig.targetSamplesPerSecond,
  )
  readonly publishIntervalMs = signal(initialMarketFeedConfig.publishIntervalMs)
  readonly updateSparklines = signal(initialMarketFeedConfig.updateSparklines)
  readonly sparklineSampleIntervalMs = signal(
    initialMarketFeedConfig.sparklineSampleIntervalMs,
  )
  readonly quotes = signal<Array<MarketQuote>>([])

  #feedSessionId = 0
  #renderPending = false

  constructor() {
    afterEveryRender(() => this.completeRender())
    this.#worker.addEventListener('message', this.#handleWorkerMessage)
    this.#worker.addEventListener('error', this.#handleWorkerError)
    this.#post({
      type: 'start',
      rowCount: this.instrumentCount(),
      running: this.running(),
      ticksPerSecond: this.targetTicksPerSecond(),
      publishIntervalMs: this.publishIntervalMs(),
      updateSparklines: this.updateSparklines(),
      sparklineSampleIntervalMs: this.sparklineSampleIntervalMs(),
    })
    this.#destroyRef.onDestroy(() => {
      this.#worker.removeEventListener('message', this.#handleWorkerMessage)
      this.#worker.removeEventListener('error', this.#handleWorkerError)
      this.#worker.terminate()
      this.#observers.clear()
    })
  }

  observe(observer: MarketFeedObserver): () => void {
    this.#observers.add(observer)
    return () => this.#observers.delete(observer)
  }

  completeRender(): void {
    if (!this.#renderPending) return

    this.#renderPending = false
    for (const observer of this.#observers) {
      observer.renderCommitted?.()
    }
  }

  toggle(): void {
    const running = !this.running()
    this.running.set(running)
    this.#post({ type: 'set-running', running })
  }

  setInstrumentCount(count: number): void {
    this.instrumentCount.set(count)
    this.reset()
  }

  setTargetRate(rate: number): void {
    const sampleRate = normalizeFeedSampleRate(rate)
    this.targetTicksPerSecond.set(sampleRate)
    this.#post({ type: 'set-rate', ticksPerSecond: sampleRate })
  }

  setPublishInterval(publishIntervalMs: number): void {
    this.publishIntervalMs.set(publishIntervalMs)
    this.#post({ type: 'set-publish-interval', intervalMs: publishIntervalMs })
  }

  setSparklineUpdates(enabled: boolean): void {
    this.updateSparklines.set(enabled)
    this.#post({ type: 'set-sparklines', enabled })
  }

  setSparklineSampleInterval(intervalMs: number): void {
    this.sparklineSampleIntervalMs.set(intervalMs)
    this.#post({ type: 'set-sparkline-interval', intervalMs })
  }

  runBurst(): void {
    this.#post({ type: 'burst', tickCount: 25_000 })
  }

  reset(): void {
    this.workerReady.set(false)
    this.#post({ type: 'reset', rowCount: this.instrumentCount() })
  }

  readonly #handleWorkerMessage = ({
    data,
  }: MessageEvent<MarketFeedEvent>): void => {
    if (data.type === 'snapshot') {
      this.#feedSessionId = data.sessionId
      this.#startMutation()
      this.quotes.set(hydrateMarketQuotes(data.quotes))
      this.workerReady.set(true)
      return
    }

    if (data.sessionId !== this.#feedSessionId) return

    for (const observer of this.#observers) {
      observer.messageReceived?.()
    }
    this.#startMutation()
    this.quotes.update((quotes) => applyMarketUpdates(quotes, data.updates))
    const batch = {
      tickCount: data.tickCount,
      updateCount: data.updates.length,
      supersededUpdateCount: data.coalescedUpdateCount,
    }
    for (const observer of this.#observers) {
      observer.batchApplied?.(batch)
    }
  }

  readonly #handleWorkerError = (error: ErrorEvent): void => {
    this.workerReady.set(false)
    this.running.set(false)
    console.error('Market feed worker failed', error)
  }

  #startMutation(): void {
    this.#renderPending = true
    for (const observer of this.#observers) {
      observer.mutationStarted?.()
    }
  }

  #post(command: MarketFeedCommand): void {
    this.#worker.postMessage(command)
  }
}
