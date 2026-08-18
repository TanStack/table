import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../benchmark/trading-benchmark.controller'
import { formatInteger } from './shell-formatters'

@Component({
  selector: 'app-market-statusbar',
  template: `
    <footer class="market-statusbar">
      <span>
        MESSAGE SAMPLES
        <strong>
          {{ formatInteger(controller.metrics().lastBatchSize) }}
        </strong>
      </span>
      <span>
        CHANGED ROWS
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
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketStatusbar {
  readonly controller = inject(TradingBenchmarkController)
  readonly formatInteger = formatInteger
}
