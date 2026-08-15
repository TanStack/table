import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../benchmark/trading-benchmark.controller'
import { formatInteger } from './shell-formatters'

@Component({
  selector: 'app-market-statusbar',
  template: `
    <footer class="market-statusbar">
      <span>
        BATCH TICKS
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
        CELL HOSTS
        <strong>{{ formatInteger(controller.mountedCells()) }}</strong>
      </span>
      <span>
        COMPONENTS
        <strong>{{ formatInteger(controller.liveComponents()) }}</strong>
      </span>
      <span class="statusbar-spacer"></span>
      <span>WORKER / FIXED CADENCE / IMMUTABLE</span>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketStatusbar {
  readonly controller = inject(TradingBenchmarkController)
  readonly formatInteger = formatInteger
}
