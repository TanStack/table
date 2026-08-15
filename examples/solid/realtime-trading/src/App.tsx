import { createTradingBenchmarkController } from './benchmark/trading-benchmark-controller'
import { createMarketFeedController } from './feed/market-feed-controller'
import { TradingShell } from './shell/TradingShell'
import {
  TradingShellProvider,
  useTradingShellController,
} from './shell/trading-shell-context'
import { TradingTable } from './table/trading-table'

export default function App() {
  const feed = createMarketFeedController()
  const controller = createTradingBenchmarkController(feed)
  return (
    <TradingShellProvider controller={controller}>
      <TradingShell>
        <TradingTableOutlet />
      </TradingShell>
    </TradingShellProvider>
  )
}

function TradingTableOutlet() {
  const { state, actions } = useTradingShellController()
  return (
    <TradingTable
      quotes={state.displayQuotes()}
      rendererMode={state.rendererMode()}
      selectedSymbol={state.selectedSymbol()}
      onSelectSymbol={actions.selectSymbol}
    />
  )
}
