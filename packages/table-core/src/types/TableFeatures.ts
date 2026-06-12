import type { CoreFeatures } from '../core/coreFeatures'
import type { CellData, RowData, UnionToIntersection } from './type-utils'
import type { ColumnDefBase_All } from './ColumnDef'
import type { Row } from './Row'
import type { Table_Internal } from './Table'
import type { TableOptions_All } from './TableOptions'
import type { TableState_All } from './TableState'
import type { StockFeatures } from '../features/stockFeatures'
import type { RowModel } from '../core/row-models/coreRowModelsFeature.types'
import type { FilterFn } from '../features/column-filtering/columnFilteringFeature.types'
import type { SortFn } from '../features/row-sorting/rowSortingFeature.types'
import type { AggregationFn } from '../features/column-grouping/columnGroupingFeature.types'

export type IsAny<T> = 0 extends 1 & T ? true : false
type UnionToIntersectionOrEmpty<T> = [T] extends [never]
  ? {}
  : UnionToIntersection<T> & {}

export type ExtractFeatureMapTypes<
  TFeatures extends TableFeatures,
  TFeatureMap extends object,
> =
  IsAny<TFeatures> extends true
    ? UnionToIntersection<TFeatureMap[keyof TFeatureMap]>
    : UnionToIntersectionOrEmpty<
        TFeatureMap[Extract<keyof TFeatures, keyof TFeatureMap>]
      >

/**
 * This is an interface that you can delcaration-merge into to allow for custom plugins to be added to the table.
 */
export interface Plugins {}

/**
 * Keys of the `features` option that are not table features themselves.
 *
 * These slots carry per-table types (`tableMeta`, `columnMeta`), row model
 * factories, and row model function registries. They are stripped from the
 * table's registered `_features` at runtime and excluded from feature-derived
 * options such as the generated `debug*` keys.
 */
export type NonFeatureKeys =
  | 'aggregationFns'
  | 'columnMeta'
  | 'coreRowModel'
  | 'expandedRowModel'
  | 'facetedMinMaxValues'
  | 'facetedRowModel'
  | 'facetedUniqueValues'
  | 'filterFns'
  | 'filterMeta'
  | 'filteredRowModel'
  | 'groupedRowModel'
  | 'paginatedRowModel'
  | 'sortFns'
  | 'sortedRowModel'
  | 'tableMeta'

/**
 * Maps each row model and fn registry slot to the feature(s) that must be
 * registered alongside it in the same features object.
 *
 * Custom features can declaration-merge their own slot prerequisites into this
 * interface to get the same validation from `tableFeatures()`.
 */
export interface FeatureSlotPrereqs {
  aggregationFns: 'columnGroupingFeature'
  columnResizingFeature: 'columnSizingFeature' // columnSizingFeature is required for columnResizingFeature
  expandedRowModel: 'rowExpandingFeature'
  facetedMinMaxValues: 'columnFacetingFeature'
  facetedRowModel: 'columnFacetingFeature'
  facetedUniqueValues: 'columnFacetingFeature'
  filteredRowModel: 'columnFilteringFeature'
  filterFns: 'columnFilteringFeature'
  filterMeta: 'columnFilteringFeature'
  globalFilteringFeature: 'columnFilteringFeature' // columnFilteringFeature is required for globalFilteringFeature
  groupedRowModel: 'columnGroupingFeature'
  paginatedRowModel: 'rowPaginationFeature'
  sortedRowModel: 'rowSortingFeature'
  sortFns: 'rowSortingFeature'
}

/**
 * Validates that every row model and fn registry slot in a features object is
 * accompanied by its prerequisite feature.
 *
 * Slots whose prerequisite is missing have their type replaced with a literal
 * error message, so the offending property fails to type-check with a message
 * naming the feature that needs to be added.
 */
export type ValidateFeatureSlots<TFeatures extends TableFeatures> =
  IsAny<TFeatures> extends true
    ? {}
    : {
        [K in keyof TFeatures as K extends keyof FeatureSlotPrereqs
          ? K
          : never]: K extends keyof FeatureSlotPrereqs
          ? [Extract<FeatureSlotPrereqs[K], keyof TFeatures>] extends [never]
            ? `Error: '${K & string}' requires '${FeatureSlotPrereqs[K] &
                string}' to be included in this table's features.`
            : TFeatures[K]
          : never
      }

