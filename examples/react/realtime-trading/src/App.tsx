import { Profiler } from 'react'
import { useMarketFeedController } from './feed/use-market-feed-controller'
import { useTradingBenchmarkController } from './benchmark/use-trading-benchmark-controller'
import { TradingShell } from './shell/TradingShell'
import {
  TradingShellProvider,
  useTradingShellController,
} from './shell/trading-shell-context'
import { TradingTable } from './table/trading-table'

export function App() {
  const feed = useMarketFeedController()
  const controller = useTradingBenchmarkController(feed)
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

  return (
    <Profiler
      id="trading-table"
      onRender={controller.monitor.recordProfilerRender}
    >
      <TradingTable />
    </Profiler>
  )
}
