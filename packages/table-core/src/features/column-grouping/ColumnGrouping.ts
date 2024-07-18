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
  Cell_ColumnGrouping,
  ColumnDef_ColumnGrouping,
  Column_ColumnGrouping,
  Row_ColumnGrouping,
  TableOptions_ColumnGrouping,
  TableState_ColumnGrouping,
  Table_ColumnGrouping,
} from './ColumnGrouping.types'

/**
 * The (Column) Grouping feature adds column grouping state and APIs to the table, row, column, and cell objects.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-grouping)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-grouping)
 */
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
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TData>>,
  ): TableOptions_ColumnGrouping<TFeatures, TData> => {
    return {
      onGroupingChange: makeStateUpdater('grouping', table),
      groupedColumnMode: 'reorder',
    }
  },

  _createCell: <TFeatures extends TableFeatures, TData extends RowData, TValue>(
    cell: Cell<TFeatures, TData, TValue> & Partial<Cell_ColumnGrouping>,
  ): void => {
    cell.getIsGrouped = () => cell_getIsGrouped(cell)

    cell.getIsPlaceholder = () => cell_getIsPlaceholder(cell)

    cell.getIsAggregated = () => cell_getIsAggregated(cell)
  },

  _createColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> &
      Partial<Column_ColumnGrouping<TFeatures, TData>>,
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TData>>,
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

  _createRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping>,
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TData>>,
  ): void => {
    row.getIsGrouped = () => row_getIsGrouped(row)

    row.getGroupingValue = (columnId) =>
      row_getGroupingValue(row, table, columnId)

    row._groupingValuesCache = {}
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TData>>,
  ): void => {
    table.setGrouping = (updater) => table_setGrouping(table, updater)

    table.resetGrouping = (defaultState) =>
      table_resetGrouping(table, defaultState)

    table.getPreGroupedRowModel = () => table_getPreGroupedRowModel(table)

    table.getGroupedRowModel = () => table_getGroupedRowModel(table)
  },
}
