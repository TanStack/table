'use client'

import {
  aggregationFns,
  createColumnHelper,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  sortFns,
  stockFeatures,
} from '@tanstack/table-core'
import { useMemo } from 'react'
import { useStore } from '@tanstack/react-store'
import { useTable } from './useTable'
import type {
  Cell,
  Column,
  ColumnDef,
  CreateRowModels_All,
  Header,
  HeaderGroup,
  Row,
  RowData,
  RowModel,
  StockFeatures,
  Table,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { ReactTable } from './useTable'

// =============================================================================
// V8-style row model factory functions
// These are stub functions that act as markers for useLegacyTable to know
// which row models to enable. They don't actually do anything - the real
// implementation is handled by useLegacyTable internally.
// =============================================================================

/**
 * @deprecated Use `createFilteredRowModel(filterFns)` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the filtered row model.
 */
export function getFilteredRowModel<
  TData extends RowData,
>(): RowModelFactory<TData> {
  return (() => () => {}) as unknown as RowModelFactory<TData>
}

/**
 * @deprecated Use `createSortedRowModel(sortFns)` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the sorted row model.
 */
export function getSortedRowModel<
  TData extends RowData,
>(): RowModelFactory<TData> {
  return (() => () => {}) as unknown as RowModelFactory<TData>
}

/**
 * @deprecated Use `createPaginatedRowModel()` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the paginated row model.
 */
export function getPaginationRowModel<
  TData extends RowData,
>(): RowModelFactory<TData> {
  return (() => () => {}) as unknown as RowModelFactory<TData>
}

/**
 * @deprecated Use `createExpandedRowModel()` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the expanded row model.
 */
export function getExpandedRowModel<
  TData extends RowData,
>(): RowModelFactory<TData> {
  return (() => () => {}) as unknown as RowModelFactory<TData>
}

/**
 * @deprecated Use `createGroupedRowModel(aggregationFns)` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the grouped row model.
 */
export function getGroupedRowModel<
  TData extends RowData,
>(): RowModelFactory<TData> {
  return (() => () => {}) as unknown as RowModelFactory<TData>
}

/**
 * @deprecated Use `createFacetedRowModel()` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the faceted row model.
 */
export function getFacetedRowModel<
  TData extends RowData,
>(): FacetedRowModelFactory<TData> {
  return (() => () => {}) as unknown as FacetedRowModelFactory<TData>
}

/**
 * @deprecated Use `createFacetedMinMaxValues()` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the faceted min/max values.
 */
export function getFacetedMinMaxValues<
  TData extends RowData,
>(): FacetedMinMaxValuesFactory<TData> {
  return (() => () => undefined) as unknown as FacetedMinMaxValuesFactory<TData>
}

/**
 * @deprecated Use `createFacetedUniqueValues()` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the faceted unique values.
 */
export function getFacetedUniqueValues<
  TData extends RowData,
>(): FacetedUniqueValuesFactory<TData> {
  return (() => () => new Map()) as unknown as FacetedUniqueValuesFactory<TData>
}

/**
 * @deprecated The core row model is always created automatically in v9.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It does nothing - the core row model is always available.
 */
export function getCoreRowModel<
  TData extends RowData,
>(): RowModelFactory<TData> {
  return (() => () => {}) as unknown as RowModelFactory<TData>
}

// =============================================================================
// Type definitions
// =============================================================================

/**
 * Row model factory function type from v8 API
 */
type RowModelFactory<TData extends RowData> = (
  table: Table<StockFeatures, TData>,
) => () => RowModel<StockFeatures, TData>

/**
 * Faceted row model factory function type from v8 API
 */
type FacetedRowModelFactory<TData extends RowData> = (
  table: Table<StockFeatures, TData>,
  columnId: string,
) => () => RowModel<StockFeatures, TData>

/**
 * Faceted min/max values factory function type from v8 API
 */
type FacetedMinMaxValuesFactory<TData extends RowData> = (
  table: Table<StockFeatures, TData>,
  columnId: string,
) => () => undefined | [number, number]

/**
 * Faceted unique values factory function type from v8 API
 */
type FacetedUniqueValuesFactory<TData extends RowData> = (
  table: Table<StockFeatures, TData>,
  columnId: string,
) => () => Map<any, number>

/**
 * Legacy v8-style row model options
 */
export interface LegacyRowModelOptions<TData extends RowData> {
  /**
   * Returns the core row model for the table.
   * @deprecated This option is no longer needed in v9. The core row model is always created automatically.
   */
  getCoreRowModel?: RowModelFactory<TData>
  /**
   * Returns the filtered row model for the table.
   * @deprecated Use `_rowModels.filteredRowModel` with `createFilteredRowModel(filterFns)` instead.
   */
  getFilteredRowModel?: RowModelFactory<TData>
  /**
   * Returns the sorted row model for the table.
   * @deprecated Use `_rowModels.sortedRowModel` with `createSortedRowModel(sortFns)` instead.
   */
  getSortedRowModel?: RowModelFactory<TData>
  /**
   * Returns the paginated row model for the table.
   * @deprecated Use `_rowModels.paginatedRowModel` with `createPaginatedRowModel()` instead.
   */
  getPaginationRowModel?: RowModelFactory<TData>
  /**
   * Returns the expanded row model for the table.
   * @deprecated Use `_rowModels.expandedRowModel` with `createExpandedRowModel()` instead.
   */
  getExpandedRowModel?: RowModelFactory<TData>
  /**
   * Returns the grouped row model for the table.
   * @deprecated Use `_rowModels.groupedRowModel` with `createGroupedRowModel(aggregationFns)` instead.
   */
  getGroupedRowModel?: RowModelFactory<TData>
  /**
   * Returns the faceted row model for a column.
   * @deprecated Use `_rowModels.facetedRowModel` with `createFacetedRowModel()` instead.
   */
  getFacetedRowModel?: FacetedRowModelFactory<TData>
  /**
   * Returns the faceted min/max values for a column.
   * @deprecated Use `_rowModels.facetedMinMaxValues` with `createFacetedMinMaxValues()` instead.
   */
  getFacetedMinMaxValues?: FacetedMinMaxValuesFactory<TData>
  /**
   * Returns the faceted unique values for a column.
   * @deprecated Use `_rowModels.facetedUniqueValues` with `createFacetedUniqueValues()` instead.
   */
  getFacetedUniqueValues?: FacetedUniqueValuesFactory<TData>
}

/**
 * Legacy v8-style table options that work with useLegacyTable.
 *
 * This type omits `_features` and `_rowModels` and instead accepts the v8-style
 * `get*RowModel` function options.
 *
 * @deprecated This is a compatibility layer for migrating from v8. Use `useTable` with explicit `_features` and `_rowModels` instead.
 */
export type LegacyTableOptions<TData extends RowData> = Omit<
  TableOptions<StockFeatures, TData>,
  '_features' | '_rowModels'
> &
  LegacyRowModelOptions<TData>

/**
 * Legacy table instance type that includes the v8-style `getState()` method.
 *
 * @deprecated Use `useTable` with explicit state selection instead.
 */
export type LegacyReactTable<TData extends RowData> = ReactTable<
  StockFeatures,
  TData,
  TableState<StockFeatures>
> & {
  /**
   * Returns the current table state.
   * @deprecated In v9, access state directly via `table.state` or use `table.store.state` for the full state.
   */
  getState: () => TableState<StockFeatures>
}

// =============================================================================
// Legacy type aliases - StockFeatures hardcoded for simpler prop typing with useLegacyTable
// =============================================================================

/** @deprecated Use Column<TFeatures, TData, TValue> with useTable instead. */
export type LegacyColumn<TData extends RowData, TValue = unknown> = Column<
  StockFeatures,
  TData,
  TValue
>

/** @deprecated Use Row<TFeatures, TData> with useTable instead. */
export type LegacyRow<TData extends RowData> = Row<StockFeatures, TData>

/** @deprecated Use Cell<TFeatures, TData, TValue> with useTable instead. */
export type LegacyCell<TData extends RowData, TValue = unknown> = Cell<
  StockFeatures,
  TData,
  TValue
>

/** @deprecated Use Header<TFeatures, TData, TValue> with useTable instead. */
export type LegacyHeader<TData extends RowData, TValue = unknown> = Header<
  StockFeatures,
  TData,
  TValue
>

/** @deprecated Use HeaderGroup<TFeatures, TData> with useTable instead. */
export type LegacyHeaderGroup<TData extends RowData> = HeaderGroup<
  StockFeatures,
  TData
>

/** @deprecated Use ColumnDef<TFeatures, TData, TValue> with useTable instead. */
export type LegacyColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<StockFeatures, TData, TValue>

/** @deprecated Use Table<TFeatures, TData> with useTable instead. */
export type LegacyTable<TData extends RowData> = Table<StockFeatures, TData>

// =============================================================================
// Legacy column helper - StockFeatures hardcoded
// =============================================================================

/**
 * @deprecated Use `createColumnHelper<TFeatures, TData>()` with useTable instead.
 *
 * A column helper with StockFeatures pre-bound for use with useLegacyTable.
 * Only requires TData—no need to specify TFeatures.
 */
export function legacyCreateColumnHelper<TData extends RowData>() {
  return createColumnHelper<StockFeatures, TData>()
}

// =============================================================================
// useLegacyTable hook
// =============================================================================

/**
 * @deprecated This hook is provided as a compatibility layer for migrating from TanStack Table v8.
 *
 * Use the new `useTable` hook instead with explicit `_features` and `_rowModels`:
 *
 * ```tsx
 * // New v9 API
 * const _features = tableFeatures({
 *   columnFilteringFeature,
 *   rowSortingFeature,
 *   rowPaginationFeature,
 * })
 *
 * const table = useTable({
 *   _features,
 *   _rowModels: {
 *     filteredRowModel: createFilteredRowModel(filterFns),
 *     sortedRowModel: createSortedRowModel(sortFns),
 *     paginatedRowModel: createPaginatedRowModel(),
 *   },
 *   columns,
 *   data,
 * })
 * ```
 *
 * Key differences from v8:
 * - Features are tree-shakeable - only import what you use
 * - Row models are explicitly passed via `_rowModels`
 * - Use `table.Subscribe` for fine-grained re-renders
 * - State is accessed via `table.state` after selecting with the 2nd argument
 *
 * @param options - Legacy v8-style table options
 * @returns A table instance with the full state subscribed and a `getState()` method
 */
export function useLegacyTable<TData extends RowData>(
  options: LegacyTableOptions<TData>,
): LegacyReactTable<TData> {
  const {
    // Extract legacy row model options
    getCoreRowModel: _getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
    getGroupedRowModel,
    getFacetedRowModel,
    getFacetedMinMaxValues,
    getFacetedUniqueValues,
    // Rest of the options
    ...restOptions
  } = options

  // Build the _rowModels object based on which legacy options were provided
  const _rowModels: CreateRowModels_All<StockFeatures, TData> = {}

  // Map v8 row model factories to v9 _rowModels
  // Note: getCoreRowModel is handled automatically in v9, so we ignore it

  if (getFilteredRowModel) {
    _rowModels.filteredRowModel = createFilteredRowModel(filterFns)
  }

  if (getSortedRowModel) {
    _rowModels.sortedRowModel = createSortedRowModel(sortFns)
  }

  if (getPaginationRowModel) {
    _rowModels.paginatedRowModel = createPaginatedRowModel()
  }

  if (getExpandedRowModel) {
    _rowModels.expandedRowModel = createExpandedRowModel()
  }

  if (getGroupedRowModel) {
    _rowModels.groupedRowModel = createGroupedRowModel(aggregationFns)
  }

  if (getFacetedRowModel) {
    _rowModels.facetedRowModel = createFacetedRowModel()
  }

  if (getFacetedMinMaxValues) {
    _rowModels.facetedMinMaxValues = createFacetedMinMaxValues()
  }

  if (getFacetedUniqueValues) {
    _rowModels.facetedUniqueValues = createFacetedUniqueValues()
  }

  // Call useTable with the v9 API, subscribing to all state changes
  const table = useTable<StockFeatures, TData, TableState<StockFeatures>>({
    ...restOptions,
    _features: stockFeatures,
    _rowModels,
  } as TableOptions<StockFeatures, TData>)

  const state = useStore(table.store, (state) => state)

  return useMemo(
    () =>
      ({
        ...table,
        getState: () => state,
      }) as LegacyReactTable<TData>,
    [table, state],
  )
}
