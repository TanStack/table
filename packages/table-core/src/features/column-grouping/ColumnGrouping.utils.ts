import { BuiltInAggregationFn, aggregationFns } from '../../aggregationFns'
import { Cell, Column, Row, RowData, Table, Updater } from '../../types'
import { isFunction } from '../../utils'
import { GroupingState } from './ColumnGrouping.types'

export function column_toggleGrouping<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>
) {
  table.setGrouping(old => {
    // Find any existing grouping for this column
    if (old?.includes(column.id)) {
      return old.filter(d => d !== column.id)
    }

    return [...(old ?? []), column.id]
  })
}

export function column_getCanGroup<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>
) {
  return (
    (column.columnDef.enableGrouping ?? true) &&
    (table.options.enableGrouping ?? true) &&
    (!!column.accessorFn || !!column.columnDef.getGroupingValue)
  )
}

export function column_getIsGrouped<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>
) {
  return table.getState().grouping?.includes(column.id)
}

export function column_getGroupedIndex<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>
) {
  return table.getState().grouping?.indexOf(column.id)
}

export function column_getToggleGroupingHandler<TData extends RowData, TValue>(
  column: Column<TData, TValue>
) {
  const canGroup = column.getCanGroup()

  return () => {
    if (!canGroup) return
    column.toggleGrouping()
  }
}

export function column_getAutoAggregationFn<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>
) {
  const firstRow = table.getCoreRowModel().flatRows[0]

  const value = firstRow?.getValue(column.id)

  if (typeof value === 'number') {
    return aggregationFns.sum
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return aggregationFns.extent
  }
}

export function column_getAggregationFn<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>
) {
  if (!column) {
    throw new Error()
  }

  return isFunction(column.columnDef.aggregationFn)
    ? column.columnDef.aggregationFn
    : column.columnDef.aggregationFn === 'auto'
      ? column.getAutoAggregationFn()
      : table.options.aggregationFns?.[
          column.columnDef.aggregationFn as string
        ] ??
        aggregationFns[column.columnDef.aggregationFn as BuiltInAggregationFn]
}

export function table_setGrouping<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<GroupingState>
) {
  table.options.onGroupingChange?.(updater)
}

export function table_resetGrouping<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean
) {
  table.setGrouping(defaultState ? [] : table.initialState?.grouping ?? [])
}

export function table_getPreGroupedRowModel<TData extends RowData>(
  table: Table<TData>
) {
  return table.getFilteredRowModel()
}

export function table_getGroupedRowModel<TData extends RowData>(
  table: Table<TData>
) {
  if (!table._getGroupedRowModel && table.options.getGroupedRowModel) {
    table._getGroupedRowModel = table.options.getGroupedRowModel(table)
  }

  if (table.options.manualGrouping || !table._getGroupedRowModel) {
    return table.getPreGroupedRowModel()
  }

  return table._getGroupedRowModel()
}

export function row_getIsGrouped<TData extends RowData>(row: Row<TData>) {
  return !!row.groupingColumnId
}

export function row_getGroupingValue<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
  columnId: string
) {
  if (row._groupingValuesCache.hasOwnProperty(columnId)) {
    return row._groupingValuesCache[columnId]
  }

  const column = table.getColumn(columnId)

  if (!column?.columnDef.getGroupingValue) {
    return row.getValue(columnId)
  }

  row._groupingValuesCache[columnId] = column.columnDef.getGroupingValue(
    row.original
  )

  return row._groupingValuesCache[columnId]
}

export function cell_getIsGrouped<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  row: Row<TData>
) {
  return column.getIsGrouped() && column.id === row.groupingColumnId
}

export function cell_getIsPlaceholder<TData extends RowData, TValue>(
  cell: Cell<TData, TValue>,
  column: Column<TData, TValue>
) {
  return !cell.getIsGrouped() && column.getIsGrouped()
}

export function cell_getIsAggregated<TData extends RowData, TValue>(
  cell: Cell<TData, TValue>,
  row: Row<TData>
) {
  return (
    !cell.getIsGrouped() && !cell.getIsPlaceholder() && !!row.subRows?.length
  )
}
