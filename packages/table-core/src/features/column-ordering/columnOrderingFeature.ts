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
}

/**
 * The Column Ordering feature adds column ordering state and APIs to the table and column objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)
 */
export const columnOrderingFeature = constructColumnOrderingFeature()
