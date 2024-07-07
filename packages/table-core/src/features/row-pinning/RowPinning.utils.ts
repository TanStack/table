import {
  row_getLeafRows,
  row_getParentRows,
  table_getRow,
} from '../../core/rows/Rows.utils'
import { row_getIsAllParentsExpanded } from '../row-expanding/RowExpanding.utils'
import { table_getRowModel } from '../../core/row-models/RowModels.utils'
import type { Row, RowData, Table, Updater } from '../../types'
import type { RowPinningPosition, RowPinningState } from './RowPinning.types'

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
  table: Table<TData>,
  updater: Updater<RowPinningState>,
): void {
  table.options.onRowPinningChange?.(updater)
}

export function table_resetRowPinning<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean,
): void {
  table_setRowPinning(
    table,
    defaultState ? getDefaultRowPinningState() : table.initialState.rowPinning,
  )
}

/**
 * Table Utils
 */

export function table_getIsSomeRowsPinned<TData extends RowData>(
  table: Table<TData>,
  position?: RowPinningPosition,
): boolean {
  const rowPinning = table.getState().rowPinning

  if (!position) {
    return Boolean(rowPinning.top.length || rowPinning.bottom.length)
  }
  return Boolean(rowPinning[position].length)
}

function table_getPinnedRows<TData extends RowData>(
  table: Table<TData>,
  visibleRows: Array<Row<TData>>,
  pinnedRowIds: Array<string>,
  position: 'top' | 'bottom',
): Array<Row<TData>> {
  const rows =
    table.options.keepPinnedRows ?? true
      ? //get all rows that are pinned even if they would not be otherwise visible
        //account for expanded parent rows, but not pagination or filtering
        pinnedRowIds.map((rowId) => {
          const row = table_getRow(table, rowId, true)
          return row_getIsAllParentsExpanded(row, table) ? row : null
        })
      : //else get only visible rows that are pinned
        pinnedRowIds.map(
          (rowId) => visibleRows.find((row) => row.id === rowId)!,
        )

  return rows.filter(Boolean).map((d) => ({ ...d, position })) as Array<
    Row<TData>
  >
}

export function table_getTopRows<TData extends RowData>(
  table: Table<TData>,
  allRows: Array<Row<TData>>,
  topPinnedRowIds: Array<string>,
): Array<Row<TData>> {
  return table_getPinnedRows(table, allRows, topPinnedRowIds, 'top')
}

export function table_getBottomRows<TData extends RowData>(
  table: Table<TData>,
  allRows: Array<Row<TData>>,
  bottomPinnedRowIds: Array<string>,
): Array<Row<TData>> {
  return table_getPinnedRows(table, allRows, bottomPinnedRowIds, 'bottom')
}

export function table_getCenterRows<TData extends RowData>(
  allRows: Array<Row<TData>>,
  rowPinning: RowPinningState,
): Array<Row<TData>> {
  const { top, bottom } = rowPinning
  const topAndBottom = new Set([...top, ...bottom])
  return allRows.filter((d) => !topAndBottom.has(d.id))
}

/**
 * Row Utils
 */

export function row_getCanPin<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
): boolean {
  const { enableRowPinning } = table.options
  if (typeof enableRowPinning === 'function') {
    return enableRowPinning(row)
  }
  return enableRowPinning ?? true
}

export function row_getIsPinned<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
): RowPinningPosition {
  const { top, bottom } = table.getState().rowPinning

  return top.includes(row.id)
    ? 'top'
    : bottom.includes(row.id)
      ? 'bottom'
      : false
}

export function row_getPinnedIndex<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
  allRows: Array<Row<TData>> = table_getRowModel(table).rows,
  rowPinning = table.getState().rowPinning,
): number {
  const position = row_getIsPinned(row, table)
  if (!position) return -1

  const { bottom, top } = rowPinning

  const visiblePinnedRowIds = (
    position === 'top'
      ? table_getTopRows(table, allRows, top)
      : table_getBottomRows(table, allRows, bottom)
  ).map(({ id }) => id)

  return visiblePinnedRowIds.indexOf(row.id)
}

export function row_pin<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
  position: RowPinningPosition,
  includeLeafRows?: boolean,
  includeParentRows?: boolean,
): void {
  const leafRowIds = includeLeafRows
    ? row_getLeafRows(row).map(({ id }) => id)
    : []
  const parentRowIds = includeParentRows
    ? row_getParentRows(row, table).map(({ id }) => id)
    : []
  const rowIds = new Set([...parentRowIds, row.id, ...leafRowIds])

  table_setRowPinning(table, (old) => {
    if (position === 'bottom') {
      return {
        top: old.top.filter((d) => !rowIds.has(d)),
        bottom: [
          ...old.bottom.filter((d) => !rowIds.has(d)),
          ...Array.from(rowIds),
        ],
      }
    }

    if (position === 'top') {
      return {
        top: [...old.top.filter((d) => !rowIds.has(d)), ...Array.from(rowIds)],
        bottom: old.bottom.filter((d) => !rowIds.has(d)),
      }
    }

    return {
      top: old.top.filter((d) => !rowIds.has(d)),
      bottom: old.bottom.filter((d) => !rowIds.has(d)),
    }
  })
}
