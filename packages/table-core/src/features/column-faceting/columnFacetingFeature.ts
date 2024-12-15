import { assignAPIs } from '../../utils'
import {
  column_getFacetedMinMaxValues,
  column_getFacetedRowModel,
  column_getFacetedUniqueValues,
} from './columnFacetingFeature.utils'
import type { Column_ColumnFaceting } from './columnFacetingFeature.types'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'

/**
 * The Column Faceting feature adds column faceting APIs to the column objects.
 */
export const columnFacetingFeature: TableFeature<{
  Column: Column_ColumnFaceting<TableFeatures, RowData>
}> = {
  constructColumnAPIs: (column) => {
    assignAPIs(column, [
      {
        fn: () => column_getFacetedMinMaxValues(column, column.table),
      },
      {
        fn: () => column_getFacetedRowModel(column, column.table),
      },
      {
        fn: () => column_getFacetedUniqueValues(column, column.table),
      },
    ])
  },
}
