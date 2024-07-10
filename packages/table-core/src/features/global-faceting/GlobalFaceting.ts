import {
  table_getGlobalFacetedMinMaxValues,
  table_getGlobalFacetedRowModel,
  table_getGlobalFacetedUniqueValues,
} from './GlobalFaceting.utils'
import type { RowData, Table, TableFeature, TableFeatures } from '../../types'

export const GlobalFaceting: TableFeature = {
  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    table.getGlobalFacetedMinMaxValues =
      table_getGlobalFacetedMinMaxValues(table)

    table.getGlobalFacetedRowModel = table_getGlobalFacetedRowModel(table)

    table.getGlobalFacetedUniqueValues =
      table_getGlobalFacetedUniqueValues(table)
  },
}
