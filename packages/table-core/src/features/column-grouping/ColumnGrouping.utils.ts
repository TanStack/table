import { aggregationFns } from '../../fns/aggregationFns'
import { isFunction } from '../../utils'
import { table_getFilteredRowModel } from '../column-filtering/ColumnFiltering.utils'
import type { BuiltInAggregationFn } from '../../fns/aggregationFns'
import type {
  Cell,
  CellData,
  Column,
  Row,
  RowData,
  RowModel,
  Table,
  TableFeatures,
  Updater,
} from '../../types'
import type { GroupingState } from './ColumnGrouping.types'

export function column_toggleGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  table_setGrouping(table, (old) => {
    // Find any existing grouping for this column
    if (old.includes(column.id)) {
      return old.filter((d) => d !== column.id)
    }

    return [...old, column.id]
  })
}

export function column_getCanGroup<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  return (
    (column.columnDef.enableGrouping ?? true) &&
    (table.options.enableGrouping ?? true) &&
    (!!column.accessorFn || !!column.columnDef.getGroupingValue)
  )
}

export function column_getIsGrouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  return table.getState().grouping.includes(column.id)
}

export function column_getGroupedIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  return table.getState().grouping.indexOf(column.id)
}

export function column_getToggleGroupingHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>) {
  const canGroup = column.getCanGroup()

  return () => {
    if (!canGroup) return
    column.toggleGrouping()
  }
}

export function column_getAutoAggregationFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  const firstRow = table.getCoreRowModel().flatRows[0]

  const value = firstRow?.getValue(column.id)

  if (typeof value === 'number') {
    return aggregationFns.sum
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return aggregationFns.extent
  }
}

export function column_getAggregationFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  return isFunction(column.columnDef.aggregationFn)
    ? column.columnDef.aggregationFn
    : column.columnDef.aggregationFn === 'auto'
      ? column.getAutoAggregationFn()
      : table.options.aggregationFns?.[
          column.columnDef.aggregationFn as string
        ] ??
        aggregationFns[column.columnDef.aggregationFn as BuiltInAggregationFn]
}

export function table_setGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, updater: Updater<GroupingState>) {
  table.options.onGroupingChange?.(updater)
}

export function table_resetGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, defaultState?: boolean) {
  table_setGrouping(table, defaultState ? [] : table.initialState.grouping)
}

export function table_getPreGroupedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table_getFilteredRowModel(table)
}

export function table_getGroupedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.Grouped) {
    table._rowModels.Grouped = table.options._rowModels?.Grouped?.(table)
  }

  if (table.options.manualGrouping || !table._rowModels.Grouped) {
    return table_getPreGroupedRowModel(table)
  }

  return table._rowModels.Grouped()
}

export function row_getIsGrouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return !!row.groupingColumnId
}

export function row_getGroupingValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData>,
  columnId: string,
) {
  if (row._groupingValuesCache.hasOwnProperty(columnId)) {
    return row._groupingValuesCache[columnId]
  }

  const column = table.getColumn(columnId)

  if (!column?.columnDef.getGroupingValue) {
    return row.getValue(columnId)
  }

  row._groupingValuesCache[columnId] = column.columnDef.getGroupingValue(
    row.original,
  )

  return row._groupingValuesCache[columnId]
}

export function cell_getIsGrouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, row: Row<TFeatures, TData>) {
  return column.getIsGrouped() && column.id === row.groupingColumnId
}

export function cell_getIsPlaceholder<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  cell: Cell<TFeatures, TData, TValue>,
  column: Column<TFeatures, TData, TValue>,
) {
  return !cell.getIsGrouped() && column.getIsGrouped()
}

export function cell_getIsAggregated<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>, row: Row<TFeatures, TData>) {
  return (
    !cell.getIsGrouped() && !cell.getIsPlaceholder() && !!row.subRows.length
  )
}
