import type { MarketQuote } from '../../feed/market-data'

export function getDayChange(quote: MarketQuote): number {
  return quote.price - quote.previousClose
}

export function getDayChangePercent(quote: MarketQuote): number {
  return quote.previousClose === 0
    ? 0
    : (getDayChange(quote) / quote.previousClose) * 100
}
