<script lang="ts">
  import { onMount } from 'svelte'
  import { TradingBenchmarkController } from './benchmark/trading-benchmark-controller'
  import { MarketFeedController } from './feed/market-feed-controller'
  import TradingShell from './shell/TradingShell.svelte'
  import { provideTradingControllers } from './shell/trading-shell-context'
  import TradingTable from './table/TradingTable.svelte'

  const feed = new MarketFeedController()
  const benchmark = new TradingBenchmarkController(feed)
  provideTradingControllers(benchmark)

  onMount(() => {
    const stopFeed = feed.start()
    const stopBenchmark = benchmark.start()
    return () => { stopBenchmark(); stopFeed() }
  })
</script>

<TradingShell><TradingTable /></TradingShell>
