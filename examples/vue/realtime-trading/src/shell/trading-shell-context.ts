import { inject, provide } from 'vue'
import { useSelector } from '@tanstack/vue-store'
import type { InjectionKey } from 'vue'
import type {
  MarketFeedController,
  MarketFeedState,
} from '../feed/market-feed-controller'
import type {
  TradingBenchmarkController,
  TradingBenchmarkState,
} from '../benchmark/trading-benchmark-controller'

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

export function useTradingShellState<TSelected>(
  selector: (state: TradingBenchmarkState) => TSelected,
) {
  return useSelector(useTradingShellController().store, selector)
}

export function useMarketFeedState<TSelected>(
  selector: (state: MarketFeedState) => TSelected,
) {
  return useSelector(useMarketFeedController().store, selector)
}
