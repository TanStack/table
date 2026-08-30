import {
  quoteCellLifecycle,
  quoteRenderDiagnostics,
} from '../table/table-config/quote-cells.gts'
import { rowModelDiagnostics } from '../table/trading-table'

export interface NamedInvocationRate {
  name: string
  callsPerSecond: number
}

export interface FeedMetrics {
  actualTicksPerSecond: number
  rowUpdatesPerSecond: number
  workerMessagesPerSecond: number
  stateApplicationsPerSecond: number
  supersededUpdatesPerSecond: number
  totalTicks: number
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
  rowModelCallsPerSecond: number
  rowModelAverageMs: number
  rowModelMaxMs: number
  visibleRows: number
}

export const initialMetrics: FeedMetrics = {
  actualTicksPerSecond: 0,
  rowUpdatesPerSecond: 0,
  workerMessagesPerSecond: 0,
  stateApplicationsPerSecond: 0,
  supersededUpdatesPerSecond: 0,
  totalTicks: 0,
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
  rowModelCallsPerSecond: 0,
  rowModelAverageMs: 0,
  rowModelMaxMs: 0,
  visibleRows: 0,
}

const userTiming = { entryCount: 0, measureCallCount: 0 }
const USER_TIMING_SAMPLE_INTERVAL = 20

interface CommitLatencySample {
  recordedAt: number
  duration: number
}

const AVERAGE_COMMIT_WINDOW_MS = 3_000
const PERCENTILE_COMMIT_WINDOW_MS = 10_000
const FRAME_RATE_WINDOW_MS = 1_000

