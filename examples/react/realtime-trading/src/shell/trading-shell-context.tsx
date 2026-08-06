import { createStoreContext, useSelector } from '@tanstack/react-store'
import type { ReactNode } from 'react'
import type { TradingBenchmarkController } from '../core/use-trading-benchmark-controller'
import type {
  TradingBenchmarkState,
} from '../core/trading-benchmark-controller'
import type { UseSelectorOptions } from '@tanstack/react-store'

const {
  StoreProvider: TradingStoreProvider,
  useStoreContext: useTradingShellController,
} = createStoreContext<TradingBenchmarkController>()

export function TradingShellProvider(props: {
  controller: TradingBenchmarkController
  children: ReactNode
}) {
  return (
    <TradingStoreProvider value={props.controller}>
      {props.children}
    </TradingStoreProvider>
  )
}

export { useTradingShellController }

export function useTradingShellState<TSelected>(
  selector: (state: TradingBenchmarkState) => TSelected,
  options?: UseSelectorOptions<TSelected>,
): TSelected {
  const controller = useTradingShellController()
  return useSelector(controller.store, selector, options)
}
