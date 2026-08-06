import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core'
import {
  FlexRender,
  injectTable,
  stockFeatures,
} from '@tanstack/angular-table-beta'
import { createBetaTradingColumns } from './trading-columns-beta'
import type { MarketQuote } from './market-data'
import type { RendererMode } from './trading-column-types'

@Component({
  selector: 'app-beta-trading-table',
  imports: [FlexRender],
  templateUrl: './table-v9.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetaTradingTable {
  readonly quotes = input.required<Array<MarketQuote>>()
  readonly rendererMode = input.required<RendererMode>()
  readonly updateQuoteAges = input.required<boolean>()
  readonly quoteClock = input.required<number>()
  readonly selectedSymbol = input<string | null>(null)
  readonly symbolSelected = output<string>()

  readonly columns = createBetaTradingColumns({
    rendererMode: () => this.rendererMode(),
    updateQuoteAges: () => this.updateQuoteAges(),
    quoteClock: () => this.quoteClock(),
    selectSymbol: (symbol) => this.symbolSelected.emit(symbol),
  })

  readonly table = injectTable(() => ({
    data: this.quotes(),
    columns: this.columns,
    features: stockFeatures,
    getRowId: (row) => row.id,
  }))
}
