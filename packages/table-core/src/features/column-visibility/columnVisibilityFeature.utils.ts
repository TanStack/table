import { callMemoOrStaticFn } from '../../utils'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Cell } from '../../types/Cell'
import type { Column_Internal } from '../../types/Column'
import type { ColumnVisibilityState } from './columnVisibilityFeature.types'
import type { Row } from '../../types/Row'

export function getDefaultColumnVisibilityState(): ColumnVisibilityState {
  return structuredClone({})
}

export function column_toggleVisibility<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>, visible?: boolean): void {
  if (column_getCanHide(column)) {
    table_setColumnVisibility(column._table, (old) => ({
      ...old,
      [column.id]:
        visible ??
        !callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
    }))
  }
}

export function column_getIsVisible<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): boolean {
  const childColumns = column.columns
  return (
    (childColumns.length
      ? childColumns.some((childColumn) =>
          callMemoOrStaticFn(childColumn, 'getIsVisible', column_getIsVisible),
        )
      : column._table.options.state?.columnVisibility?.[column.id]) ?? true
  )
}

export function column_getCanHide<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return (
    (column.columnDef.enableHiding ?? true) &&
    (column._table.options.enableHiding ?? true)
  )
}

export function column_getToggleVisibilityHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return (e: unknown) => {
    column_toggleVisibility(
      column,
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}

export function row_getAllVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return row
    .getAllCells()
    .filter((cell) =>
      callMemoOrStaticFn(cell.column, 'getIsVisible', column_getIsVisible),
    )
}

export function row_getVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  left: Array<Cell<TFeatures, TData, unknown>>,
  center: Array<Cell<TFeatures, TData, unknown>>,
  right: Array<Cell<TFeatures, TData, unknown>>,
) {
  return [...left, ...center, ...right]
}

export function table_getVisibleFlatColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return table
    .getAllFlatColumns()
    .filter((column) =>
      callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
    )
}

export function table_getVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return table
    .getAllLeafColumns()
    .filter((column) =>
      callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
    )
}

export function table_setColumnVisibility<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<ColumnVisibilityState>,
) {
  table.options.onColumnVisibilityChange?.(updater)
}

export function table_resetColumnVisibility<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnVisibility(
    table,
    defaultState ? {} : (table.initialState.columnVisibility ?? {}),
  )
}

export function table_toggleAllColumnsVisible<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, value?: boolean) {
  value = value ?? !table_getIsAllColumnsVisible(table)

  table_setColumnVisibility(
    table,
    table.getAllLeafColumns().reduce(
      (obj, column) => ({
        ...obj,
        [column.id]: !value ? !column_getCanHide(column) : value,
      }),
      {},
    ),
  )
}

export function table_getIsAllColumnsVisible<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return !table
    .getAllLeafColumns()
    .some(
      (column) =>
        !callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
    )
}

export function table_getIsSomeColumnsVisible<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return table
    .getAllLeafColumns()
    .some((column) =>
      callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
    )
}

export function table_getToggleAllColumnsVisibilityHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (e: unknown) => {
    table_toggleAllColumnsVisible(
      table,
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}
