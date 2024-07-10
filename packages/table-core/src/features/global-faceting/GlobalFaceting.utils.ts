import { table_getPreFilteredRowModel } from '../column-filtering/ColumnFiltering.utils'
import type { RowData, RowModel, Table, TableFeatures } from '../../types'

export function table_getGlobalFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): () => undefined | [number, number] {
  return (
    table.options._rowModels?.FacetedMinMax?.(table, '__global__') ??
    (() => undefined)
  )
}

export function table_getGlobalFacetedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): () => RowModel<TFeatures, TData> {
  return (
    table.options._rowModels?.Faceted?.(table, '__global__') ??
    (() => table_getPreFilteredRowModel(table))
  )
}

export function table_getGlobalFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): () => Map<any, number> {
  return (
    table.options._rowModels?.FacetedUnique?.(table, '__global__') ??
    (() => new Map())
  )
}
