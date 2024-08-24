import { assignAPIs, makeStateUpdater } from '../../utils'
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
import type { TableState } from '../../types/TableState'
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
  _getInitialState: <TFeatures extends TableFeatures>(
    state: TableState<TFeatures>,
  ): TableState<TFeatures> & TableState_ColumnGrouping => {
    return {
      grouping: [],
      ...state,
    }
  },

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
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TData>>,
  ): void => {
    assignAPIs(cell, table, [
      {
        fn: () => cell_getIsGrouped(cell, table),
      },
      {
        fn: () => cell_getIsPlaceholder(cell, table),
      },
      {
        fn: () => cell_getIsAggregated(cell, table),
      },
    ])
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
    assignAPIs(column, table, [
      {
        fn: () => column_toggleGrouping(column, table),
      },
      {
        fn: () => column_getCanGroup(column, table),
      },
      {
        fn: () => column_getIsGrouped(column, table),
      },
      {
        fn: () => column_getGroupedIndex(column, table),
      },
      {
        fn: () => column_getToggleGroupingHandler(column, table),
      },
      {
        fn: () => column_getAutoAggregationFn(column, table),
      },
      {
        fn: () => column_getAggregationFn(column, table),
      },
    ])
  },

  _createRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping>,
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TData>>,
  ): void => {
    row._groupingValuesCache = {}

    assignAPIs(row, table, [
      {
        fn: () => row_getIsGrouped(row as any),
      },
      {
        fn: (columnId) => row_getGroupingValue(row, table, columnId),
      },
    ])
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TData>>,
  ): void => {
    assignAPIs(table, table, [
      {
        fn: (updater) => table_setGrouping(table, updater),
      },
      {
        fn: (defaultState) => table_resetGrouping(table, defaultState),
      },
      {
        fn: () => table_getPreGroupedRowModel(table),
      },
      {
        fn: () => table_getGroupedRowModel(table),
      },
    ])
  },
}
