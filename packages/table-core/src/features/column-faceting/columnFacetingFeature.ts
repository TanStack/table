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
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Column_Internal } from '../../types/Column'
// import type {
//   CachedRowModel_Faceted,
//   Column_ColumnFaceting,
//   CreateRowModel_Faceted,
// } from './columnFacetingFeature.types'

export interface ColumnFacetingFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // CachedRowModel: CachedRowModel_Faceted<TFeatures, TData>
  // Column: Column_ColumnFaceting<TFeatures, TData>
  // CreateRowModels: CreateRowModel_Faceted<TFeatures, TData>
}

export function constructColumnFacetingFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<ColumnFacetingFeatureConstructors<TFeatures, TData>> {
  return {
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
          memoDeps: (column: Column_Internal<TFeatures, TData>) => [
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
          memoDeps: (column: Column_Internal<TFeatures, TData>) => [
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
}

/**
 * The Column Faceting feature adds column faceting APIs to the column objects.
 */
export const columnFacetingFeature = constructColumnFacetingFeature()
