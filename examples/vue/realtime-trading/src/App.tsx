import { defineComponent, onBeforeUnmount } from 'vue'
import { TradingBenchmarkController } from './benchmark/trading-benchmark-controller'
import { MarketFeedController } from './feed/market-feed-controller'
import { TradingShell } from './shell/TradingShell'
import { provideTradingControllers } from './shell/trading-shell-context'
import { TradingTable } from './table/trading-table'

export const App = defineComponent({
  name: 'RealtimeTradingApp',
  setup() {
    const feed = new MarketFeedController()
    const benchmark = new TradingBenchmarkController(feed)
    provideTradingControllers(benchmark)

    const stopFeed = feed.start()
    const stopBenchmark = benchmark.start()
    onBeforeUnmount(() => {
      stopBenchmark()
      stopFeed()
    })

    return () => (
      <TradingShell>
        {{ default: () => <TradingTable /> }}
      </TradingShell>
    )
  },
})
