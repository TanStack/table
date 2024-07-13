import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column } from '../../types/Column'
import type { ColumnSizingState } from './ColumnSizing.types'

export function column_getSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  table: Table<TFeatures, TData>,
): number {
  const columnSize = table.getState().columnSizing[column.id]

  return Math.min(
    Math.max(
      column.columnDef.minSize ?? defaultColumnSizing.minSize,
      columnSize ?? column.columnDef.size ?? defaultColumnSizing.size,
    ),
    column.columnDef.maxSize ?? defaultColumnSizing.maxSize,
  )
}

export function column_getStart<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  columns: Array<Column<TFeatures, TData, unknown>>,
  column: Column<TFeatures, TData, TValue>,
  table: Table<TFeatures, TData>,
  position?: false | 'left' | 'right' | 'center',
): number {
  return columns
    .slice(0, column.getIndex(position))
    .reduce((sum, c) => sum + column_getSize(c, table), 0)
}

export function column_getAfter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  columns: Array<Column<TFeatures, TData, unknown>>,
  column: Column<TFeatures, TData, TValue>,
  table: Table<TFeatures, TData>,
  position?: false | 'left' | 'right' | 'center',
): number {
  return columns
    .slice(column.getIndex(position) + 1)
    .reduce((sum, c) => sum + column_getSize(c, table), 0)
}

export function column_resetSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(table: Table<TFeatures, TData>, column: Column<TFeatures, TData, TValue>) {
  table_setColumnSizing(table, ({ [column.id]: _, ...rest }) => {
    return rest
  })
}

export function header_getSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(header: Header<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  let sum = 0

  const recurse = (h: Header<TFeatures, TData, TValue>) => {
    if (h.subHeaders.length) {
      h.subHeaders.forEach(recurse)
    } else {
      sum += column_getSize(h.column, table)
    }
  }

  recurse(header)

  return sum
}

export function header_getStart<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(header: Header<TFeatures, TData, TValue>) {
  if (header.index > 0) {
    const prevSiblingHeader = header.headerGroup?.headers[header.index - 1]
    if (prevSiblingHeader) {
      return prevSiblingHeader.getStart() + prevSiblingHeader.getSize()
    }
  }

  return 0
}

export function table_setColumnSizing<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, updater: Updater<ColumnSizingState>) {
  table.options.onColumnSizingChange?.(updater)
}

export function table_resetColumnSizing<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnSizing(
    table,
    defaultState ? {} : table.initialState.columnSizing ?? {},
  )
}

export function table_getTotalSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return (
    table.getHeaderGroups()[0]?.headers.reduce((sum, header) => {
      return sum + header.getSize()
    }, 0) ?? 0
  )
}

export function table_getLeftTotalSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return (
    table.getLeftHeaderGroups()[0]?.headers.reduce((sum, header) => {
      return sum + header.getSize()
    }, 0) ?? 0
  )
}

export function table_getCenterTotalSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return (
    table.getCenterHeaderGroups()[0]?.headers.reduce((sum, header) => {
      return sum + header.getSize()
    }, 0) ?? 0
  )
}

export function table_getRightTotalSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return (
    table.getRightHeaderGroups()[0]?.headers.reduce((sum, header) => {
      return sum + header.getSize()
    }, 0) ?? 0
  )
}

export const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER,
}
