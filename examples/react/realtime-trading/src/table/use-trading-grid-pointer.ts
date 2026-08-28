import { useRef } from 'react'
import {
  findTradingGridCellTarget,
  selectRowFromPointer,
} from './table-interactions'
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import type { TradingGridTable } from './table-interactions'

export interface TradingGridPointerHandlers {
  readonly onMouseDown: (
    event: ReactMouseEvent<HTMLTableSectionElement>,
  ) => void
  readonly onPointerOver: (
    event: ReactPointerEvent<HTMLTableSectionElement>,
  ) => void
  readonly onMouseLeave: () => void
  readonly onClick: (event: ReactMouseEvent<HTMLTableSectionElement>) => void
}

export function useTradingGridPointer(
  table: TradingGridTable,
  selectSymbol: (symbol: string) => void,
): TradingGridPointerHandlers {
  const lastPointerCell = useRef<HTMLTableCellElement | null>(null)

  return {
    onMouseDown(event) {
      if (event.button !== 0) return

      const nativeEvent = event.nativeEvent
      const target = findTradingGridCellTarget(
        table,
        nativeEvent.composedPath(),
      )
      if (!target) return

      nativeEvent.preventDefault()
      lastPointerCell.current = target.element
      selectSymbol(target.cell.row.original.symbol)
      target.cell.getSelectionStartHandler(target.element.ownerDocument)(
        nativeEvent,
      )
    },
    onPointerOver(event) {
      const nativeEvent = event.nativeEvent
      if ((nativeEvent.buttons & 1) === 0) {
        lastPointerCell.current = null
        return
      }

      const target = findTradingGridCellTarget(
        table,
        nativeEvent.composedPath(),
      )
      if (!target || target.element === lastPointerCell.current) return

      lastPointerCell.current = target.element
      target.cell.getSelectionExtendHandler()(nativeEvent)
    },
    onMouseLeave() {
      lastPointerCell.current = null
    },
    onClick(event) {
      const nativeEvent = event.nativeEvent
      const target = findTradingGridCellTarget(
        table,
        nativeEvent.composedPath(),
      )
      if (!target) return
      selectRowFromPointer(table, target.cell.row, nativeEvent)
    },
  }
}
