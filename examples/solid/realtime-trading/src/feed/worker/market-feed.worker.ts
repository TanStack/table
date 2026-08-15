import { MarketFeedEngine } from './market-feed-engine'
import type {
  MarketFeedCommand,
  MarketFeedEvent,
  MarketQuoteUpdate,
} from './market-feed-protocol'

const engine = new MarketFeedEngine()
const pendingUpdates = new Map<number, MarketQuoteUpdate>()
const runtime = {
  sessionId: 0,
  pendingTickCount: 0,
  pendingCoalescedUpdateCount: 0,
  initialized: false,
  running: true,
  ticksPerSecond: 10_000,
  publishIntervalMs: 20,
  publishTimerId: null as ReturnType<typeof setInterval> | null,
  updateSparklines: true,
  sparklineSampleIntervalMs: 250,
  tickBudget: 0,
  lastTickAt: performance.now(),
}

addEventListener('message', ({ data }: MessageEvent<MarketFeedCommand>) => {
  switch (data.type) {
    case 'start':
      runtime.running = data.running
      runtime.ticksPerSecond = data.ticksPerSecond
      runtime.publishIntervalMs = data.publishIntervalMs
      runtime.updateSparklines = data.updateSparklines
      runtime.sparklineSampleIntervalMs = data.sparklineSampleIntervalMs
      restartPublishTimer()
      reset(data.rowCount)
      break
    case 'set-running':
      runtime.running = data.running
      break
    case 'set-rate':
      runtime.ticksPerSecond = data.ticksPerSecond
      break
    case 'set-publish-interval':
      runtime.publishIntervalMs = Math.max(4, data.intervalMs)
      restartPublishTimer()
      break
    case 'set-sparklines':
      runtime.updateSparklines = data.enabled
      break
    case 'set-sparkline-interval':
      runtime.sparklineSampleIntervalMs = Math.max(16, data.intervalMs)
      break
    case 'reset':
      reset(data.rowCount)
      break
    case 'burst':
      produceTicks(data.tickCount)
      flush()
      break
  }
})

setInterval(() => {
  const now = performance.now()
  const elapsed = Math.min(100, Math.max(0, now - runtime.lastTickAt))
  runtime.lastTickAt = now

  if (runtime.initialized && runtime.running) {
    runtime.tickBudget += (runtime.ticksPerSecond * elapsed) / 1_000
    const tickCount = Math.floor(runtime.tickBudget)
    runtime.tickBudget -= tickCount
    produceTicks(tickCount)
  }
}, 16)

restartPublishTimer()

function reset(rowCount: number): void {
  runtime.initialized = true
  runtime.sessionId++
  runtime.pendingTickCount = 0
  runtime.pendingCoalescedUpdateCount = 0
  pendingUpdates.clear()
  runtime.tickBudget = 0
  runtime.lastTickAt = performance.now()

  post({
    type: 'snapshot',
    sessionId: runtime.sessionId,
    quotes: engine.reset(rowCount),
  })
}

function produceTicks(tickCount: number): void {
  if (!runtime.initialized || tickCount <= 0) return

  runtime.pendingTickCount += tickCount
  for (const update of engine.applyTicks(
    tickCount,
    runtime.updateSparklines,
    runtime.sparklineSampleIntervalMs,
  )) {
    const previousUpdate = pendingUpdates.get(update.index)
    if (previousUpdate) runtime.pendingCoalescedUpdateCount++
    pendingUpdates.set(update.index, {
      ...update,
      ...(update.history || !previousUpdate?.history
        ? {}
        : { history: previousUpdate.history }),
    })
  }
}

function flush(): void {
  if (runtime.pendingTickCount === 0) return

  const message: MarketFeedEvent = {
    type: 'updates',
    sessionId: runtime.sessionId,
    tickCount: runtime.pendingTickCount,
    coalescedUpdateCount: runtime.pendingCoalescedUpdateCount,
    updates: [...pendingUpdates.values()],
  }

  runtime.pendingTickCount = 0
  runtime.pendingCoalescedUpdateCount = 0
  pendingUpdates.clear()
  post(message)
}

function restartPublishTimer(): void {
  if (runtime.publishTimerId !== null) {
    clearInterval(runtime.publishTimerId)
  }
  runtime.publishTimerId = setInterval(
    flush,
    Math.max(4, runtime.publishIntervalMs),
  )
}

function post(event: MarketFeedEvent): void {
  postMessage(event)
}
