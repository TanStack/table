import type { MarketQuote } from './market-data'

export type FeedLoadProfile =
  'low' | 'medium' | 'high' | 'very-high' | 'max' | 'custom'

export type RowWorkloadMode =
  'stable' | 'price-sort' | 'rotating-filter' | 'identity-churn'

export const feedLoadRates: Record<
  Exclude<FeedLoadProfile, 'custom'>,
  number
> = {
  low: 1_000,
  medium: 5_000,
  high: 10_000,
  'very-high': 25_000,
  max: 100_000,
}

export function deriveBenchmarkQuotes(
  quotes: Array<MarketQuote>,
  mode: RowWorkloadMode,
  epoch: number,
): Array<MarketQuote> {
  if (mode === 'stable') {
    return quotes
  }

  if (mode === 'price-sort') {
    return [...quotes].sort(
      (left, right) =>
        right.price - left.price || left.symbol.localeCompare(right.symbol),
    )
  }

  if (mode === 'rotating-filter') {
    const excludedBucket = epoch % 5
    return quotes.filter((_, index) => index % 5 !== excludedBucket)
  }

  const replacementBucket = epoch % 10
  return quotes.map((quote, index) =>
    index % 10 === replacementBucket
      ? {
          ...quote,
          id: `${quote.id}-replacement-${epoch}`,
          symbol: `${quote.symbol}R${epoch % 100}`,
          company: `${quote.company} replacement`,
        }
      : quote,
  )
}

export function rowWorkloadLabel(mode: RowWorkloadMode): string {
  switch (mode) {
    case 'price-sort':
      return 'PRICE REORDER'
    case 'rotating-filter':
      return 'FILTER ROTATION'
    case 'identity-churn':
      return 'TICKER REPLACEMENT'
    default:
      return 'STABLE UNIVERSE'
  }
}
