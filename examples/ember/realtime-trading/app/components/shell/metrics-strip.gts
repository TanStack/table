import Component from '@glimmer/component'
import type { TradingBenchmarkController } from '../../benchmark/trading-benchmark-controller'

interface Signature {
  Args: { controller: TradingBenchmarkController }
}
const rate = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const ms = (value: number): string => `${value.toFixed(2)} ms`

export default class MetricsStrip extends Component<Signature> {
  get items() {
    const metrics = this.args.controller.metrics
    return [
      [
        'FRAME RATE (EST.)',
        metrics.rafCallbacksPerSecond.toFixed(1),
        'rAF callbacks/s · rolling 1 s',
        'frame-rate',
      ],
      [
        'AVG COMMIT',
        ms(metrics.averageRenderMs),
        'snapshot → DOM · rolling 3 s',
        'average-commit-latency',
      ],
      [
        'LONG FRAMES',
        this.args.controller.longAnimationFramesSupported
          ? String(metrics.longAnimationFrames)
          : 'N/A',
        this.args.controller.longAnimationFramesSupported
          ? `since reset · worst ${ms(metrics.worstLongAnimationFrameMs)}`
          : 'unsupported',
        'long-frame-count',
      ],
      [
        'THROUGHPUT',
        `${rate.format(metrics.rowUpdatesPerSecond)} rows/s`,
        `${metrics.stateApplicationsPerSecond.toFixed(1)} snapshots/s · rows deduplicated per snapshot`,
        'throughput-rate',
      ],
    ] as const
  }
  <template>
    <section class='metrics-strip' aria-labelledby='live-health'>
      <h2 id='live-health'>LIVE HEALTH</h2>
      {{#each this.items as |item|}}
        <article><span>{{item.[0]}}</span><strong
            data-testid={{or item.[3] undefined}}
          >{{item.[1]}}</strong><small>{{item.[2]}}</small></article>
      {{/each}}
    </section>
  </template>
}

const or = <T,>(left: T, right: T): T => left || right
