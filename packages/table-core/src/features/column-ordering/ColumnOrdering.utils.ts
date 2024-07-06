import { column_getVisibleLeafColumns } from '../column-visibility/ColumnVisibility.utils'
import type { Column, RowData, Table, Updater } from '../../types'
import type {
  GroupingColumnMode,
  GroupingState,
} from '../column-grouping/ColumnGrouping.types'
import type { ColumnPinningPosition } from '../column-pinning/ColumnPinning.types'
import type { ColumnOrderState } from './ColumnOrdering.types'

export function column_getIndex<TData extends RowData>(
  columns: Array<Column<TData, unknown>>,
  column: Column<TData, unknown>,
) {
  return columns.findIndex((d) => d.id === column.id)
}

export function column_getIsFirstColumn<TData extends RowData>(
  column: Column<TData, unknown>,
  table: Table<TData>,
  position?: ColumnPinningPosition | 'center',
) {
  const columns = column_getVisibleLeafColumns(table, position)
  return columns[0]?.id === column.id
}

export function column_getIsLastColumn<TData extends RowData>(
  column: Column<TData, unknown>,
  table: Table<TData>,
  position?: ColumnPinningPosition | 'center',
) {
  const columns = column_getVisibleLeafColumns(table, position)
  return columns[columns.length - 1]?.id === column.id
}

export function table_setColumnOrder<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<ColumnOrderState>,
) {
  table.options.onColumnOrderChange?.(updater)
}

export function table_resetColumnOrder<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean,
) {
  table.setColumnOrder(defaultState ? [] : table.initialState.columnOrder)
}

export function table_getOrderColumnsFn<TData extends RowData>(
  columnOrder: ColumnOrderState,
  grouping: GroupingState,
  groupedColumnMode?: false | 'reorder' | 'remove',
) {
  return (columns: Array<Column<TData, unknown>>) => {
    // Sort grouped columns to the start of the column list
    // before the headers are built
    let orderedColumns: Array<Column<TData, unknown>> = []

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

    return orderColumns(orderedColumns, grouping, groupedColumnMode)
  }
}

export function orderColumns<TData extends RowData>(
  leafColumns: Array<Column<TData, unknown>>,
  grouping: Array<string>,
  groupedColumnMode?: GroupingColumnMode,
) {
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
