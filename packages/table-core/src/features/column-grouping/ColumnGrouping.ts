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
  getDefaultGroupingState,
  row_getGroupingValue,
  row_getIsGrouped,
  table_resetGrouping,
  table_setGrouping,
} from './ColumnGrouping.utils'
import type { Row } from '../../types/Row'
import type { TableState } from '../../types/TableState'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'
import type {
  Cell_ColumnGrouping,
  ColumnDef_ColumnGrouping,
  Column_ColumnGrouping,
  Row_ColumnGrouping,
  TableOptions_ColumnGrouping,
  Table_ColumnGrouping,
} from './ColumnGrouping.types'

/**
 * The (Column) Grouping feature adds column grouping state and APIs to the table, row, column, and cell objects.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-grouping)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-grouping)
 */
export const ColumnGrouping: TableFeature = {
  getInitialState: <TFeatures extends TableFeatures>(
    state: Partial<TableState<TFeatures>>,
  ): Partial<TableState<TFeatures>> => {
    return {
      grouping: getDefaultGroupingState(),
      ...state,
    }
  },

  getDefaultColumnDef: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(): ColumnDef_ColumnGrouping<TFeatures, TData, TValue> => {
    return {
      aggregatedCell: (props) => props.getValue()?.toString?.() ?? null,
      aggregationFn: 'auto',
    }
  },

  getDefaultTableOptions: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TData>>,
  ): TableOptions_ColumnGrouping => {
    return {
      onGroupingChange: makeStateUpdater('grouping', table),
      groupedColumnMode: 'reorder',
    }
  },

  constructCellAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue,
  >(
    cell: Cell<TFeatures, TData, TValue> & Partial<Cell_ColumnGrouping>,
  ): void => {
    assignAPIs(cell, [
      {
        fn: () => cell_getIsGrouped(cell),
      },
      {
        fn: () => cell_getIsPlaceholder(cell),
      },
      {
        fn: () => cell_getIsAggregated(cell),
      },
    ])
  },

  constructColumnAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> &
      Partial<Column_ColumnGrouping<TFeatures, TData>>,
  ): void => {
    assignAPIs(column, [
      {
        fn: () => column_toggleGrouping(column),
      },
      {
        fn: () => column_getCanGroup(column),
      },
      {
        fn: () => column_getIsGrouped(column),
      },
      {
        fn: () => column_getGroupedIndex(column),
      },
      {
        fn: () => column_getToggleGroupingHandler(column),
      },
      {
        fn: () => column_getAutoAggregationFn(column),
      },
      {
        fn: () => column_getAggregationFn(column),
      },
    ])
  },

  constructRowAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping>,
  ): void => {
    row._groupingValuesCache = {}

    assignAPIs(row, [
      {
        fn: () => row_getIsGrouped(row),
      },
      {
        fn: (columnId) => row_getGroupingValue(row, columnId),
      },
    ])
  },

  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnGrouping<TFeatures, TData>>,
  ): void => {
    assignAPIs(table, [
      {
        fn: (updater) => table_setGrouping(table, updater),
      },
      {
        fn: (defaultState) => table_resetGrouping(table, defaultState),
      },
    ])
  },
}
