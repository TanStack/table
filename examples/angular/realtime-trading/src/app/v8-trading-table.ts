import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core'
import {
  FlexRenderDirective,
  createAngularTable,
  getCoreRowModel,
} from '@tanstack/angular-table-v8'
import { createV8TradingColumns } from './trading-columns-v8'
import type { MarketQuote } from './market-data'
import type { RendererMode } from './trading-column-types'

@Component({
  selector: 'app-v8-trading-table',
  imports: [FlexRenderDirective],
  templateUrl: './table-v8.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V8TradingTable {
  readonly quotes = input.required<Array<MarketQuote>>()
  readonly rendererMode = input.required<RendererMode>()
  readonly updateQuoteAges = input.required<boolean>()
  readonly quoteClock = input.required<number>()
  readonly selectedSymbol = input<string | null>(null)
  readonly symbolSelected = output<string>()

  readonly columns = createV8TradingColumns({
    rendererMode: () => this.rendererMode(),
    updateQuoteAges: () => this.updateQuoteAges(),
    quoteClock: () => this.quoteClock(),
    selectSymbol: (symbol) => this.symbolSelected.emit(symbol),
  })

  readonly table = createAngularTable(() => ({
    data: this.quotes(),
    columns: this.columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  }))
}
