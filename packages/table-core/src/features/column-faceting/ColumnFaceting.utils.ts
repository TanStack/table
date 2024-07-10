import { table_getPreFilteredRowModel } from '../column-filtering/ColumnFiltering.utils'
import type {
  CellData,
  Column,
  RowData,
  RowModel,
  Table,
  TableFeatures,
} from '../../types'

export function column_getFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  table: Table<TFeatures, TData>,
): () => [number, number] | undefined {
  return (
    table.options._rowModels?.FacetedMinMax?.(table, column.id) ??
    (() => undefined)
  )
}

export function column_getFacetedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  table: Table<TFeatures, TData>,
): () => RowModel<TFeatures, TData> {
  return (
    table.options._rowModels?.Faceted?.(table, column.id) ??
    (() => table_getPreFilteredRowModel(table))
  )
}

export function column_getFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  table: Table<TFeatures, TData>,
): () => Map<any, number> {
  return (
    table.options._rowModels?.FacetedUnique?.(table, column.id) ??
    (() => new Map<any, number>())
  )
}
