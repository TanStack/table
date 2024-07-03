import { Row, RowData, Table, Updater } from '../../types'
import {
  TableOptions_RowPinning,
  RowPinningPosition,
  RowPinningState,
} from './RowPinning.types'

/**
 * State Utils
 */

export function getDefaultRowPinningState(): RowPinningState {
  return structuredClone({
    top: [],
    bottom: [],
  })
}

export function table_setRowPinning<TData extends RowData>(
  table: Table<TData> & {
    options: TableOptions_RowPinning<TData>
  },
  updater: Updater<RowPinningState>
): void {
  table.options.onRowPinningChange?.(updater)
}

export function table_resetRowPinning<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean
): void {
  table_setRowPinning(
    table,
    defaultState
      ? getDefaultRowPinningState()
      : table.initialState?.rowPinning ?? getDefaultRowPinningState()
  )
}

/**
 * Table Utils
 */

export function table_getIsSomeRowsPinned<TData extends RowData>(
  table: Table<TData>,
  position?: RowPinningPosition
): boolean {
  const rowPinning = table.getState().rowPinning

  if (!position) {
    return Boolean(rowPinning.top?.length || rowPinning.bottom?.length)
  }
  return Boolean(rowPinning[position]?.length)
}

function table_getPinnedRows<TData extends RowData>(
  table: Table<TData>,
  visibleRows: Row<TData>[],
  pinnedRowIds: string[],
  position: 'top' | 'bottom'
): Row<TData>[] {
  const rows =
    table.options.keepPinnedRows ?? true
      ? //get all rows that are pinned even if they would not be otherwise visible
        //account for expanded parent rows, but not pagination or filtering
        pinnedRowIds.map(rowId => {
          const row = table.getRow(rowId, true)
          return row.getIsAllParentsExpanded() ? row : null
        })
      : //else get only visible rows that are pinned
        pinnedRowIds.map(rowId => visibleRows.find(row => row.id === rowId)!)

  return rows.filter(Boolean).map(d => ({ ...d, position })) as Row<TData>[]
}

export function table_getTopRows<TData extends RowData>(
  table: Table<TData>,
  allRows: Row<TData>[],
  topPinnedRowIds: string[]
): Row<TData>[] {
  return table_getPinnedRows(table, allRows, topPinnedRowIds, 'top')
}

export function table_getBottomRows<TData extends RowData>(
  table: Table<TData>,
  allRows: Row<TData>[],
  bottomPinnedRowIds: string[]
): Row<TData>[] {
  return table_getPinnedRows(table, allRows, bottomPinnedRowIds, 'bottom')
}

export function table_getCenterRows<TData extends RowData>(
  allRows: Row<TData>[],
  rowPinning: RowPinningState
): Row<TData>[] {
  const { top, bottom } = rowPinning
  const topAndBottom = new Set([...top, ...bottom])
  return allRows.filter(d => !topAndBottom.has(d.id))
}

/**
 * Row Utils
 */

export function row_getCanPin<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>
): boolean {
  const { enableRowPinning } = table.options
  if (typeof enableRowPinning === 'function') {
    return enableRowPinning(row)
  }
  return enableRowPinning ?? true
}

export function row_getIsPinned<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>
): RowPinningPosition {
  const { top, bottom } = table.getState().rowPinning

  return top?.includes(row.id)
    ? 'top'
    : bottom?.includes(row.id)
      ? 'bottom'
      : false
}

export function row_getPinnedIndex<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>
): number {
  const position = row_getIsPinned(row, table)
  if (!position) return -1

  const visiblePinnedRowIds = (
    position === 'top' ? table.getTopRows() : table.getBottomRows()
  )?.map(({ id }) => id)

  return visiblePinnedRowIds?.indexOf(row.id) ?? -1
}

export function row_pin<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
  position: RowPinningPosition,
  includeLeafRows?: boolean,
  includeParentRows?: boolean
): void {
  const leafRowIds = includeLeafRows
    ? row.getLeafRows().map(({ id }) => id)
    : []
  const parentRowIds = includeParentRows
    ? row.getParentRows().map(({ id }) => id)
    : []
  const rowIds = new Set([...parentRowIds, row.id, ...leafRowIds])

  table_setRowPinning(table, old => {
    if (position === 'bottom') {
      return {
        top: (old?.top ?? []).filter(d => !rowIds?.has(d)),
        bottom: [
          ...(old?.bottom ?? []).filter(d => !rowIds?.has(d)),
          ...Array.from(rowIds),
        ],
      }
    }

    if (position === 'top') {
      return {
        top: [...old.top.filter(d => !rowIds?.has(d)), ...Array.from(rowIds)],
        bottom: old.bottom.filter(d => !rowIds?.has(d)),
      }
    }

    return {
      top: old.top.filter(d => !rowIds?.has(d)),
      bottom: old.bottom.filter(d => !rowIds?.has(d)),
    }
  })
}
