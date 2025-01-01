import { assignAPIs } from '../../utils'
import {
  table_getGlobalFacetedMinMaxValues,
  table_getGlobalFacetedRowModel,
  table_getGlobalFacetedUniqueValues,
} from './globalFacetingFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { Table_GlobalFaceting } from './globalFacetingFeature.types'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'

interface GlobalFacetingFeatureConstructors {
  Table: Table_GlobalFaceting<TableFeatures, RowData>
}

/**
 * The Global Faceting feature adds global faceting APIs to the table object.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/global-faceting)
 * [Guide](https://tanstack.com/table/v8/docs/guide/global-faceting)
 */
export const globalFacetingFeature: TableFeature<GlobalFacetingFeatureConstructors> =
  {
    constructTableAPIs: (table) => {
      assignAPIs(table, [
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
