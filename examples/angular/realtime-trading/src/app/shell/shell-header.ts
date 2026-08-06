import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../core/trading-benchmark.controller'

@Component({
  selector: 'app-shell-header',
  template: `
    <header class="app-bar">
      <div class="brand">
        <span class="brand-mark">TT</span>
        <strong>MARKET MONITOR</strong>
        <span class="environment">SIMULATED</span>
      </div>
      <div class="session-info">
        <span>ANGULAR / FLEX RENDER</span>
        <span
          class="feed-status"
          data-testid="feed-status"
          [class.is-running]="controller.workerReady() && controller.running()"
        >
          <span class="status-dot" aria-hidden="true"></span>
          {{
            !controller.workerReady()
              ? 'FEED CONNECTING'
              : controller.running()
                ? 'FEED LIVE'
                : 'FEED PAUSED'
          }}
        </span>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellHeader {
  readonly controller = inject(TradingBenchmarkController)
}
