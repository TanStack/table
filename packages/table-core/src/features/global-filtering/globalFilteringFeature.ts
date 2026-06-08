import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
import {
  column_getCanGlobalFilter,
  table_getGlobalAutoFilterFn,
  table_getGlobalFilterFn,
  table_resetGlobalFilter,
  table_setGlobalFilter,
} from './globalFilteringFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds global filtering state, defaults, and global filter APIs.
 */
export const globalFilteringFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      globalFilter: undefined,
      ...initialState,
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onGlobalFilterChange: makeStateUpdater('globalFilter', table),
      globalFilterFn: 'auto',
      getColumnCanGlobalFilter: (column) => {
        const value = table
          .getCoreRowModel()
          .flatRows[0]?.getAllCellsByColumnId()
          [column.id]?.getValue()

        return typeof value === 'string' || typeof value === 'number'
      },
    }
  },

  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('globalFilteringFeature', prototype, table, {
      column_getCanGlobalFilter: {
        fn: (column) => column_getCanGlobalFilter(column),
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('globalFilteringFeature', table, {
      table_getGlobalAutoFilterFn: {
        fn: () => table_getGlobalAutoFilterFn(),
      },
      table_getGlobalFilterFn: {
        fn: () => table_getGlobalFilterFn(table),
      },
      table_setGlobalFilter: {
        fn: (updater) => table_setGlobalFilter(table, updater),
      },
      table_resetGlobalFilter: {
        fn: (defaultState) => table_resetGlobalFilter(table, defaultState),
      },
    })
  },
}
