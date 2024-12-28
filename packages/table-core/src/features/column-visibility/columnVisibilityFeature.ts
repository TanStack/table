import { assignAPIs, callMemoOrStaticFn, makeStateUpdater } from '../../utils'
import {
  row_getCenterVisibleCells,
  row_getLeftVisibleCells,
  row_getRightVisibleCells,
} from '../column-pinning/columnPinningFeature.utils'
import {
  column_getCanHide,
  column_getIsVisible,
  column_getToggleVisibilityHandler,
  column_toggleVisibility,
  getDefaultColumnVisibilityState,
  row_getAllVisibleCells,
  row_getVisibleCells,
  table_getIsAllColumnsVisible,
  table_getIsSomeColumnsVisible,
  table_getToggleAllColumnsVisibilityHandler,
  table_getVisibleFlatColumns,
  table_getVisibleLeafColumns,
  table_resetColumnVisibility,
  table_setColumnVisibility,
  table_toggleAllColumnsVisible,
} from './columnVisibilityFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type {
  ColumnDef_ColumnVisibility,
  Column_ColumnVisibility,
  Row_ColumnVisibility,
  TableOptions_ColumnVisibility,
  TableState_ColumnVisibility,
  Table_ColumnVisibility,
} from './columnVisibilityFeature.types'

/**
 * The Column Visibility feature adds column visibility state and APIs to the table, row, and column objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility)
 */
export const columnVisibilityFeature: TableFeature<{
  ColumnDef: ColumnDef_ColumnVisibility
  Column: Column_ColumnVisibility
  Row: Row_ColumnVisibility<TableFeatures, RowData>
  Table: Table_ColumnVisibility<TableFeatures, RowData>
  TableOptions: TableOptions_ColumnVisibility
  TableState: TableState_ColumnVisibility
}> = {
  getInitialState: (initialState) => {
    return {
      columnVisibility: getDefaultColumnVisibilityState(),
      ...initialState,
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onColumnVisibilityChange: makeStateUpdater('columnVisibility', table),
    }
  },

  constructColumnAPIs: (column) => {
    assignAPIs(column, [
      {
        fn: () => column_getIsVisible(column),
        memoDeps: () => [
          column._table.options.columns,
          column._table.options.state?.columnVisibility,
          column.columns,
        ],
      },
      {
        fn: () => column_getCanHide(column),
      },
      {
        fn: () => column_getToggleVisibilityHandler(column),
      },
      {
        fn: (visible) => column_toggleVisibility(column, visible),
      },
    ])
  },

  constructRowAPIs: (row) => {
    assignAPIs(row, [
      {
        fn: () => row_getAllVisibleCells(row),
        memoDeps: () => [
          row.getAllCells(),
          row._table.options.state?.columnVisibility,
        ],
      },
      {
        fn: (left, center, right) => row_getVisibleCells(left, center, right),
        memoDeps: () => [
          callMemoOrStaticFn(row, row_getLeftVisibleCells),
          callMemoOrStaticFn(row, row_getCenterVisibleCells),
          callMemoOrStaticFn(row, row_getRightVisibleCells),
        ],
      },
    ])
  },

  constructTableAPIs: (table) => {
    assignAPIs(table, [
      {
        fn: () => table_getVisibleFlatColumns(table),
        memoDeps: () => [
          table.options.state?.columnVisibility,
          table.options.columns,
        ],
      },
      {
        fn: () => table_getVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.state?.columnVisibility,
          table.options.columns,
        ],
      },
      {
        fn: (updater) => table_setColumnVisibility(table, updater),
      },
      {
        fn: (defaultState) => table_resetColumnVisibility(table, defaultState),
      },
      {
        fn: (value) => table_toggleAllColumnsVisible(table, value),
      },
      {
        fn: () => table_getIsAllColumnsVisible(table),
      },
      {
        fn: () => table_getIsSomeColumnsVisible(table),
      },
      {
        fn: () => table_getToggleAllColumnsVisibilityHandler(table),
      },
    ])
  },
}
