import { inject, provide } from 'vue'
import type { InjectionKey } from 'vue'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

interface TradingControllers {
  benchmark: TradingBenchmarkController
  feed: MarketFeedController
}

const tradingControllersKey: InjectionKey<TradingControllers> = Symbol(
  'trading-controllers',
)

export function provideTradingControllers(
  benchmark: TradingBenchmarkController,
): void {
  provide(tradingControllersKey, { benchmark, feed: benchmark.feed })
}

export function useTradingShellController(): TradingBenchmarkController {
  const controllers = inject(tradingControllersKey)
  if (!controllers) throw new Error('Missing trading controllers')
  return controllers.benchmark
}

export function useMarketFeedController(): MarketFeedController {
  const controllers = inject(tradingControllersKey)
  if (!controllers) throw new Error('Missing trading controllers')
  return controllers.feed
}
