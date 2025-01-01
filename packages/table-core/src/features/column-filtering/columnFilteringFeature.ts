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
import type {
  CachedRowModel_Filtered,
  ColumnDef_ColumnFiltering,
  Column_ColumnFiltering,
  CreateRowModel_Filtered,
  RowModelFns_ColumnFiltering,
  Row_ColumnFiltering,
  TableOptions_ColumnFiltering,
  TableState_ColumnFiltering,
  Table_ColumnFiltering,
} from './columnFilteringFeature.types'

interface ColumnFilteringFeatureConstructors {
  CachedRowModel: CachedRowModel_Filtered<TableFeatures, RowData>
  Column: Column_ColumnFiltering<TableFeatures, RowData>
  ColumnDef: ColumnDef_ColumnFiltering<TableFeatures, RowData>
  CreateRowModels: CreateRowModel_Filtered<TableFeatures, RowData>
  Row: Row_ColumnFiltering<TableFeatures, RowData>
  RowModelFns: RowModelFns_ColumnFiltering<TableFeatures, RowData>
  Table: Table_ColumnFiltering
  TableOptions: TableOptions_ColumnFiltering<TableFeatures, RowData>
  TableState: TableState_ColumnFiltering
}

/**
 * The Column Filtering feature adds column filtering state and APIs to the table, row, and column objects.
 *
 * **Note:** This does not include Global Filtering. The globalFilteringFeature feature has been split out into its own standalone feature.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
 */
export const columnFilteringFeature: TableFeature<ColumnFilteringFeatureConstructors> =
  {
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
      assignAPIs(column, [
        {
          fn: () => column_getAutoFilterFn(column),
        },
        {
          fn: () => column_getFilterFn(column),
        },
        {
          fn: () => column_getCanFilter(column),
        },
        {
          fn: () => column_getIsFiltered(column),
        },
        {
          fn: () => column_getFilterValue(column),
        },
        {
          fn: () => column_getFilterIndex(column),
        },
        {
          fn: (value) => column_setFilterValue(column, value),
        },
      ])
    },

    constructRowAPIs: (row) => {
      ;(row as any).columnFilters = {}
      ;(row as any).columnFiltersMeta = {}
    },

    constructTableAPIs: (table) => {
      assignAPIs(table, [
        {
          fn: (updater) => table_setColumnFilters(table, updater),
        },
        {
          fn: (defaultState) => table_resetColumnFilters(table, defaultState),
        },
      ])
    },
  }
