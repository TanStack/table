export interface MarketFeedConfig {
  readonly instrumentCount: number
  readonly targetSamplesPerSecond: number
  readonly publishIntervalMs: number
  readonly updateSparklines: boolean
  readonly sparklineSampleIntervalMs: number
}

export const initialMarketFeedConfig: MarketFeedConfig = {
  instrumentCount: 100,
  targetSamplesPerSecond: 10_000,
  publishIntervalMs: 20,
  updateSparklines: true,
  sparklineSampleIntervalMs: 16,
}
