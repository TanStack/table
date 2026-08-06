import { quoteCellLifecycle, quoteRenderDiagnostics } from '../quote-cells'
import { rowModelDiagnostics } from '../trading-table'
import type { ProfilerOnRenderCallback } from 'react'
import type { MarketFeedCommand } from '../market-feed-protocol'
import type { TableAdapter } from '../trading-table'

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
  profilerCommitsPerSecond: number
  profilerAverageActualMs: number
  profilerP95ActualMs: number
  profilerAverageBaseMs: number
  rowModelCallsPerSecond: number
  rowModelAverageMs: number
  rowModelMaxMs: number
  visibleRows: number
  scrollCallbacksPerSecond: number
  scrollDistancePerSecond: number
  scrollJankFrames: number
}

export type ScrollStressMode = 'off' | 'vertical' | 'horizontal' | 'both'

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
  profilerCommitsPerSecond: 0,
  profilerAverageActualMs: 0,
  profilerP95ActualMs: 0,
  profilerAverageBaseMs: 0,
  rowModelCallsPerSecond: 0,
  rowModelAverageMs: 0,
  rowModelMaxMs: 0,
  visibleRows: 0,
  scrollCallbacksPerSecond: 0,
  scrollDistancePerSecond: 0,
  scrollJankFrames: 0,
}

const userTiming = { entryCount: 0 }

export function recordMeasure(
  name: string,
  start: number,
  end: number,
  detail: Record<string, unknown>,
): void {
  try {
    performance.measure(name, { start, end, detail })
    userTiming.entryCount++
    if (userTiming.entryCount % 1_000 === 0) {
      performance.clearMeasures('react-profiler-commit')
      performance.clearMeasures('market-update-to-layout-commit')
    }
  } catch {
    // User Timing Level 3 options are not implemented in every browser.
  }
}

export function markBenchmarkAction(
  name: string,
  detail: Record<string, unknown> = {},
): void {
  try {
    performance.mark(`benchmark:${name}`, { detail })
    userTiming.entryCount++
    if (userTiming.entryCount % 1_000 === 0) {
      performance.clearMarks()
    }
  } catch {
    // User Timing Level 3 detail is not implemented in every browser.
  }
}

interface PendingAck {
  generation: number
  sequence: number
}

interface ProfilerSample {
  actualDuration: number
  baseDuration: number
}

