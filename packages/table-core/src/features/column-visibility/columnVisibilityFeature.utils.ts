import { callMemoOrStaticFn, cloneState } from '../../utils'
import { getDefaultColumnPinningState } from '../column-pinning/columnPinningFeature.utils'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Cell } from '../../types/Cell'
import type { Column_Internal } from '../../types/Column'
import type { ColumnVisibilityState } from './columnVisibilityFeature.types'
import type { Row } from '../../types/Row'

/**
 * Creates the default column visibility state.
 *
 * The feature default is an empty object, where missing column ids are treated
 * as visible. Reset APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const visibility = getDefaultColumnVisibilityState()
 * ```
 */
export function getDefaultColumnVisibilityState(): ColumnVisibilityState {
  return {}
}

/**
 * Updates this column's visibility when hiding is allowed.
 *
 * Passing `visible` stores that value. Omitting it flips the column's current
 * visibility state. Columns that cannot hide are left unchanged.
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
 * Checks whether this column is visible.
 *
 * Leaf columns read `state.columnVisibility[column.id]`, where missing entries
 * default to visible. Parent columns are visible when at least one child column
 * is visible.
 *
 * @example
 * ```ts
 * const visible = column_getIsVisible(column)
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
 * Checks whether this column is allowed to be hidden.
 *
 * Both `columnDef.enableHiding` and table `enableHiding` default to `true`.
 *
 * @example
 * ```ts
 * const canHide = column_getCanHide(column)
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
 * Creates a checkbox-style handler that writes this column's visibility.
 *
 * The handler reads `event.target.checked`, so it is intended for visibility
 * controls whose checked state means "visible".
 *
 * @example
 * ```ts
 * const onChange = column_getToggleVisibilityHandler(column)
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
 * Collects the cells from this row whose columns are visible.
 *
 * When column pinning is active, the result is ordered as left-pinned cells,
 * center cells, then right-pinned cells.
 *
 * @example
 * ```ts
 * const visibleCells = row_getVisibleCells(row)
 * ```
 */
export function row_getVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Array<Cell<TFeatures, TData, unknown>> {
  const allCells = row.getAllCells()
  const visibleCells: Array<Cell<TFeatures, TData, unknown>> = []
  for (let i = 0; i < allCells.length; i++) {
    const cell = allCells[i]!
    if (callMemoOrStaticFn(cell.column, 'getIsVisible', column_getIsVisible)) {
      visibleCells.push(cell)
    }
  }

  const { left, right } =
    row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  if (!left.length && !right.length) return visibleCells // no pinning, return early

  const visibleCellsByColumnId = callMemoOrStaticFn(
    row,
    'getVisibleCellsByColumnId',
    row_getVisibleCellsByColumnId,
  )

  const leftCells: Array<Cell<TFeatures, TData, unknown>> = []
  for (let i = 0; i < left.length; i++) {
    const cell = visibleCellsByColumnId[left[i]!]
    if (cell) leftCells.push(cell)
  }

  const rightCells: Array<Cell<TFeatures, TData, unknown>> = []
  for (let i = 0; i < right.length; i++) {
    const cell = visibleCellsByColumnId[right[i]!]
    if (cell) rightCells.push(cell)
  }

  // Center cells: visible cells in natural column order, minus pinned ones.
  const centerCells: Array<Cell<TFeatures, TData, unknown>> = []
  for (let i = 0; i < visibleCells.length; i++) {
    const cell = visibleCells[i]!
    const id = cell.column.id
    if (!left.includes(id) && !right.includes(id)) centerCells.push(cell)
  }

  return [...leftCells, ...centerCells, ...rightCells]
}

/**
 * Builds a lookup map of this row's visible cells keyed by column id.
 *
 * Hidden columns are omitted from the map.
 *
 * @example
 * ```ts
 * const visibleCellsById = row_getVisibleCellsByColumnId(row)
 * ```
 */
export function row_getVisibleCellsByColumnId<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Record<string, Cell<TFeatures, TData, unknown>> {
  const result: Record<string, Cell<TFeatures, TData, unknown>> = {}
  const allCells = row.getAllCells()
  for (let i = 0; i < allCells.length; i++) {
    const cell = allCells[i]!
    if (callMemoOrStaticFn(cell.column, 'getIsVisible', column_getIsVisible)) {
      result[cell.column.id] = cell
    }
  }
  return result
}

/**
 * Filters the flat column list down to visible columns.
 *
 * Parent/group columns are included when `column_getIsVisible` considers them
 * visible.
 *
 * @example
 * ```ts
 * const columns = table_getVisibleFlatColumns(table)
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
 * Filters leaf columns down to those currently visible.
 *
 * This is the column list most row rendering code uses before pinning-specific
 * partitioning.
 *
 * @example
 * ```ts
 * const columns = table_getVisibleLeafColumns(table)
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
 * Routes a column visibility updater through the table's visibility change handler.
 *
 * The updater may be a next visibility map or a function of the previous map,
 * matching the instance `table.setColumnVisibility` behavior.
 *
 * @example
 * ```ts
 * table_setColumnVisibility(table, (old) => ({ ...old, age: false }))
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
 * Resets `columnVisibility` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.columnVisibility` when
 * it exists. Passing `true` ignores initial state and resets to `{}`.
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
 * Shows or hides every hideable leaf column.
 *
 * Columns that cannot hide stay visible when toggling all columns off.
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

  const visibility: Record<string, boolean> = {}
  const leafColumns = table.getAllLeafColumns()
  for (let i = 0; i < leafColumns.length; i++) {
    const column = leafColumns[i]!
    visibility[column.id] = !value ? !column_getCanHide(column) : value
  }

  table_setColumnVisibility(table, visibility)
}

/**
 * Checks whether every leaf column is currently visible.
 *
 * Non-hideable columns are naturally visible because missing visibility entries
 * default to `true`.
 *
 * @example
 * ```ts
 * const allVisible = table_getIsAllColumnsVisible(table)
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
 * Checks whether at least one leaf column is currently visible.
 *
 * This is useful for tri-state "show all columns" controls.
 *
 * @example
 * ```ts
 * const someVisible = table_getIsSomeColumnsVisible(table)
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
 * Creates a checkbox-style handler that shows or hides all columns.
 *
 * The handler reads `event.target.checked`, so it is intended for controls whose
 * checked state means "all columns visible".
 *
 * @example
 * ```ts
 * const onChange = table_getToggleAllColumnsVisibilityHandler(table)
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
