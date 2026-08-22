import { createStoreContext, useSelector } from '@tanstack/preact-store'
import type { ComponentChildren } from 'preact'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../benchmark/use-trading-benchmark-controller'
import type { TradingBenchmarkState } from '../benchmark/trading-benchmark-controller'
import type { UseSelectorOptions } from '@tanstack/preact-store'

const {
  StoreProvider: TradingStoreProvider,
  useStoreContext: useTradingShellController,
} = createStoreContext<TradingBenchmarkController>()

const {
  StoreProvider: MarketFeedStoreProvider,
  useStoreContext: useMarketFeedController,
} = createStoreContext<MarketFeedController>()

export function MarketFeedProvider(props: {
  controller: MarketFeedController
  children: ComponentChildren
}) {
  return (
    <MarketFeedStoreProvider value={props.controller}>
      {props.children}
    </MarketFeedStoreProvider>
  )
}

export function TradingShellProvider(props: {
  controller: TradingBenchmarkController
  children: ComponentChildren
}) {
  return (
    <MarketFeedProvider controller={props.controller.feed}>
      <TradingStoreProvider value={props.controller}>
        {props.children}
      </TradingStoreProvider>
    </MarketFeedProvider>
  )
}

export { useMarketFeedController, useTradingShellController }

export function useTradingShellState<TSelected>(
  selector: (state: TradingBenchmarkState) => TSelected,
  options?: UseSelectorOptions<TSelected>,
): TSelected {
  const controller = useTradingShellController()
  return useSelector(controller.store, selector, options)
}
