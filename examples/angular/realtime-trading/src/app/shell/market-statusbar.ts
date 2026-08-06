import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../core/trading-benchmark.controller'
import { formatInteger } from './shell-formatters'

@Component({
  selector: 'app-market-statusbar',
  template: `
    <footer class="market-statusbar">
      <span>
        BATCH EVENTS
        <strong>
          {{ formatInteger(controller.metrics().lastBatchSize) }}
        </strong>
      </span>
      <span>
        ROW UPDATES
        <strong>
          {{ formatInteger(controller.metrics().lastUpdateCount) }}
        </strong>
      </span>
      <span>
        HOSTS
        <strong>{{ formatInteger(controller.mountedCells()) }}</strong>
      </span>
      <span>
        COMPONENTS
        <strong>{{ formatInteger(controller.liveComponents()) }}</strong>
      </span>
      <span class="statusbar-spacer"></span>
      <span>WORKER / ACKNOWLEDGED / IMMUTABLE</span>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketStatusbar {
  readonly controller = inject(TradingBenchmarkController)
  readonly formatInteger = formatInteger
}
