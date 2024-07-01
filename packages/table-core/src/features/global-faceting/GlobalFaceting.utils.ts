import { RowData, Table } from '../../types'

export function table_getGlobalFacetedRowModel<TData extends RowData>(
  table: Table<TData>
) {
  if (table.options.manualFiltering || !table._getGlobalFacetedRowModel) {
    return table.getPreFilteredRowModel()
  }

  return table._getGlobalFacetedRowModel()
}

export function table_getGlobalFacetedUniqueValues<TData extends RowData>(
  table: Table<TData>
) {
  if (!table._getGlobalFacetedUniqueValues) {
    return new Map()
  }

  return table._getGlobalFacetedUniqueValues()
}

export function table_getGlobalFacetedMinMaxValues<TData extends RowData>(
  table: Table<TData>
) {
  if (!table._getGlobalFacetedMinMaxValues) {
    return
  }

  return table._getGlobalFacetedMinMaxValues()
}
