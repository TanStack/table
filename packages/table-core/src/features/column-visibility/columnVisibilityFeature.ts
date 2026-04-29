import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
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

export interface ColumnVisibilityFeatureConstructors<
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

    assignColumnPrototype: (prototype, table) => {
      assignPrototypeAPIs('columnVisibilityFeature', prototype, table, {
        column_getIsVisible: {
          fn: (column) => column_getIsVisible(column),
          memoDeps: (column) => [
            column.table.options.columns,
            column.table.atoms.columnVisibility?.get(),
            column.columns,
          ],
        },
        column_getCanHide: {
          fn: (column) => column_getCanHide(column),
        },
        column_getToggleVisibilityHandler: {
          fn: (column) => column_getToggleVisibilityHandler(column),
        },
        column_toggleVisibility: {
          fn: (column, visible) => column_toggleVisibility(column, visible),
        },
      })
    },

    assignRowPrototype: (prototype, table) => {
      assignPrototypeAPIs('columnVisibilityFeature', prototype, table, {
        row_getAllVisibleCells: {
          fn: (row) => row_getAllVisibleCells(row),
          memoDeps: (row) => [
            row.getAllCells(),
            row.table.atoms.columnVisibility?.get(),
          ],
        },
        row_getVisibleCells: {
          fn: (row, left, center, right) =>
            row_getVisibleCells(left, center, right),
          memoDeps: (row) => [
            row_getLeftVisibleCells(row),
            row_getCenterVisibleCells(row),
            row_getRightVisibleCells(row),
          ],
        },
      })
    },

    constructTableAPIs: (table) => {
      assignTableAPIs('columnVisibilityFeature', table, {
        table_getVisibleFlatColumns: {
          fn: () => table_getVisibleFlatColumns(table),
          memoDeps: () => [
            table.atoms.columnVisibility?.get(),
            table.atoms.columnOrder?.get(),
            table.options.columns,
          ],
        },
        table_getVisibleLeafColumns: {
          fn: () => table_getVisibleLeafColumns(table),
          memoDeps: () => [
            table.atoms.columnVisibility?.get(),
            table.atoms.columnOrder?.get(),
            table.options.columns,
          ],
        },
        table_setColumnVisibility: {
          fn: (updater) => table_setColumnVisibility(table, updater),
        },
        table_resetColumnVisibility: {
          fn: (defaultState) =>
            table_resetColumnVisibility(table, defaultState),
        },
        table_toggleAllColumnsVisible: {
          fn: (value) => table_toggleAllColumnsVisible(table, value),
        },
        table_getIsAllColumnsVisible: {
          fn: () => table_getIsAllColumnsVisible(table),
        },
        table_getIsSomeColumnsVisible: {
          fn: () => table_getIsSomeColumnsVisible(table),
        },
        table_getToggleAllColumnsVisibilityHandler: {
          fn: () => table_getToggleAllColumnsVisibilityHandler(table),
        },
      })
    },
  }
}

/**
 * The Column Visibility feature adds column visibility state and APIs to the table, row, and column objects.
 */
export const columnVisibilityFeature = constructColumnVisibilityFeature()
