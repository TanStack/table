import {
  table_getCenterHeaderGroups,
  table_getLeftHeaderGroups,
  table_getPinnedVisibleLeafColumns,
  table_getRightHeaderGroups,
} from '../column-pinning/ColumnPinning.utils'
import { column_getIndex } from '../column-ordering/ColumnOrdering.utils'
import { callMemoOrStaticFn } from '../../utils'
import type { ColumnPinningPosition } from '../column-pinning/ColumnPinning.types'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column_Internal } from '../../types/Column'
import type { ColumnSizingState } from './ColumnSizing.types'

export function getDefaultColumnSizingState(): ColumnSizingState {
  return structuredClone({})
}

export function getDefaultColumnSizingColumnDef() {
  return structuredClone({
    size: 150,
    minSize: 20,
    maxSize: Number.MAX_SAFE_INTEGER,
  })
}

export function column_getSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): number {
  const defaultSizes = getDefaultColumnSizingColumnDef()
  const columnSize = column.table.options.state?.columnSizing?.[column.id]

  return Math.min(
    Math.max(
      column.columnDef.minSize ?? defaultSizes.minSize,
      columnSize ?? column.columnDef.size ?? defaultSizes.size,
    ),
    column.columnDef.maxSize ?? defaultSizes.maxSize,
  )
}

export function column_getStart<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position: ColumnPinningPosition | 'center',
): number {
  const { table } = column
  const visibleLeafColumns = callMemoOrStaticFn(
    table,
    table_getPinnedVisibleLeafColumns,
    position,
  )

  return visibleLeafColumns
    .slice(0, callMemoOrStaticFn(column, column_getIndex, position))
    .reduce((sum, c) => sum + column_getSize(c), 0)
}

export function column_getAfter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position: ColumnPinningPosition | 'center',
): number {
  const { table } = column
  const visibleLeafColumns = callMemoOrStaticFn(
    table,
    table_getPinnedVisibleLeafColumns,
    position,
  )

  return visibleLeafColumns
    .slice(callMemoOrStaticFn(column, column_getIndex, position) + 1)
    .reduce((sum, c) => sum + column_getSize(c), 0)
}

export function column_resetSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  table_setColumnSizing(column.table, ({ [column.id]: _, ...rest }) => {
    return rest
  })
}

export function header_getSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(header: Header<TFeatures, TData, TValue>) {
  let sum = 0

  const recurse = (h: Header<TFeatures, TData, TValue>) => {
    if (h.subHeaders.length) {
      h.subHeaders.forEach(recurse)
    } else {
      sum += column_getSize(h.column)
    }
  }

  recurse(header)

  return sum
}

export function header_getStart<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(header: Header<TFeatures, TData, TValue>): number {
  if (header.index > 0) {
    const prevSiblingHeader = header.headerGroup?.headers[header.index - 1]
    if (prevSiblingHeader) {
      return (
        header_getStart(prevSiblingHeader) + header_getSize(prevSiblingHeader)
      )
    }
  }

  return 0
}

// Table APIs

export function table_setColumnSizing<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<ColumnSizingState>,
) {
  table.options.onColumnSizingChange?.(updater)
}

export function table_resetColumnSizing<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnSizing(
    table,
    defaultState ? {} : (table.initialState.columnSizing ?? {}),
  )
}

export function table_getTotalSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (
    table.getHeaderGroups()[0]?.headers.reduce((sum, header) => {
      return sum + header_getSize(header)
    }, 0) ?? 0
  )
}

export function table_getLeftTotalSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (
    table_getLeftHeaderGroups(table)[0]?.headers.reduce((sum, header) => {
      return sum + header_getSize(header)
    }, 0) ?? 0
  )
}

export function table_getCenterTotalSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (
    table_getCenterHeaderGroups(table)[0]?.headers.reduce((sum, header) => {
      return sum + header_getSize(header)
    }, 0) ?? 0
  )
}

export function table_getRightTotalSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (
    table_getRightHeaderGroups(table)[0]?.headers.reduce((sum, header) => {
      return sum + header_getSize(header)
    }, 0) ?? 0
  )
}
