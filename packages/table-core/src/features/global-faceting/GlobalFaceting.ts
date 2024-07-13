import {
  table_getGlobalFacetedMinMaxValues,
  table_getGlobalFacetedRowModel,
  table_getGlobalFacetedUniqueValues,
} from './GlobalFaceting.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'

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
