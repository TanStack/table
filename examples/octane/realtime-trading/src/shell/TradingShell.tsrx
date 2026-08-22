import { useEffect, useState } from 'octane'
import { AppHeader } from './AppHeader.tsrx'
import { Configurator } from './Configurator.tsrx'
import { MarketStatusbar } from './MarketStatusbar.tsrx'
import { TradingTable } from '../table/TradingTable.tsrx'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

export function TradingShell(props: {
  controller: TradingBenchmarkController
  feed: MarketFeedController
}) @{
  const [sidebarOpen, setSidebarOpen] = useState(true)
  useEffect(() => {
    const stopFeed = props.feed.start()
    const stopBenchmark = props.controller.start()
    return () => {
      stopBenchmark()
      stopFeed()
    }
  }, [props.controller, props.feed])

  <main className={`trading-terminal${sidebarOpen ? '' : ' is-sidebar-collapsed'}`}>
    <div className="shell-header">
      <AppHeader feed={props.feed} sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen((open) => !open)} />
      {import.meta.env.DEV && <aside className="development-warning">DEV BUILD — use the production build before recording results.</aside>}
    </div>
    <section className="market-panel" aria-label="Live synthetic quotes">
      <TradingTable controller={props.controller} feed={props.feed} />
    </section>
    <MarketStatusbar controller={props.controller} />
    <div className="sidebar-slot">
      {sidebarOpen && <Configurator controller={props.controller} feed={props.feed} />}
    </div>
  </main>
}
