import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/rowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'

export function table_getGlobalFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): () => undefined | [number, number] {
  return (
    table.options._rowModels?.facetedMinMaxValues?.(table, '__global__') ??
    (() => undefined)
  )
}

export function table_getGlobalFacetedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): () => RowModel<TFeatures, TData> {
  return (
    table.options._rowModels?.facetedRowModel?.(table, '__global__') ??
    (() => table.getPreFilteredRowModel())
  )
}

export function table_getGlobalFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): () => Map<any, number> {
  return (
    table.options._rowModels?.facetedUniqueValues?.(table, '__global__') ??
    (() => new Map())
  )
}
