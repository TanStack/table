import type {
  MarketQuoteSnapshot,
  MarketQuoteUpdate,
} from './market-feed-protocol'

const baseInstruments = [
  ['ALP', 'Alpine Systems', 'XNAS'],
  ['ARC', 'Arcadia Cloud', 'XNYS'],
  ['BLU', 'Blue River Energy', 'BATS'],
  ['CRN', 'Crown Robotics', 'XNAS'],
  ['DYN', 'Dynasty Networks', 'XNYS'],
  ['ECO', 'Ecoframe Materials', 'IEX'],
  ['FLX', 'Flux Semiconductors', 'XNAS'],
  ['GEO', 'Geode Analytics', 'BATS'],
  ['HLX', 'Helix Biotech', 'XNYS'],
  ['ION', 'Ion Mobility', 'IEX'],
  ['JDE', 'Jade Financial', 'XNYS'],
  ['KNT', 'Kinetic Aerospace', 'XNAS'],
] as const

export class MarketFeedEngine {
  #quotes: Array<MarketQuoteSnapshot> = []
  #random = createRandom(2_026)
  #rowCursor = 0
  #historyTick = 0
  #eventIndex = 0

  reset(count: number, seed: number): Array<MarketQuoteSnapshot> {
    const random = createRandom(seed)

    this.#quotes = Array.from({ length: count }, (_, index) => {
      const [baseSymbol, company, venue] =
        baseInstruments[index % baseInstruments.length]
      const series = Math.floor(index / baseInstruments.length)
      const symbol = series === 0 ? baseSymbol : `${baseSymbol}${series}`
      const open = roundPrice(20 + random() * 480)
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
        venue,
        open,
        price: open,
        bid: roundPrice(open - spread / 2),
        ask: roundPrice(open + spread / 2),
        bidSize: Math.floor(100 + random() * 25_000),
        askSize: Math.floor(100 + random() * 25_000),
        lastSize,
        lastMove: 0,
        lastUpdatedAt: Date.now(),
        volume,
        turnover: roundMoney(open * volume),
        history,
      }
    })

    this.#random = createRandom(2_026 + seed)
    this.#rowCursor = 0
    this.#historyTick = 0

    return this.#quotes.map((quote) => ({
      ...quote,
      history: [...quote.history],
    }))
  }

  applyEvents(
    eventCount: number,
    updateSparklines: boolean,
  ): Array<MarketQuoteUpdate> {
    if (this.#quotes.length === 0 || eventCount <= 0) return []

    const updatedAt = Date.now()
    const updatedQuotes = new Map<number, MarketQuoteUpdate>()
    const stride = 97

    this.#eventIndex = 0
    while (this.#eventIndex < eventCount) {
      this.#rowCursor = (this.#rowCursor + stride) % this.#quotes.length
      const quote = this.#quotes[this.#rowCursor]
      const shouldUpdateHistory =
        updateSparklines && this.#historyTick++ % 4 === 0

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
        volume: quote.volume,
        turnover: quote.turnover,
        ...(shouldUpdateHistory || previousUpdate?.history
          ? { history: [...quote.history] }
          : {}),
      })
      this.#eventIndex++
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
    const firstMix = Math.imul(
      stateValue ^ (stateValue >>> 15),
      stateValue | 1,
    )
    const secondMix =
      firstMix +
      Math.imul(firstMix ^ (firstMix >>> 7), firstMix | 61)
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
