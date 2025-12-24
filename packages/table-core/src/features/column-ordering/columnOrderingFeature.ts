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
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type {
//   Column_ColumnOrdering,
//   TableOptions_ColumnOrdering,
//   TableState_ColumnOrdering,
//   Table_ColumnOrdering,
// } from './columnOrderingFeature.types'

interface ColumnOrderingFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // Column: Column_ColumnOrdering
  // Table: Table_ColumnOrdering<TFeatures, TData>
  // TableOptions: TableOptions_ColumnOrdering
  // TableState: TableState_ColumnOrdering
}

export function constructColumnOrderingFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<ColumnOrderingFeatureConstructors<TFeatures, TData>> {
  return {
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
      assignAPIs('columnOrderingFeature', column, {
        column_getIndex: {
          fn: (position) => column_getIndex(column, position),
          memoDeps: (position) => [
            position,
            column._table.store.state.columnOrder,
            column._table.store.state.columnPinning,
            column._table.store.state.grouping,
          ],
        },
        column_getIsFirstColumn: {
          fn: (position) => column_getIsFirstColumn(column, position),
        },
        column_getIsLastColumn: {
          fn: (position) => column_getIsLastColumn(column, position),
        },
      })
    },

    constructTableAPIs: (table) => {
      assignAPIs('columnOrderingFeature', table, {
        table_setColumnOrder: {
          fn: (updater) => table_setColumnOrder(table, updater),
        },
        table_resetColumnOrder: {
          fn: (defaultState) => table_resetColumnOrder(table, defaultState),
        },
        table_getOrderColumnsFn: {
          fn: () => table_getOrderColumnsFn(table),
          memoDeps: () => [
            table.store.state.columnOrder,
            table.store.state.grouping,
            table.options.groupedColumnMode,
          ],
        },
      })
    },
  }
}

/**
 * The Column Ordering feature adds column ordering state and APIs to the table and column objects.
 */
export const columnOrderingFeature = constructColumnOrderingFeature()
