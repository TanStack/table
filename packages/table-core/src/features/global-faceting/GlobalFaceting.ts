import { Table, RowData, TableFeature } from '../../types'
import {
  table_getGlobalFacetedMinMaxValues,
  table_getGlobalFacetedRowModel,
  table_getGlobalFacetedUniqueValues,
} from './GlobalFaceting.utils'

export const GlobalFaceting: TableFeature = {
  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table._getGlobalFacetedRowModel =
      table.options.getFacetedRowModel &&
      table.options.getFacetedRowModel(table, '__global__')

    table.getGlobalFacetedRowModel = () => table_getGlobalFacetedRowModel(table)

    table._getGlobalFacetedUniqueValues =
      table.options.getFacetedUniqueValues &&
      table.options.getFacetedUniqueValues(table, '__global__')
    table.getGlobalFacetedUniqueValues = () =>
      table_getGlobalFacetedUniqueValues(table)

    table._getGlobalFacetedMinMaxValues =
      table.options.getFacetedMinMaxValues &&
      table.options.getFacetedMinMaxValues(table, '__global__')
    table.getGlobalFacetedMinMaxValues = () =>
      table_getGlobalFacetedMinMaxValues(table)
  },
}
