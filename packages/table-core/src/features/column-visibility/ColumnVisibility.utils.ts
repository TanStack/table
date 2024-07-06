import { Cell, Column, Row, RowData, Table, Updater } from '../../types'
import { getMemoOptions, memo } from '../../utils'
import { ColumnPinningPosition } from '../column-pinning/ColumnPinning.types'
import { ColumnVisibilityState } from './ColumnVisibility.types'

export function column_toggleVisibility<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>,
  value?: boolean,
): void {
  if (column.getCanHide()) {
    table.setColumnVisibility((old) => ({
      ...old,
      [column.id]: value ?? !column.getIsVisible(),
    }))
  }
}

export function column_getIsVisible<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>,
) {
  const childColumns = column.columns
  return (
    (childColumns.length
      ? childColumns.some((c) => c.getIsVisible())
      : table.getState().columnVisibility?.[column.id]) ?? true
  )
}

export function column_getCanHide<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>,
) {
  return (
    (column.columnDef.enableHiding ?? true) &&
    (table.options.enableHiding ?? true)
  )
}

export function column_getToggleVisibilityHandler<
  TData extends RowData,
  TValue,
>(column: Column<TData, TValue>) {
  return (e: unknown) => {
    column.toggleVisibility?.(
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}

export function column_getVisibleLeafColumns<TData extends RowData>(
  table: Table<TData>,
  position?: ColumnPinningPosition | 'center',
) {
  return !position
    ? table.getVisibleLeafColumns()
    : position === 'center'
      ? table.getCenterVisibleLeafColumns()
      : position === 'left'
        ? table.getLeftVisibleLeafColumns()
        : table.getRightVisibleLeafColumns()
}

export function row_getAllVisibleCells<TData extends RowData>(
  cells: Cell<TData, unknown>[],
) {
  return cells.filter((cell) => cell.column.getIsVisible())
}

export function row_getVisibleCells<TData extends RowData>(
  left: Cell<TData, unknown>[],
  center: Cell<TData, unknown>[],
  right: Cell<TData, unknown>[],
) {
  return [...left, ...center, ...right]
}

export function table_makeVisibleColumnsMethod<TData extends RowData>(
  table: Table<TData>,
  key: string,
  getColumns: () => Column<TData, unknown>[],
): () => Column<TData, unknown>[] {
  return memo(
    () => [
      getColumns(),
      getColumns()
        .filter((d) => d.getIsVisible())
        .map((d) => d.id)
        .join('_'),
    ],
    (columns) => {
      return columns.filter((d) => d.getIsVisible?.())
    },
    getMemoOptions(table.options, 'debugColumns', key),
  )
}

export function table_setColumnVisibility<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<ColumnVisibilityState>,
) {
  table.options.onColumnVisibilityChange?.(updater)
}

export function table_resetColumnVisibility<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean,
) {
  table.setColumnVisibility(
    defaultState ? {} : table.initialState.columnVisibility ?? {},
  )
}

export function table_toggleAllColumnsVisible<TData extends RowData>(
  table: Table<TData>,
  value?: boolean,
) {
  value = value ?? !table.getIsAllColumnsVisible()

  table.setColumnVisibility(
    table.getAllLeafColumns().reduce(
      (obj, column) => ({
        ...obj,
        [column.id]: !value ? !column.getCanHide?.() : value,
      }),
      {},
    ),
  )
}

export function table_getIsAllColumnsVisible<TData extends RowData>(
  table: Table<TData>,
) {
  return !table.getAllLeafColumns().some((column) => !column.getIsVisible?.())
}

export function table_getIsSomeColumnsVisible<TData extends RowData>(
  table: Table<TData>,
) {
  return table.getAllLeafColumns().some((column) => column.getIsVisible?.())
}

export function table_getToggleAllColumnsVisibilityHandler<
  TData extends RowData,
>(table: Table<TData>) {
  return (e: unknown) => {
    table.toggleAllColumnsVisible(
      ((e as MouseEvent).target as HTMLInputElement)?.checked,
    )
  }
}
