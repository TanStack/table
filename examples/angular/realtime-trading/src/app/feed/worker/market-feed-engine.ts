import { globalInstruments } from '../market-instruments'
import type {
  MarketQuoteSnapshot,
  MarketQuoteUpdate,
} from './market-feed-protocol'

const INITIAL_MARKET_SEED = 0x4d41524b
const LIVE_FEED_SEED = 0x5449434b

export class MarketFeedEngine {
  #quotes: Array<MarketQuoteSnapshot> = []
  #lastHistorySampledAt = new Uint32Array(0)
  #random = createRandom(2_026)
  #rowCursor = 0
  #tickIndex = 0

  reset(count: number): Array<MarketQuoteSnapshot> {
    const random = createRandom(INITIAL_MARKET_SEED ^ count)
    const createdAt = Date.now()

    this.#quotes = Array.from({ length: count }, (_, index) => {
      const [baseSymbol, company, market] =
        globalInstruments[index % globalInstruments.length]
      const series = Math.floor(index / globalInstruments.length)
      const symbol = series === 0 ? baseSymbol : `${baseSymbol}${series}`
      const previousClose = roundPrice(20 + random() * 480)
      const open = roundPrice(previousClose * (1 + (random() - 0.5) * 0.016))
      const spread = Math.max(0.01, open * (0.0002 + random() * 0.0004))
      const history = Array.from({ length: 24 }, (_, historyIndex) =>
        roundPrice(
          open *
            (1 + Math.sin(historyIndex / 4) * 0.002 + (random() - 0.5) * 0.001),
        ),
      )
      const volume = Math.floor(50_000 + random() * 2_000_000)
      const lastSize = Math.floor(10 + random() * 5_000)

      return {
        id: `instrument-${index}`,
        symbol,
        company,
        venue: market,
        previousClose,
        open,
        high: open,
        low: open,
        price: open,
        bid: roundPrice(open - spread / 2),
        ask: roundPrice(open + spread / 2),
        bidSize: Math.floor(100 + random() * 25_000),
        askSize: Math.floor(100 + random() * 25_000),
        lastSize,
        lastMove: 0,
        lastUpdatedAt: createdAt,
        volume,
        turnover: roundMoney(open * volume),
        history,
      }
    })

    this.#random = createRandom(LIVE_FEED_SEED ^ count)
    this.#rowCursor = 0
    this.#lastHistorySampledAt = new Uint32Array(count)
    this.#lastHistorySampledAt.fill(createdAt >>> 0)

    return this.#quotes.map((quote) => ({
      ...quote,
      history: [...quote.history],
    }))
  }

  applyTicks(
    tickCount: number,
    updateSparklines: boolean,
    sparklineSampleIntervalMs: number,
  ): Array<MarketQuoteUpdate> {
    if (this.#quotes.length === 0 || tickCount <= 0) return []

    const updatedAt = Date.now()
    const sampledAt = updatedAt >>> 0
    const sampleIntervalMs = Math.max(16, sparklineSampleIntervalMs)
    const updatedQuotes = new Map<number, MarketQuoteUpdate>()
    const stride = 97

    this.#tickIndex = 0
    while (this.#tickIndex < tickCount) {
      this.#rowCursor = (this.#rowCursor + stride) % this.#quotes.length
      const quote = this.#quotes[this.#rowCursor]
      const lastSampledAt = this.#lastHistorySampledAt[this.#rowCursor]
      const shouldUpdateHistory =
        updateSparklines &&
        (sampledAt - lastSampledAt) >>> 0 >= sampleIntervalMs

      if (shouldUpdateHistory) {
        this.#lastHistorySampledAt[this.#rowCursor] = sampledAt
      }

      this.#applyTick(quote, shouldUpdateHistory, updatedAt)

      const previousUpdate = updatedQuotes.get(this.#rowCursor)
      updatedQuotes.set(this.#rowCursor, {
        index: this.#rowCursor,
        price: quote.price,
        bid: quote.bid,
        ask: quote.ask,
        bidSize: quote.bidSize,
        askSize: quote.askSize,
        lastSize: quote.lastSize,
        lastMove: quote.lastMove,
        lastUpdatedAt: quote.lastUpdatedAt,
        high: quote.high,
        low: quote.low,
        volume: quote.volume,
        turnover: quote.turnover,
        ...(shouldUpdateHistory || previousUpdate?.history
          ? { history: [...quote.history] }
          : {}),
      })
      this.#tickIndex++
    }

    return [...updatedQuotes.values()]
  }

  #applyTick(
    quote: MarketQuoteSnapshot,
    updateHistory: boolean,
    updatedAt: number,
  ): void {
    const previousPrice = quote.price
    const volatility = 0.00015 + this.#random() * 0.0012
    const move = previousPrice * (this.#random() - 0.495) * volatility
    const nextPrice = roundPrice(Math.max(0.1, previousPrice + move))
    const spread = Math.max(
      0.01,
      nextPrice * (0.00015 + this.#random() * 0.0005),
    )

    quote.lastMove = nextPrice - previousPrice
    quote.price = nextPrice
    quote.high = Math.max(quote.high, nextPrice)
    quote.low = Math.min(quote.low, nextPrice)
    quote.bid = roundPrice(nextPrice - spread / 2)
    quote.ask = roundPrice(nextPrice + spread / 2)
    quote.bidSize = Math.floor(100 + this.#random() * 25_000)
    quote.askSize = Math.floor(100 + this.#random() * 25_000)
    quote.lastSize = Math.floor(10 + this.#random() * 5_000)
    quote.lastUpdatedAt = updatedAt
    quote.volume += quote.lastSize
    quote.turnover = roundMoney(quote.turnover + nextPrice * quote.lastSize)

    if (updateHistory) {
      quote.history = [...quote.history.slice(-23), nextPrice]
    }
  }
}

function createRandom(seed: number): () => number {
  const runtime = { state: seed >>> 0 }
  return () => {
    runtime.state += 0x6d2b79f5
    const stateValue = runtime.state
    const firstMix = Math.imul(stateValue ^ (stateValue >>> 15), stateValue | 1)
    const secondMix =
      firstMix + Math.imul(firstMix ^ (firstMix >>> 7), firstMix | 61)
    const value = firstMix ^ secondMix
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296
  }
}

function roundPrice(value: number): number {
  return Math.round(value * 100) / 100
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}
