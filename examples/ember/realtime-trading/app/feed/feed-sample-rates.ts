export const feedSampleRateOptions = [
  { label: '100', value: 100 },
  { label: '250', value: 250 },
  { label: '500', value: 500 },
  { label: '1K', value: 1_000 },
  { label: '2.5K', value: 2_500 },
  { label: '5K', value: 5_000 },
  { label: '10K', value: 10_000 },
  { label: '25K', value: 25_000 },
  { label: '50K', value: 50_000 },
  { label: '100K', value: 100_000 },
] as const

export function feedSampleRateIndex(rate: number): number {
  return feedSampleRateOptions.reduce((closestIndex, candidate, index) => {
    const closest = feedSampleRateOptions[closestIndex]!
    return Math.abs(candidate.value - rate) < Math.abs(closest.value - rate)
      ? index
      : closestIndex
  }, 0)
}

export function feedSampleRateAt(stepIndex: number): number {
  const index = Math.min(
    feedSampleRateOptions.length - 1,
    Math.max(0, Math.round(stepIndex)),
  )
  return feedSampleRateOptions[index]!.value
}

export function normalizeFeedSampleRate(rate: number): number {
  return feedSampleRateAt(feedSampleRateIndex(rate))
}
