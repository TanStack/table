import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
import {
  getDefaultExpandedState,
  row_getCanExpand,
  row_getIsAllParentsExpanded,
  row_getIsExpanded,
  row_getToggleExpandedHandler,
  row_toggleExpanded,
  table_autoResetExpanded,
  table_getCanSomeRowsExpand,
  table_getExpandedDepth,
  table_getIsAllRowsExpanded,
  table_getIsSomeRowsExpanded,
  table_getToggleAllRowsExpandedHandler,
  table_resetExpanded,
  table_setExpanded,
  table_toggleAllRowsExpanded,
} from './rowExpandingFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds row expansion state and APIs for expandable row trees.
 */
export const rowExpandingFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      expanded: getDefaultExpandedState(),
      ...initialState,
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onExpandedChange: makeStateUpdater('expanded', table),
      paginateExpandedRows: true,
    }
  },

  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs('rowExpandingFeature', prototype, table, {
      row_toggleExpanded: {
        fn: (row, expanded) => row_toggleExpanded(row, expanded),
      },
      row_getIsExpanded: {
        fn: (row) => row_getIsExpanded(row),
      },
      row_getCanExpand: {
        fn: (row) => row_getCanExpand(row),
      },
      row_getIsAllParentsExpanded: {
        fn: (row) => row_getIsAllParentsExpanded(row),
      },
      row_getToggleExpandedHandler: {
        fn: (row) => row_getToggleExpandedHandler(row),
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('rowExpandingFeature', table, {
      table_autoResetExpanded: {
        fn: () => table_autoResetExpanded(table),
      },
      table_setExpanded: {
        fn: (updater) => table_setExpanded(table, updater),
      },
      table_toggleAllRowsExpanded: {
        fn: (expanded) => table_toggleAllRowsExpanded(table, expanded),
      },
      table_resetExpanded: {
        fn: (defaultState) => table_resetExpanded(table, defaultState),
      },
      table_getCanSomeRowsExpand: {
        fn: () => table_getCanSomeRowsExpand(table),
      },
      table_getToggleAllRowsExpandedHandler: {
        fn: () => table_getToggleAllRowsExpandedHandler(table),
      },
      table_getIsSomeRowsExpanded: {
        fn: () => table_getIsSomeRowsExpanded(table),
      },
      table_getIsAllRowsExpanded: {
        fn: () => table_getIsAllRowsExpanded(table),
      },
      table_getExpandedDepth: {
        fn: () => table_getExpandedDepth(table),
      },
    })
  },
}
