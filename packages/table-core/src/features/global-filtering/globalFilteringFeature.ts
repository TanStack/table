import { assignAPIs, makeStateUpdater } from '../../utils'
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

interface GlobalFilteringFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // Column: Column_GlobalFiltering
  // ColumnDef: ColumnDef_GlobalFiltering
  // Table: Table_GlobalFiltering<TFeatures, TData>
  // TableOptions: TableOptions_GlobalFiltering<TFeatures, TData>
  // TableState: TableState_GlobalFiltering
}

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
          const value = table
            .getCoreRowModel()
            .flatRows[0]?.getAllCellsByColumnId()
            [column.id]?.getValue()

          return typeof value === 'string' || typeof value === 'number'
        },
      }
    },

    constructColumnAPIs: (column) => {
      assignAPIs('globalFilteringFeature', column, [
        {
          fn: () => column_getCanGlobalFilter(column),
          fnName: 'column_getCanGlobalFilter',
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs('globalFilteringFeature', table, [
        {
          fn: () => table_getGlobalAutoFilterFn(),
          fnName: 'table_getGlobalAutoFilterFn',
        },
        {
          fn: () => table_getGlobalFilterFn(table),
          fnName: 'table_getGlobalFilterFn',
        },
        {
          fn: (updater) => table_setGlobalFilter(table, updater),
          fnName: 'table_setGlobalFilter',
        },
        {
          fn: (defaultState) => table_resetGlobalFilter(table, defaultState),
          fnName: 'table_resetGlobalFilter',
        },
      ])
    },
  }
}

/**
 * The Global Filtering feature adds global filtering state and APIs to the table and column objects.
 *
 * **Note:** This is dependent on the columnFilteringFeature feature.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering)
 * [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
 */
export const globalFilteringFeature = constructGlobalFilteringFeature()
