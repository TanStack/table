import Component from '@glimmer/component'
import { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'
import { MarketFeedController } from '../feed/market-feed-controller'
import TradingShell from '../components/shell/trading-shell.gts'
import { registerCleanup } from '../utils/subscriptions'
import type Owner from '@ember/owner'

export default class Application extends Component {
  readonly feed = new MarketFeedController()
  readonly controller = new TradingBenchmarkController(this.feed)

  constructor(owner: Owner, args: object) {
    super(owner, args)
    const stopFeed = this.feed.start()
    const stopBenchmark = this.controller.start()
    registerCleanup(this, () => {
      stopBenchmark()
      stopFeed()
    })
  }

  <template><TradingShell @controller={{this.controller}} @feed={{this.feed}} /></template>
}
