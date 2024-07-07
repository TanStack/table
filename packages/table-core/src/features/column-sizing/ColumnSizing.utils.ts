import type { Column, Header, RowData, Table, Updater } from '../../types'
import type { ColumnSizingState } from './ColumnSizing.types'

export function column_getSize<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>,
) {
  const columnSize = table.getState().columnSizing[column.id]

  return Math.min(
    Math.max(
      column.columnDef.minSize ?? defaultColumnSizing.minSize,
      columnSize ?? column.columnDef.size ?? defaultColumnSizing.size,
    ),
    column.columnDef.maxSize ?? defaultColumnSizing.maxSize,
  )
}

export function column_getStart<TData extends RowData, TValue>(
  columns: Array<Column<TData, unknown>>,
  column: Column<TData, TValue>,
  position?: false | 'left' | 'right' | 'center',
) {
  return columns
    .slice(0, column.getIndex(position))
    .reduce((sum, c) => sum + c.getSize(), 0)
}

export function column_getAfter<TData extends RowData, TValue>(
  columns: Array<Column<TData, unknown>>,
  column: Column<TData, TValue>,
  position?: false | 'left' | 'right' | 'center',
) {
  return columns
    .slice(column.getIndex(position) + 1)
    .reduce((sum, c) => sum + c.getSize(), 0)
}

export function column_resetSize<TData extends RowData, TValue>(
  table: Table<TData>,
  column: Column<TData, TValue>,
) {
  table_setColumnSizing(table, ({ [column.id]: _, ...rest }) => {
    return rest
  })
}

export function header_getSize<TData extends RowData, TValue>(
  header: Header<TData, TValue>,
) {
  let sum = 0

  const recurse = (h: Header<TData, TValue>) => {
    if (h.subHeaders.length) {
      h.subHeaders.forEach(recurse)
    } else {
      sum += h.column.getSize()
    }
  }

  recurse(header)

  return sum
}

export function header_getStart<TData extends RowData, TValue>(
  header: Header<TData, TValue>,
) {
  if (header.index > 0) {
    const prevSiblingHeader = header.headerGroup?.headers[header.index - 1]
    if (prevSiblingHeader) {
      return prevSiblingHeader.getStart() + prevSiblingHeader.getSize()
    }
  }

  return 0
}

export function table_setColumnSizing<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<ColumnSizingState>,
) {
  table.options.onColumnSizingChange?.(updater)
}

export function table_resetColumnSizing<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean,
) {
  table_setColumnSizing(
    table,
    defaultState ? {} : table.initialState.columnSizing,
  )
}

export function table_getTotalSize<TData extends RowData>(table: Table<TData>) {
  return (
    table.getHeaderGroups()[0]?.headers.reduce((sum, header) => {
      return sum + header.getSize()
    }, 0) ?? 0
  )
}

export function table_getLeftTotalSize<TData extends RowData>(
  table: Table<TData>,
) {
  return (
    table.getLeftHeaderGroups()[0]?.headers.reduce((sum, header) => {
      return sum + header.getSize()
    }, 0) ?? 0
  )
}

export function table_getCenterTotalSize<TData extends RowData>(
  table: Table<TData>,
) {
  return (
    table.getCenterHeaderGroups()[0]?.headers.reduce((sum, header) => {
      return sum + header.getSize()
    }, 0) ?? 0
  )
}

export function table_getRightTotalSize<TData extends RowData>(
  table: Table<TData>,
) {
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
