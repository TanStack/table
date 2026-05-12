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
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type {
//   ColumnDef_GlobalFiltering,
//   Column_GlobalFiltering,
//   TableOptions_GlobalFiltering,
//   TableState_GlobalFiltering,
//   Table_GlobalFiltering,
// } from './globalFilteringFeature.types'

export interface GlobalFilteringFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // Column: Column_GlobalFiltering
  // ColumnDef: ColumnDef_GlobalFiltering
  // Table: Table_GlobalFiltering<TFeatures, TData>
  // TableOptions: TableOptions_GlobalFiltering<TFeatures, TData>
  // TableState: TableState_GlobalFiltering
}

/**
 * Creates the stock global filtering feature.
 *
 * The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.
 */
export function constructGlobalFilteringFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<GlobalFilteringFeatureConstructors<TFeatures, TData>> {
  return {
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
          let value: unknown
          for (const row of table.getCoreRowModel().flatRows) {
            value = row.getAllCellsByColumnId()[column.id]?.getValue()
            if (value != null) break
          }

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
}

/**
 * The stock global filtering feature.
 *
 * Register this feature with column filtering support to add global filter
 * state, global filter function resolution, and column eligibility APIs.
 */
export const globalFilteringFeature = constructGlobalFilteringFeature()
