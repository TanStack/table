import { Directive, input, output } from '@angular/core'
import type { Cell, Table, TableFeatures } from '@tanstack/angular-table'
import type { MarketQuote } from '../../feed/market-data'
import type { TradingTableInteractionController } from '../table-interactions'

type TradingCell = Cell<TableFeatures, MarketQuote, unknown>
type TradingTable = Table<TableFeatures, MarketQuote>

interface SelectionCellTarget {
  readonly element: HTMLTableCellElement
  readonly cell: TradingCell
}

@Directive({
  selector: 'table[appTradingGridSelection]',
  host: {
    '(mousedown)': 'handleMouseDown($event)',
    '(mousemove)': 'handleMouseMove($event)',
    '(mouseleave)': 'resetPointerCell()',
    '(click)': 'handleClick($event)',
  },
})
export class TradingGridSelectionDirective {
  readonly table = input.required<TradingTable>({
    alias: 'appTradingGridSelection',
  })
  readonly interactions = input.required<TradingTableInteractionController>()
  readonly symbolSelected = output<string>()

  #lastPointerCell: HTMLTableCellElement | null = null

  readCellSelectionState(cell: TradingCell) {
    this.table().atoms.cellSelection.get()
    const edges = cell.getSelectionEdges()

    return {
      selected: cell.getIsSelected(),
      focused: cell.getIsFocused(),
      top: edges.top,
      right: edges.right,
      bottom: edges.bottom,
      left: edges.left,
      tabIndex: cell.getTabIndex(),
    }
  }

  handleMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return

    const target = this.#findCellTarget(event.composedPath())
    if (!target) return

    event.preventDefault()
    this.#lastPointerCell = target.element
    this.symbolSelected.emit(target.cell.row.original.symbol)
    target.cell.getSelectionStartHandler(target.element.ownerDocument)(event)
  }

  handleMouseMove(event: MouseEvent): void {
    if ((event.buttons & 1) === 0) {
      this.#lastPointerCell = null
      return
    }

    const target = this.#findCellTarget(event.composedPath())
    if (!target || target.element === this.#lastPointerCell) return

    this.#lastPointerCell = target.element
    target.cell.getSelectionExtendHandler()(event)
  }

  resetPointerCell(): void {
    this.#lastPointerCell = null
  }

  handleClick(event: MouseEvent): void {
    const target = this.#findCellTarget(event.composedPath())
    if (!target) return
    this.interactions().selectRow(this.table(), target.cell.row, event)
  }

  #findCellTarget(path: Array<EventTarget>): SelectionCellTarget | null {
    for (const target of path) {
      if (!(target instanceof HTMLTableCellElement)) continue

      const columnId = target.dataset['columnId']
      const rowId =
        target.closest<HTMLTableRowElement>('tr[data-row-id]')?.dataset['rowId']
      if (!columnId || !rowId) return null

      const row = this.table().getRowModel().rowsById[rowId]
      const cell = row.getAllCellsByColumnId()[columnId]
      return { element: target, cell }
    }

    return null
  }
}
