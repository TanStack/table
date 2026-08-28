import Component from '@glimmer/component'
import type { TradingBenchmarkController } from '../../benchmark/trading-benchmark-controller'

interface Signature {
  Args: { controller: TradingBenchmarkController }
}
const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

export default class MarketStatusbar extends Component<Signature> {
  get metrics() {
    return this.args.controller.metrics
  }
  get mountedCells() {
    return this.args.controller.mountedCells
  }
  get liveComponents() {
    return this.args.controller.liveComponents
  }
  <template>
    <footer class='market-statusbar'>
      <span>MESSAGE SAMPLES
        <strong>{{format this.metrics.lastBatchSize}}</strong></span>
      <span>CHANGED ROWS
        <strong>{{format this.metrics.lastUpdateCount}}</strong></span>
      <span>HOSTS <strong>{{format this.mountedCells}}</strong></span>
      <span>COMPONENTS
        <strong>{{format this.liveComponents}}</strong></span>
    </footer>
  </template>
}
const format = (value: number): string => integer.format(value)
