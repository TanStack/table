import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
import { row_getValue } from '../../core/rows/coreRowsFeature.utils'
import {
  cell_getIsGrouped,
  cell_getIsPlaceholder,
  column_getCanGroup,
  column_getGroupedIndex,
  column_getIsGrouped,
  column_getToggleGroupingHandler,
  column_toggleGrouping,
  getDefaultGroupingState,
  row_getGroupedValue,
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

    // Overrides the core `row.getValue` (core features assign first) so
    // grouped rows resolve grouping and aggregated values through the shared
    // prototype instead of a per-row closure, which would fork the row's
    // hidden class. Assigned directly with fixed arity: `getValue` is the
    // hottest row API in grouped pipelines (groupBy and every aggregation
    // read it), so it skips the generic rest-args wrapper.
    prototype.getValue = function (this: any, columnId: string) {
      return this.groupingColumnId === undefined
        ? row_getValue(this, columnId)
        : row_getGroupedValue(this, columnId)
    }
  },

  initRowInstanceData: (row) => {
    // Declared up front (`undefined` until the grouped row model assigns
    // them) so grouped rows share the leaf rows' hidden class.
    const groupingRow = row as any
    groupingRow._aggregationValuesCache = undefined
    groupingRow._groupedRows = undefined
    groupingRow._groupingValuesCache = undefined
    groupingRow.groupingColumnId = undefined
    groupingRow.groupingValue = undefined
    groupingRow.leafRows = undefined
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
