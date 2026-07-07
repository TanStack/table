import { table_getPinnedVisibleLeafColumns } from '../column-pinning/columnPinningFeature.utils'
import { callMemoOrStaticFn, cloneState, makeObjectMap } from '../../utils'
import type { GroupingState } from '../column-grouping/columnGroupingFeature.types'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Column, Column_Internal } from '../../types/Column'
import type { ColumnPinningPosition } from '../column-pinning/columnPinningFeature.types'
import type {
  ColumnIndexes,
  ColumnOrderState,
} from './columnOrderingFeature.types'

/**
 * Creates the default column order state.
 *
 * The feature default is an empty array, meaning leaf columns keep their natural
 * definition order. Reset APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const order = getDefaultColumnOrderState()
 * ```
 */
export function getDefaultColumnOrderState(): ColumnOrderState {
  return []
}

/**
 * Builds column-id to index records for each visible pinning region.
 *
 * All four regions are built in one pass so a single memo entry serves every
 * `column_getIndex` lookup without per-column scans.
 *
 * @example
 * ```ts
 * const indexes = table_getColumnIndexes(table)
 * ```
 */
export function table_getColumnIndexes<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): ColumnIndexes {
  const buildIndexes = (
    columns: ReadonlyArray<
      | Column<TFeatures, TData, unknown>
      | Column_Internal<TFeatures, TData, unknown>
    >,
  ): Record<string, number> => {
    const indexes = makeObjectMap<number>()
    for (let i = 0; i < columns.length; i++) {
      indexes[columns[i]!.id] = i
    }
    return indexes
  }

  return {
    all: buildIndexes(table_getPinnedVisibleLeafColumns(table)),
    center: buildIndexes(table_getPinnedVisibleLeafColumns(table, 'center')),
    left: buildIndexes(table_getPinnedVisibleLeafColumns(table, 'left')),
    right: buildIndexes(table_getPinnedVisibleLeafColumns(table, 'right')),
  }
}

/**
 * Finds this column's index within a visible pinning region.
 *
 * Pass `'left'`, `'center'`, or `'right'` to search that region; omit the
 * position to search the full visible leaf column list.
 *
 * @example
 * ```ts
 * const index = column_getIndex(column, 'center')
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
  const indexes = callMemoOrStaticFn(
    column.table,
    'getColumnIndexes',
    table_getColumnIndexes,
  )
  const key =
    position === 'left'
      ? 'left'
      : position === 'right'
        ? 'right'
        : position === 'center'
          ? 'center'
          : 'all'
  return indexes[key][column.id] ?? -1
}

/**
 * Checks whether this column is the first visible column in a pinning region.
 *
 * The same `position` semantics as `column_getIndex` apply.
 *
 * @example
 * ```ts
 * const isFirst = column_getIsFirstColumn(column, 'left')
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
 * Checks whether this column is the last visible column in a pinning region.
 *
 * The same `position` semantics as `column_getIndex` apply.
 *
 * @example
 * ```ts
 * const isLast = column_getIsLastColumn(column, 'right')
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
 * Routes a column order updater through the table's column-order change handler.
 *
 * The updater may be a next ordered id array or a function of the previous
 * array, matching the instance `table.setColumnOrder` behavior.
 *
 * @example
 * ```ts
 * table_setColumnOrder(table, ['firstName', 'lastName', 'age'])
 * ```
 */
export function table_setColumnOrder<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<ColumnOrderState>) {
  table.options.onColumnOrderChange?.(updater)
}

/**
 * Resets `columnOrder` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.columnOrder` when it
 * exists. Passing `true` ignores initial state and resets to `[]`.
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
 * Creates the ordering function used to arrange leaf columns.
 *
 * The returned function applies `state.columnOrder`, preserves unspecified
 * columns in their original order, then delegates to grouping rules.
 *
 * @example
 * ```ts
 * const orderColumnsForTable = table_getOrderColumnsFn(table)
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
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i]!
        remaining.set(column.id, column)
      }

      // Place columns in the requested order, removing each as it's used
      // (handles duplicates and unknown ids in columnOrder)
      for (let i = 0; i < columnOrder.length; i++) {
        const id = columnOrder[i]!
        const column = remaining.get(id)
        if (column) {
          orderedColumns.push(column)
          remaining.delete(id)
        }
      }

      // Append leftover columns in their original order
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i]!
        if (remaining.has(column.id)) orderedColumns.push(column)
      }
    }

    return orderColumns(table, orderedColumns)
  }
}

/**
 * Applies grouped-column placement rules to an already ordered leaf-column list.
 *
 * `groupedColumnMode: 'remove'` drops grouped columns from the list.
 * `groupedColumnMode: 'reorder'` moves grouped columns to the front in grouping
 * state order.
 *
 * @example
 * ```ts
 * const orderedColumns = orderColumns(table, leafColumns)
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
  for (let i = 0; i < leafColumns.length; i++) {
    const col = leafColumns[i]!
    leafColumnsById.set(col.id, col)
  }

  const groupingColumns: Array<Column_Internal<TFeatures, TData, unknown>> = []
  for (let i = 0; i < grouping.length; i++) {
    const col = leafColumnsById.get(grouping[i]!)
    if (col) groupingColumns.push(col)
  }

  return [...groupingColumns, ...nonGroupingColumns]
}
