import { table_getPinnedVisibleLeafColumns } from '../column-pinning/columnPinningFeature.utils'
import type { GroupingState } from '../column-grouping/columnGroupingFeature.types'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Column_Internal } from '../../types/Column'
import type { ColumnPinningPosition } from '../column-pinning/columnPinningFeature.types'
import type { ColumnOrderState } from './columnOrderingFeature.types'

export function getDefaultColumnOrderState(): ColumnOrderState {
  return structuredClone([])
}

export function column_getIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position?: ColumnPinningPosition | 'center',
) {
  const { _table: table } = column
  const columns = table_getPinnedVisibleLeafColumns(table, position)
  return columns.findIndex((d) => d.id === column.id)
}

export function column_getIsFirstColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position?: ColumnPinningPosition | 'center',
) {
  const columns = table_getPinnedVisibleLeafColumns(column._table, position)
  return columns[0]?.id === column.id
}

export function column_getIsLastColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position?: ColumnPinningPosition | 'center',
) {
  const columns = table_getPinnedVisibleLeafColumns(column._table, position)
  return columns[columns.length - 1]?.id === column.id
}

export function table_setColumnOrder<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<ColumnOrderState>) {
  table.options.onColumnOrderChange?.(updater)
}

export function table_resetColumnOrder<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnOrder(
    table,
    defaultState ? [] : (table.initialState.columnOrder ?? []),
  )
}

export function table_getOrderColumnsFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const { columnOrder = [] } = table.options.state ?? {}

  return (columns: Array<Column_Internal<TFeatures, TData, unknown>>) => {
    // Sort grouped columns to the start of the column list
    // before the headers are built
    let orderedColumns: Array<Column_Internal<TFeatures, TData, unknown>> = []

    // If there is no order, return the normal columns
    if (!columnOrder.length) {
      orderedColumns = columns
    } else {
      const columnOrderCopy = [...columnOrder]

      // If there is an order, make a copy of the columns
      const columnsCopy = [...columns]

      // And make a new ordered array of the columns

      // Loop over the columns and place them in order into the new array
      while (columnsCopy.length && columnOrderCopy.length) {
        const targetColumnId = columnOrderCopy.shift()
        const foundIndex = columnsCopy.findIndex((d) => d.id === targetColumnId)
        if (foundIndex > -1) {
          orderedColumns.push(columnsCopy.splice(foundIndex, 1)[0]!)
        }
      }

      // If there are any columns left, add them to the end
      orderedColumns = [...orderedColumns, ...columnsCopy]
    }

    return orderColumns(table, orderedColumns)
  }
}

export function orderColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  leafColumns: Array<Column_Internal<TFeatures, TData, unknown>>,
) {
  const grouping = table.options.state?.grouping ?? ([] as GroupingState)
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

  const groupingColumns = grouping
    .map((g) => leafColumns.find((col) => col.id === g)!)
    .filter(Boolean)

  return [...groupingColumns, ...nonGroupingColumns]
}
