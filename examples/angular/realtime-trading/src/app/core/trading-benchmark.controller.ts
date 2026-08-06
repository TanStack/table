import {
  DestroyRef,
  Injectable,
  NgZone,
  afterEveryRender,
  computed,
  inject,
  isDevMode,
  signal,
} from '@angular/core'
import {
  deriveBenchmarkQuotes,
  feedLoadRates,
  rowWorkloadLabel,
} from '../benchmark-profiles'
import {
  BenchmarkMonitor,
  initialMetrics,
} from '../benchmark/benchmark-monitor'
import { applyMarketUpdates, hydrateMarketQuotes } from '../market-data'
import { TRADING_COLUMN_COUNT } from '../trading-column-types'
import type { FeedMetrics } from '../benchmark/benchmark-monitor'
import type { FeedLoadProfile, RowWorkloadMode } from '../benchmark-profiles'
import type {
  MarketFeedCommand,
  MarketFeedEvent,
} from '../market-feed-protocol'
import type { MarketQuote } from '../market-data'
import type { RendererMode } from '../trading-column-types'

export type TableAdapter = 'local' | 'beta' | 'v8'

@Injectable({ providedIn: 'root' })
export class TradingBenchmarkController {
  readonly #zone = inject(NgZone)
  readonly #destroyRef = inject(DestroyRef)
  readonly #worker: Worker
  readonly #longAnimationFrameObserver: PerformanceObserver | null
  readonly #monitor = new BenchmarkMonitor()

  readonly devMode = isDevMode()
  readonly longAnimationFramesSupported =
    PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')
  readonly workerReady = signal(false)
  readonly running = signal(true)
  readonly instrumentCount = signal(250)
  readonly feedLoadProfile = signal<FeedLoadProfile>('high')
  readonly targetEventsPerSecond = signal(10_000)
  readonly rowWorkloadMode = signal<RowWorkloadMode>('stable')
  readonly rowWorkloadEpoch = signal(0)
  readonly tableAdapter = signal<TableAdapter>('local')
  readonly tableWorkerEnabled = signal(false)
  readonly rendererMode = signal<RendererMode>('stable')
  readonly updateSparklines = signal(true)
  readonly updateQuoteAges = signal(true)
  readonly quoteClock = signal(Date.now())
  readonly quotes = signal<Array<MarketQuote>>([])
  readonly selectedSymbol = signal<string | null>(null)
  readonly metrics = signal<FeedMetrics>(initialMetrics)
  readonly displayQuotes = computed(() =>
    deriveBenchmarkQuotes(
      this.quotes(),
      this.rowWorkloadMode(),
      this.rowWorkloadEpoch(),
    ),
  )
  readonly selectedQuote = computed(() => {
    const symbol = this.selectedSymbol()
    return symbol
      ? (this.displayQuotes().find((quote) => quote.symbol === symbol) ?? null)
      : null
  })

  readonly mountedCells = computed(
    () => this.displayQuotes().length * TRADING_COLUMN_COUNT,
  )
  readonly rowWorkloadLabel = computed(() =>
    rowWorkloadLabel(this.rowWorkloadMode()),
  )
  readonly liveComponents = computed(() => {
    const metrics = this.metrics()
    return metrics.componentsCreated - metrics.componentsDestroyed
  })

  #animationFrameId: number | null = null
  #feedGeneration = 0
  #lastAgeClockAt = performance.now()
  #lastRowWorkloadAt = performance.now()

