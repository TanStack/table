import { assignAPIs, makeStateUpdater } from '../../utils'
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
// import type {
//   ColumnDef_ColumnVisibility,
//   Column_ColumnVisibility,
//   Row_ColumnVisibility,
//   TableOptions_ColumnVisibility,
//   TableState_ColumnVisibility,
//   Table_ColumnVisibility,
// } from './columnVisibilityFeature.types'

interface ColumnVisibilityFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // ColumnDef: ColumnDef_ColumnVisibility
  // Column: Column_ColumnVisibility
  // Row: Row_ColumnVisibility<TFeatures, TData>
  // Table: Table_ColumnVisibility<TFeatures, TData>
  // TableOptions: TableOptions_ColumnVisibility
  // TableState: TableState_ColumnVisibility
}

export function constructColumnVisibilityFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<ColumnVisibilityFeatureConstructors<TFeatures, TData>> {
  return {
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
      assignAPIs('columnVisibilityFeature', column, [
        {
          fn: () => column_getIsVisible(column),
          fnName: 'column_getIsVisible',
          memoDeps: () => [
            column._table.options.columns,
            column._table.options.state?.columnVisibility,
            column.columns,
          ],
        },
        {
          fn: () => column_getCanHide(column),
          fnName: 'column_getCanHide',
        },
        {
          fn: () => column_getToggleVisibilityHandler(column),
          fnName: 'column_getToggleVisibilityHandler',
        },
        {
          fn: (visible) => column_toggleVisibility(column, visible),
          fnName: 'column_toggleVisibility',
        },
      ])
    },

    constructRowAPIs: (row) => {
      assignAPIs('columnVisibilityFeature', row, [
        {
          fn: () => row_getAllVisibleCells(row),
          fnName: 'row_getAllVisibleCells',
          memoDeps: () => [
            row.getAllCells(),
            row._table.options.state?.columnVisibility,
          ],
        },
        {
          fn: (left, center, right) => row_getVisibleCells(left, center, right),
          fnName: 'row_getVisibleCells',
          memoDeps: () => [
            row_getLeftVisibleCells(row),
            row_getCenterVisibleCells(row),
            row_getRightVisibleCells(row),
          ],
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs('columnVisibilityFeature', table, [
        {
          fn: () => table_getVisibleFlatColumns(table),
          fnName: 'table_getVisibleFlatColumns',
          memoDeps: () => [
            table.options.state?.columnVisibility,
            table.options.columns,
          ],
        },
        {
          fn: () => table_getVisibleLeafColumns(table),
          fnName: 'table_getVisibleLeafColumns',
          memoDeps: () => [
            table.options.state?.columnVisibility,
            table.options.columns,
          ],
        },
        {
          fn: (updater) => table_setColumnVisibility(table, updater),
          fnName: 'table_setColumnVisibility',
        },
        {
          fn: (defaultState) =>
            table_resetColumnVisibility(table, defaultState),
          fnName: 'table_resetColumnVisibility',
        },
        {
          fn: (value) => table_toggleAllColumnsVisible(table, value),
          fnName: 'table_toggleAllColumnsVisible',
        },
        {
          fn: () => table_getIsAllColumnsVisible(table),
          fnName: 'table_getIsAllColumnsVisible',
        },
        {
          fn: () => table_getIsSomeColumnsVisible(table),
          fnName: 'table_getIsSomeColumnsVisible',
        },
        {
          fn: () => table_getToggleAllColumnsVisibilityHandler(table),
          fnName: 'table_getToggleAllColumnsVisibilityHandler',
        },
      ])
    },
  }
}

/**
 * The Column Visibility feature adds column visibility state and APIs to the table, row, and column objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility)
 */
export const columnVisibilityFeature = constructColumnVisibilityFeature()
