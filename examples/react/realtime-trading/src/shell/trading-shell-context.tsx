import { createStoreContext, useSelector } from '@tanstack/react-store'
import type { ReactNode } from 'react'
import type {
  MarketFeedController,
  MarketFeedState,
} from '../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../benchmark/use-trading-benchmark-controller'
import type { TradingBenchmarkState } from '../benchmark/trading-benchmark-controller'
import type { UseSelectorOptions } from '@tanstack/react-store'

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
  children: ReactNode
}) {
  return (
    <MarketFeedStoreProvider value={props.controller}>
      {props.children}
    </MarketFeedStoreProvider>
  )
}

export function TradingShellProvider(props: {
  controller: TradingBenchmarkController
  children: ReactNode
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

export function useMarketFeedState<TSelected>(
  selector: (state: MarketFeedState) => TSelected,
  options?: UseSelectorOptions<TSelected>,
): TSelected {
  const controller = useMarketFeedController()
  return useSelector(controller.store, selector, options)
}