  constructor() {
    this.#worker = new Worker(
      new URL('../market-feed.worker', import.meta.url),
      { type: 'module' },
    )
    this.#longAnimationFrameObserver = this.longAnimationFramesSupported
      ? new PerformanceObserver(this.#recordLongAnimationFrames)
      : null
    afterEveryRender(() =>
      this.#monitor.recordCompletedRender((command) =>
        this.#postToWorker(command),
      ),
    )
    this.#zone.runOutsideAngular(() => {
      this.#worker.addEventListener('message', this.#handleWorkerMessage)
      this.#worker.addEventListener('error', this.#handleWorkerError)
      this.#longAnimationFrameObserver?.observe({
        type: 'long-animation-frame',
        buffered: true,
      })
      this.#animationFrameId = requestAnimationFrame(this.#feedFrame)
    })
    this.#postToWorker({
      type: 'initialize',
      rowCount: this.instrumentCount(),
      seed: 42 + this.instrumentCount(),
      running: this.running(),
      targetEventsPerSecond: this.targetEventsPerSecond(),
      updateSparklines: this.updateSparklines(),
    })
    this.#destroyRef.onDestroy(() => {
      if (this.#animationFrameId !== null) {
        cancelAnimationFrame(this.#animationFrameId)
      }
      this.#longAnimationFrameObserver?.disconnect()
      this.#worker.terminate()
    })
  }

  toggleFeed(): void {
    const running = !this.running()
    this.running.set(running)
    this.#postToWorker({ type: 'configure', running })
  }

  setRowCount(count: number): void {
    this.instrumentCount.set(count)
    this.#resetWorkerMarket(count)
  }

  setTargetRate(rate: number): void {
    this.feedLoadProfile.set('custom')
    this.targetEventsPerSecond.set(rate)
    this.#postToWorker({
      type: 'configure',
      targetEventsPerSecond: rate,
    })
  }

  setFeedLoadProfile(profile: FeedLoadProfile): void {
    this.feedLoadProfile.set(profile)
    if (profile === 'custom') {
      return
    }

    const rate = feedLoadRates[profile]
    this.targetEventsPerSecond.set(rate)
    this.#postToWorker({
      type: 'configure',
      targetEventsPerSecond: rate,
    })
  }

  setRowWorkloadMode(mode: RowWorkloadMode): void {
    this.rowWorkloadMode.set(mode)
    this.rowWorkloadEpoch.set(0)
    this.#lastRowWorkloadAt = performance.now()
    this.selectedSymbol.set(null)
  }

  setTableAdapter(adapter: TableAdapter): void {
    this.tableAdapter.set(adapter)
  }

  setRendererMode(shouldSwap: boolean): void {
    this.rendererMode.set(shouldSwap ? 'swap' : 'stable')
  }

  setTableWorkerEnabled(enabled: boolean): void {
    this.tableWorkerEnabled.set(enabled)
  }

  setSparklineUpdates(updateSparklines: boolean): void {
    this.updateSparklines.set(updateSparklines)
    this.#postToWorker({ type: 'configure', updateSparklines })
  }

  setQuoteAgeUpdates(enabled: boolean): void {
    this.updateQuoteAges.set(enabled)
  }

  runBurst(): void {
    this.#postToWorker({ type: 'burst', eventCount: 25_000 })
  }

  resetMarket(): void {
    const count = this.instrumentCount()
    this.selectedSymbol.set(null)
    this.#monitor.reset()
    this.#lastRowWorkloadAt = performance.now()
    this.rowWorkloadEpoch.set(0)
    this.quoteClock.set(Date.now())
    this.metrics.set(initialMetrics)
    this.#resetWorkerMarket(count)
  }

  readonly #feedFrame = (now: number): void => {
    this.#monitor.recordAnimationFrame()

    if (this.updateQuoteAges() && now - this.#lastAgeClockAt >= 100) {
      this.#monitor.markRenderPending()
      this.#lastAgeClockAt = now
      this.quoteClock.set(Date.now())
    }

    if (
      this.running() &&
      (this.rowWorkloadMode() === 'rotating-filter' ||
        this.rowWorkloadMode() === 'identity-churn') &&
      now - this.#lastRowWorkloadAt >= 1_000
    ) {
      this.#monitor.markRenderPending()
      this.#lastRowWorkloadAt = now
      this.rowWorkloadEpoch.update((epoch) => epoch + 1)
    }

    if (this.#monitor.shouldPublish(now)) {
      this.metrics.set(this.#monitor.publish(now))
    }

    this.#animationFrameId = requestAnimationFrame(this.#feedFrame)
  }

  readonly #recordLongAnimationFrames = (
    entries: PerformanceObserverEntryList,
  ): void => {
    for (const entry of entries.getEntries()) {
      this.#monitor.recordLongAnimationFrame(entry.duration)
    }
  }

  readonly #handleWorkerMessage = ({
    data,
  }: MessageEvent<MarketFeedEvent>): void => {
    if (data.type === 'ready') {
      this.#feedGeneration = data.generation
      this.#monitor.setPendingAck(null)
      this.#monitor.markRenderPending()
      this.quotes.set(hydrateMarketQuotes(data.quotes))
      this.workerReady.set(true)
      return
    }

    if (data.generation !== this.#feedGeneration) {
      this.#postToWorker({
        type: 'ack',
        generation: data.generation,
        sequence: data.sequence,
      })
      return
    }

    this.#monitor.markRenderPending()
    this.quotes.update((quotes) => applyMarketUpdates(quotes, data.updates))
    this.#monitor.recordBatch(data.eventCount, data.updates.length)
    this.#monitor.setPendingAck({
      generation: data.generation,
      sequence: data.sequence,
    })
  }

  readonly #handleWorkerError = (error: ErrorEvent): void => {
    this.workerReady.set(false)
    this.running.set(false)
    console.error('Market feed worker failed', error)
  }

  #resetWorkerMarket(rowCount: number): void {
    this.workerReady.set(false)
    this.#monitor.setPendingAck(null)
    this.#postToWorker({
      type: 'reset',
      rowCount,
      seed: 42 + rowCount,
    })
  }

  #postToWorker(command: MarketFeedCommand): void {
    this.#worker.postMessage(command)
  }
}
