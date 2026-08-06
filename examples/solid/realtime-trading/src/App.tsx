import { Match, Switch } from 'solid-js'
import { createTradingBenchmarkController } from './core/trading-benchmark-controller'
import { TradingShell } from './shell/TradingShell'
import {
  TradingShellProvider,
  useTradingShellController,
} from './shell/trading-shell-context'
import {
  LocalTradingTable,
  V8TradingTable,
} from './trading-table'

export default function App() {
  const controller = createTradingBenchmarkController()
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
    <Switch>
      <Match when={state.tableAdapter() === 'local'}>
        <LocalTradingTable
          quotes={state.displayQuotes()}
          rendererMode={state.rendererMode()}
          updateQuoteAges={state.updateQuoteAges()}
          quoteClock={state.quoteClock()}
          selectedSymbol={state.selectedSymbol()}
          onSelectSymbol={actions.selectSymbol}
        />
      </Match>
      <Match when={state.tableAdapter() === 'v8'}>
        <V8TradingTable
          quotes={state.displayQuotes()}
          rendererMode={state.rendererMode()}
          updateQuoteAges={state.updateQuoteAges()}
          quoteClock={state.quoteClock()}
          selectedSymbol={state.selectedSymbol()}
          onSelectSymbol={actions.selectSymbol}
        />
      </Match>
    </Switch>
  )
}
