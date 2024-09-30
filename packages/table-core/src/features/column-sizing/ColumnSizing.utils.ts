import {
  table_getInitialState,
  table_getState,
} from '../../core/table/Tables.utils'
import {
  table_getCenterHeaderGroups,
  table_getLeftHeaderGroups,
  table_getRightHeaderGroups,
} from '../column-pinning/ColumnPinning.utils'
import { table_getHeaderGroups } from '../../core/headers/Headers.utils'
import { column_getIndex } from '../column-ordering/ColumnOrdering.utils'
import { column_getVisibleLeafColumns } from '../column-visibility/ColumnVisibility.utils'
import type { Fns } from '../../types/Fns'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column } from '../../types/Column'
import type {
  ColumnDef_ColumnSizing,
  ColumnSizingState,
} from './ColumnSizing.types'

export function getDefaultColumnSizingColumnDef() {
  return structuredClone({
    size: 150,
    minSize: 20,
    maxSize: Number.MAX_SAFE_INTEGER,
  })
}

export function column_getSize<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: ColumnDef_ColumnSizing
  },
  table: Table_Internal<TFeatures, TFns, TData>,
): number {
  const defaultSizes = getDefaultColumnSizingColumnDef()
  const columnSize = table_getState(table).columnSizing?.[column.id]

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
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: ColumnDef_ColumnSizing
  },
  table: Table_Internal<TFeatures, TFns, TData>,
  position?: false | 'left' | 'right' | 'center',
): number {
  return column_getVisibleLeafColumns(table, position)
    .slice(0, column_getIndex(column, table, position))
    .reduce((sum, c) => sum + column_getSize(c, table), 0)
}

export function column_getAfter<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue>,
  table: Table_Internal<TFeatures, TFns, TData>,
  position?: false | 'left' | 'right' | 'center',
): number {
  return column_getVisibleLeafColumns(table, position)
    .slice(column_getIndex(column, table, position) + 1)
    .reduce((sum, c) => sum + column_getSize(c, table), 0)
}

export function column_resetSize<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  table: Table_Internal<TFeatures, TFns, TData>,
  column: Column<TFeatures, TFns, TData, TValue>,
) {
  table_setColumnSizing(table, ({ [column.id]: _, ...rest }) => {
    return rest
  })
}

export function header_getSize<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  header: Header<TFeatures, TFns, TData, TValue>,
  table: Table_Internal<TFeatures, TFns, TData>,
) {
  let sum = 0

  const recurse = (h: Header<TFeatures, TFns, TData, TValue>) => {
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
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  header: Header<TFeatures, TFns, TData, TValue>,
  table: Table_Internal<TFeatures, TFns, TData>,
): number {
  if (header.index > 0) {
    const prevSiblingHeader = header.headerGroup?.headers[header.index - 1]
    if (prevSiblingHeader) {
      return (
        header_getStart(prevSiblingHeader, table) +
        header_getSize(prevSiblingHeader, table)
      )
    }
  }

  return 0
}

export function table_setColumnSizing<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TFns, TData>,
  updater: Updater<ColumnSizingState>,
) {
  table.options.onColumnSizingChange?.(updater)
}

export function table_resetColumnSizing<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>, defaultState?: boolean) {
  table_setColumnSizing(
    table,
    defaultState ? {} : (table_getInitialState(table).columnSizing ?? {}),
  )
}

export function table_getTotalSize<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>) {
  return (
    table_getHeaderGroups(table)[0]?.headers.reduce((sum, header) => {
      return sum + header_getSize(header, table)
    }, 0) ?? 0
  )
}

export function table_getLeftTotalSize<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>) {
  return (
    table_getLeftHeaderGroups(table)[0]?.headers.reduce((sum, header) => {
      return sum + header_getSize(header, table)
    }, 0) ?? 0
  )
}

export function table_getCenterTotalSize<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>) {
  return (
    table_getCenterHeaderGroups(table)[0]?.headers.reduce((sum, header) => {
      return sum + header_getSize(header, table)
    }, 0) ?? 0
  )
}

export function table_getRightTotalSize<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>) {
  return (
    table_getRightHeaderGroups(table)[0]?.headers.reduce((sum, header) => {
      return sum + header_getSize(header, table)
    }, 0) ?? 0
  )
}
