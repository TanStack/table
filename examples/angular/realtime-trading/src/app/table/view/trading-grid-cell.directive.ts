import { Directive, computed, inject, input } from '@angular/core'
import { TradingGridSelectionDirective } from './trading-grid-selection.directive'
import type { Cell, TableFeatures } from '@tanstack/angular-table'
import type { MarketQuote } from '../../feed/market-data'

type TradingCell = Cell<TableFeatures, MarketQuote, unknown>

@Directive({
  selector: 'td[appTradingGridCell]',
  host: {
    '[style.width]': 'staticHostState().width',
    '[attr.data-column-id]': 'staticHostState().columnId',
    '[attr.data-cell-focused]': "selectionHostState().focused ? 'true' : null",
    '[attr.data-selection-top]': "selectionHostState().top ? 'true' : null",
    '[attr.data-selection-right]': "selectionHostState().right ? 'true' : null",
    '[attr.data-selection-bottom]':
      "selectionHostState().bottom ? 'true' : null",
    '[attr.data-selection-left]': "selectionHostState().left ? 'true' : null",
    '[attr.tabindex]': 'selectionHostState().tabIndex',
    '[attr.aria-selected]': 'selectionHostState().selected',
  },
})
export class TradingGridCellDirective {
  readonly #selection = inject(TradingGridSelectionDirective)

  readonly cell = input.required<TradingCell>({
    alias: 'appTradingGridCell',
  })

  readonly staticHostState = computed(() => {
    const columnId = this.cell().column.id

    return {
      width: `calc(var(--col-${columnId}-size) * 1px)`,
      columnId,
    }
  })

  readonly selectionHostState = computed(() => {
    return this.#selection.readCellSelectionState(this.cell())
  })
}
