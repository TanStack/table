import { assignAPIs } from '../../utils'
import {
  table_getGlobalFacetedMinMaxValues,
  table_getGlobalFacetedRowModel,
  table_getGlobalFacetedUniqueValues,
} from './globalFacetingFeature.utils'
// import type { Table_GlobalFaceting } from './globalFacetingFeature.types'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * The Global Faceting feature adds global faceting APIs to the table object.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/global-faceting)
 * [Guide](https://tanstack.com/table/v8/docs/guide/global-faceting)
 */
export const globalFacetingFeature: TableFeature<{
  // Table: Table_GlobalFaceting<TableFeatures, RowData>
}> = {
  constructTableAPIs: (table) => {
    assignAPIs(table, [
      {
        fn: () => table_getGlobalFacetedMinMaxValues(table),
      },
      {
        fn: () => table_getGlobalFacetedRowModel(table),
      },
      {
        fn: () => table_getGlobalFacetedUniqueValues(table),
      },
    ])
  },
}
