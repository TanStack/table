import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
import {
  column_clearSorting,
  column_getAutoSortDir,
  column_getAutoSortFn,
  column_getCanMultiSort,
  column_getCanSort,
  column_getFirstSortDir,
  column_getIsSorted,
  column_getNextSortingOrder,
  column_getSortFn,
  column_getSortIndex,
  column_getToggleSortingHandler,
  column_toggleSorting,
  getDefaultSortingState,
  table_resetSorting,
  table_setSorting,
} from './rowSortingFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds row sorting state, defaults, and column/table sorting APIs.
 */
export const rowSortingFeature: TableFeature = {
  getInitialState(initialState) {
    return {
      sorting: getDefaultSortingState(),
      ...initialState,
    }
  },

  getDefaultColumnDef() {
    return {
      sortFn: 'auto',
      sortUndefined: 1,
    }
  },

  getDefaultTableOptions(table) {
    return {
      onSortingChange: makeStateUpdater('sorting', table),
      isMultiSortEvent: (e: unknown) => {
        return (e as MouseEvent).shiftKey
      },
    }
  },

  assignColumnPrototype(prototype, table) {
    assignPrototypeAPIs('rowSortingFeature', prototype, table, {
      column_getAutoSortFn: {
        fn: (column) => column_getAutoSortFn(column),
      },
      column_getAutoSortDir: {
        fn: (column) => column_getAutoSortDir(column),
      },
      column_getSortFn: {
        fn: (column) => column_getSortFn(column),
      },
      column_toggleSorting: {
        fn: (column, desc, multi) => column_toggleSorting(column, desc, multi),
      },
      column_getFirstSortDir: {
        fn: (column) => column_getFirstSortDir(column),
      },
      column_getNextSortingOrder: {
        fn: (column, multi) => column_getNextSortingOrder(column, multi),
      },
      column_getCanSort: {
        fn: (column) => column_getCanSort(column),
      },
      column_getCanMultiSort: {
        fn: (column) => column_getCanMultiSort(column),
      },
      column_getIsSorted: {
        fn: (column) => column_getIsSorted(column),
      },
      column_getSortIndex: {
        fn: (column) => column_getSortIndex(column),
      },
      column_clearSorting: {
        fn: (column) => column_clearSorting(column),
      },
      column_getToggleSortingHandler: {
        fn: (column) => column_getToggleSortingHandler(column),
      },
    })
  },

  constructTableAPIs(table) {
    assignTableAPIs('rowSortingFeature', table, {
      table_setSorting: {
        fn: (updater) => table_setSorting(table, updater),
      },
      table_resetSorting: {
        fn: (defaultState) => table_resetSorting(table, defaultState),
      },
    })
  },
}
