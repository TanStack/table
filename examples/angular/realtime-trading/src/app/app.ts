import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { BetaTradingTable } from './beta-trading-table'
import { TradingBenchmarkController } from './core/trading-benchmark.controller'
import { CurrentTradingTable } from './current-trading-table'
import { TradingShell } from './shell/trading-shell'
import { V8TradingTable } from './v8-trading-table'
import { WorkerTradingTable } from './worker-trading-table'

@Component({
  selector: 'app-root',
  imports: [
    BetaTradingTable,
    CurrentTradingTable,
    TradingShell,
    V8TradingTable,
    WorkerTradingTable,
  ],
  template: `
    <app-trading-shell>
      @switch (controller.tableAdapter()) {
        @case ('local') {
          @if (controller.tableWorkerEnabled()) {
            <app-worker-trading-table
              [quotes]="controller.displayQuotes()"
              [rendererMode]="controller.rendererMode()"
              [updateQuoteAges]="controller.updateQuoteAges()"
              [quoteClock]="controller.quoteClock()"
              [selectedSymbol]="controller.selectedSymbol()"
              (symbolSelected)="controller.selectedSymbol.set($event)"
            />
          } @else {
            <app-current-trading-table
              [quotes]="controller.displayQuotes()"
              [rendererMode]="controller.rendererMode()"
              [updateQuoteAges]="controller.updateQuoteAges()"
              [quoteClock]="controller.quoteClock()"
              [selectedSymbol]="controller.selectedSymbol()"
              (symbolSelected)="controller.selectedSymbol.set($event)"
            />
          }
        }
        @case ('beta') {
          <app-beta-trading-table
            [quotes]="controller.displayQuotes()"
            [rendererMode]="controller.rendererMode()"
            [updateQuoteAges]="controller.updateQuoteAges()"
            [quoteClock]="controller.quoteClock()"
            [selectedSymbol]="controller.selectedSymbol()"
            (symbolSelected)="controller.selectedSymbol.set($event)"
          />
        }
        @case ('v8') {
          <app-v8-trading-table
            [quotes]="controller.displayQuotes()"
            [rendererMode]="controller.rendererMode()"
            [updateQuoteAges]="controller.updateQuoteAges()"
            [quoteClock]="controller.quoteClock()"
            [selectedSymbol]="controller.selectedSymbol()"
            (symbolSelected)="controller.selectedSymbol.set($event)"
          />
        }
      }
    </app-trading-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly controller = inject(TradingBenchmarkController)
}
