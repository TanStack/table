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
        computed: (column) => {
          void table.getPreFilteredRowModel().rows
          void table.atoms.columnFilters?.get()
          void table.atoms.globalFilter?.get()
          // Ensure row.columnFilters metadata is populated before faceting.
          void table.getFilteredRowModel().rows
          return column_getFacetedRowModel(column, column.table)
        },
      },
      column_getFacetedMinMaxValues: {
        computed: (column) => {
          void callMemoOrStaticFn(
            column,
            'getFacetedRowModel',
            column_getFacetedRowModel,
            column.table,
          ).flatRows
          return column_getFacetedMinMaxValues(column, column.table)
        },
      },
      column_getFacetedUniqueValues: {
        computed: (column) => {
          void callMemoOrStaticFn(
            column,
            'getFacetedRowModel',
            column_getFacetedRowModel,
            column.table,
          ).flatRows
          return column_getFacetedUniqueValues(column, column.table)
        },
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('columnFacetingFeature', table, {
      table_getGlobalFacetedRowModel: {
        computed: () => {
          void table.getPreFilteredRowModel().rows
          void table.atoms.columnFilters?.get()
          void table.atoms.globalFilter?.get()
          // Ensure row.columnFilters metadata is populated before faceting.
          void table.getFilteredRowModel().rows
          return table_getGlobalFacetedRowModel(table)
        },
      },
      table_getGlobalFacetedMinMaxValues: {
        computed: () => {
          void callMemoOrStaticFn(
            table,
            'getGlobalFacetedRowModel',
            table_getGlobalFacetedRowModel,
          ).flatRows
          return table_getGlobalFacetedMinMaxValues(table)
        },
      },
      table_getGlobalFacetedUniqueValues: {
        computed: () => {
          void callMemoOrStaticFn(
            table,
            'getGlobalFacetedRowModel',
            table_getGlobalFacetedRowModel,
          ).flatRows
          return table_getGlobalFacetedUniqueValues(table)
        },
      },
    })
  },
}
