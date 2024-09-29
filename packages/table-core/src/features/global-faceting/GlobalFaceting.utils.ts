import { table_getPreFilteredRowModel } from '../column-filtering/ColumnFiltering.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../types/RowModel'
import type { Table_Internal } from '../../types/Table'

/**
 *
 * @param table
 * @returns
 */
export function table_getGlobalFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): () => undefined | [number, number] {
  return (
    table.options._rowModels?.FacetedMinMax?.(table, '__global__') ??
    (() => undefined)
  )
}

/**
 *
 * @param table
 * @returns
 */
export function table_getGlobalFacetedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): () => RowModel<TFeatures, TData> {
  return (
    table.options._rowModels?.Faceted?.(table, '__global__') ??
    (() => table_getPreFilteredRowModel(table))
  )
}

/**
 *
 * @param table
 * @returns
 */
export function table_getGlobalFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): () => Map<any, number> {
  return (
    table.options._rowModels?.FacetedUnique?.(table, '__global__') ??
    (() => new Map())
  )
}
