import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
import {
  cell_getIsAggregated,
  cell_getIsGrouped,
  cell_getIsPlaceholder,
  column_getAggregationFn,
  column_getAutoAggregationFn,
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
 * Feature that adds column grouping state, aggregation defaults, and grouped row APIs.
 */
export const columnGroupingFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      grouping: getDefaultGroupingState(),
      ...initialState,
    }
  },

  getDefaultColumnDef: () => {
    return {
      aggregatedCell: ({ getValue }: any) => getValue()?.toString?.() ?? null,
      aggregationFn: 'auto',
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
      cell_getIsAggregated: {
        fn: (cell) => cell_getIsAggregated(cell),
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
      column_getAutoAggregationFn: {
        fn: (column) => column_getAutoAggregationFn(column),
      },
      column_getAggregationFn: {
        fn: (column) => column_getAggregationFn(column),
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
    ;(row as any)._groupingValuesCache = {}
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
