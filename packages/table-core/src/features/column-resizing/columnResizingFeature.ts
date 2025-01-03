import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  column_getCanResize,
  column_getIsResizing,
  getDefaultColumnResizingState,
  header_getResizeHandler,
  table_resetHeaderSizeInfo,
  table_setColumnResizing,
} from './columnResizingFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'
import type {
  Column_ColumnResizing,
  Header_ColumnResizing,
  TableOptions_ColumnResizing,
  TableState_ColumnResizing,
  Table_ColumnResizing,
} from './columnResizingFeature.types'

interface ColumnResizingFeatureConstructors {
  Column: Column_ColumnResizing
  Header: Header_ColumnResizing
  Table: Table_ColumnResizing
  TableOptions: TableOptions_ColumnResizing
  TableState: TableState_ColumnResizing
}

/**
 * The Column Resizing feature adds column resizing state and APIs to the table and column objects.
 *
 * **Note:** This is dependent on the Column Sizing feature.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-resizing)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-resizing)
 */
export const columnResizingFeature: TableFeature<ColumnResizingFeatureConstructors> =
  {
    getInitialState: (initialState) => {
      return {
        columnResizing: getDefaultColumnResizingState(),
        ...initialState,
      }
    },

    getDefaultTableOptions: (table) => {
      return {
        columnResizeMode: 'onEnd',
        columnResizeDirection: 'ltr',
        onColumnResizingChange: makeStateUpdater('columnResizing', table),
      }
    },

    constructColumnAPIs: (column) => {
      assignAPIs(column, [
        {
          fn: () => column_getCanResize(column),
          fnName: 'column_getCanResize',
        },
        {
          fn: () => column_getIsResizing(column),
          fnName: 'column_getIsResizing',
        },
      ])
    },

    constructHeaderAPIs: (header) => {
      assignAPIs(header, [
        {
          fn: (_contextDocument) =>
            header_getResizeHandler(header, _contextDocument),
          fnName: 'header_getResizeHandler',
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs(table, [
        {
          fn: (updater) => table_setColumnResizing(table, updater),
          fnName: 'table_setColumnResizing',
        },
        {
          fn: (defaultState) => table_resetHeaderSizeInfo(table, defaultState),
          fnName: 'table_resetHeaderSizeInfo',
        },
      ])
    },
  }