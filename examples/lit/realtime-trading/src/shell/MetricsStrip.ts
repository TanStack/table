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
        'WORKER SAMPLES',
        rate.format(metrics.actualTicksPerSecond),
        'generated samples/s',
        'actual-rate',
      ],
      [
        'ROW UPDATES',
        rate.format(metrics.rowUpdatesPerSecond),
        'unique rows applied/s',
        'row-update-rate',
      ],
      [
        'MESSAGES',
        metrics.workerMessagesPerSecond.toFixed(1),
        'worker messages/s',
        'message-rate',
      ],
      [
        'STATE APPLIES',
        metrics.stateApplicationsPerSecond.toFixed(1),
        'quote snapshots/s',
        'state-apply-rate',
      ],
      [
        'TABLE COMMITS',
        metrics.tableRendersPerSecond.toFixed(1),
        'completed renders/s',
        'table-render-rate',
      ],
      ['AVG RENDER', ms(metrics.averageRenderMs), 'mutation → render', ''],
      [
        'P95 RENDER',
        ms(metrics.p95RenderMs),
        `max ${ms(metrics.maxRenderMs)}`,
        '',
      ],
      [
        'LONG FRAMES',
        state.longAnimationFramesSupported
          ? String(metrics.longAnimationFrames)
          : 'N/A',
        state.longAnimationFramesSupported
          ? `worst ${ms(metrics.worstLongAnimationFrameMs)}`
          : 'unsupported',
        'long-frame-count',
      ],
    ] as const
    return html`<section
      class="metrics-strip"
      aria-label="Live performance metrics"
    >
      ${repeat(
        items,
        (item) => item[0],
        (item) =>
          html`<article>
            <span>${item[0]}</span
            ><strong data-testid=${item[3] || undefined}>${item[1]}</strong
            ><small>${item[2]}</small>
          </article>`,
      )}
    </section>`
  }
}