export function recordMeasure(
  name: string,
  start: number,
  end: number,
  detail: Record<string, unknown>,
): void {
  userTiming.measureCallCount++
  if (userTiming.measureCallCount % USER_TIMING_SAMPLE_INTERVAL !== 0) return
  try {
    performance.measure(name, { start, end, detail })
    userTiming.entryCount++
    if (userTiming.entryCount % 1_000 === 0) {
      performance.clearMeasures('market-update-to-dom-commit')
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

export class BenchmarkMonitor {
  readonly #runtime = {
    sampleStartedAt: performance.now(),
    sessionStartedAt: performance.now(),
    frameTrackingStartedAt: performance.now(),
    pendingRenderStartedAt: null as number | null,
    renderSamples: [] as Array<CommitLatencySample>,
    frameTimestamps: [] as Array<number>,
    totalTicks: 0,
    ticksInSample: 0,
    rowUpdatesInSample: 0,
    workerMessagesInSample: 0,
    stateApplicationsInSample: 0,
    supersededUpdatesInSample: 0,
    lastBatchSize: 0,
    lastUpdateCount: 0,
    workerMessages: 0,
    tableRendersInSample: 0,
    slowRenderCount: 0,
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
  }

  markRenderPending(): void {
    this.#runtime.pendingRenderStartedAt ??= performance.now()
  }

  recordCompletedRender(): void {
    const runtime = this.#runtime
    if (runtime.pendingRenderStartedAt !== null) {
      const renderEndedAt = performance.now()
      const duration = renderEndedAt - runtime.pendingRenderStartedAt
      runtime.renderSamples.push({ recordedAt: renderEndedAt, duration })
      if (duration > 16.7) runtime.slowRenderCount++
      recordMeasure(
        'market-update-to-dom-commit',
        runtime.pendingRenderStartedAt,
        renderEndedAt,
        {},
      )
      runtime.pendingRenderStartedAt = null
      runtime.tableRendersInSample++
    }
  }

  recordWorkerMessage(): void {
    this.#runtime.workerMessages++
    this.#runtime.workerMessagesInSample++
  }

  recordBatch(
    tickCount: number,
    updateCount: number,
    supersededUpdateCount: number,
  ): void {
    const runtime = this.#runtime
    runtime.lastBatchSize = tickCount
    runtime.lastUpdateCount = updateCount
    runtime.ticksInSample += tickCount
    runtime.totalTicks += tickCount
    runtime.rowUpdatesInSample += updateCount
    runtime.stateApplicationsInSample++
    runtime.supersededUpdatesInSample += supersededUpdateCount
  }

  recordAnimationFrame(now: number): void {
    this.#runtime.frameTimestamps.push(now)
  }

  recordLongAnimationFrame(duration: number, startTime: number): void {
    const runtime = this.#runtime
    if (startTime < runtime.sessionStartedAt) return
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
    runtime.renderSamples = runtime.renderSamples.filter(
      (sample) => sample.recordedAt >= now - PERCENTILE_COMMIT_WINDOW_MS,
    )
    runtime.frameTimestamps = runtime.frameTimestamps.filter(
      (timestamp) => timestamp >= now - FRAME_RATE_WINDOW_MS,
    )
    const averageRenderSamples = runtime.renderSamples.filter(
      (sample) => sample.recordedAt >= now - AVERAGE_COMMIT_WINDOW_MS,
    )
    const sortedRenderSamples = runtime.renderSamples
      .map((sample) => sample.duration)
      .sort((left, right) => left - right)
    const rowModelCalls =
      rowModelDiagnostics.calls - runtime.previousRowModelCalls
    const rowModelDuration =
      rowModelDiagnostics.totalDurationMs - runtime.previousRowModelDuration
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
      averageRenderSamples.length === 0
        ? 0
        : averageRenderSamples.reduce(
            (sum, sample) => sum + sample.duration,
            0,
          ) / averageRenderSamples.length
    const p95Index = Math.max(
      0,
      Math.ceil(sortedRenderSamples.length * 0.95) - 1,
    )
    const metrics: FeedMetrics = {
      actualTicksPerSecond:
        sampleDuration === 0
          ? 0
          : (runtime.ticksInSample / sampleDuration) * 1_000,
      rowUpdatesPerSecond:
        (runtime.rowUpdatesInSample / sampleDuration) * 1_000,
      workerMessagesPerSecond:
        (runtime.workerMessagesInSample / sampleDuration) * 1_000,
      stateApplicationsPerSecond:
        (runtime.stateApplicationsInSample / sampleDuration) * 1_000,
      supersededUpdatesPerSecond:
        (runtime.supersededUpdatesInSample / sampleDuration) * 1_000,
      totalTicks: runtime.totalTicks,
      rafCallbacksPerSecond:
        (runtime.frameTimestamps.length /
          Math.min(
            FRAME_RATE_WINDOW_MS,
            Math.max(1, now - runtime.frameTrackingStartedAt),
          )) *
        1_000,
      tableRendersPerSecond:
        (runtime.tableRendersInSample / sampleDuration) * 1_000,
      lastBatchSize: runtime.lastBatchSize,
      averageRenderMs,
      p95RenderMs: sortedRenderSamples[p95Index] ?? 0,
      maxRenderMs: sortedRenderSamples.at(-1) ?? 0,
      slowRenders: runtime.slowRenderCount,
      longAnimationFrames: runtime.longAnimationFrameCount,
      worstLongAnimationFrameMs: runtime.worstLongAnimationFrameMs,
      heapMb: readHeapSizeMb(),
      componentsCreated: quoteCellLifecycle.created,
      componentsDestroyed: quoteCellLifecycle.destroyed,
      workerMessages: runtime.workerMessages,
      lastUpdateCount: runtime.lastUpdateCount,
      cellRendererCallsPerSecond: (cellRendererCalls / sampleDuration) * 1_000,
      componentRenderCallsPerSecond:
        (componentRenderCalls / sampleDuration) * 1_000,
      cellRendererRates,
      componentRenderRates,
      domMutationsPerSecond:
        (runtime.domMutationsInSample / sampleDuration) * 1_000,
      rowModelCallsPerSecond: (rowModelCalls / sampleDuration) * 1_000,
      rowModelAverageMs:
        rowModelCalls === 0 ? 0 : rowModelDuration / rowModelCalls,
      rowModelMaxMs: rowModelDiagnostics.maxDurationMs,
      visibleRows: rowModelDiagnostics.lastRowCount,
    }

    runtime.sampleStartedAt = now
    runtime.previousCellRendererCalls = quoteRenderDiagnostics.cellRendererCalls
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
    runtime.ticksInSample = 0
    runtime.rowUpdatesInSample = 0
    runtime.workerMessagesInSample = 0
    runtime.stateApplicationsInSample = 0
    runtime.supersededUpdatesInSample = 0
    runtime.tableRendersInSample = 0
    return metrics
  }

  reset(): void {
    const runtime = this.#runtime
    runtime.sampleStartedAt = performance.now()
    runtime.sessionStartedAt = runtime.sampleStartedAt
    runtime.pendingRenderStartedAt = null
    runtime.renderSamples = []
    runtime.frameTrackingStartedAt = runtime.sampleStartedAt
    runtime.frameTimestamps = []
    runtime.totalTicks = 0
    runtime.ticksInSample = 0
    runtime.rowUpdatesInSample = 0
    runtime.workerMessagesInSample = 0
    runtime.stateApplicationsInSample = 0
    runtime.supersededUpdatesInSample = 0
    runtime.lastBatchSize = 0
    runtime.lastUpdateCount = 0
    runtime.workerMessages = 0
    runtime.tableRendersInSample = 0
    runtime.slowRenderCount = 0
    runtime.longAnimationFrameCount = 0
    runtime.worstLongAnimationFrameMs = 0
    runtime.previousCellRendererCalls = quoteRenderDiagnostics.cellRendererCalls
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

export function exposeTradingBenchmarkSnapshot(
  metrics: FeedMetrics,
  extras: { mountedCells: number; liveComponents: number },
): void {
  Object.assign(globalThis, {
    __TANSTACK_TRADING_BENCHMARK__: {
      capturedAt: performance.now(),
      metrics,
      ...extras,
    },
  })
}
