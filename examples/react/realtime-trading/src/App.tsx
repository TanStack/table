import { Profiler } from 'react'
import { useTradingBenchmarkController } from './core/use-trading-benchmark-controller'
import { TradingShell } from './shell/TradingShell'
import {
  TradingShellProvider,
  useTradingShellController,
  useTradingShellState,
} from './shell/trading-shell-context'
import {
  LocalTradingTable,
  V8TradingTable,
} from './trading-table'

export function App() {
  const controller = useTradingBenchmarkController()
  return (
    <TradingShellProvider controller={controller}>
      <TradingShell>
        <TradingTableOutlet />
      </TradingShell>
    </TradingShellProvider>
  )
}

function TradingTableOutlet() {
  const controller = useTradingShellController()
  const tableAdapter = useTradingShellState((state) => state.tableAdapter)
  const ActiveTradingTable =
    tableAdapter === 'local'
      ? LocalTradingTable
      : V8TradingTable

  return (
    <Profiler
      id={`trading-table-${tableAdapter}`}
      onRender={controller.monitor.recordProfilerRender}
    >
      <ActiveTradingTable key={tableAdapter} />
    </Profiler>
  )
}
