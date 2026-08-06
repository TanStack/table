import { MarketFeedEngine } from './market-feed-engine'
import type {
  MarketFeedCommand,
  MarketFeedEvent,
  MarketQuoteUpdate,
} from './market-feed-protocol'

const engine = new MarketFeedEngine()
const pendingUpdates = new Map<number, MarketQuoteUpdate>()

const runtime = {
  generation: 0,
  sequence: 0,
  inFlightSequence: null as number | null,
  pendingEventCount: 0,
  initialized: false,
  running: true,
  targetEventsPerSecond: 10_000,
  updateSparklines: true,
  eventBudget: 0,
  lastTickAt: performance.now(),
}

addEventListener('message', ({ data }: MessageEvent<MarketFeedCommand>) => {
  switch (data.type) {
    case 'initialize':
      runtime.running = data.running
      runtime.targetEventsPerSecond = data.targetEventsPerSecond
      runtime.updateSparklines = data.updateSparklines
      reset(data.rowCount, data.seed)
      break
    case 'configure':
      runtime.running = data.running ?? runtime.running
      runtime.targetEventsPerSecond =
        data.targetEventsPerSecond ?? runtime.targetEventsPerSecond
      runtime.updateSparklines =
        data.updateSparklines ?? runtime.updateSparklines
      break
    case 'reset':
      reset(data.rowCount, data.seed)
      break
    case 'burst':
      produceEvents(data.eventCount)
      flush()
      break
    case 'ack':
      if (
        data.generation === runtime.generation &&
        data.sequence === runtime.inFlightSequence
      ) {
        runtime.inFlightSequence = null
        flush()
      }
      break
  }
})

setInterval(() => {
  const now = performance.now()
  const elapsed = Math.min(100, Math.max(0, now - runtime.lastTickAt))
  runtime.lastTickAt = now

  if (runtime.initialized && runtime.running) {
    runtime.eventBudget +=
      (runtime.targetEventsPerSecond * elapsed) / 1_000
    const eventCount = Math.floor(runtime.eventBudget)
    runtime.eventBudget -= eventCount
    produceEvents(eventCount)
  }

  flush()
}, 16)

function reset(rowCount: number, seed: number): void {
  runtime.initialized = true
  runtime.generation++
  runtime.sequence = 0
  runtime.inFlightSequence = null
  runtime.pendingEventCount = 0
  pendingUpdates.clear()
  runtime.eventBudget = 0
  runtime.lastTickAt = performance.now()

  post({
    type: 'ready',
    generation: runtime.generation,
    quotes: engine.reset(rowCount, seed),
  })
}

function produceEvents(eventCount: number): void {
  if (!runtime.initialized || eventCount <= 0) return

  runtime.pendingEventCount += eventCount
  for (const update of engine.applyEvents(
    eventCount,
    runtime.updateSparklines,
  )) {
    const previousUpdate = pendingUpdates.get(update.index)
    pendingUpdates.set(update.index, {
      ...update,
      ...(update.history || !previousUpdate?.history
        ? {}
        : { history: previousUpdate.history }),
    })
  }
}

function flush(): void {
  if (
    runtime.inFlightSequence !== null ||
    runtime.pendingEventCount === 0
  )
    return

  const nextSequence = ++runtime.sequence
  const message: MarketFeedEvent = {
    type: 'batch',
    generation: runtime.generation,
    sequence: nextSequence,
    eventCount: runtime.pendingEventCount,
    updates: [...pendingUpdates.values()],
  }

  runtime.pendingEventCount = 0
  pendingUpdates.clear()
  runtime.inFlightSequence = nextSequence
  post(message)
}

function post(event: MarketFeedEvent): void {
  postMessage(event)
}
