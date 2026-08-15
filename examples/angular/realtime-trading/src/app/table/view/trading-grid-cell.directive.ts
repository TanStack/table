import { DestroyRef, Directive, ElementRef, Input, inject } from '@angular/core'
import { TradingGridSelectionDirective } from './trading-grid-selection.directive'
import type { Cell, TableFeatures } from '@tanstack/angular-table'
import type { MarketQuote } from '../../feed/market-data'

type TradingCell = Cell<TableFeatures, MarketQuote, unknown>

const selectionClasses = [
  'is-cell-selected',
  'is-cell-focused',
  'selection-top',
  'selection-right',
  'selection-bottom',
  'selection-left',
] as const

@Directive({
  selector: 'td[appTradingGridCell]',
  host: {
    '(mousedown)': 'startSelection($event)',
    '(mouseenter)': 'extendSelection($event)',
  },
})
export class TradingGridCellDirective {
  readonly #element = inject<ElementRef<HTMLTableCellElement>>(ElementRef)
  readonly #destroyRef = inject(DestroyRef)
  readonly #selection = inject(TradingGridSelectionDirective)
  #cell: TradingCell | null = null
  #renderedCellId: string | null = null

  constructor() {
    const unregister = this.#selection.register(this)
    this.#destroyRef.onDestroy(unregister)
  }

  @Input({ required: true, alias: 'appTradingGridCell' })
  set appTradingGridCell(cell: TradingCell) {
    this.#cell = cell
    if (this.#renderedCellId === cell.id) return

    this.#renderedCellId = cell.id
    this.#writeStaticState(cell)
    this.#writeSelectionState(cell)
  }

  startSelection(event: MouseEvent): void {
    if (event.button !== 0 || !this.#cell) return
    event.preventDefault()
    this.#cell.getSelectionStartHandler(
      this.#element.nativeElement.ownerDocument,
    )(event)
    this.#selection.refreshSelectionState()
  }

  extendSelection(event: MouseEvent): void {
    if (!this.#cell) return
    this.#cell.getSelectionExtendHandler()(event)
    this.#selection.refreshSelectionState()
  }

  refreshSelectionState(): void {
    if (this.#cell) this.#writeSelectionState(this.#cell)
  }

  #writeStaticState(cell: TradingCell): void {
    const columnId = cell.column.id
    const element = this.#element.nativeElement
    element.style.width = `calc(var(--col-${columnId}-size) * 1px)`
    element.classList.toggle('market-cell', columnId === 'market')
    element.classList.toggle('name-cell', columnId === 'name')
    element.classList.toggle('symbol-cell', columnId === 'symbol')
    element.classList.toggle(
      'numeric-cell',
      columnId !== 'market' && columnId !== 'name' && columnId !== 'symbol',
    )
  }

  #writeSelectionState(cell: TradingCell): void {
    const element = this.#element.nativeElement
    const edges = cell.getSelectionEdges()
    const states: Record<(typeof selectionClasses)[number], boolean> = {
      'is-cell-selected': cell.getIsSelected(),
      'is-cell-focused': cell.getIsFocused(),
      'selection-top': edges.top,
      'selection-right': edges.right,
      'selection-bottom': edges.bottom,
      'selection-left': edges.left,
    }
    for (const className of selectionClasses) {
      element.classList.toggle(className, states[className])
    }
    element.tabIndex = cell.getTabIndex()
    element.setAttribute('aria-selected', String(states['is-cell-selected']))
  }
}
