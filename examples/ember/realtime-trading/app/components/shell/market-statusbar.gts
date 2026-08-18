import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { observeValue } from '../../utils/subscriptions'
import type Owner from '@ember/owner'
import type {
  TradingBenchmarkController,
  TradingBenchmarkState,
} from '../../benchmark/trading-benchmark-controller'

interface Signature {
  Args: { controller: TradingBenchmarkController }
}
const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

export default class MarketStatusbar extends Component<Signature> {
  @tracked state: TradingBenchmarkState
  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args)
    this.state = args.controller.store.get()
    observeValue(this, args.controller.store, (state) => {
      this.state = state
    })
  }
  <template>
    <footer class='market-statusbar'>
      <span>MESSAGE SAMPLES
        <strong>{{format this.state.metrics.lastBatchSize}}</strong></span>
      <span>ROW UPDATES
        <strong>{{format this.state.metrics.lastUpdateCount}}</strong></span>
      <span>HOSTS <strong>{{format this.state.mountedCells}}</strong></span>
      <span>COMPONENTS
        <strong>{{format this.state.liveComponents}}</strong></span>
    </footer>
  </template>
}
const format = (value: number): string => integer.format(value)
