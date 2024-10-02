import {
  table_getAllFlatColumns,
  table_getAllLeafColumns,
} from '../../core/columns/Columns.utils'
import { row_getAllCells } from '../../core/rows/Rows.utils'
import {
  table_getInitialState,
  table_getState,
} from '../../core/table/Tables.utils'
import {
  table_getCenterVisibleLeafColumns,
  table_getLeftVisibleLeafColumns,
  table_getRightVisibleLeafColumns,
} from '../column-pinning/ColumnPinning.utils'
import type { Fns } from '../../types/Fns'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'
import type { ColumnPinningPosition } from '../column-pinning/ColumnPinning.types'
import type {
  ColumnDef_ColumnVisibility,
  ColumnVisibilityState,
} from './ColumnVisibility.types'
import type { Row } from '../../types/Row'

export function getDefaultColumnVisibilityState(): ColumnVisibilityState {
  return structuredClone({})
}

export function column_toggleVisibility<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: Partial<ColumnDef_ColumnVisibility>
  },
  table: Table_Internal<TFeatures, TFns, TData>,
  visible?: boolean,
): void {
  if (column_getCanHide(column, table)) {
    table_setColumnVisibility(table, (old) => ({
      ...old,
      [column.id]: visible ?? !column_getIsVisible(column, table),
    }))
  }
}

export function column_getIsVisible<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: Partial<ColumnDef_ColumnVisibility>
  },
  table: Table_Internal<TFeatures, TFns, TData>,
): boolean {
  const childColumns = column.columns
  return (
    (childColumns.length
      ? childColumns.some((c) => column_getIsVisible(c, table))
      : table_getState(table).columnVisibility?.[column.id]) ?? true
  )
}

export function column_getCanHide<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: Partial<ColumnDef_ColumnVisibility>
  },
  table: Table_Internal<TFeatures, TFns, TData>,
) {
  return (
    (column.columnDef.enableHiding ?? true) &&
    (table.options.enableHiding ?? true)
  )
}

export function column_getToggleVisibilityHandler<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: Partial<ColumnDef_ColumnVisibility>
  },
  table: Table_Internal<TFeatures, TFns, TData>,
) {
  return (e: unknown) => {
    column_toggleVisibility(
      column,
      table,
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}

export function column_getVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TFns, TData>,
  position?: ColumnPinningPosition | 'center',
) {
  return !position
    ? table_getVisibleLeafColumns(table)
    : position === 'center'
      ? table_getCenterVisibleLeafColumns(table)
      : position === 'left'
        ? table_getLeftVisibleLeafColumns(table)
        : table_getRightVisibleLeafColumns(table)
}

export function row_getAllVisibleCells<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  row: Row<TFeatures, TFns, TData>,
  table: Table_Internal<TFeatures, TFns, TData>,
) {
  return row_getAllCells(row, table).filter((cell) =>
    column_getIsVisible(cell.column, table),
  )
}

export function row_getVisibleCells<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  left: Array<Cell<TFeatures, TFns, TData, unknown>>,
  center: Array<Cell<TFeatures, TFns, TData, unknown>>,
  right: Array<Cell<TFeatures, TFns, TData, unknown>>,
) {
  return [...left, ...center, ...right]
}

export function table_getVisibleFlatColumns<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>) {
  return table_getAllFlatColumns(table).filter((column) =>
    column_getIsVisible(column, table),
  )
}

export function table_getVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>) {
  return table_getAllLeafColumns(table).filter((column) =>
    column_getIsVisible(column, table),
  )
}

export function table_setColumnVisibility<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TFns, TData>,
  updater: Updater<ColumnVisibilityState>,
) {
  table.options.onColumnVisibilityChange?.(updater)
}

export function table_resetColumnVisibility<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>, defaultState?: boolean) {
  table_setColumnVisibility(
    table,
    defaultState ? {} : (table_getInitialState(table).columnVisibility ?? {}),
  )
}

export function table_toggleAllColumnsVisible<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>, value?: boolean) {
  value = value ?? !table_getIsAllColumnsVisible(table)

  table_setColumnVisibility(
    table,
    table.getAllLeafColumns().reduce(
      (obj, column) => ({
        ...obj,
        [column.id]: !value ? !column_getCanHide(column, table) : value,
      }),
      {},
    ),
  )
}

export function table_getIsAllColumnsVisible<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>) {
  return !table
    .getAllLeafColumns()
    .some((column) => !column_getIsVisible(column, table))
}

export function table_getIsSomeColumnsVisible<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>) {
  return table
    .getAllLeafColumns()
    .some((column) => column_getIsVisible(column, table))
}

export function table_getToggleAllColumnsVisibilityHandler<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>) {
  return (e: unknown) => {
    table_toggleAllColumnsVisible(
      table,
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}
