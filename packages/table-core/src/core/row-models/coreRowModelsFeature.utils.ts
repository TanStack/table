import { createCoreRowModel } from './createCoreRowModel'
import type { Table_Internal } from '../../types/Table'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'
import type { RowModel } from './coreRowModelsFeature.types'

export function table_getCoreRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.coreRowModel) {
    table._rowModels.coreRowModel =
      table.options._rowModels?.coreRowModel?.(table) ??
      createCoreRowModel<TFeatures, TData>()(table)
  }

  return table._rowModels.coreRowModel()
}

export function table_getPreFilteredRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getCoreRowModel()
}

export function table_getFilteredRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.filteredRowModel) {
    table._rowModels.filteredRowModel =
      table.options._rowModels?.filteredRowModel?.(table)
  }

  if (table.options.manualFiltering || !table._rowModels.filteredRowModel) {
    return table.getPreFilteredRowModel()
  }

  return table._rowModels.filteredRowModel()
}

export function table_getPreGroupedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getFilteredRowModel()
}

export function table_getGroupedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.groupedRowModel) {
    table._rowModels.groupedRowModel =
      table.options._rowModels?.groupedRowModel?.(table)
  }

  if (table.options.manualGrouping || !table._rowModels.groupedRowModel) {
    return table.getPreGroupedRowModel()
  }

  return table._rowModels.groupedRowModel()
}

export function table_getPreSortedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getGroupedRowModel()
}

export function table_getSortedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.sortedRowModel) {
    table._rowModels.sortedRowModel =
      table.options._rowModels?.sortedRowModel?.(table)
  }

  if (table.options.manualSorting || !table._rowModels.sortedRowModel) {
    return table.getPreSortedRowModel()
  }

  return table._rowModels.sortedRowModel()
}

export function table_getPreExpandedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getSortedRowModel()
}

export function table_getExpandedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.expandedRowModel) {
    table._rowModels.expandedRowModel =
      table.options._rowModels?.expandedRowModel?.(table)
  }

  if (table.options.manualExpanding || !table._rowModels.expandedRowModel) {
    return table.getPreExpandedRowModel()
  }

  return table._rowModels.expandedRowModel()
}

export function table_getPrePaginatedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getExpandedRowModel()
}

export function table_getPaginatedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.paginatedRowModel) {
    table._rowModels.paginatedRowModel =
      table.options._rowModels?.paginatedRowModel?.(table)
  }

  if (table.options.manualPagination || !table._rowModels.paginatedRowModel) {
    return table.getPrePaginatedRowModel()
  }

  return table._rowModels.paginatedRowModel()
}

export function table_getRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getPaginatedRowModel()
}
