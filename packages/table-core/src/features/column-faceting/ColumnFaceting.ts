import { assignAPIs } from '../../utils'
import {
  column_getFacetedMinMaxValues,
  column_getFacetedRowModel,
  column_getFacetedUniqueValues,
} from './ColumnFaceting.utils'
import type { Column_ColumnFaceting } from './ColumnFaceting.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Column } from '../../types/Column'

/**
 * The Column Faceting feature adds column faceting APIs to the column objects.
 */
export const ColumnFaceting: TableFeature = {
  constructColumnAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> &
      Partial<Column_ColumnFaceting<TFeatures, TData>>,
  ): void => {
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
