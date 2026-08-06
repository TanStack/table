export interface MarketQuoteSnapshot {
  id: string
  symbol: string
  company: string
  venue: string
  open: number
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
  volume: number
  turnover: number
  history?: Array<number>
}

export type MarketFeedCommand =
  | {
      type: 'initialize'
      rowCount: number
      seed: number
      running: boolean
      targetEventsPerSecond: number
      updateSparklines: boolean
    }
  | {
      type: 'configure'
      running?: boolean
      targetEventsPerSecond?: number
      updateSparklines?: boolean
    }
  | { type: 'reset'; rowCount: number; seed: number }
  | { type: 'burst'; eventCount: number }
  | { type: 'ack'; generation: number; sequence: number }

export type MarketFeedEvent =
  | {
      type: 'ready'
      generation: number
      quotes: Array<MarketQuoteSnapshot>
    }
  | {
      type: 'batch'
      generation: number
      sequence: number
      eventCount: number
      updates: Array<MarketQuoteUpdate>
    }
