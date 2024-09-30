import { assignAPIs } from '../../utils'
import {
  column_getFacetedMinMaxValues,
  column_getFacetedRowModel,
  column_getFacetedUniqueValues,
} from './ColumnFaceting.utils'
import type { Fns } from '../../types/Fns'
import type { TableFns_ColumnFiltering } from '../column-filtering/ColumnFiltering.types'
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
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TFns, TData, TValue> &
      Partial<Column_ColumnFaceting<TFeatures, TFns, TData>>,
    table: Table<TFeatures, TFns, TData>,
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
