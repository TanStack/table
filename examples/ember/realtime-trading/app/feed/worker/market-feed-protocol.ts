export interface MarketQuoteSnapshot {
  id: string
  symbol: string
  company: string
  venue: string
  previousClose: number
  open: number
  high: number
  low: number
  price: number
  bid: number
  ask: number
  bidSize: number
  askSize: number
  lastSize: number
  lastMove: number
  lastUpdatedAt: number
  volume: number
  turnover: number
  history: Array<number>
}

export interface MarketQuoteUpdate {
  index: number
  price: number
  bid: number
  ask: number
  bidSize: number
  askSize: number
  lastSize: number
  lastMove: number
  lastUpdatedAt: number
  high: number
  low: number
  volume: number
  turnover: number
  history?: Array<number>
}

export type MarketFeedCommand =
  | {
      type: 'start'
      rowCount: number
      running: boolean
      ticksPerSecond: number
      publishIntervalMs: number
      updateSparklines: boolean
      sparklineSampleIntervalMs: number
    }
  | { type: 'set-running'; running: boolean }
  | { type: 'set-rate'; ticksPerSecond: number }
  | { type: 'set-publish-interval'; intervalMs: number }
  | { type: 'set-sparklines'; enabled: boolean }
  | { type: 'set-sparkline-interval'; intervalMs: number }
  | { type: 'reset'; rowCount: number }
  | { type: 'burst'; tickCount: number }

export type MarketFeedEvent =
  | {
      type: 'snapshot'
      sessionId: number
      quotes: Array<MarketQuoteSnapshot>
    }
  | {
      type: 'updates'
      sessionId: number
      tickCount: number
      coalescedUpdateCount: number
      updates: Array<MarketQuoteUpdate>
    }
