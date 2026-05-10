import { callMemoOrStaticFn, cloneState } from '../../utils'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Cell } from '../../types/Cell'
import type { Column_Internal } from '../../types/Column'
import type { ColumnVisibilityState } from './columnVisibilityFeature.types'
import type { Row } from '../../types/Row'

/**
 * Returns the default column visibility state.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultColumnVisibilityState()
 * ```
 */
export function getDefaultColumnVisibilityState(): ColumnVisibilityState {
  return {}
}

/**
 * Toggles visibility for a column.
 *
 * The update is applied through the owning table state slice and respects the feature options for that column.
 *
 * @example
 * ```ts
 * column_toggleVisibility(column)
 * ```
 */
export function column_toggleVisibility<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>, visible?: boolean): void {
  if (column_getCanHide(column)) {
    table_setColumnVisibility(column.table, (old) => ({
      ...old,
      [column.id]:
        visible ??
        !callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
    }))
  }
}

/**
 * Returns is visible for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getIsVisible(column)
 * ```
 */
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
      : column.table.atoms.columnVisibility?.get()?.[column.id]) ?? true
  )
}

/**
 * Returns whether a column can use hide.
 *
 * This combines column options, table options, and any required accessor or feature state for the capability.
 *
 * @example
 * ```ts
 * const value = column_getCanHide(column)
 * ```
 */
export function column_getCanHide<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return (
    (column.columnDef.enableHiding ?? true) &&
    (column.table.options.enableHiding ?? true)
  )
}

/**
 * Returns an event handler for toggling visibility handler.
 *
 * The handler is intended for direct use in column header controls such as buttons or checkboxes.
 *
 * @example
 * ```ts
 * const value = column_getToggleVisibilityHandler(column)
 * ```
 */
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

/**
 * Returns all visible cells for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getAllVisibleCells(row)
 * ```
 */
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

/**
 * Returns visible cells for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getVisibleCells(row)
 * ```
 */
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

/**
 * Returns visible flat columns for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getVisibleFlatColumns(table)
 * ```
 */
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

/**
 * Returns visible leaf columns for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getVisibleLeafColumns(table)
 * ```
 */
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

/**
 * Updates the table's column visibility state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
 *
 * @example
 * ```ts
 * table_setColumnVisibility(table, (old) => old)
 * ```
 */
export function table_setColumnVisibility<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<ColumnVisibilityState>,
) {
  table.options.onColumnVisibilityChange?.(updater)
}

/**
 * Resets the table's column visibility state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
 *
 * @example
 * ```ts
 * table_resetColumnVisibility(table)
 * table_resetColumnVisibility(table, true)
 * ```
 */
export function table_resetColumnVisibility<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnVisibility(
    table,
    defaultState ? {} : cloneState(table.initialState.columnVisibility ?? {}),
  )
}

/**
 * Toggles all columns visible for the table.
 *
 * This is the table-level convenience API used by UI controls that affect many columns or rows at once.
 *
 * @example
 * ```ts
 * table_toggleAllColumnsVisible(table)
 * ```
 */
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

/**
 * Returns is all columns visible for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getIsAllColumnsVisible(table)
 * ```
 */
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

/**
 * Returns is some columns visible for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getIsSomeColumnsVisible(table)
 * ```
 */
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

/**
 * Returns an event handler for all columns visibility handler.
 *
 * The handler calls the matching table toggle API and can be attached directly to checkbox or button UI.
 *
 * @example
 * ```ts
 * const value = table_getToggleAllColumnsVisibilityHandler(table)
 * ```
 */
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
