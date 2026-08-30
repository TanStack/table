import {
  quoteCellLifecycle,
  quoteRenderDiagnostics,
} from '../table/table-config/quote-cells'
import { rowModelDiagnostics } from '../table/trading-table'

export interface NamedInvocationRate {
  name: string
  callsPerSecond: number
}

interface TimedLatencySample {
  recordedAt: number
  duration: number
}

const averageLatencyWindowMs = 3_000
const percentileLatencyWindowMs = 10_000
const frameRateWindowMs = 1_000

export interface FeedMetrics {
  actualTicksPerSecond: number
  rowUpdatesPerSecond: number
  workerMessagesPerSecond: number
  stateApplicationsPerSecond: number
  supersededUpdatesPerSecond: number
  totalTicks: number
  rafCallbacksPerSecond: number
  tableCommitsPerSecond: number
  lastBatchSize: number
  averageCommitLatencyMs: number
  p95CommitLatencyMs: number
  maxCommitLatencyMs: number
  slowCommits: number
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
  tableCommitsPerSecond: 0,
  lastBatchSize: 0,
  averageCommitLatencyMs: 0,
  p95CommitLatencyMs: 0,
  maxCommitLatencyMs: 0,
  slowCommits: 0,
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

const userTiming = { entryCount: 0, measureCalls: 0 }

export function recordMeasure(
  name: string,
  start: number,
  end: number,
  detail: Record<string, unknown>,
): void {
  userTiming.measureCalls++
  if (userTiming.measureCalls % 20 !== 0) return
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
    pendingMutationStartedAt: null as number | null,
    commitLatencySamples: [] as Array<TimedLatencySample>,
    slowCommitCount: 0,
    totalTicks: 0,
    ticksInSample: 0,
    rowUpdatesInSample: 0,
    workerMessagesInSample: 0,
    stateApplicationsInSample: 0,
    supersededUpdatesInSample: 0,
    lastBatchSize: 0,
    lastUpdateCount: 0,
    workerMessages: 0,
    frameTrackingStartedAt: performance.now(),
    frameTimestamps: [] as Array<number>,
    tableCommitsInSample: 0,
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

  markCommitPending(): void {
    this.#runtime.pendingMutationStartedAt ??= performance.now()
  }

  recordDomCommit(): void {
    const runtime = this.#runtime
    if (runtime.pendingMutationStartedAt !== null) {
      const commitEndedAt = performance.now()
      const duration = commitEndedAt - runtime.pendingMutationStartedAt
      runtime.commitLatencySamples.push({
        recordedAt: commitEndedAt,
        duration,
      })
      if (duration > 16.7) runtime.slowCommitCount++
      recordMeasure(
        'market-update-to-dom-commit',
        runtime.pendingMutationStartedAt,
        commitEndedAt,
        {},
      )
      runtime.pendingMutationStartedAt = null
      runtime.tableCommitsInSample++
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
    const timestamps = this.#runtime.frameTimestamps
    timestamps.push(now)
    pruneFrameTimestamps(timestamps, now)
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
    pruneLatencySamples(runtime.commitLatencySamples, now)
    pruneFrameTimestamps(runtime.frameTimestamps, now)
    const averageCommitLatencySamples = runtime.commitLatencySamples
      .filter((sample) => sample.recordedAt >= now - averageLatencyWindowMs)
      .map((sample) => sample.duration)
    const percentileCommitLatencySamples = runtime.commitLatencySamples.map(
      (sample) => sample.duration,
    )
    const sortedCommitLatencySamples = [...percentileCommitLatencySamples].sort(
      (left, right) => left - right,
    )
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
    const averageCommitLatencyMs =
      averageCommitLatencySamples.length === 0
        ? 0
        : averageCommitLatencySamples.reduce((sum, value) => sum + value, 0) /
          averageCommitLatencySamples.length
    const p95Index = Math.max(
      0,
      Math.ceil(sortedCommitLatencySamples.length * 0.95) - 1,
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
      rafCallbacksPerSecond: calculateFrameRate(
        runtime.frameTimestamps,
        runtime.frameTrackingStartedAt,
        now,
      ),
      tableCommitsPerSecond:
        (runtime.tableCommitsInSample / sampleDuration) * 1_000,
      lastBatchSize: runtime.lastBatchSize,
      averageCommitLatencyMs,
      p95CommitLatencyMs: sortedCommitLatencySamples[p95Index] ?? 0,
      maxCommitLatencyMs: sortedCommitLatencySamples.at(-1) ?? 0,
      slowCommits: runtime.slowCommitCount,
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
    runtime.tableCommitsInSample = 0
    return metrics
  }

  reset(): void {
    const runtime = this.#runtime
    runtime.sampleStartedAt = performance.now()
    runtime.sessionStartedAt = runtime.sampleStartedAt
    runtime.pendingMutationStartedAt = null
    runtime.commitLatencySamples = []
    runtime.slowCommitCount = 0
    runtime.totalTicks = 0
    runtime.ticksInSample = 0
    runtime.rowUpdatesInSample = 0
    runtime.workerMessagesInSample = 0
    runtime.stateApplicationsInSample = 0
    runtime.supersededUpdatesInSample = 0
    runtime.lastBatchSize = 0
    runtime.lastUpdateCount = 0
    runtime.workerMessages = 0
    runtime.frameTrackingStartedAt = runtime.sampleStartedAt
    runtime.frameTimestamps = []
    runtime.tableCommitsInSample = 0
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

function pruneLatencySamples(
  samples: Array<TimedLatencySample>,
  now: number,
): void {
  const cutoff = now - percentileLatencyWindowMs
  const firstRetainedIndex = samples.findIndex(
    (sample) => sample.recordedAt >= cutoff,
  )
  if (firstRetainedIndex > 0) samples.splice(0, firstRetainedIndex)
  else if (firstRetainedIndex === -1) samples.length = 0
}

function pruneFrameTimestamps(timestamps: Array<number>, now: number): void {
  const cutoff = now - frameRateWindowMs
  const firstRetainedIndex = timestamps.findIndex(
    (timestamp) => timestamp >= cutoff,
  )
  if (firstRetainedIndex > 0) timestamps.splice(0, firstRetainedIndex)
  else if (firstRetainedIndex === -1) timestamps.length = 0
}

function calculateFrameRate(
  timestamps: ReadonlyArray<number>,
  trackingStartedAt: number,
  now: number,
): number {
  const observedWindowMs = Math.min(
    frameRateWindowMs,
    Math.max(1, now - trackingStartedAt),
  )
  return (timestamps.length / observedWindowMs) * 1_000
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
