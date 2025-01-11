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
// import type {
//   CachedRowModel_Grouped,
//   Cell_ColumnGrouping,
//   ColumnDef_ColumnGrouping,
//   Column_ColumnGrouping,
//   CreateRowModel_Grouped,
//   RowModelFns_ColumnGrouping,
//   Row_ColumnGrouping,
//   TableOptions_ColumnGrouping,
//   TableState_ColumnGrouping,
//   Table_ColumnGrouping,
// } from './columnGroupingFeature.types'

interface ColumnGroupingFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // CachedRowModel: CachedRowModel_Grouped<TFeatures, TData>
  // Cell: Cell_ColumnGrouping
  // Column: Column_ColumnGrouping<TFeatures, TData>
  // ColumnDef: ColumnDef_ColumnGrouping<TFeatures, TData>
  // CreateRowModels: CreateRowModel_Grouped<TFeatures, TData>
  // Row: Row_ColumnGrouping
  // RowModelFns: RowModelFns_ColumnGrouping<TFeatures, TData>
  // Table: Table_ColumnGrouping<TFeatures, TData>
  // TableOptions: TableOptions_ColumnGrouping
  // TableState: TableState_ColumnGrouping
}

export function constructColumnGroupingFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<ColumnGroupingFeatureConstructors<TFeatures, TData>> {
  return {
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
      assignAPIs('columnGroupingFeature', cell, [
        {
          fn: () => cell_getIsGrouped(cell),
          fnName: 'cell_getIsGrouped',
        },
        {
          fn: () => cell_getIsPlaceholder(cell),
          fnName: 'cell_getIsPlaceholder',
        },
        {
          fn: () => cell_getIsAggregated(cell),
          fnName: 'cell_getIsAggregated',
        },
      ])
    },

    constructColumnAPIs: (column) => {
      assignAPIs('columnGroupingFeature', column, [
        {
          fn: () => column_toggleGrouping(column),
          fnName: 'column_toggleGrouping',
        },
        {
          fn: () => column_getCanGroup(column),
          fnName: 'column_getCanGroup',
        },
        {
          fn: () => column_getIsGrouped(column),
          fnName: 'column_getIsGrouped',
        },
        {
          fn: () => column_getGroupedIndex(column),
          fnName: 'column_getGroupedIndex',
        },
        {
          fn: () => column_getToggleGroupingHandler(column),
          fnName: 'column_getToggleGroupingHandler',
        },
        {
          fn: () => column_getAutoAggregationFn(column),
          fnName: 'column_getAutoAggregationFn',
        },
        {
          fn: () => column_getAggregationFn(column),
          fnName: 'column_getAggregationFn',
        },
      ])
    },

    constructRowAPIs: (row) => {
      ;(row as any)._groupingValuesCache = {}

      assignAPIs('columnGroupingFeature', row, [
        {
          fn: () => row_getIsGrouped(row),
          fnName: 'row_getIsGrouped',
        },
        {
          fn: (columnId) => row_getGroupingValue(row, columnId),
          fnName: 'row_getGroupingValue',
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs('columnGroupingFeature', table, [
        {
          fn: (updater) => table_setGrouping(table, updater),
          fnName: 'table_setGrouping',
        },
        {
          fn: (defaultState) => table_resetGrouping(table, defaultState),
          fnName: 'table_resetGrouping',
        },
      ])
    },
  }
}

/**
 * The (Column) Grouping feature adds column grouping state and APIs to the table, row, column, and cell objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-grouping)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-grouping)
 */
export const columnGroupingFeature = constructColumnGroupingFeature()
