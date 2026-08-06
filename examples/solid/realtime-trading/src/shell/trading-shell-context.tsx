import { createContext, useContext } from 'solid-js'
import type { JSX } from 'solid-js'
import type { TradingBenchmarkController } from '../core/trading-benchmark-controller'

const TradingShellContext = createContext<TradingBenchmarkController>()

export function TradingShellProvider(props: {
  controller: TradingBenchmarkController
  children: JSX.Element
}) {
  return (
    <TradingShellContext.Provider value={props.controller}>
      {props.children}
    </TradingShellContext.Provider>
  )
}

export function useTradingShellController(): TradingBenchmarkController {
  const controller = useContext(TradingShellContext)
  if (!controller) {
    throw new Error(
      'Trading shell components must be rendered inside TradingShellProvider',
    )
  }
  return controller
}
