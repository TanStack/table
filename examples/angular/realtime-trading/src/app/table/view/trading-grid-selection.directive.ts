import { DestroyRef, Directive, Input, inject } from '@angular/core'
import type { Table, TableFeatures } from '@tanstack/angular-table'
import type { MarketQuote } from '../../feed/market-data'

interface SelectionCellView {
  refreshSelectionState: () => void
}

type TradingTable = Table<TableFeatures, MarketQuote>

@Directive({
  selector: 'table[appTradingGridSelection]',
})
export class TradingGridSelectionDirective {
  readonly #destroyRef = inject(DestroyRef)
  readonly #cellViews = new Set<SelectionCellView>()
  #table: TradingTable | null = null
  #lastRenderedSelection: unknown = null
  #stopSelectionSubscription: (() => void) | null = null

  constructor() {
    this.#destroyRef.onDestroy(() => {
      this.#stopSelectionSubscription?.()
      this.#cellViews.clear()
    })
  }

  @Input({ required: true, alias: 'appTradingGridSelection' })
  set appTradingGridSelection(table: TradingTable) {
    if (this.#stopSelectionSubscription) return

    this.#table = table
    const subscription = table.atoms.cellSelection.subscribe((selection) => {
      if (selection === this.#lastRenderedSelection) return
      this.#lastRenderedSelection = selection
      this.refreshSelectionState()
    })
    this.#stopSelectionSubscription = () => subscription.unsubscribe()
  }

  register(cellView: SelectionCellView): () => void {
    this.#cellViews.add(cellView)
    return () => this.#cellViews.delete(cellView)
  }

  refreshSelectionState(): void {
    this.#lastRenderedSelection = this.#table?.atoms.cellSelection.get()
    for (const cellView of this.#cellViews) {
      cellView.refreshSelectionState()
    }
  }
}
