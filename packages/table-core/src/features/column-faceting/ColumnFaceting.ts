import {
  column_getFacetedRowModel,
  column_getFacetedMinMaxValues,
  column_getFacetedUniqueValues,
} from './ColumnFaceting.utils'
import { CellData, Column, RowData, Table, TableFeature } from '../../types'

export const ColumnFaceting: TableFeature = {
  _createColumn: <TData extends RowData, TValue extends CellData>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.getFacetedMinMaxValues = column_getFacetedMinMaxValues(column, table)

    column.getFacetedRowModel = column_getFacetedRowModel(column, table)

    column.getFacetedUniqueValues = column_getFacetedUniqueValues(column, table)
  },
}
