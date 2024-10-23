import { assignAPIs } from '../../utils'
import {
  table_getGlobalFacetedMinMaxValues,
  table_getGlobalFacetedRowModel,
  table_getGlobalFacetedUniqueValues,
} from './GlobalFaceting.utils'
import type { Table_GlobalFaceting } from './GlobalFaceting.types'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'

/**
 * The Global Faceting feature adds global faceting APIs to the table object.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-faceting)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-faceting)
 */
export const GlobalFaceting: TableFeature = {
  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_GlobalFaceting<TFeatures, TData>>,
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
