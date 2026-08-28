import { useMemo, useRef } from 'octane'
import {
  findTradingGridCellTarget,
  selectRowFromPointer,
} from './table-interactions'
import type { TradingGridTable } from './table-interactions'

export interface TradingGridPointerHandlers {
  readonly onMouseDown: (event: MouseEvent) => void
  readonly onPointerOver: (event: PointerEvent) => void
  readonly onMouseLeave: () => void
  readonly onClick: (event: MouseEvent) => void
}

export function useTradingGridPointer(
  table: TradingGridTable,
  selectSymbol: (symbol: string) => void,
): TradingGridPointerHandlers {
  const lastPointerCell = useRef<HTMLTableCellElement | null>(null)

  return useMemo(
    () => ({
      onMouseDown(event) {
        if (event.button !== 0) return

        const target = findTradingGridCellTarget(table, event.composedPath())
        if (!target) return

        event.preventDefault()
        lastPointerCell.current = target.element
        selectSymbol(target.cell.row.original.symbol)
        target.cell.getSelectionStartHandler(target.element.ownerDocument)(
          event,
        )
      },
      onPointerOver(event) {
        if ((event.buttons & 1) === 0) {
          lastPointerCell.current = null
          return
        }

        const target = findTradingGridCellTarget(table, event.composedPath())
        if (!target || target.element === lastPointerCell.current) return

        lastPointerCell.current = target.element
        target.cell.getSelectionExtendHandler()(event)
      },
      onMouseLeave() {
        lastPointerCell.current = null
      },
      onClick(event) {
        const target = findTradingGridCellTarget(table, event.composedPath())
        if (!target) return
        selectRowFromPointer(table, target.cell.row, event)
      },
    }),
    [selectSymbol, table],
  )
}
