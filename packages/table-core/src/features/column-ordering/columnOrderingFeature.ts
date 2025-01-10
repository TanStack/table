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

interface ColumnOrderingFeatureConstructors {
  // Column: Column_ColumnOrdering
  // Table: Table_ColumnOrdering<TableFeatures, RowData>
  // TableOptions: TableOptions_ColumnOrdering
  // TableState: TableState_ColumnOrdering
}

/**
 * The Column Ordering feature adds column ordering state and APIs to the table and column objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)
 */
export const columnOrderingFeature: TableFeature<ColumnOrderingFeatureConstructors> =
  {
    feature: 'columnOrderingFeature',

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
      assignAPIs('columnOrderingFeature', column, [
        {
          fn: (position) => column_getIndex(column, position),
          fnName: 'column_getIndex',
          memoDeps: (position) => [
            position,
            column._table.options.state?.columnOrder,
            column._table.options.state?.columnPinning,
            column._table.options.state?.grouping,
          ],
        },
        {
          fn: (position) => column_getIsFirstColumn(column, position),
          fnName: 'column_getIsFirstColumn',
        },
        {
          fn: (position) => column_getIsLastColumn(column, position),
          fnName: 'column_getIsLastColumn',
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs('columnOrderingFeature', table, [
        {
          fn: (updater) => table_setColumnOrder(table, updater),
          fnName: 'table_setColumnOrder',
        },
        {
          fn: (defaultState) => table_resetColumnOrder(table, defaultState),
          fnName: 'table_resetColumnOrder',
        },
        {
          fn: () => table_getOrderColumnsFn(table),
          fnName: 'table_getOrderColumnsFn',
          memoDeps: () => [
            table.options.state?.columnOrder,
            table.options.state?.grouping,
            table.options.groupedColumnMode,
          ],
        },
      ])
    },
  }
