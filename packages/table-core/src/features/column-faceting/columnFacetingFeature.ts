import {
  assignPrototypeAPIs,
  assignTableAPIs,
  callMemoOrStaticFn,
} from '../../utils'
import {
  column_getFacetedMinMaxValues,
  column_getFacetedRowModel,
  column_getFacetedUniqueValues,
  table_getGlobalFacetedMinMaxValues,
  table_getGlobalFacetedRowModel,
  table_getGlobalFacetedUniqueValues,
} from './columnFacetingFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that derives faceted row models, unique values, and min/max values for filters.
 */
export const columnFacetingFeature: TableFeature = {
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnFacetingFeature', prototype, table, {
      column_getFacetedRowModel: {
        memoDeps: () => [
          table.getPreFilteredRowModel().rows,
          table.atoms.columnFilters?.get(),
          table.atoms.globalFilter?.get(),
          table.getFilteredRowModel().rows,
        ],
        fn: (column) => column_getFacetedRowModel(column, column.table),
      },
      column_getFacetedMinMaxValues: {
        memoDeps: (column) => [
          callMemoOrStaticFn(
            column,
            'getFacetedRowModel',
            column_getFacetedRowModel,
            column.table,
          ).flatRows,
        ],
        fn: (column) => column_getFacetedMinMaxValues(column, column.table),
      },
      column_getFacetedUniqueValues: {
        memoDeps: (column) => [
          callMemoOrStaticFn(
            column,
            'getFacetedRowModel',
            column_getFacetedRowModel,
            column.table,
          ).flatRows,
        ],
        fn: (column) => column_getFacetedUniqueValues(column, column.table),
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('columnFacetingFeature', table, {
      table_getGlobalFacetedRowModel: {
        memoDeps: () => [
          table.getPreFilteredRowModel().rows,
          table.atoms.columnFilters?.get(),
          table.atoms.globalFilter?.get(),
          table.getFilteredRowModel().rows,
        ],
        fn: () => table_getGlobalFacetedRowModel(table),
      },
      table_getGlobalFacetedMinMaxValues: {
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getGlobalFacetedRowModel',
            table_getGlobalFacetedRowModel,
          ).flatRows,
        ],
        fn: () => table_getGlobalFacetedMinMaxValues(table),
      },
      table_getGlobalFacetedUniqueValues: {
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getGlobalFacetedRowModel',
            table_getGlobalFacetedRowModel,
          ).flatRows,
        ],
        fn: () => table_getGlobalFacetedUniqueValues(table),
      },
    })
  },
}
