import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  column_getIndex,
  column_getIsFirstColumn,
  column_getIsLastColumn,
  getDefaultColumnOrderState,
  table_getOrderColumnsFn,
  table_resetColumnOrder,
  table_setColumnOrder,
} from './columnOrderingFeature.utils'
// import type {
//   Column_ColumnOrdering,
//   TableOptions_ColumnOrdering,
//   TableState_ColumnOrdering,
//   Table_ColumnOrdering,
// } from './columnOrderingFeature.types'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * The Column Ordering feature adds column ordering state and APIs to the table and column objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)
 */
export const columnOrderingFeature: TableFeature<{
  // Column: Column_ColumnOrdering
  // Table: Table_ColumnOrdering<TableFeatures, RowData>
  // TableOptions: TableOptions_ColumnOrdering
  // TableState: TableState_ColumnOrdering
}> = {
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

  constructColumnAPIs: (column) => {
    assignAPIs(column, [
      {
        fn: (position) => column_getIndex(column, position),
        memoDeps: (position) => [
          position,
          column._table.options.state?.columnOrder,
          column._table.options.state?.columnPinning,
          column._table.options.state?.grouping,
        ],
      },
      {
        fn: (position) => column_getIsFirstColumn(column, position),
      },
      {
        fn: (position) => column_getIsLastColumn(column, position),
      },
    ])
  },

  constructTableAPIs: (table) => {
    assignAPIs(table, [
      {
        fn: (updater) => table_setColumnOrder(table, updater),
      },
      {
        fn: (defaultState) => table_resetColumnOrder(table, defaultState),
      },
      {
        fn: () => table_getOrderColumnsFn(table),
        memoDeps: () => [
          table.options.state?.columnOrder,
          table.options.state?.grouping,
          table.options.groupedColumnMode,
        ],
      },
    ])
  },
}
