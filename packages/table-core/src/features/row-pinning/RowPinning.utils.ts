import {
  row_getLeafRows,
  row_getParentRows,
  table_getRow,
} from '../../core/rows/Rows.utils'
import { row_getIsAllParentsExpanded } from '../row-expanding/RowExpanding.utils'
import {
  table_getInitialState,
  table_getState,
} from '../../core/table/Tables.utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { RowPinningPosition, RowPinningState } from './RowPinning.types'

// State Utils

/**
 *
 * @returns
 */
export function getDefaultRowPinningState(): RowPinningState {
  return structuredClone({
    top: [],
    bottom: [],
  })
}

/**
 *
 * @param table
 * @param updater
 */
export function table_setRowPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<RowPinningState>,
): void {
  table.options.onRowPinningChange?.(updater)
}

/**
 *
 * @param table
 * @param defaultState
 */
export function table_resetRowPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean): void {
  table_setRowPinning(
    table,
    defaultState
      ? getDefaultRowPinningState()
      : table_getInitialState(table).rowPinning ?? getDefaultRowPinningState(),
  )
}

// Table Utils

/**
 *
 * @param table
 * @param position
 * @returns
 */
export function table_getIsSomeRowsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  position?: RowPinningPosition,
): boolean {
  const rowPinning = table_getState(table).rowPinning

  if (!position) {
    return Boolean(rowPinning?.top.length || rowPinning?.bottom.length)
  }
  return Boolean(rowPinning?.[position].length)
}

/**
 *
 * @param table
 * @param position
 * @returns
 */
function table_getPinnedRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  position: 'top' | 'bottom',
): Array<Row<TFeatures, TData>> {
  const visibleRows = table.getRowModel().rows
  const pinnedRowIds = table_getState(table).rowPinning?.[position] ?? []

  const rows =
    table.options.keepPinnedRows ?? true
      ? // get all rows that are pinned even if they would not be otherwise visible
        // account for expanded parent rows, but not pagination or filtering
        pinnedRowIds.map((rowId) => {
          const row = table_getRow(table, rowId, true)
          return row_getIsAllParentsExpanded(row, table) ? row : null
        })
      : // else get only visible rows that are pinned
        pinnedRowIds.map(
          (rowId) => visibleRows.find((row) => row.id === rowId)!,
        )

  return rows.filter((r) => !!r).map((d) => ({ ...d, position })) as Array<
    Row<TFeatures, TData>
  >
}

/**
 *
 * @param table
 * @returns
 */
export function table_getTopRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  return table_getPinnedRows(table, 'top')
}

/**
 *
 * @param table
 * @returns
 */
export function table_getBottomRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  return table_getPinnedRows(table, 'bottom')
}

/**
 *
 * @param table
 * @returns
 */
export function table_getCenterRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  const { top, bottom } =
    table_getState(table).rowPinning ?? getDefaultRowPinningState()
  const allRows = table.getRowModel().rows

  const topAndBottom = new Set([...top, ...bottom])
  return allRows.filter((d) => !topAndBottom.has(d.id))
}

// Row Utils

/**
 *
 * @param row
 * @param table
 * @returns
 */
export function row_getCanPin<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table_Internal<TFeatures, TData>,
): boolean {
  const { enableRowPinning } = table.options
  if (typeof enableRowPinning === 'function') {
    return enableRowPinning(row)
  }
  return enableRowPinning ?? true
}

/**
 *
 * @param row
 * @param table
 * @returns
 */
export function row_getIsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table_Internal<TFeatures, TData>,
): RowPinningPosition {
  const { top, bottom } =
    table_getState(table).rowPinning ?? getDefaultRowPinningState()

  return top.includes(row.id)
    ? 'top'
    : bottom.includes(row.id)
      ? 'bottom'
      : false
}

/**
 *
 * @param row
 * @param table
 * @returns
 */
export function row_getPinnedIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table_Internal<TFeatures, TData>): number {
  const position = row_getIsPinned(row, table)
  if (!position) return -1

  const visiblePinnedRowIds = (
    position === 'top' ? table_getTopRows(table) : table_getBottomRows(table)
  ).map(({ id }) => id)

  return visiblePinnedRowIds.indexOf(row.id)
}

/**
 *
 * @param row
 * @param table
 * @param position
 * @param includeLeafRows
 * @param includeParentRows
 */
export function row_pin<TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  table: Table_Internal<TFeatures, TData>,
  position: RowPinningPosition,
  includeLeafRows?: boolean,
  includeParentRows?: boolean,
): void {
  console.log('pinning row', row.id)
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
