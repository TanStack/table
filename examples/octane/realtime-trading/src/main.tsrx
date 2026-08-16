import { createRoot } from 'octane'
import { TradingBenchmarkController } from './benchmark/trading-benchmark-controller'
import { MarketFeedController } from './feed/market-feed-controller'
import { TradingShell } from './shell/TradingShell.tsrx'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const feed = new MarketFeedController()
const controller = new TradingBenchmarkController(feed)
createRoot(rootElement).render(() => <TradingShell controller={controller} feed={feed} />)
