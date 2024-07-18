import { makeStateUpdater } from '../../utils'
import {
  cell_getIsAggregated,
  cell_getIsGrouped,
  cell_getIsPlaceholder,
  column_getAggregationFn,
  column_getAutoAggregationFn,
  column_getCanGroup,
  column_getGroupedIndex,
  column_getIsGrouped,
  column_getToggleGroupingHandler,
  column_toggleGrouping,
  row_getGroupingValue,
  row_getIsGrouped,
  table_getGroupedRowModel,
  table_getPreGroupedRowModel,
  table_resetGrouping,
  table_setGrouping,
} from './ColumnGrouping.utils'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'
import type {
  ColumnDef_ColumnGrouping,
  TableOptions_ColumnGrouping,
  TableState_ColumnGrouping,
  Table_ColumnGrouping,
} from './ColumnGrouping.types'

export const ColumnGrouping: TableFeature = {
  _getDefaultColumnDef: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(): ColumnDef_ColumnGrouping<TFeatures, TData, TValue> => {
    return {
      aggregatedCell: (props) => props.getValue()?.toString?.() ?? null,
      aggregationFn: 'auto',
    }
  },

  _getInitialState: (state): TableState_ColumnGrouping => {
    return {
      grouping: [],
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Partial<Table<TFeatures, TData>>,
  ): TableOptions_ColumnGrouping<TFeatures, TData> => {
    return {
      onGroupingChange: makeStateUpdater('grouping', table),
      groupedColumnMode: 'reorder',
    }
  },

  _createColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ): void => {
    column.toggleGrouping = () => column_toggleGrouping(column, table)

    column.getCanGroup = () => column_getCanGroup(column, table)

    column.getIsGrouped = () => column_getIsGrouped(column, table)

    column.getGroupedIndex = () => column_getGroupedIndex(column, table)

    column.getToggleGroupingHandler = () =>
      column_getToggleGroupingHandler(column)

    column.getAutoAggregationFn = () =>
      column_getAutoAggregationFn(column, table)

    column.getAggregationFn = () => column_getAggregationFn(column, table)
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> & Table_ColumnGrouping<TFeatures, TData>,
  ): void => {
    table.setGrouping = (updater) => table_setGrouping(table, updater)

    table.resetGrouping = (defaultState) =>
      table_resetGrouping(table, defaultState)

    table.getPreGroupedRowModel = () => table_getPreGroupedRowModel(table)

    table.getGroupedRowModel = () => table_getGroupedRowModel(table)
  },

  _createRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    table: Table<TFeatures, TData>,
  ): void => {
    row.getIsGrouped = () => row_getIsGrouped(row)

    row.getGroupingValue = (columnId) =>
      row_getGroupingValue(row, table, columnId)

    row._groupingValuesCache = {}
  },

  _createCell: <TFeatures extends TableFeatures, TData extends RowData, TValue>(
    cell: Cell<TFeatures, TData, TValue>,
    _table: Table<TFeatures, TData>,
  ): void => {
    const { column, row } = cell

    cell.getIsGrouped = () => cell_getIsGrouped(column, row)

    cell.getIsPlaceholder = () => cell_getIsPlaceholder(cell, column)

    cell.getIsAggregated = () => cell_getIsAggregated(cell, row)
  },
}
