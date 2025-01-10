import { assignAPIs } from '../../utils'
import {
  column_getFacetedMinMaxValues,
  column_getFacetedRowModel,
  column_getFacetedUniqueValues,
  table_getGlobalFacetedMinMaxValues,
  table_getGlobalFacetedRowModel,
  table_getGlobalFacetedUniqueValues,
} from './columnFacetingFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'
// import type {
//   CachedRowModel_Faceted,
//   Column_ColumnFaceting,
//   CreateRowModel_Faceted,
// } from './columnFacetingFeature.types'

interface ColumnFacetingFeatureConstructors {
  // Column: Column_ColumnFaceting<TableFeatures, RowData>
  // CreateRowModels: CreateRowModel_Faceted<TableFeatures, RowData>
  // CachedRowModel: CachedRowModel_Faceted<TableFeatures, RowData>
}

/**
 * The Column Faceting feature adds column faceting APIs to the column objects.
 */
export const columnFacetingFeature: TableFeature<ColumnFacetingFeatureConstructors> =
  {
    feature: 'columnFacetingFeature',

    constructColumnAPIs: (column) => {
      assignAPIs('columnFacetingFeature', column, [
        {
          fn: () => column_getFacetedMinMaxValues(column, column._table),
          fnName: 'column_getFacetedMinMaxValues',
        },
        {
          fn: () => column_getFacetedRowModel(column, column._table),
          fnName: 'column_getFacetedRowModel',
        },
        {
          fn: () => column_getFacetedUniqueValues(column, column._table),
          fnName: 'column_getFacetedUniqueValues',
        },
      ])
    },
    constructTableAPIs: (table) => {
      assignAPIs('columnFacetingFeature', table, [
        {
          fn: () => table_getGlobalFacetedMinMaxValues(table),
          fnName: 'table_getGlobalFacetedMinMaxValues',
        },
        {
          fn: () => table_getGlobalFacetedRowModel(table),
          fnName: 'table_getGlobalFacetedRowModel',
        },
        {
          fn: () => table_getGlobalFacetedUniqueValues(table),
          fnName: 'table_getGlobalFacetedUniqueValues',
        },
      ])
    },
  }
