import { table_getPreFilteredRowModel } from '../column-filtering/ColumnFiltering.utils'
import type { Fns } from '../../types/Fns'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../types/RowModel'
import type { Table_Internal } from '../../types/Table'
import type { Column } from '../../types/Column'

export function column_getFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue>,
  table: Table_Internal<TFeatures, TFns, TData>,
): () => [number, number] | undefined {
  return (
    table.options._rowModels?.FacetedMinMax?.(table, column.id) ??
    (() => undefined)
  )
}

export function column_getFacetedRowModel<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> | undefined,
  table: Table_Internal<TFeatures, TFns, TData>,
): () => RowModel<TFeatures, TFns, TData> {
  return (
    table.options._rowModels?.Faceted?.(table, column?.id ?? '') ??
    (() => table_getPreFilteredRowModel(table))
  )
}

export function column_getFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue>,
  table: Table_Internal<TFeatures, TFns, TData>,
): () => Map<any, number> {
  return (
    table.options._rowModels?.FacetedUnique?.(table, column.id) ??
    (() => new Map<any, number>())
  )
}
