import { createTradingBenchmarkController } from './benchmark/trading-benchmark-controller'
import { createMarketFeedController } from './feed/market-feed-controller'
import { TradingShell } from './shell/TradingShell'
import { TradingShellProvider } from './shell/trading-shell-context'
import { TradingTable } from './table/trading-table'

export default function App() {
  const feed = createMarketFeedController()
  const controller = createTradingBenchmarkController(feed)
  return (
    <TradingShellProvider controller={controller}>
      <TradingShell>
        <TradingTable />
      </TradingShell>
    </TradingShellProvider>
  )
}
