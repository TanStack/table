import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { observeValue } from '../../utils/subscriptions'
import type Owner from '@ember/owner'
import type { TradingBenchmarkController, TradingBenchmarkState } from '../../benchmark/trading-benchmark-controller'

interface Signature { Args: { controller: TradingBenchmarkController } }
const rate = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const ms = (value: number): string => `${value.toFixed(2)} ms`

export default class MetricsStrip extends Component<Signature> {
  @tracked state: TradingBenchmarkState
  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args)
    this.state = args.controller.store.get()
    observeValue(this, args.controller.store, (state) => { this.state = state })
  }
  get items() {
    const metrics = this.state.metrics
    return [
      ['WORKER SAMPLES', rate.format(metrics.actualTicksPerSecond), 'generated samples/s', 'actual-rate'],
      ['ROW UPDATES', rate.format(metrics.rowUpdatesPerSecond), 'unique rows applied/s', 'row-update-rate'],
      ['MESSAGES', metrics.workerMessagesPerSecond.toFixed(1), 'worker messages/s', 'message-rate'],
      ['STATE APPLIES', metrics.stateApplicationsPerSecond.toFixed(1), 'quote snapshots/s', 'state-apply-rate'],
      ['TABLE COMMITS', metrics.tableRendersPerSecond.toFixed(1), 'completed renders/s', 'table-render-rate'],
      ['AVG RENDER', ms(metrics.averageRenderMs), 'mutation → render', ''],
      ['P95 RENDER', ms(metrics.p95RenderMs), `max ${ms(metrics.maxRenderMs)}`, ''],
      ['LONG FRAMES', this.state.longAnimationFramesSupported ? String(metrics.longAnimationFrames) : 'N/A', this.state.longAnimationFramesSupported ? `worst ${ms(metrics.worstLongAnimationFrameMs)}` : 'unsupported', 'long-frame-count'],
    ] as const
  }
  <template>
    <section class='metrics-strip' aria-label='Live performance metrics'>
      {{#each this.items as |item|}}
        <article><span>{{item.[0]}}</span><strong data-testid={{or item.[3] undefined}}>{{item.[1]}}</strong><small>{{item.[2]}}</small></article>
      {{/each}}
    </section>
  </template>
}

const or = <T,>(left: T, right: T): T => left || right
