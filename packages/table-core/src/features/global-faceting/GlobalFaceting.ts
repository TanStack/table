import { Table, RowData, TableFeature } from '../../types'
import {
  table_getGlobalFacetedMinMaxValues,
  table_getGlobalFacetedRowModel,
  table_getGlobalFacetedUniqueValues,
} from './GlobalFaceting.utils'

export const GlobalFaceting: TableFeature = {
  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.getGlobalFacetedMinMaxValues =
      table_getGlobalFacetedMinMaxValues(table)

    table.getGlobalFacetedRowModel = table_getGlobalFacetedRowModel(table)

    table.getGlobalFacetedUniqueValues =
      table_getGlobalFacetedUniqueValues(table)
  },
}
