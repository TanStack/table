import { useEffect, useState } from 'preact/hooks'
import { TradingBenchmarkController } from './trading-benchmark-controller'
import type { MarketFeedController } from '../feed/market-feed-controller'

export function useTradingBenchmarkController(feed: MarketFeedController) {
  const [controller] = useState(() => new TradingBenchmarkController(feed))

  useEffect(() => controller.start(), [controller])

  return controller
}

export type { TradingBenchmarkController } from './trading-benchmark-controller'
