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
import type { Fns } from '../../types/Fns'
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
  getInitialState: <TFeatures extends TableFeatures>(
    state: TableState<TFeatures>,
  ): TableState<TFeatures> & TableState_ColumnGrouping => {
    return {
      grouping: [],
      ...state,
    }
  },

  getDefaultColumnDef: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(): ColumnDef_ColumnGrouping<TFeatures, TFns, TData, TValue> => {
    return {
      aggregatedCell: (props) => props.getValue()?.toString?.() ?? null,
      aggregationFn: 'auto',
    }
  },

  getDefaultOptions: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
  >(
    table: Table<TFeatures, TFns, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TFns, TData>>,
  ): TableOptions_ColumnGrouping => {
    return {
      onGroupingChange: makeStateUpdater('grouping', table),
      groupedColumnMode: 'reorder',
    }
  },

  constructCell: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
    TValue,
  >(
    cell: Cell<TFeatures, TFns, TData, TValue> & Partial<Cell_ColumnGrouping>,
    table: Table<TFeatures, TFns, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TFns, TData>>,
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

  constructColumn: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TFns, TData, TValue> &
      Partial<Column_ColumnGrouping<TFeatures, TFns, TData>>,
    table: Table<TFeatures, TFns, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TFns, TData>>,
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

  constructRow: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
  >(
    row: Row<TFeatures, TFns, TData> & Partial<Row_ColumnGrouping>,
    table: Table<TFeatures, TFns, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TFns, TData>>,
  ): void => {
    row._groupingValuesCache = {}

    assignAPIs(row, table, [
      {
        fn: () => row_getIsGrouped(row),
      },
      {
        fn: (columnId) => row_getGroupingValue(row, table, columnId),
      },
    ])
  },

  constructTable: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
  >(
    table: Table<TFeatures, TFns, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TFns, TData>>,
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
