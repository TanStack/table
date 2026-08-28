import { getContext, setContext } from 'svelte'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

interface TradingControllers {
  benchmark: TradingBenchmarkController
  feed: MarketFeedController
}

const tradingControllersKey = Symbol('trading-controllers')

export function provideTradingControllers(
  benchmark: TradingBenchmarkController,
): void {
  setContext<TradingControllers>(tradingControllersKey, {
    benchmark,
    feed: benchmark.feed,
  })
}

export function useTradingShellController(): TradingBenchmarkController {
  const controllers = getContext<TradingControllers | undefined>(
    tradingControllersKey,
  )
  if (!controllers) throw new Error('Missing trading controllers')
  return controllers.benchmark
}

export function useMarketFeedController(): MarketFeedController {
  const controllers = getContext<TradingControllers | undefined>(
    tradingControllersKey,
  )
  if (!controllers) throw new Error('Missing trading controllers')
  return controllers.feed
}
