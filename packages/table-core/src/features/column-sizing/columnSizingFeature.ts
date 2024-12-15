import { assignAPIs, callMemoOrStaticFn, makeStateUpdater } from '../../utils'
import { table_getPinnedVisibleLeafColumns } from '../column-pinning/columnPinningFeature.utils'
import {
  column_getAfter,
  column_getSize,
  column_getStart,
  column_resetSize,
  getDefaultColumnSizingColumnDef,
  getDefaultColumnSizingState,
  header_getSize,
  header_getStart,
  table_getCenterTotalSize,
  table_getLeftTotalSize,
  table_getRightTotalSize,
  table_getTotalSize,
  table_resetColumnSizing,
  table_setColumnSizing,
} from './columnSizingFeature.utils'
import type {
  ColumnDef_ColumnSizing,
  Column_ColumnSizing,
  Header_ColumnSizing,
  TableOptions_ColumnSizing,
  TableState_ColumnSizing,
  Table_ColumnSizing,
} from './columnSizingFeature.types'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * The Column Sizing feature adds column sizing state and APIs to the table, header, and column objects.
 *
 * **Note:** This does not include column resizing. The columnResizingFeature feature has been split out into its own standalone feature.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
 */
export const columnSizingFeature: TableFeature<{
  ColumnDef: ColumnDef_ColumnSizing
  Column: Column_ColumnSizing
  Header: Header_ColumnSizing
  Table: Table_ColumnSizing
  TableOptions: TableOptions_ColumnSizing
  TableState: TableState_ColumnSizing
}> = {
  getInitialState: (initialState) => {
    return {
      columnSizing: getDefaultColumnSizingState(),
      ...initialState,
    }
  },

  getDefaultColumnDef: () => {
    return getDefaultColumnSizingColumnDef()
  },

  getDefaultTableOptions: (table) => {
    return {
      onColumnSizingChange: makeStateUpdater('columnSizing', table),
    }
  },

  constructColumnAPIs: (column) => {
    assignAPIs(column, [
      {
        fn: () => column_getSize(column),
      },
      {
        fn: (position) => column_getStart(column, position),
        memoDeps: (position) => [
          position,
          callMemoOrStaticFn(
            column.table,
            table_getPinnedVisibleLeafColumns,
            position,
          ),
          column.table.options.state?.columnSizing,
        ],
      },
      {
        fn: (position) => column_getAfter(column, position),
        memoDeps: (position) => [
          position,
          callMemoOrStaticFn(
            column.table,
            table_getPinnedVisibleLeafColumns,
            position,
          ),
          column.table.options.state?.columnSizing,
        ],
      },
      {
        fn: () => column_resetSize(column),
      },
    ])
  },

  constructHeaderAPIs: (header) => {
    assignAPIs(header, [
      {
        fn: () => header_getSize(header),
      },
      {
        fn: () => header_getStart(header),
      },
    ])
  },

  constructTableAPIs: (table) => {
    assignAPIs(table, [
      {
        fn: (updater) => table_setColumnSizing(table, updater),
      },
      {
        fn: (defaultState) => table_resetColumnSizing(table, defaultState),
      },
      {
        fn: () => table_getTotalSize(table),
      },
      {
        fn: () => table_getLeftTotalSize(table),
      },
      {
        fn: () => table_getCenterTotalSize(table),
      },
      {
        fn: () => table_getRightTotalSize(table),
      },
    ])
  },
}
