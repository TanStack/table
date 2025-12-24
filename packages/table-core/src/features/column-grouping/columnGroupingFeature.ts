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
      assignAPIs('columnGroupingFeature', cell, {
        cell_getIsGrouped: {
          fn: () => cell_getIsGrouped(cell),
        },
        cell_getIsPlaceholder: {
          fn: () => cell_getIsPlaceholder(cell),
        },
        cell_getIsAggregated: {
          fn: () => cell_getIsAggregated(cell),
        },
      })
    },

    constructColumnAPIs: (column) => {
      assignAPIs('columnGroupingFeature', column, {
        column_toggleGrouping: {
          fn: () => column_toggleGrouping(column),
        },
        column_getCanGroup: {
          fn: () => column_getCanGroup(column),
        },
        column_getIsGrouped: {
          fn: () => column_getIsGrouped(column),
        },
        column_getGroupedIndex: {
          fn: () => column_getGroupedIndex(column),
        },
        column_getToggleGroupingHandler: {
          fn: () => column_getToggleGroupingHandler(column),
        },
        column_getAutoAggregationFn: {
          fn: () => column_getAutoAggregationFn(column),
        },
        column_getAggregationFn: {
          fn: () => column_getAggregationFn(column),
        },
      })
    },

    constructRowAPIs: (row) => {
      ;(row as any)._groupingValuesCache = {}

      assignAPIs('columnGroupingFeature', row, {
        row_getIsGrouped: {
          fn: () => row_getIsGrouped(row),
        },
        row_getGroupingValue: {
          fn: (columnId) => row_getGroupingValue(row, columnId),
        },
      })
    },

    constructTableAPIs: (table) => {
      assignAPIs('columnGroupingFeature', table, {
        table_setGrouping: {
          fn: (updater) => table_setGrouping(table, updater),
        },
        table_resetGrouping: {
          fn: (defaultState) => table_resetGrouping(table, defaultState),
        },
      })
    },
  }
}

/**
 * The (Column) Grouping feature adds column grouping state and APIs to the table, row, column, and cell objects.
 */
export const columnGroupingFeature = constructColumnGroupingFeature()
