import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../core/trading-benchmark.controller'
import { formatInteger, formatMs, formatRate } from './shell-formatters'

@Component({
  selector: 'app-metrics-strip',
  template: `
    <section class="metrics-strip" aria-label="Live performance metrics">
      <article>
        <span>THROUGHPUT</span>
        <strong data-testid="actual-rate">
          {{ formatRate(controller.metrics().actualEventsPerSecond) }}
        </strong>
        <small>events/s</small>
      </article>
      <article>
        <span>RAF RATE</span>
        <strong data-testid="raf-rate">
          {{ controller.metrics().rafCallbacksPerSecond.toFixed(1) }}
        </strong>
        <small>callbacks/s</small>
      </article>
      <article>
        <span>TABLE RENDERS</span>
        <strong data-testid="table-render-rate">
          {{ controller.metrics().tableRendersPerSecond.toFixed(1) }}
        </strong>
        <small>worker batches/s</small>
      </article>
      <article>
        <span>AVG RENDER</span>
        <strong>{{ formatMs(controller.metrics().averageRenderMs) }}</strong>
        <small>mutation → render</small>
      </article>
      <article>
        <span>P95 RENDER</span>
        <strong>{{ formatMs(controller.metrics().p95RenderMs) }}</strong>
        <small>max {{ formatMs(controller.metrics().maxRenderMs) }}</small>
      </article>
      <article>
        <span>LONG FRAMES</span>
        @if (controller.longAnimationFramesSupported) {
          <strong
            data-testid="long-frame-count"
            [class.metric-alert]="controller.metrics().longAnimationFrames > 0"
          >
            {{ controller.metrics().longAnimationFrames }}
          </strong>
          <small>
            worst
            {{ formatMs(controller.metrics().worstLongAnimationFrameMs) }}
          </small>
        } @else {
          <strong data-testid="long-frame-count">N/A</strong>
          <small>unsupported</small>
        }
      </article>
      <article>
        <span>TOTAL EVENTS</span>
        <strong data-testid="total-events">
          {{ formatInteger(controller.metrics().totalEvents) }}
        </strong>
        <small>since reset</small>
      </article>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsStrip {
  readonly controller = inject(TradingBenchmarkController)
  readonly formatInteger = formatInteger
  readonly formatMs = formatMs
  readonly formatRate = formatRate
}
