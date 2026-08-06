import { quoteCellLifecycle, quoteRenderDiagnostics } from '../quote-cells'
import type { MarketFeedCommand } from '../market-feed-protocol'

export interface NamedInvocationRate {
  name: string
  callsPerSecond: number
}

export interface FeedMetrics {
  actualEventsPerSecond: number
  totalEvents: number
  rafCallbacksPerSecond: number
  tableRendersPerSecond: number
  lastBatchSize: number
  averageRenderMs: number
  p95RenderMs: number
  maxRenderMs: number
  slowRenders: number
  longAnimationFrames: number
  worstLongAnimationFrameMs: number
  heapMb: number | null
  componentsCreated: number
  componentsDestroyed: number
  workerMessages: number
  lastUpdateCount: number
  cellRendererCallsPerSecond: number
  componentRenderCallsPerSecond: number
  cellRendererRates: ReadonlyArray<NamedInvocationRate>
  componentRenderRates: ReadonlyArray<NamedInvocationRate>
  domMutationsPerSecond: number
}

export const initialMetrics: FeedMetrics = {
  actualEventsPerSecond: 0,
  totalEvents: 0,
  rafCallbacksPerSecond: 0,
  tableRendersPerSecond: 0,
  lastBatchSize: 0,
  averageRenderMs: 0,
  p95RenderMs: 0,
  maxRenderMs: 0,
  slowRenders: 0,
  longAnimationFrames: 0,
  worstLongAnimationFrameMs: 0,
  heapMb: null,
  componentsCreated: 0,
  componentsDestroyed: 0,
  workerMessages: 0,
  lastUpdateCount: 0,
  cellRendererCallsPerSecond: 0,
  componentRenderCallsPerSecond: 0,
  cellRendererRates: [],
  componentRenderRates: [],
  domMutationsPerSecond: 0,
}

interface PendingAck {
  generation: number
  sequence: number
}

