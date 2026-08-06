import { shallow } from '@tanstack/react-store'
import { useTableBenchmark } from '../benchmark/use-table-benchmark'
import {
  useTradingShellController,
  useTradingShellState,
} from '../shell/trading-shell-context'

export function useV9TradingTableRuntime(adapter: 'local') {
  const controller = useTradingShellController()
  const quotes = useTradingShellState((state) => state.displayQuotes)
  const scrollStressMode = useTradingShellState(
    (state) => state.scrollStressMode,
  )

  useTableBenchmark(controller, adapter, scrollStressMode)

  return {
    quotes,
    tableAtoms: controller.tableAtoms,
  }
}

export function useV8TradingTableRuntime() {
  const controller = useTradingShellController()
  const state = useTradingShellState(
    (storeState) => ({
      quotes: storeState.displayQuotes,
      coreRowModelMode: storeState.coreRowModelMode,
      coreFilterValue: storeState.coreFilterValue,
    }),
    { compare: shallow },
  )
  const scrollStressMode = useTradingShellState(
    (storeState) => storeState.scrollStressMode,
  )

  useTableBenchmark(controller, 'v8', scrollStressMode)

  return state
}
