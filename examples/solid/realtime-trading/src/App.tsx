import { createTradingBenchmarkController } from './benchmark/trading-benchmark-controller'
import { createMarketFeedController } from './feed/market-feed-controller'
import { TradingShell } from './shell/TradingShell'
import {
  TradingShellProvider,
  useMarketFeedController,
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
  const feed = useMarketFeedController()
  return (
    <TradingTable
      quotes={feed.state.quotes()}
      rendererMode={state.rendererMode()}
      selectedSymbol={state.selectedSymbol()}
      virtualScrollMode={state.virtualScrollMode()}
      onSelectSymbol={actions.selectSymbol}
      onRenderedRowCount={actions.setRenderedRowCount}
    />
  )
}
