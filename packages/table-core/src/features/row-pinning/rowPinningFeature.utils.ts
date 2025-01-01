import { row_getIsAllParentsExpanded } from '../row-expanding/rowExpandingFeature.utils'
import { callMemoOrStaticFn } from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type {
  RowPinningPosition,
  RowPinningState,
} from './rowPinningFeature.types'

// State Utils

export function getDefaultRowPinningState(): RowPinningState {
  return structuredClone({
    top: [],
    bottom: [],
  })
}

export function table_setRowPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<RowPinningState>,
): void {
  table.options.onRowPinningChange?.(updater)
}

export function table_resetRowPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean): void {
  table_setRowPinning(
    table,
    defaultState
      ? getDefaultRowPinningState()
      : (table.initialState.rowPinning ?? getDefaultRowPinningState()),
  )
}

// Table Utils

export function table_getIsSomeRowsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  position?: RowPinningPosition,
): boolean {
  const rowPinning = table.options.state?.rowPinning

  if (!position) {
    return Boolean(rowPinning?.top.length || rowPinning?.bottom.length)
  }
  return Boolean(rowPinning?.[position].length)
}

function table_getPinnedRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  position: 'top' | 'bottom',
): Array<Row<TFeatures, TData>> {
  const visibleRows = table.getRowModel().rows
  const pinnedRowIds = table.options.state?.rowPinning?.[position] ?? []

  const rows =
    (table.options.keepPinnedRows ?? true)
      ? // get all rows that are pinned even if they would not be otherwise visible
        // account for expanded parent rows, but not pagination or filtering
        pinnedRowIds.map((rowId) => {
          const row = table.getRow(rowId, true)
          return row_getIsAllParentsExpanded(row) ? row : null
        })
      : // else get only visible rows that are pinned
        pinnedRowIds.map(
          (rowId) => visibleRows.find((row) => row.id === rowId)!,
        )

  return rows.filter((r) => !!r).map((d) => ({ ...d, position }))
}

export function table_getTopRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  return table_getPinnedRows(table, 'top')
}

export function table_getBottomRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  return table_getPinnedRows(table, 'bottom')
}

export function table_getCenterRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  const { top, bottom } =
    table.options.state?.rowPinning ?? getDefaultRowPinningState()
  const allRows = table.getRowModel().rows

  const topAndBottom = new Set([...top, ...bottom])
  return allRows.filter((d) => !topAndBottom.has(d.id))
}

// Row Utils

export function row_getCanPin<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): boolean {
  const { enableRowPinning } = row._table.options
  if (typeof enableRowPinning === 'function') {
    return enableRowPinning(row)
  }
  return enableRowPinning ?? true
}

export function row_getIsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): RowPinningPosition {
  const { top, bottom } =
    row._table.options.state?.rowPinning ?? getDefaultRowPinningState()

  return top.includes(row.id)
    ? 'top'
    : bottom.includes(row.id)
      ? 'bottom'
      : false
}

export function row_getPinnedIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): number {
  const position = row_getIsPinned(row)
  if (!position) return -1

  const visiblePinnedRowIds = (
    position === 'top'
      ? callMemoOrStaticFn(row._table, 'getTopRows', table_getTopRows)
      : callMemoOrStaticFn(row._table, 'getBottomRows', table_getBottomRows)
  ).map(({ id }) => id)

  return visiblePinnedRowIds.indexOf(row.id)
}

export function row_pin<TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  position: RowPinningPosition,
  includeLeafRows?: boolean,
  includeParentRows?: boolean,
): void {
  const leafRowIds = includeLeafRows
    ? row.getLeafRows().map(({ id }) => id)
    : []
  const parentRowIds = includeParentRows
    ? row.getParentRows().map(({ id }) => id)
    : []
  const rowIds: Set<string> = new Set([...parentRowIds, row.id, ...leafRowIds])

  table_setRowPinning(row._table, (old) => {
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
