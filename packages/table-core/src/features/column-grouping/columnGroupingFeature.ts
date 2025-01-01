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
} from './columnGroupingFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type {
  CachedRowModel_Grouped,
  Cell_ColumnGrouping,
  ColumnDef_ColumnGrouping,
  Column_ColumnGrouping,
  CreateRowModel_Grouped,
  RowModelFns_ColumnGrouping,
  Row_ColumnGrouping,
  TableOptions_ColumnGrouping,
  TableState_ColumnGrouping,
  Table_ColumnGrouping,
} from './columnGroupingFeature.types'

interface ColumnGroupingFeatureConstructors {
  CachedRowModel: CachedRowModel_Grouped<TableFeatures, RowData>
  Cell: Cell_ColumnGrouping
  Column: Column_ColumnGrouping<TableFeatures, RowData>
  ColumnDef: ColumnDef_ColumnGrouping<TableFeatures, RowData>
  CreateRowModels: CreateRowModel_Grouped<TableFeatures, RowData>
  Row: Row_ColumnGrouping
  RowModelFns: RowModelFns_ColumnGrouping<TableFeatures, RowData>
  Table: Table_ColumnGrouping<TableFeatures, RowData>
  TableOptions: TableOptions_ColumnGrouping
  TableState: TableState_ColumnGrouping
}

/**
 * The (Column) Grouping feature adds column grouping state and APIs to the table, row, column, and cell objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-grouping)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-grouping)
 */
export const columnGroupingFeature: TableFeature<ColumnGroupingFeatureConstructors> =
  {
    getInitialState: (initialState) => {
      return {
        grouping: getDefaultGroupingState(),
        ...initialState,
      }
    },

    getDefaultColumnDef: () => {
      return {
        aggregatedCell: ({ getValue }: any) => getValue()?.toString?.() ?? null,
        aggregationFn: 'auto',
      }
    },

    getDefaultTableOptions: (table) => {
      return {
        onGroupingChange: makeStateUpdater('grouping', table),
        groupedColumnMode: 'reorder',
      }
    },

    constructCellAPIs: (cell) => {
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

    constructColumnAPIs: (column) => {
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

    constructRowAPIs: (row) => {
      ;(row as any)._groupingValuesCache = {}

      assignAPIs(row, [
        {
          fn: () => row_getIsGrouped(row),
        },
        {
          fn: (columnId) => row_getGroupingValue(row, columnId),
        },
      ])
    },

    constructTableAPIs: (table) => {
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
