import { createCoreRowModel } from './createCoreRowModel'
import type { Table_Internal } from '../../types/Table'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'
import type { RowModel } from './coreRowModelsFeature.types'

/**
 * Resolves the table's unmodified core row model.
 *
 * The factory is created once per table, either from the `coreRowModel` slot on the `features` option
 * or the built-in `createCoreRowModel()`, then reused for later calls.
 *
 * @example
 * ```ts
 * const coreRows = table_getCoreRowModel(table)
 * ```
 */
export function table_getCoreRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.coreRowModel) {
    table._rowModels.coreRowModel =
      table.options.features.coreRowModel?.(table) ??
      createCoreRowModel<TFeatures, TData>()(table)
  }

  return table._rowModels.coreRowModel()
}

/**
 * Reads the row model immediately before column/global filtering.
 *
 * Filtering is the first derived row-model stage, so this currently aliases
 * `table.getCoreRowModel()`.
 *
 * @example
 * ```ts
 * const rowsBeforeFiltering = table_getPreFilteredRowModel(table)
 * ```
 */
export function table_getPreFilteredRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getCoreRowModel()
}

/**
 * Resolves the row model after column and global filtering.
 *
 * When `manualFiltering` is enabled, or no filtered row-model factory was
 * registered, this returns the pre-filtered row model because filtering is
 * expected to happen outside the table.
 *
 * @example
 * ```ts
 * const filteredRows = table_getFilteredRowModel(table)
 * ```
 */
export function table_getFilteredRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.filteredRowModel) {
    table._rowModels.filteredRowModel =
      table.options.features.filteredRowModel?.(table)
  }

  if (table.options.manualFiltering || !table._rowModels.filteredRowModel) {
    return table.getPreFilteredRowModel()
  }

  return table._rowModels.filteredRowModel()
}

/**
 * Reads the row model immediately before grouping.
 *
 * Grouping runs after filtering, so this aliases `table.getFilteredRowModel()`.
 *
 * @example
 * ```ts
 * const rowsBeforeGrouping = table_getPreGroupedRowModel(table)
 * ```
 */
export function table_getPreGroupedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getFilteredRowModel()
}

/**
 * Resolves the row model after grouping has produced grouped and aggregated rows.
 *
 * When `manualGrouping` is enabled, or no grouped row-model factory was
 * registered, this returns the pre-grouped row model unchanged.
 *
 * @example
 * ```ts
 * const groupedRows = table_getGroupedRowModel(table)
 * ```
 */
export function table_getGroupedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.groupedRowModel) {
    table._rowModels.groupedRowModel =
      table.options.features.groupedRowModel?.(table)
  }

  if (table.options.manualGrouping || !table._rowModels.groupedRowModel) {
    return table.getPreGroupedRowModel()
  }

  return table._rowModels.groupedRowModel()
}

/**
 * Reads the row model immediately before sorting.
 *
 * Sorting runs after grouping, so this aliases `table.getGroupedRowModel()`.
 *
 * @example
 * ```ts
 * const rowsBeforeSorting = table_getPreSortedRowModel(table)
 * ```
 */
export function table_getPreSortedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getGroupedRowModel()
}

/**
 * Resolves the row model after sorting has been applied.
 *
 * When `manualSorting` is enabled, or no sorted row-model factory was
 * registered, this returns the pre-sorted row model because sorted data is
 * expected to be supplied by the caller.
 *
 * @example
 * ```ts
 * const sortedRows = table_getSortedRowModel(table)
 * ```
 */
export function table_getSortedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.sortedRowModel) {
    table._rowModels.sortedRowModel =
      table.options.features.sortedRowModel?.(table)
  }

  if (table.options.manualSorting || !table._rowModels.sortedRowModel) {
    return table.getPreSortedRowModel()
  }

  return table._rowModels.sortedRowModel()
}

/**
 * Reads the row model immediately before row expansion.
 *
 * Expansion runs after sorting, so this aliases `table.getSortedRowModel()`.
 *
 * @example
 * ```ts
 * const rowsBeforeExpansion = table_getPreExpandedRowModel(table)
 * ```
 */
export function table_getPreExpandedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getSortedRowModel()
}

/**
 * Resolves the row model after expanded rows have been flattened into view.
 *
 * When `manualExpanding` is enabled, or no expanded row-model factory was
 * registered, this returns the pre-expanded row model unchanged.
 *
 * @example
 * ```ts
 * const expandedRows = table_getExpandedRowModel(table)
 * ```
 */
export function table_getExpandedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.expandedRowModel) {
    table._rowModels.expandedRowModel =
      table.options.features.expandedRowModel?.(table)
  }

  if (table.options.manualExpanding || !table._rowModels.expandedRowModel) {
    return table.getPreExpandedRowModel()
  }

  return table._rowModels.expandedRowModel()
}

/**
 * Reads the row model immediately before pagination.
 *
 * Pagination is the final built-in row-model stage, so this aliases
 * `table.getExpandedRowModel()`.
 *
 * @example
 * ```ts
 * const rowsBeforePagination = table_getPrePaginatedRowModel(table)
 * ```
 */
export function table_getPrePaginatedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getExpandedRowModel()
}

/**
 * Resolves the row model after pagination has sliced rows for the current page.
 *
 * When `manualPagination` is enabled, or no paginated row-model factory was
 * registered, this returns the pre-paginated row model because pagination is
 * expected to happen before data reaches the table.
 *
 * @example
 * ```ts
 * const pageRows = table_getPaginatedRowModel(table)
 * ```
 */
export function table_getPaginatedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.paginatedRowModel) {
    table._rowModels.paginatedRowModel =
      table.options.features.paginatedRowModel?.(table)
  }

  if (table.options.manualPagination || !table._rowModels.paginatedRowModel) {
    return table.getPrePaginatedRowModel()
  }

  return table._rowModels.paginatedRowModel()
}

/**
 * Resolves the final row model consumed by renderers.
 *
 * This is the end of the built-in row-model pipeline: core -> filtering ->
 * grouping -> sorting -> expanding -> pagination.
 *
 * @example
 * ```ts
 * const visibleRows = table_getRowModel(table)
 * ```
 */
export function table_getRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getPaginatedRowModel()
}
