import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../benchmark/trading-benchmark.controller'
import { formatMs, formatRate } from './shell-formatters'

@Component({
  selector: 'app-metrics-strip',
  template: `
    <section class="metrics-strip" aria-label="Live performance metrics">
      <article>
        <span>WORKER SAMPLES</span>
        <strong data-testid="actual-rate">
          {{ formatRate(controller.metrics().actualTicksPerSecond) }}
        </strong>
        <small>generated samples/s</small>
      </article>
      <article>
        <span>ROW UPDATES</span>
        <strong data-testid="row-update-rate">
          {{ formatRate(controller.metrics().rowUpdatesPerSecond) }}
        </strong>
        <small>unique rows applied/s</small>
      </article>
      <article>
        <span>MESSAGES</span>
        <strong data-testid="message-rate">
          {{ controller.metrics().workerMessagesPerSecond.toFixed(1) }}
        </strong>
        <small>worker messages/s</small>
      </article>
      <article>
        <span>STATE APPLIES</span>
        <strong data-testid="state-apply-rate">
          {{ controller.metrics().stateApplicationsPerSecond.toFixed(1) }}
        </strong>
        <small>quote snapshots/s</small>
      </article>
      <article>
        <span>TABLE COMMITS</span>
        <strong data-testid="table-render-rate">
          {{ controller.metrics().tableRendersPerSecond.toFixed(1) }}
        </strong>
        <small>completed renders/s</small>
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
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsStrip {
  readonly controller = inject(TradingBenchmarkController)
  readonly formatMs = formatMs
  readonly formatRate = formatRate
}
