import { assignAPIs } from '../../utils'
import {
  column_getFacetedMinMaxValues,
  column_getFacetedRowModel,
  column_getFacetedUniqueValues,
} from './ColumnFaceting.utils'
import type { Column_ColumnFaceting } from './ColumnFaceting.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Column } from '../../types/Column'

/**
 * The Column Faceting feature adds column faceting APIs to the column objects.
 */
export const ColumnFaceting: TableFeature = {
  constructColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> &
      Partial<Column_ColumnFaceting<TFeatures, TData>>,
    table: Table<TFeatures, TData>,
  ): void => {
    assignAPIs(column, table, [
      {
        fn: () => column_getFacetedMinMaxValues(column, table),
      },
      {
        fn: () => column_getFacetedRowModel(column, table),
      },
      {
        fn: () => column_getFacetedUniqueValues(column, table),
      },
    ])
  },
}
