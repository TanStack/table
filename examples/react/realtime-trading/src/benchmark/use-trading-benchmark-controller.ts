import { useEffect, useRef } from 'react'
import { TradingBenchmarkController } from './trading-benchmark-controller'
import type { MarketFeedController } from '../feed/market-feed-controller'

export function useTradingBenchmarkController(feed: MarketFeedController) {
  'use no memo'
  const controllerRef = useRef<TradingBenchmarkController | null>(null)
  controllerRef.current ??= new TradingBenchmarkController(feed)
  const controller = controllerRef.current

  useEffect(() => controller.start(), [controller])

  return controller
}

export type { TradingBenchmarkController } from './trading-benchmark-controller'
