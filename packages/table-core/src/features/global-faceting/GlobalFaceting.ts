import { assignAPIs } from '../../utils'
import {
  table_getGlobalFacetedMinMaxValues,
  table_getGlobalFacetedRowModel,
  table_getGlobalFacetedUniqueValues,
} from './GlobalFaceting.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'

/**
 * The Global Faceting feature adds global faceting APIs to the table object.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/global-faceting)
 * [Guide](https://tanstack.com/table/v8/docs/guide/global-faceting)
 */
export const GlobalFaceting: TableFeature = {
  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ): void => {
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
