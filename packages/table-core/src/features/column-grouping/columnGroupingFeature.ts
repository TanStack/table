import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeObjectMap,
  makeStateUpdater,
} from '../../utils'
import {
  cell_getIsGrouped,
  cell_getIsPlaceholder,
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
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds column grouping state and grouped row APIs.
 */
export const columnGroupingFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      grouping: getDefaultGroupingState(),
      ...initialState,
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onGroupingChange: makeStateUpdater('grouping', table),
      groupedColumnMode: 'reorder',
    }
  },

  assignCellPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnGroupingFeature', prototype, table, {
      cell_getIsGrouped: {
        fn: (cell) => cell_getIsGrouped(cell),
      },
      cell_getIsPlaceholder: {
        fn: (cell) => cell_getIsPlaceholder(cell),
      },
    })
  },

  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnGroupingFeature', prototype, table, {
      column_toggleGrouping: {
        fn: (column) => column_toggleGrouping(column),
      },
      column_getCanGroup: {
        fn: (column) => column_getCanGroup(column),
      },
      column_getIsGrouped: {
        fn: (column) => column_getIsGrouped(column),
      },
      column_getGroupedIndex: {
        fn: (column) => column_getGroupedIndex(column),
      },
      column_getToggleGroupingHandler: {
        fn: (column) => column_getToggleGroupingHandler(column),
      },
    })
  },

  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnGroupingFeature', prototype, table, {
      row_getIsGrouped: {
        fn: (row) => row_getIsGrouped(row),
      },
      row_getGroupingValue: {
        fn: (row, columnId) => row_getGroupingValue(row, columnId),
      },
    })
  },

  initRowInstanceData: (row) => {
    ;(row as any)._groupingValuesCache = makeObjectMap()
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('columnGroupingFeature', table, {
      table_setGrouping: {
        fn: (updater) => table_setGrouping(table, updater),
      },
      table_resetGrouping: {
        fn: (defaultState) => table_resetGrouping(table, defaultState),
      },
    })
  },
}
