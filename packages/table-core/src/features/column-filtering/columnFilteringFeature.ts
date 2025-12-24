import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  column_getAutoFilterFn,
  column_getCanFilter,
  column_getFilterFn,
  column_getFilterIndex,
  column_getFilterValue,
  column_getIsFiltered,
  column_setFilterValue,
  getDefaultColumnFiltersState,
  table_resetColumnFilters,
  table_setColumnFilters,
} from './columnFilteringFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type {
//   CachedRowModel_Filtered,
//   ColumnDef_ColumnFiltering,
//   Column_ColumnFiltering,
//   CreateRowModel_Filtered,
//   RowModelFns_ColumnFiltering,
//   Row_ColumnFiltering,
//   TableOptions_ColumnFiltering,
//   TableState_ColumnFiltering,
//   Table_ColumnFiltering,
// } from './columnFilteringFeature.types'

interface ColumnFilteringFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // CachedRowModel: CachedRowModel_Filtered<TFeatures, TData>
  // Column: Column_ColumnFiltering<TFeatures, TData>
  // ColumnDef: ColumnDef_ColumnFiltering<TFeatures, TData>
  // CreateRowModels: CreateRowModel_Filtered<TFeatures, TData>
  // Row: Row_ColumnFiltering<TFeatures, TData>
  // RowModelFns: RowModelFns_ColumnFiltering<TFeatures, TData>
  // Table: Table_ColumnFiltering<TFeatures, TData>
  // TableOptions: TableOptions_ColumnFiltering<TFeatures, TData>
  // TableState: TableState_ColumnFiltering
}

export function constructColumnFilteringFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<ColumnFilteringFeatureConstructors<TFeatures, TData>> {
  return {
    getInitialState: (initialState) => {
      return {
        columnFilters: getDefaultColumnFiltersState(),
        ...initialState,
      }
    },

    getDefaultColumnDef: () => {
      return {
        filterFn: 'auto',
      }
    },

    getDefaultTableOptions: (table) => {
      return {
        onColumnFiltersChange: makeStateUpdater('columnFilters', table),
        filterFromLeafRows: false,
        maxLeafRowFilterDepth: 100,
      }
    },

    constructColumnAPIs: (column) => {
      assignAPIs('columnFilteringFeature', column, {
        column_getAutoFilterFn: {
          fn: () => column_getAutoFilterFn(column),
        },
        column_getFilterFn: {
          fn: () => column_getFilterFn(column),
        },
        column_getCanFilter: {
          fn: () => column_getCanFilter(column),
        },
        column_getIsFiltered: {
          fn: () => column_getIsFiltered(column),
        },
        column_getFilterValue: {
          fn: () => column_getFilterValue(column),
        },
        column_getFilterIndex: {
          fn: () => column_getFilterIndex(column),
        },
        column_setFilterValue: {
          fn: (value) => column_setFilterValue(column, value),
        },
      })
    },

    constructRowAPIs: (row) => {
      ;(row as any).columnFilters = {}
      ;(row as any).columnFiltersMeta = {}
    },

    constructTableAPIs: (table) => {
      assignAPIs('columnFilteringFeature', table, {
        table_setColumnFilters: {
          fn: (updater) => table_setColumnFilters(table, updater),
        },
        table_resetColumnFilters: {
          fn: (defaultState) => table_resetColumnFilters(table, defaultState),
        },
      })
    },
  }
}

/**
 * The Column Filtering feature adds column filtering state and APIs to the table, row, and column objects.
 * **Note:** This does not include Global Filtering. The globalFilteringFeature feature has been split out into its own standalone feature.
 */
export const columnFilteringFeature = constructColumnFilteringFeature()
