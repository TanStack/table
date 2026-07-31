import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
import {
  column_getIndex,
  column_getIsFirstColumn,
  column_getIsLastColumn,
  getDefaultColumnOrderState,
  table_getColumnIndexes,
  table_getOrderColumnsFn,
  table_resetColumnOrder,
  table_setColumnOrder,
} from './columnOrderingFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds column ordering state and APIs for ordering leaf columns.
 */
export const columnOrderingFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      columnOrder: getDefaultColumnOrderState(),
      ...initialState,
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onColumnOrderChange: makeStateUpdater('columnOrder', table),
    }
  },

  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnOrderingFeature', prototype, table, {
      column_getIndex: {
        fn: (column, position) => column_getIndex(column, position),
      },
      column_getIsFirstColumn: {
        fn: (column, position) => column_getIsFirstColumn(column, position),
      },
      column_getIsLastColumn: {
        fn: (column, position) => column_getIsLastColumn(column, position),
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('columnOrderingFeature', table, {
      table_getColumnIndexes: {
        computed: () => table_getColumnIndexes(table),
      },
      table_setColumnOrder: {
        fn: (updater) => table_setColumnOrder(table, updater),
      },
      table_resetColumnOrder: {
        fn: (defaultState) => table_resetColumnOrder(table, defaultState),
      },
      table_getOrderColumnsFn: {
        computed: () => {
          // These values are consumed when the returned ordering function runs,
          // but they also determine that function's behavior. Read them while
          // resolving the computed so either change replaces the cached
          // function, matching the former explicit memo dependency list.
          void table.atoms.grouping?.get()
          void table.options.groupedColumnMode
          return table_getOrderColumnsFn(table)
        },
      },
    })
  },
}
