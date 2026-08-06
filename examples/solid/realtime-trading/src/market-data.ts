import type {
  MarketQuoteSnapshot,
  MarketQuoteUpdate,
} from './market-feed-protocol'

export interface MarketQuote extends Omit<MarketQuoteSnapshot, 'history'> {
  history: ReadonlyArray<number>
}

export function hydrateMarketQuotes(
  snapshots: Array<MarketQuoteSnapshot>,
): Array<MarketQuote> {
  return snapshots.map((quote) => ({
    ...quote,
    history: [...quote.history],
  }))
}

export function applyMarketUpdates(
  quotes: Array<MarketQuote>,
  updates: Array<MarketQuoteUpdate>,
): Array<MarketQuote> {
  const nextQuotes = [...quotes]

  for (const update of updates) {
    const { index, history, ...values } = update
    const previousQuote = quotes.at(index)
    if (!previousQuote) continue

    nextQuotes[index] = {
      ...previousQuote,
      ...values,
      history: history ?? previousQuote.history,
    }
  }

  return nextQuotes
}
