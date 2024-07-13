import {
  row_getLeafRows,
  row_getParentRows,
  table_getRow,
} from '../../core/rows/Rows.utils'
import { row_getIsAllParentsExpanded } from '../row-expanding/RowExpanding.utils'
import { table_getRowModel } from '../../core/table/Tables.utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
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

export function table_setRowPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, updater: Updater<RowPinningState>): void {
  table.options.onRowPinningChange?.(updater)
}

export function table_resetRowPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, defaultState?: boolean): void {
  table_setRowPinning(
    table,
    defaultState
      ? getDefaultRowPinningState()
      : table.initialState.rowPinning ?? getDefaultRowPinningState(),
  )
}

/**
 * Table Utils
 */

export function table_getIsSomeRowsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, position?: RowPinningPosition): boolean {
  const rowPinning = table.getState().rowPinning

  if (!position) {
    return Boolean(rowPinning.top.length || rowPinning.bottom.length)
  }
  return Boolean(rowPinning[position].length)
}

function table_getPinnedRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  visibleRows: Array<Row<TFeatures, TData>>,
  pinnedRowIds: Array<string>,
  position: 'top' | 'bottom',
): Array<Row<TFeatures, TData>> {
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
    Row<TFeatures, TData>
  >
}

export function table_getTopRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  allRows: Array<Row<TFeatures, TData>>,
  topPinnedRowIds: Array<string>,
): Array<Row<TFeatures, TData>> {
  return table_getPinnedRows(table, allRows, topPinnedRowIds, 'top')
}

export function table_getBottomRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  allRows: Array<Row<TFeatures, TData>>,
  bottomPinnedRowIds: Array<string>,
): Array<Row<TFeatures, TData>> {
  return table_getPinnedRows(table, allRows, bottomPinnedRowIds, 'bottom')
}

export function table_getCenterRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  allRows: Array<Row<TFeatures, TData>>,
  rowPinning: RowPinningState,
): Array<Row<TFeatures, TData>> {
  const { top, bottom } = rowPinning
  const topAndBottom = new Set([...top, ...bottom])
  return allRows.filter((d) => !topAndBottom.has(d.id))
}

/**
 * Row Utils
 */

export function row_getCanPin<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>): boolean {
  const { enableRowPinning } = table.options
  if (typeof enableRowPinning === 'function') {
    return enableRowPinning(row)
  }
  return enableRowPinning ?? true
}

export function row_getIsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData>,
): RowPinningPosition {
  const { top, bottom } = table.getState().rowPinning

  return top.includes(row.id)
    ? 'top'
    : bottom.includes(row.id)
      ? 'bottom'
      : false
}

export function row_getPinnedIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData>,
  allRows: Array<Row<TFeatures, TData>> = table_getRowModel(table).rows,
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

export function row_pin<TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData>,
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
