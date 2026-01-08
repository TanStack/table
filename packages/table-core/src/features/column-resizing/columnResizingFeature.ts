import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
import {
  column_getCanResize,
  column_getIsResizing,
  getDefaultColumnResizingState,
  header_getResizeHandler,
  table_resetHeaderSizeInfo,
  table_setColumnResizing,
} from './columnResizingFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type {
//   Column_ColumnResizing,
//   Header_ColumnResizing,
//   TableOptions_ColumnResizing,
//   TableState_ColumnResizing,
//   Table_ColumnResizing,
// } from './columnResizingFeature.types'

interface ColumnResizingFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // Column: Column_ColumnResizing
  // Header: Header_ColumnResizing
  // Table: Table_ColumnResizing
  // TableOptions: TableOptions_ColumnResizing
  // TableState: TableState_ColumnResizing
}

export function constructColumnResizingFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<ColumnResizingFeatureConstructors<TFeatures, TData>> {
  return {
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

    assignColumnPrototype: (prototype, table) => {
      assignPrototypeAPIs('columnResizingFeature', prototype, table, {
        column_getCanResize: {
          fn: (column) => column_getCanResize(column),
        },
        column_getIsResizing: {
          fn: (column) => column_getIsResizing(column),
        },
      })
    },

    assignHeaderPrototype: (prototype, table) => {
      assignPrototypeAPIs('columnResizingFeature', prototype, table, {
        header_getResizeHandler: {
          fn: (header, _contextDocument) =>
            header_getResizeHandler(header, _contextDocument),
        },
      })
    },

    constructTableAPIs: (table) => {
      assignTableAPIs('columnResizingFeature', table, {
        table_setColumnResizing: {
          fn: (updater) => table_setColumnResizing(table, updater),
        },
        table_resetHeaderSizeInfo: {
          fn: (defaultState) => table_resetHeaderSizeInfo(table, defaultState),
        },
      })
    },
  }
}

/**
 * The Column Resizing feature adds column resizing state and APIs to the table and column objects.
 * **Note:** This is dependent on the Column Sizing feature.
 */
export const columnResizingFeature = constructColumnResizingFeature()
