import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Column_Internal } from '../../types/Column'

/**
 * Computes min and max numeric facet values for one column.
 *
 * The configured `facetedMinMaxValues` row-model factory owns the calculation.
 * If no factory is registered, the result is `undefined`.
 *
 * @example
 * ```ts
 * const range = column_getFacetedMinMaxValues(column, table)
 * ```
 */
export function column_getFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  table: Table_Internal<TFeatures, TData>,
): [number, number] | undefined {
  const facetedMinMaxValuesFn =
    table.options.features.facetedMinMaxValues?.(table, column.id) ??
    (() => undefined)
  return facetedMinMaxValuesFn()
}

/**
 * Computes the row model used to derive one column's facet values.
 *
 * The faceted row model normally applies every other active filter while
 * excluding this column's own filter. If no factory is registered, the
 * pre-filtered row model is returned.
 *
 * @example
 * ```ts
 * const rows = column_getFacetedRowModel(column, table)
 * ```
 */
export function column_getFacetedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue> | undefined,
  table: Table_Internal<TFeatures, TData>,
): RowModel<TFeatures, TData> {
  const facetedRowModelFn =
    table.options.features.facetedRowModel?.(table, column?.id ?? '') ??
    (() => table.getPreFilteredRowModel())
  return facetedRowModelFn()
}

/**
 * Computes unique facet values and their occurrence counts for one column.
 *
 * The configured `facetedUniqueValues` row-model factory owns the calculation.
 * If no factory is registered, an empty `Map` is returned.
 *
 * @example
 * ```ts
 * const values = column_getFacetedUniqueValues(column, table)
 * ```
 */
export function column_getFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  table: Table_Internal<TFeatures, TData>,
): Map<any, number> {
  const facetedUniqueValuesFn =
    table.options.features.facetedUniqueValues?.(table, column.id) ??
    (() => new Map<any, number>())
  return facetedUniqueValuesFn()
}

/**
 * Computes min and max numeric facet values for the global filter context.
 *
 * The global context is requested with the internal `__global__` column id. If
 * no factory is registered, the result is `undefined`.
 *
 * @example
 * ```ts
 * const range = table_getGlobalFacetedMinMaxValues(table)
 * ```
 */
export function table_getGlobalFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): undefined | [number, number] {
  const facetedMinMaxValuesFn =
    table.options.features.facetedMinMaxValues?.(table, '__global__') ??
    (() => undefined)
  return facetedMinMaxValuesFn()
}

/**
 * Computes the row model used to derive global facet values.
 *
 * The global context is requested with the internal `__global__` column id. If
 * no faceted row-model factory is registered, the pre-filtered row model is
 * returned.
 *
 * @example
 * ```ts
 * const rows = table_getGlobalFacetedRowModel(table)
 * ```
 */
export function table_getGlobalFacetedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  const facetedRowModelFn =
    table.options.features.facetedRowModel?.(table, '__global__') ??
    (() => table.getPreFilteredRowModel())
  return facetedRowModelFn()
}

/**
 * Computes unique values and occurrence counts for the global filter context.
 *
 * The global context is requested with the internal `__global__` column id. If
 * no factory is registered, an empty `Map` is returned.
 *
 * @example
 * ```ts
 * const values = table_getGlobalFacetedUniqueValues(table)
 * ```
 */
export function table_getGlobalFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Map<any, number> {
  const facetedUniqueValuesFn =
    table.options.features.facetedUniqueValues?.(table, '__global__') ??
    (() => new Map())
  return facetedUniqueValuesFn()
}