export interface TableFeatures
  extends Partial<CoreFeatures>, Partial<StockFeatures>, Partial<Plugins> {
  /**
   * Registry of aggregation functions available to this table by name.
   *
   * Keys registered here become the valid string values for `aggregationFn` on
   * column definitions, with full inference. Spread the exported
   * `aggregationFns` to register the built-in aggregation functions:
   * `aggregationFns: { ...aggregationFns, myCustomAggregationFn }`.
   */
  aggregationFns?: Record<string, AggregationFn<any, any>>
  /**
   * Type-only slot for declaring the type of `columnDef.meta` for all columns
   * of this table.
   *
   * Pass a phantom value: `columnMeta: {} as MyColumnMeta`. The value itself is
   * ignored and stripped from the table's registered features at runtime — only
   * its type is used, inferred wherever `TFeatures` flows.
   *
   * When omitted, the global declaration-merged `ColumnMeta` interface applies.
   */
  columnMeta?: object
  /**
   * Factory for the table's core (unmodified) row model. Defaults to the
   * built-in `createCoreRowModel()` when omitted.
   */
  coreRowModel?: (table: any) => () => RowModel<any, any>
  /**
   * Factory for the client-side expanded row model. Pass the exported
   * `createExpandedRowModel()` or implement your own. Not needed for
   * server-side expansion.
   */
  expandedRowModel?: (table: any) => () => RowModel<any, any>
  /**
   * Factory for per-column faceted min/max values. Pass the exported
   * `createFacetedMinMaxValues()` or implement your own. Not needed for
   * server-side faceting.
   */
  facetedMinMaxValues?: (
    table: any,
    columnId: string,
  ) => () => [number, number] | undefined
  /**
   * Factory for the per-column faceted row model. Pass the exported
   * `createFacetedRowModel()` or implement your own. Not needed for
   * server-side faceting.
   */
  facetedRowModel?: (table: any, columnId: string) => () => RowModel<any, any>
  /**
   * Factory for per-column faceted unique values. Pass the exported
   * `createFacetedUniqueValues()` or implement your own. Not needed for
   * server-side faceting.
   */
  facetedUniqueValues?: (table: any, columnId: string) => () => Map<any, number>
  /**
   * Factory for the client-side filtered row model. Pass the exported
   * `createFilteredRowModel()` or implement your own. Not needed for
   * server-side filtering.
   */
  filteredRowModel?: (table: any) => () => RowModel<any, any>
  /**
   * Registry of filter functions available to this table by name.
   *
   * Keys registered here become the valid string values for `filterFn` on
   * column definitions and the `globalFilterFn` option, with full inference.
   * Spread the exported `filterFns` to register the built-in filter functions:
   * `filterFns: { ...filterFns, myCustomFilterFn }`.
   */
  filterFns?: Record<string, FilterFn<any, any>>
  /**
   * Type-only slot for declaring the type of the filter meta that filter
   * functions attach to rows via `addMeta` and that is read back from
   * `row.columnFiltersMeta`.
   *
   * Pass a phantom value: `filterMeta: {} as MyFilterMeta` (or
   * `metaHelper<MyFilterMeta>()`). The value itself is ignored and stripped
   * from the table's registered features at runtime; only its type is used.
   *
   * When omitted, the global declaration-merged `FilterMeta` interface applies.
   */
  filterMeta?: object
  /**
   * Factory for the client-side grouped row model. Pass the exported
   * `createGroupedRowModel()` or implement your own. Not needed for
   * server-side grouping.
   */
  groupedRowModel?: (table: any) => () => RowModel<any, any>
  /**
   * Factory for the client-side paginated row model. Pass the exported
   * `createPaginatedRowModel()` or implement your own. Not needed for
   * server-side pagination.
   */
  paginatedRowModel?: (table: any) => () => RowModel<any, any>
  /**
   * Factory for the client-side sorted row model. Pass the exported
   * `createSortedRowModel()` or implement your own. Not needed for
   * server-side sorting.
   */
  sortedRowModel?: (table: any) => () => RowModel<any, any>
  /**
   * Registry of sorting functions available to this table by name.
   *
   * Keys registered here become the valid string values for `sortFn` on column
   * definitions, with full inference. Spread the exported `sortFns` to register
   * the built-in sorting functions: `sortFns: { ...sortFns, myCustomSortFn }`.
   */
  sortFns?: Record<string, SortFn<any, any>>
  /**
   * Type-only slot for declaring the type of this table's `options.meta`.
   *
   * Pass a phantom value: `tableMeta: {} as MyTableMeta`. The value itself is
   * ignored and stripped from the table's registered features at runtime — only
   * its type is used, inferred wherever `TFeatures` flows.
   *
   * When omitted, the global declaration-merged `TableMeta` interface applies.
   */
  tableMeta?: object
}

export interface TableFeature {
  /**
   * Assigns Cell APIs to the cell prototype for memory-efficient method sharing.
   * This is called once per table to build a shared prototype for all cells.
   */
  assignCellPrototype?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Assigns Column APIs to the column prototype for memory-efficient method sharing.
   * This is called once per table to build a shared prototype for all columns.
   */
  assignColumnPrototype?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Assigns Header APIs to the header prototype for memory-efficient method sharing.
   * This is called once per table to build a shared prototype for all headers.
   */
  assignHeaderPrototype?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Assigns Row APIs to the row prototype for memory-efficient method sharing.
   * This is called once per table to build a shared prototype for all rows.
   */
  assignRowPrototype?: <TFeatures extends TableFeatures, TData extends RowData>(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Assigns Table APIs to the table instance.
   * Unlike row/cell/column/header, the table is a singleton so methods are assigned directly.
   */
  constructTableAPIs?: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ) => void
  getDefaultColumnDef?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >() => ColumnDefBase_All<TFeatures, TData, TValue>
  getDefaultTableOptions?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
  ) => Partial<TableOptions_All<TFeatures, TData>>
  getInitialState?: (initialState: Partial<TableState_All>) => TableState_All
  /**
   * Initializes instance-specific data on each row (e.g., caches).
   * Methods should be assigned via assignRowPrototype instead.
   */
  initRowInstanceData?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    row: Row<TFeatures, TData>,
  ) => void
}
