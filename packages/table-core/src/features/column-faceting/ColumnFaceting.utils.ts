import { table_getPreFilteredRowModel } from '../column-filtering/ColumnFiltering.utils'
import type { CellData, Column, RowData, RowModel, Table } from '../../types'

export function column_getFacetedMinMaxValues<
  TData extends RowData,
  TValue extends CellData,
>(
  column: Column<TData, TValue>,
  table: Table<TData>,
): () => [number, number] | undefined {
  return (
    table.options._rowModels?.FacetedMinMax?.(table, column.id) ??
    (() => undefined)
  )
}

export function column_getFacetedRowModel<
  TData extends RowData,
  TValue extends CellData,
>(column: Column<TData, TValue>, table: Table<TData>): () => RowModel<TData> {
  return (
    table.options._rowModels?.Faceted?.(table, column.id) ??
    (() => table_getPreFilteredRowModel(table))
  )
}

export function column_getFacetedUniqueValues<
  TData extends RowData,
  TValue extends CellData,
>(column: Column<TData, TValue>, table: Table<TData>): () => Map<any, number> {
  return (
    table.options._rowModels?.FacetedUnique?.(table, column.id) ??
    (() => new Map<any, number>())
  )
}
