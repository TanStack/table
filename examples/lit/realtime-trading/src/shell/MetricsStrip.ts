import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { ControllerElement } from './controller-element'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

const rate = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const ms = (value: number) => `${value.toFixed(2)} ms`
@customElement('trading-metrics-strip')
export class MetricsStrip extends ControllerElement {
  @property({ attribute: false }) controller!: TradingBenchmarkController
  protected firstUpdated() {
    this.observe(this.controller.store)
  }
  protected render() {
    const state = this.controller.store.get()
    const metrics = state.metrics
    const items = [
      [
        'FRAME RATE (EST.)',
        metrics.rafCallbacksPerSecond.toFixed(1),
        'rAF callbacks/s · rolling 1 s',
        'frame-rate',
      ],
      [
        'AVG COMMIT',
        ms(metrics.averageCommitLatencyMs),
        'snapshot → DOM · rolling 3 s',
        'average-commit-latency',
      ],
      [
        'LONG FRAMES',
        state.longAnimationFramesSupported
          ? String(metrics.longAnimationFrames)
          : 'N/A',
        state.longAnimationFramesSupported
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
    return html`<section class="metrics-strip" aria-labelledby="live-health">
      <h2 id="live-health">LIVE HEALTH</h2>
      ${repeat(
        items,
        (item) => item[0],
        (item) =>
          html`<article>
            <span>${item[0]}</span
            ><strong data-testid=${item[3]}>${item[1]}</strong
            ><small>${item[2]}</small>
          </article>`,
      )}
    </section>`
  }
}
