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

    assignColumnPrototype: (prototype, table) => {
      assignPrototypeAPIs('columnOrderingFeature', prototype, table, {
        column_getIndex: {
          fn: (column, position) => column_getIndex(column, position),
          memoDeps: (column, position) => [
            position,
            column.table.atoms.columnOrder.get(),
            column.table.atoms.columnPinning.get(),
            column.table.atoms.grouping.get(),
          ],
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
        table_setColumnOrder: {
          fn: (updater) => table_setColumnOrder(table, updater),
        },
        table_resetColumnOrder: {
          fn: (defaultState) => table_resetColumnOrder(table, defaultState),
        },
        table_getOrderColumnsFn: {
          fn: () => table_getOrderColumnsFn(table),
          memoDeps: () => [
            table.atoms.columnOrder.get(),
            table.atoms.grouping.get(),
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
