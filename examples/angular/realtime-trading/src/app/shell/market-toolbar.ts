import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../core/trading-benchmark.controller'
import { formatInteger } from './shell-formatters'

@Component({
  selector: 'app-market-toolbar',
  template: `
    <header class="market-toolbar">
      <div class="watchlist-name">
        <span>WATCHLIST</span>
        <strong>ALL INSTRUMENTS</strong>
      </div>
      <div class="market-context">
        <span>
          {{ formatInteger(controller.displayQuotes().length) }} /
          {{ formatInteger(controller.quotes().length) }} SYMBOLS
        </span>
        <span>
          {{
            controller.tableAdapter() === 'local'
              ? 'LOCAL OPTIMIZED'
              : controller.tableAdapter() === 'beta'
                ? 'BETA.80'
                : 'V8.21.4'
          }}
        </span>
        <span>WORKER STREAM</span>
        <span>
          {{
            controller.tableAdapter() === 'local' &&
            controller.tableWorkerEnabled()
              ? 'ROW MODEL WORKER ON'
              : 'ROW MODEL MAIN THREAD'
          }}
        </span>
        <span>IMMUTABLE ROWS</span>
        <span>{{ controller.rowWorkloadLabel() }}</span>
        <span>
          {{
            controller.rendererMode() === 'stable'
              ? 'STABLE CELLS'
              : 'A/B CELL SWAP'
          }}
        </span>
        <span>
          {{ controller.updateSparklines() ? 'CHARTS ON' : 'CHARTS OFF' }}
        </span>
        <span>
          {{ controller.updateQuoteAges() ? 'AGE CLOCK ON' : 'AGE CLOCK OFF' }}
        </span>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketToolbar {
  readonly controller = inject(TradingBenchmarkController)
  readonly formatInteger = formatInteger
}
