import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Column_Internal } from '../../types/Column'

/**
 * Returns faceted min max values for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getFacetedMinMaxValues(column)
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
    table.options._rowModels?.facetedMinMaxValues?.(table, column.id) ??
    (() => undefined)
  return facetedMinMaxValuesFn()
}

/**
 * Returns faceted row model for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getFacetedRowModel(column)
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
    table.options._rowModels?.facetedRowModel?.(table, column?.id ?? '') ??
    (() => table.getPreFilteredRowModel())
  return facetedRowModelFn()
}

/**
 * Returns faceted unique values for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getFacetedUniqueValues(column)
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
    table.options._rowModels?.facetedUniqueValues?.(table, column.id) ??
    (() => new Map<any, number>())
  return facetedUniqueValuesFn()
}

/**
 * Returns global faceted min max values for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getGlobalFacetedMinMaxValues(table)
 * ```
 */
export function table_getGlobalFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): undefined | [number, number] {
  const facetedMinMaxValuesFn =
    table.options._rowModels?.facetedMinMaxValues?.(table, '__global__') ??
    (() => undefined)
  return facetedMinMaxValuesFn()
}

/**
 * Returns global faceted row model for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getGlobalFacetedRowModel(table)
 * ```
 */
export function table_getGlobalFacetedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  const facetedRowModelFn =
    table.options._rowModels?.facetedRowModel?.(table, '__global__') ??
    (() => table.getPreFilteredRowModel())
  return facetedRowModelFn()
}

/**
 * Returns global faceted unique values for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getGlobalFacetedUniqueValues(table)
 * ```
 */
export function table_getGlobalFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Map<any, number> {
  const facetedUniqueValuesFn =
    table.options._rowModels?.facetedUniqueValues?.(table, '__global__') ??
    (() => new Map())
  return facetedUniqueValuesFn()
}
