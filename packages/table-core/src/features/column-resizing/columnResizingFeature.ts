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
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds column resizing state, options, and resize handlers.
 */
export const columnResizingFeature: TableFeature = {
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
