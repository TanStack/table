import { table_getPinnedVisibleLeafColumns } from '../column-pinning/columnPinningFeature.utils'
import { cloneState } from '../../utils'
import type { GroupingState } from '../column-grouping/columnGroupingFeature.types'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Column_Internal } from '../../types/Column'
import type { ColumnPinningPosition } from '../column-pinning/columnPinningFeature.types'
import type { ColumnOrderState } from './columnOrderingFeature.types'

/**
 * Returns the default column order state.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultColumnOrderState()
 * ```
 */
export function getDefaultColumnOrderState(): ColumnOrderState {
  return []
}

/**
 * Returns index for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getIndex(column)
 * ```
 */
export function column_getIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position?: ColumnPinningPosition | 'center',
) {
  const columns = table_getPinnedVisibleLeafColumns(column.table, position)
  return columns.findIndex((d) => d.id === column.id)
}

/**
 * Returns is first column for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getIsFirstColumn(column)
 * ```
 */
export function column_getIsFirstColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position?: ColumnPinningPosition | 'center',
) {
  const columns = table_getPinnedVisibleLeafColumns(column.table, position)
  return columns[0]?.id === column.id
}

/**
 * Returns is last column for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getIsLastColumn(column)
 * ```
 */
export function column_getIsLastColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position?: ColumnPinningPosition | 'center',
) {
  const columns = table_getPinnedVisibleLeafColumns(column.table, position)
  return columns[columns.length - 1]?.id === column.id
}

/**
 * Updates the table's column order state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
 *
 * @example
 * ```ts
 * table_setColumnOrder(table, (old) => old)
 * ```
 */
export function table_setColumnOrder<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<ColumnOrderState>) {
  table.options.onColumnOrderChange?.(updater)
}

/**
 * Resets the table's column order state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
 *
 * @example
 * ```ts
 * table_resetColumnOrder(table)
 * table_resetColumnOrder(table, true)
 * ```
 */
export function table_resetColumnOrder<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnOrder(
    table,
    defaultState ? [] : cloneState(table.initialState.columnOrder ?? []),
  )
}

/**
 * Returns order columns fn for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getOrderColumnsFn(table)
 * ```
 */
export function table_getOrderColumnsFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const columnOrder = table.atoms.columnOrder?.get()

  return (columns: Array<Column_Internal<TFeatures, TData, unknown>>) => {
    // Sort grouped columns to the start of the column list
    // before the headers are built
    let orderedColumns: Array<Column_Internal<TFeatures, TData, unknown>> = []

    // If there is no order, return the normal columns
    if (!columnOrder?.length) {
      orderedColumns = columns
    } else {
      // Index columns by id for O(1) lookup
      const remaining = new Map<
        string,
        Column_Internal<TFeatures, TData, unknown>
      >()
      for (const column of columns) remaining.set(column.id, column)

      // Place columns in the requested order, removing each as it's used
      // (handles duplicates and unknown ids in columnOrder)
      for (const id of columnOrder) {
        const column = remaining.get(id)
        if (column) {
          orderedColumns.push(column)
          remaining.delete(id)
        }
      }

      // Append leftover columns in their original order
      for (const column of columns) {
        if (remaining.has(column.id)) orderedColumns.push(column)
      }
    }

    return orderColumns(table, orderedColumns)
  }
}

/**
 * Orders leaf columns with manual ordering, grouping, and pinning rules.
 *
 * This helper is used by the column ordering feature to produce the final visible column order.
 *
 * @example
 * ```ts
 * const orderedColumns = orderColumns(leafColumns, columnOrder, grouping, groupedColumnMode)
 * ```
 */
export function orderColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  leafColumns: Array<Column_Internal<TFeatures, TData, unknown>>,
) {
  const grouping = table.atoms.grouping?.get() ?? ([] as GroupingState)
  const { groupedColumnMode } = table.options

  if (!grouping.length || !groupedColumnMode) {
    return leafColumns
  }

  const nonGroupingColumns = leafColumns.filter(
    (col) => !grouping.includes(col.id),
  )

  if (groupedColumnMode === 'remove') {
    return nonGroupingColumns
  }

  const leafColumnsById = new Map<
    string,
    Column_Internal<TFeatures, TData, unknown>
  >()
  for (const col of leafColumns) leafColumnsById.set(col.id, col)

  const groupingColumns: Array<Column_Internal<TFeatures, TData, unknown>> = []
  for (const g of grouping) {
    const col = leafColumnsById.get(g)
    if (col) groupingColumns.push(col)
  }

  return [...groupingColumns, ...nonGroupingColumns]
}