export class BenchmarkMonitor {
  readonly #runtime = {
    sampleStartedAt: performance.now(),
    pendingRenderStartedAt: null as number | null,
    pendingAck: null as PendingAck | null,
    renderSamples: [] as Array<number>,
    profilerSamples: [] as Array<ProfilerSample>,
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
    previousRowModelCalls: 0,
    previousRowModelDuration: 0,
    scrollCallbacksInSample: 0,
    scrollDistanceInSample: 0,
    scrollJankFramesInSample: 0,
  }

  readonly recordProfilerRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  ) => {
    this.#runtime.profilerSamples.push({ actualDuration, baseDuration })
    recordMeasure('react-profiler-commit', startTime, commitTime, {
      id,
      phase,
      actualDuration,
      baseDuration,
    })
  }

  markRenderPending(): void {
    this.#runtime.pendingRenderStartedAt ??= performance.now()
  }

  setPendingAck(ack: PendingAck | null): void {
    this.#runtime.pendingAck = ack
  }

  recordCompletedRender(
    adapter: TableAdapter,
    postCommand: (command: MarketFeedCommand) => void,
  ): void {
    const runtime = this.#runtime
    if (runtime.pendingRenderStartedAt !== null) {
      const renderEndedAt = performance.now()
      runtime.renderSamples.push(
        renderEndedAt - runtime.pendingRenderStartedAt,
      )
      recordMeasure(
        'market-update-to-layout-commit',
        runtime.pendingRenderStartedAt,
        renderEndedAt,
        { adapter },
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

  recordScrollFrame(distance: number, delayed: boolean): void {
    const runtime = this.#runtime
    runtime.scrollCallbacksInSample++
    runtime.scrollDistanceInSample += distance
    if (delayed) {
      runtime.scrollJankFramesInSample++
    }
  }

  shouldPublish(now: number): boolean {
    return now - this.#runtime.sampleStartedAt >= 500
  }

  publish(now: number): FeedMetrics {
    const runtime = this.#runtime
    const sampleDuration = now - runtime.sampleStartedAt
    const renderSamples = runtime.renderSamples
    const sortedRenderSamples = [...renderSamples].sort(
      (left, right) => left - right,
    )
    const profilerSamples = runtime.profilerSamples
    const sortedProfilerSamples = profilerSamples
      .map((sample) => sample.actualDuration)
      .sort((left, right) => left - right)
    const rowModelCalls =
      rowModelDiagnostics.calls - runtime.previousRowModelCalls
    const rowModelDuration =
      rowModelDiagnostics.totalDurationMs -
      runtime.previousRowModelDuration
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
    const averageRenderMs =
      renderSamples.length === 0
        ? 0
        : renderSamples.reduce((sum, value) => sum + value, 0) /
          renderSamples.length
    const p95Index = Math.max(
      0,
      Math.ceil(sortedRenderSamples.length * 0.95) - 1,
    )
    const profilerP95Index = Math.max(
      0,
      Math.ceil(sortedProfilerSamples.length * 0.95) - 1,
    )
    const metrics: FeedMetrics = {
      actualEventsPerSecond:
        sampleDuration === 0
          ? 0
          : (runtime.eventsInSample / sampleDuration) * 1_000,
      totalEvents: runtime.totalEvents,
      rafCallbacksPerSecond:
        (runtime.rafCallbacksInSample / sampleDuration) * 1_000,
      tableRendersPerSecond:
        (runtime.tableRendersInSample / sampleDuration) * 1_000,
      lastBatchSize: runtime.lastBatchSize,
      averageRenderMs,
      p95RenderMs: sortedRenderSamples[p95Index] ?? 0,
      maxRenderMs: sortedRenderSamples.at(-1) ?? 0,
      slowRenders: renderSamples.filter((value) => value > 16.7).length,
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
      profilerCommitsPerSecond:
        (profilerSamples.length / sampleDuration) * 1_000,
      profilerAverageActualMs:
        profilerSamples.length === 0
          ? 0
          : profilerSamples.reduce(
              (sum, sample) => sum + sample.actualDuration,
              0,
            ) / profilerSamples.length,
      profilerP95ActualMs:
        sortedProfilerSamples[profilerP95Index] ?? 0,
      profilerAverageBaseMs:
        profilerSamples.length === 0
          ? 0
          : profilerSamples.reduce(
              (sum, sample) => sum + sample.baseDuration,
              0,
            ) / profilerSamples.length,
      rowModelCallsPerSecond: (rowModelCalls / sampleDuration) * 1_000,
      rowModelAverageMs:
        rowModelCalls === 0 ? 0 : rowModelDuration / rowModelCalls,
      rowModelMaxMs: rowModelDiagnostics.maxDurationMs,
      visibleRows: rowModelDiagnostics.lastRowCount,
      scrollCallbacksPerSecond:
        (runtime.scrollCallbacksInSample / sampleDuration) * 1_000,
      scrollDistancePerSecond:
        (runtime.scrollDistanceInSample / sampleDuration) * 1_000,
      scrollJankFrames: runtime.scrollJankFramesInSample,
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
    runtime.profilerSamples = []
    runtime.previousRowModelCalls = rowModelDiagnostics.calls
    runtime.previousRowModelDuration = rowModelDiagnostics.totalDurationMs
    runtime.scrollCallbacksInSample = 0
    runtime.scrollDistanceInSample = 0
    runtime.scrollJankFramesInSample = 0
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
    runtime.profilerSamples = []
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
    runtime.previousRowModelCalls = rowModelDiagnostics.calls
    runtime.previousRowModelDuration = rowModelDiagnostics.totalDurationMs
    runtime.scrollCallbacksInSample = 0
    runtime.scrollDistanceInSample = 0
    runtime.scrollJankFramesInSample = 0
    rowModelDiagnostics.maxDurationMs = 0
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
