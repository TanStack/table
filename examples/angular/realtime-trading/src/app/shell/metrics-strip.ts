import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../benchmark/trading-benchmark.controller'
import { formatMs, formatRate } from './shell-formatters'

@Component({
  selector: 'app-metrics-strip',
  template: `
    <section class="metrics-strip" aria-labelledby="live-health">
      <h2 id="live-health">LIVE HEALTH</h2>
      <article>
        <span>FRAME RATE (EST.)</span>
        <strong data-testid="frame-rate">
          {{ controller.metrics().rafCallbacksPerSecond.toFixed(1) }}
        </strong>
        <small>rAF callbacks/s · rolling 1 s</small>
      </article>
      <article>
        <span>AVG COMMIT</span>
        <strong data-testid="average-commit-latency">
          {{ formatMs(controller.metrics().averageRenderMs) }}
        </strong>
        <small>snapshot → DOM · rolling 3 s</small>
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
            since reset · worst
            {{ formatMs(controller.metrics().worstLongAnimationFrameMs) }}
          </small>
        } @else {
          <strong data-testid="long-frame-count">N/A</strong>
          <small>unsupported</small>
        }
      </article>
      <article>
        <span>THROUGHPUT</span>
        <strong data-testid="throughput-rate">
          {{ formatRate(controller.metrics().rowUpdatesPerSecond) }} rows/s
        </strong>
        <small>
          {{ controller.metrics().stateApplicationsPerSecond.toFixed(1) }}
          snapshots/s · rows deduplicated per snapshot
        </small>
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
