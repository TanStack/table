import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Column_Internal } from '../../types/Column'

export function column_getFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  table: Table_Internal<TFeatures, TData>,
): () => [number, number] | undefined {
  return (
    table.options._rowModels?.facetedMinMaxValues?.(table, column.id) ??
    (() => undefined)
  )
}

export function column_getFacetedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue> | undefined,
  table: Table_Internal<TFeatures, TData>,
): () => RowModel<TFeatures, TData> {
  return (
    table.options._rowModels?.facetedRowModel?.(table, column?.id ?? '') ??
    (() => table.getPreFilteredRowModel())
  )
}

export function column_getFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  table: Table_Internal<TFeatures, TData>,
): () => Map<any, number> {
  return (
    table.options._rowModels?.facetedUniqueValues?.(table, column.id) ??
    (() => new Map<any, number>())
  )
}

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
