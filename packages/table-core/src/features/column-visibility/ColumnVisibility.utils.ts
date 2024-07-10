import { Row } from '../../types'
import { getMemoOptions, memo } from '../../utils'
import type {
  Cell,
  CellData,
  Column,
  RowData,
  Table,
  TableFeatures,
  Updater,
} from '../../types'
import type { ColumnPinningPosition } from '../column-pinning/ColumnPinning.types'
import type { ColumnVisibilityState } from './ColumnVisibility.types'

export function column_toggleVisibility<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  table: Table<TFeatures, TData>,
  value?: boolean,
): void {
  if (column_getCanHide(column, table)) {
    table_setColumnVisibility(table, (old) => ({
      ...old,
      [column.id]: value ?? !column_getIsVisible(column, table),
    }))
  }
}

export function column_getIsVisible<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  const childColumns = column.columns
  return (
    (childColumns.length
      ? childColumns.some((c) => c.getIsVisible())
      : table.getState().columnVisibility[column.id]) ?? true
  )
}

export function column_getCanHide<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  return (
    (column.columnDef.enableHiding ?? true) &&
    (table.options.enableHiding ?? true)
  )
}

export function column_getToggleVisibilityHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
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
  TData extends RowData,
>(table: Table<TFeatures, TData>, position?: ColumnPinningPosition | 'center') {
  return !position
    ? table.getVisibleLeafColumns()
    : position === 'center'
      ? table.getCenterVisibleLeafColumns()
      : position === 'left'
        ? table.getLeftVisibleLeafColumns()
        : table.getRightVisibleLeafColumns()
}

export function row_getAllVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  cells: Array<Cell<TFeatures, TData, unknown>>,
  table: Table<TFeatures, TData>,
) {
  return cells.filter((cell) => column_getIsVisible(cell.column, table))
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

export function table_makeVisibleColumnsMethod<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  key: string,
  getColumns: () => Array<Column<TFeatures, TData, unknown>>,
): () => Array<Column<TFeatures, TData, unknown>> {
  return memo(
    () => [
      getColumns(),
      getColumns()
        .filter((column) => column_getIsVisible(column, table))
        .map((d) => d.id)
        .join('_'),
    ],
    (columns) => {
      return columns.filter((column) => column_getIsVisible(column, table))
    },
    getMemoOptions(table.options, 'debugColumns', key),
  )
}

export function table_setColumnVisibility<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, updater: Updater<ColumnVisibilityState>) {
  table.options.onColumnVisibilityChange?.(updater)
}

export function table_resetColumnVisibility<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnVisibility(
    table,
    defaultState ? {} : table.initialState.columnVisibility,
  )
}

export function table_toggleAllColumnsVisible<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, value?: boolean) {
  value = value ?? !table_getIsAllColumnsVisible(table)

  table_setColumnVisibility(
    table,
    table.getAllLeafColumns().reduce(
      (obj, column) => ({
        ...obj,
        [column.id]: !value ? !column.getCanHide() : value,
      }),
      {},
    ),
  )
}

export function table_getIsAllColumnsVisible<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return !table.getAllLeafColumns().some((column) => !column.getIsVisible())
}

export function table_getIsSomeColumnsVisible<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return table.getAllLeafColumns().some((column) => column.getIsVisible())
}

export function table_getToggleAllColumnsVisibilityHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return (e: unknown) => {
    table_toggleAllColumnsVisible(
      table,
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}