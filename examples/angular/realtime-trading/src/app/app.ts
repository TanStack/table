import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from './benchmark/trading-benchmark.controller'
import { CurrentTradingTable } from './table/current-trading-table'
import { TradingShell } from './shell/trading-shell'
import { WorkerTradingTable } from './table/worker/worker-trading-table'

@Component({
  selector: 'app-root',
  imports: [CurrentTradingTable, TradingShell, WorkerTradingTable],
  template: `
    <app-trading-shell>
      @if (controller.tableWorkerEnabled()) {
        <app-worker-trading-table
          [quotes]="controller.displayQuotes()"
          [rendererMode]="controller.rendererMode()"
          [selectedSymbol]="controller.selectedSymbol()"
          [virtualScrollMode]="controller.virtualScrollMode()"
          (symbolSelected)="controller.selectedSymbol.set($event)"
        />
      } @else {
        <app-current-trading-table
          [quotes]="controller.displayQuotes()"
          [rendererMode]="controller.rendererMode()"
          [selectedSymbol]="controller.selectedSymbol()"
          [virtualScrollMode]="controller.virtualScrollMode()"
          (symbolSelected)="controller.selectedSymbol.set($event)"
        />
      }
    </app-trading-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly controller = inject(TradingBenchmarkController)
}
