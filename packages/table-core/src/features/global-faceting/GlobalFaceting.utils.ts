import { table_getPreFilteredRowModel } from '../column-filtering/ColumnFiltering.utils'
import type { RowData, RowModel, Table } from '../../types'

export function table_getGlobalFacetedMinMaxValues<TData extends RowData>(
  table: Table<TData>,
): () => undefined | [number, number] {
  return (
    table.options._rowModels?.FacetedMinMax?.(table, '__global__') ??
    (() => undefined)
  )
}

export function table_getGlobalFacetedRowModel<TData extends RowData>(
  table: Table<TData>,
): () => RowModel<TData> {
  return (
    table.options._rowModels?.Faceted?.(table, '__global__') ??
    (() => table_getPreFilteredRowModel(table))
  )
}

export function table_getGlobalFacetedUniqueValues<TData extends RowData>(
  table: Table<TData>,
): () => Map<any, number> {
  return (
    table.options._rowModels?.FacetedUnique?.(table, '__global__') ??
    (() => new Map())
  )
}
