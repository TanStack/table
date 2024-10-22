import { isFunction } from '../../utils'
import {
  table_getInitialState,
  table_getState,
} from '../../core/table/Tables.utils'
import { table_getColumn } from '../../core/columns/Columns.utils'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/RowModels.types'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'
import type {
  AggregationFn,
  ColumnDef_ColumnGrouping,
  GroupingState,
  Row_ColumnGrouping,
} from './ColumnGrouping.types'

export function getDefaultGroupingState(): GroupingState {
  return structuredClone([])
}

export function column_toggleGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  table: Table_Internal<TFeatures, TData>,
) {
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
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: Partial<ColumnDef_ColumnGrouping<TFeatures, TData>>
  },
  table: Table_Internal<TFeatures, TData>,
) {
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
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: Partial<ColumnDef_ColumnGrouping<TFeatures, TData>>
  },
  table: Table_Internal<TFeatures, TData>,
): boolean {
  return !!table_getState(table).grouping?.includes(column.id)
}

export function column_getGroupedIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: Partial<ColumnDef_ColumnGrouping<TFeatures, TData>>
  },
  table: Table_Internal<TFeatures, TData>,
): number {
  return table_getState(table).grouping?.indexOf(column.id) ?? -1
}

export function column_getToggleGroupingHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: Partial<ColumnDef_ColumnGrouping<TFeatures, TData>>
  },
  table: Table_Internal<TFeatures, TData>,
) {
  const canGroup = column_getCanGroup(column, table)

  return () => {
    if (!canGroup) return
    column_toggleGrouping(column, table)
  }
}

export function column_getAutoAggregationFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: Partial<ColumnDef_ColumnGrouping<TFeatures, TData>>
  },
  table: Table_Internal<TFeatures, TData>,
) {
  const aggregationFns = table._processingFns.aggregationFns as
    | Record<string, AggregationFn<TFeatures, TData>>
    | undefined

  const firstRow = table.getCoreRowModel().flatRows[0]

  const value = firstRow?.getValue(column.id)

  if (typeof value === 'number') {
    return aggregationFns?.sum
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return aggregationFns?.extent
  }
}

export function column_getAggregationFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: Partial<ColumnDef_ColumnGrouping<TFeatures, TData>>
  },
  table: Table_Internal<TFeatures, TData>,
) {
  const aggregationFns = table._processingFns.aggregationFns as
    | Record<string, AggregationFn<TFeatures, TData>>
    | undefined

  return isFunction(column.columnDef.aggregationFn)
    ? column.columnDef.aggregationFn
    : column.columnDef.aggregationFn === 'auto'
      ? column_getAutoAggregationFn(column, table)
      : aggregationFns?.[column.columnDef.aggregationFn as string]
}

export function table_setGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<GroupingState>) {
  table.options.onGroupingChange?.(updater)
}

export function table_resetGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setGrouping(
    table,
    defaultState ? [] : (table_getInitialState(table).grouping ?? []),
  )
}



export function row_getIsGrouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData> & Row_ColumnGrouping) {
  return !!row.groupingColumnId
}

export function row_getGroupingValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping>,
  table: Table_Internal<TFeatures, TData>,
  columnId: string,
) {
  if (row._groupingValuesCache?.hasOwnProperty(columnId)) {
    return row._groupingValuesCache[columnId]
  }

  const column = table_getColumn(table, columnId)

  if (!column?.columnDef.getGroupingValue) {
    return row.getValue(columnId)
  }

  if (row._groupingValuesCache) {
    row._groupingValuesCache[columnId] = column.columnDef.getGroupingValue(
      row.original,
    )
  }

  return row._groupingValuesCache?.[columnId]
}

export function cell_getIsGrouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  cell: Cell<TFeatures, TData, TValue>,
  table: Table_Internal<TFeatures, TData>,
) {
  const row = cell.row
  return (
    column_getIsGrouped(cell.column, table) &&
    cell.column.id === row.groupingColumnId
  )
}

export function cell_getIsPlaceholder<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  cell: Cell<TFeatures, TData, TValue>,
  table: Table_Internal<TFeatures, TData>,
) {
  return (
    !cell_getIsGrouped(cell, table) && column_getIsGrouped(cell.column, table)
  )
}

export function cell_getIsAggregated<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  cell: Cell<TFeatures, TData, TValue>,
  table: Table_Internal<TFeatures, TData>,
) {
  return (
    !cell_getIsGrouped(cell, table) &&
    !cell_getIsPlaceholder(cell, table) &&
    !!cell.row.subRows.length
  )
}