export class BenchmarkMonitor {
  readonly #runtime = {
    sampleStartedAt: performance.now(),
    pendingRenderStartedAt: null as number | null,
    pendingAck: null as PendingAck | null,
    renderSamples: [] as Array<number>,
    totalEvents: 0,
    eventsInSample: 0,
    lastBatchSize: 0,
    lastUpdateCount: 0,
    workerMessages: 0,
    rafCallbacksInSample: 0,
    tableRendersInSample: 0,
    longAnimationFrameCount: 0,
    worstLongAnimationFrameMs: 0,
    previousCellRendererCalls: 0,
    previousComponentRenderCalls: 0,
    previousCellRendererCallsByName: {
      ...quoteRenderDiagnostics.cellRendererCallsByName,
    },
    previousComponentRenderCallsByName: {
      ...quoteRenderDiagnostics.componentRenderCallsByName,
    },
    domMutationsInSample: 0,
  }

  markRenderPending(): void {
    this.#runtime.pendingRenderStartedAt ??= performance.now()
  }

  setPendingAck(ack: PendingAck | null): void {
    this.#runtime.pendingAck = ack
  }

  recordCompletedRender(postCommand: (command: MarketFeedCommand) => void) {
    const runtime = this.#runtime
    if (runtime.pendingRenderStartedAt !== null) {
      runtime.renderSamples.push(
        performance.now() - runtime.pendingRenderStartedAt,
      )
      runtime.pendingRenderStartedAt = null
    }

    if (runtime.pendingAck) {
      runtime.tableRendersInSample++
      postCommand({ type: 'ack', ...runtime.pendingAck })
      runtime.pendingAck = null
    }
  }

  recordBatch(eventCount: number, updateCount: number): void {
    const runtime = this.#runtime
    runtime.lastBatchSize = eventCount
    runtime.lastUpdateCount = updateCount
    runtime.eventsInSample += eventCount
    runtime.totalEvents += eventCount
    runtime.workerMessages++
  }

  recordAnimationFrame(): void {
    this.#runtime.rafCallbacksInSample++
  }

  recordLongAnimationFrame(duration: number): void {
    const runtime = this.#runtime
    runtime.longAnimationFrameCount++
    runtime.worstLongAnimationFrameMs = Math.max(
      runtime.worstLongAnimationFrameMs,
      duration,
    )
  }

  recordDomMutations(count: number): void {
    this.#runtime.domMutationsInSample += count
  }

  resetDomMutations(): void {
    this.#runtime.domMutationsInSample = 0
  }

  shouldPublish(now: number): boolean {
    return now - this.#runtime.sampleStartedAt >= 500
  }

  publish(now: number): FeedMetrics {
    const runtime = this.#runtime
    const sampleDuration = now - runtime.sampleStartedAt
    const cellRendererCalls =
      quoteRenderDiagnostics.cellRendererCalls -
      runtime.previousCellRendererCalls
    const componentRenderCalls =
      quoteRenderDiagnostics.componentRenderCalls -
      runtime.previousComponentRenderCalls
    const cellRendererRates = calculateInvocationRates(
      quoteRenderDiagnostics.cellRendererCallsByName,
      runtime.previousCellRendererCallsByName,
      sampleDuration,
    )
    const componentRenderRates = calculateInvocationRates(
      quoteRenderDiagnostics.componentRenderCallsByName,
      runtime.previousComponentRenderCallsByName,
      sampleDuration,
    )
    const sortedRenderSamples = [...runtime.renderSamples].sort(
      (left, right) => left - right,
    )
    const averageRenderMs =
      runtime.renderSamples.length === 0
        ? 0
        : runtime.renderSamples.reduce((sum, value) => sum + value, 0) /
          runtime.renderSamples.length
    const p95Index = Math.max(
      0,
      Math.ceil(sortedRenderSamples.length * 0.95) - 1,
    )
    const metrics: FeedMetrics = {
      actualEventsPerSecond:
        sampleDuration === 0
          ? 0
          : (runtime.eventsInSample / sampleDuration) * 1_000,
      totalEvents: runtime.totalEvents,
      rafCallbacksPerSecond:
        sampleDuration === 0
          ? 0
          : (runtime.rafCallbacksInSample / sampleDuration) * 1_000,
      tableRendersPerSecond:
        sampleDuration === 0
          ? 0
          : (runtime.tableRendersInSample / sampleDuration) * 1_000,
      lastBatchSize: runtime.lastBatchSize,
      averageRenderMs,
      p95RenderMs: sortedRenderSamples[p95Index] ?? 0,
      maxRenderMs: sortedRenderSamples.at(-1) ?? 0,
      slowRenders: runtime.renderSamples.filter((value) => value > 16.7)
        .length,
      longAnimationFrames: runtime.longAnimationFrameCount,
      worstLongAnimationFrameMs: runtime.worstLongAnimationFrameMs,
      heapMb: readHeapSizeMb(),
      componentsCreated: quoteCellLifecycle.created,
      componentsDestroyed: quoteCellLifecycle.destroyed,
      workerMessages: runtime.workerMessages,
      lastUpdateCount: runtime.lastUpdateCount,
      cellRendererCallsPerSecond:
        (cellRendererCalls / sampleDuration) * 1_000,
      componentRenderCallsPerSecond:
        (componentRenderCalls / sampleDuration) * 1_000,
      cellRendererRates,
      componentRenderRates,
      domMutationsPerSecond:
        (runtime.domMutationsInSample / sampleDuration) * 1_000,
    }

    runtime.sampleStartedAt = now
    runtime.previousCellRendererCalls =
      quoteRenderDiagnostics.cellRendererCalls
    runtime.previousComponentRenderCalls =
      quoteRenderDiagnostics.componentRenderCalls
    runtime.previousCellRendererCallsByName = {
      ...quoteRenderDiagnostics.cellRendererCallsByName,
    }
    runtime.previousComponentRenderCallsByName = {
      ...quoteRenderDiagnostics.componentRenderCallsByName,
    }
    runtime.domMutationsInSample = 0
    runtime.eventsInSample = 0
    runtime.renderSamples = []
    runtime.rafCallbacksInSample = 0
    runtime.tableRendersInSample = 0
    return metrics
  }

  reset(): void {
    const runtime = this.#runtime
    runtime.sampleStartedAt = performance.now()
    runtime.pendingRenderStartedAt = null
    runtime.pendingAck = null
    runtime.renderSamples = []
    runtime.totalEvents = 0
    runtime.eventsInSample = 0
    runtime.lastBatchSize = 0
    runtime.lastUpdateCount = 0
    runtime.workerMessages = 0
    runtime.rafCallbacksInSample = 0
    runtime.tableRendersInSample = 0
    runtime.longAnimationFrameCount = 0
    runtime.worstLongAnimationFrameMs = 0
    runtime.previousCellRendererCalls =
      quoteRenderDiagnostics.cellRendererCalls
    runtime.previousComponentRenderCalls =
      quoteRenderDiagnostics.componentRenderCalls
    runtime.previousCellRendererCallsByName = {
      ...quoteRenderDiagnostics.cellRendererCallsByName,
    }
    runtime.previousComponentRenderCallsByName = {
      ...quoteRenderDiagnostics.componentRenderCallsByName,
    }
    runtime.domMutationsInSample = 0
  }
}

export const longAnimationFramesSupported =
  PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')

function readHeapSizeMb(): number | null {
  const memory = (
    performance as Performance & {
      memory?: { usedJSHeapSize: number }
    }
  ).memory
  return memory ? memory.usedJSHeapSize / 1_048_576 : null
}

function calculateInvocationRates(
  current: Record<string, number>,
  previous: Record<string, number>,
  sampleDuration: number,
): ReadonlyArray<NamedInvocationRate> {
  return Object.entries(current).map(([name, calls]) => ({
    name,
    callsPerSecond:
      sampleDuration === 0
        ? 0
        : ((calls - (previous[name] ?? 0)) / sampleDuration) * 1_000,
  }))
}
