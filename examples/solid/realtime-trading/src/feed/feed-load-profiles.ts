export type FeedLoadProfile =
  | 'low'
  | 'medium'
  | 'high'
  | 'very-high'
  | 'max'
  | 'custom'

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
