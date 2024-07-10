import {
  column_getFacetedMinMaxValues,
  column_getFacetedRowModel,
  column_getFacetedUniqueValues,
} from './ColumnFaceting.utils'
import type {
  CellData,
  Column,
  RowData,
  Table,
  TableFeature,
  TableFeatures,
} from '../../types'

export const ColumnFaceting: TableFeature = {
  _createColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ): void => {
    column.getFacetedMinMaxValues = column_getFacetedMinMaxValues(column, table)

    column.getFacetedRowModel = column_getFacetedRowModel(column, table)

    column.getFacetedUniqueValues = column_getFacetedUniqueValues(column, table)
  },
}
