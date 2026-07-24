import type { CoreFeatures } from '../core/coreFeatures'
import type { CellData, RowData, UnionToIntersection } from './type-utils'
import type { Cell } from './Cell'
import type { Column } from './Column'
import type { ColumnDefBase_All } from './ColumnDef'
import type { Header } from './Header'
import type { HeaderGroup } from './HeaderGroup'
import type { Row } from './Row'
import type { Table_Internal } from './Table'
import type { TableOptions_All } from './TableOptions'
import type { TableState_All } from './TableState'
import type { StockFeatures } from '../features/stockFeatures'
import type { RowModel } from '../core/row-models/coreRowModelsFeature.types'
import type { FilterFn } from '../features/column-filtering/columnFilteringFeature.types'
import type { SortFn } from '../features/row-sorting/rowSortingFeature.types'
import type { AggregationFnDef } from '../features/row-aggregation/rowAggregationFeature.types'

/**
 * Detects whether a type is `any`.
 *
 * Several feature-map helpers need a separate `any` path so broad generic
 * usage still exposes all known feature APIs instead of narrowing to no keys.
 */
export type IsAny<T> = 0 extends 1 & T ? true : false

/**
 * Converts a union to an intersection, returning `{}` for `never`.
 *
 * This keeps empty feature-map lookups usable as an intersection member.
 */
type UnionToIntersectionOrEmpty<T> = [T] extends [never]
  ? {}
  : UnionToIntersection<T> & {}

/**
 * Extracts the API/types contributed by the features present in `TFeatures`.
 *
 * `TFeatureMap` maps feature keys to the types they contribute. When
 * `TFeatures` is `any`, all feature-map entries are included to preserve the
 * permissive behavior expected by broad table types. Otherwise, only entries
 * whose keys are present in `TFeatures` are intersected together.
 */
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
 * Declaration-merge target for custom table features.
 *
 * Add custom feature keys here so `TableFeatures` can accept them in the
 * `features` option and use the same feature-map extraction system as built-in
 * features.
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
  /**
   * Named aggregation functions require the independent aggregation feature.
   */
  aggregationFns: 'rowAggregationFeature'
  /**
   * Column resizing builds on the column sizing state and APIs.
   */
  columnResizingFeature: 'columnSizingFeature'
  /**
   * Expanded row-model factories require row expanding APIs and state.
   */
  expandedRowModel: 'rowExpandingFeature'
  /**
   * Faceted min/max factories require column faceting APIs.
   */
  facetedMinMaxValues: 'columnFacetingFeature'
  /**
   * Faceted row-model factories require column faceting APIs.
   */
  facetedRowModel: 'columnFacetingFeature'
  /**
   * Faceted unique-value factories require column faceting APIs.
   */
  facetedUniqueValues: 'columnFacetingFeature'
  /**
   * Filtered row-model factories require column filtering APIs and state.
   */
  filteredRowModel: 'columnFilteringFeature'
  /**
   * Named filter functions are only meaningful when column filtering is enabled.
   */
  filterFns: 'columnFilteringFeature'
  /**
   * Filter metadata types are only read and written by filtering features.
   */
  filterMeta: 'columnFilteringFeature'
  /**
   * Global filtering builds on column filtering state and filter functions.
   */
  globalFilteringFeature: 'columnFilteringFeature'
  /**
   * Grouped row-model factories require column grouping APIs and state.
   */
  groupedRowModel: 'columnGroupingFeature'
  /**
   * Paginated row-model factories require row pagination APIs and state.
   */
  paginatedRowModel: 'rowPaginationFeature'
  /**
   * Sorted row-model factories require row sorting APIs and state.
   */
  sortedRowModel: 'rowSortingFeature'
  /**
   * Named sorting functions are only meaningful when row sorting is enabled.
   */
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

/**
 * Complete feature registry for a table.
 *
 * This type combines core features, stock features, declaration-merged custom
 * plugins, row-model factory slots, function registries, and type-only meta
 * slots. The concrete `features` object passed to `tableFeatures()` determines
 * which feature APIs are included throughout table, row, column, cell, header,
 * options, and state types.
 */
export interface TableFeatures
  extends Partial<CoreFeatures>, Partial<StockFeatures>, Partial<Plugins> {
  /**
   * Registry of aggregation functions available to this table by name.
   *
   * Keys registered here become the valid string values for `aggregationFn` on
   * column definitions, with full inference. Import the built-in aggregation
   * functions you use individually and register them by their conventional
   * names: `aggregationFns: { sum: aggregationFn_sum, myCustomAggregationFn }`.
   * Spreading the exported `aggregationFns` registry also works, but puts
   * every built-in aggregation function in your bundle.
   */
  aggregationFns?: Record<string, AggregationFnDef<any, any, any, any>>
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
   * Import the built-in filter functions you use individually and register
   * them by their conventional names:
   * `filterFns: { includesString: filterFn_includesString, myCustomFilterFn }`.
   * Spreading the exported `filterFns` registry also works, but puts every
   * built-in filter function in your bundle.
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
   * definitions, with full inference. Import the built-in sorting functions
   * you use individually and register them by their conventional names:
   * `sortFns: { alphanumeric: sortFn_alphanumeric, myCustomSortFn }`. Spreading
   * the exported `sortFns` registry also works, but puts every built-in
   * sorting function in your bundle.
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

/**
 * Lifecycle hooks and defaults contributed by a table feature.
 *
 * Feature objects are registered in the table's `features` option. They can
 * contribute default state/options, default column definitions, table APIs,
 * shared prototype APIs for rows/columns/headers/cells, and per-instance data
 * for tables, columns, rows, headers, header groups, and cells.
 */
export interface TableFeature {
  /**
   * Adds feature methods to the shared cell prototype for a table.
   *
   * This runs lazily the first time a cell is constructed for a table. Methods
   * assigned here are shared by every cell instance created by that table, so
   * this hook should be used for APIs and memoized methods rather than
   * per-cell mutable data.
   */
  assignCellPrototype?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Adds feature methods to the shared column prototype for a table.
   *
   * This runs lazily the first time a column is constructed for a table.
   * Methods assigned here are shared by every column instance created by that
   * table, so this hook should be used for APIs and memoized methods rather
   * than per-column mutable data.
   */
  assignColumnPrototype?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Adds feature methods to the shared header prototype for a table.
   *
   * This runs lazily the first time a header is constructed for a table.
   * Methods assigned here are shared by every header instance created by that
   * table, so this hook should be used for APIs and memoized methods rather
   * than per-header mutable data.
   */
  assignHeaderPrototype?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Adds feature methods to the shared row prototype for a table.
   *
   * This runs lazily the first time a row is constructed for a table. Methods
   * assigned here are shared by every row instance created by that table, so
   * this hook should be used for APIs and memoized methods rather than per-row
   * mutable data.
   */
  assignRowPrototype?: <TFeatures extends TableFeatures, TData extends RowData>(
    prototype: Record<string, any>,
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Adds feature APIs directly to the table instance.
   *
   * The table is a singleton, unlike rows, columns, headers, and cells, so
   * table APIs are assigned directly instead of through a shared prototype.
   * This hook is exclusively for assigning table methods. It runs after
   * options, state atoms, and the store have been created and after every
   * feature's `initTableInstanceData` hook has completed.
   */
  constructTableAPIs?: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Returns default column definition options contributed by this feature.
   *
   * These defaults are merged into the table's default column definition before
   * `options.defaultColumn` and before each user-supplied column definition is
   * resolved, so users can override values supplied here.
   */
  getDefaultColumnDef?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >() => ColumnDefBase_All<TFeatures, TData, TValue>
  /**
   * Returns default table options contributed by this feature.
   *
   * This runs while table options are being resolved. Use it for option
   * defaults such as feature enablement flags and default state-updater
   * callbacks. User-supplied table options take precedence over values returned
   * here.
   */
  getDefaultTableOptions?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
  ) => Partial<TableOptions_All<TFeatures, TData>>
  /**
   * Returns this feature's initial table state.
   *
   * The incoming `initialState` contains state accumulated from earlier
   * features and user-provided initial state. Return a complete state object
   * for this feature, preserving `initialState` so user-provided values can
   * override feature defaults.
   */
  getInitialState?: (initialState: Partial<TableState_All>) => TableState_All
  /**
   * Initializes mutable, non-reactive data owned by this feature on the table
   * instance.
   *
   * This runs once during table construction after options, state atoms, and
   * the store are available, and before any feature's `constructTableAPIs`
   * hook runs. Use `constructTableAPIs` exclusively for assigning table
   * methods. Table resets do not rerun this hook; use
   * `resetTableInstanceData` to clear transient instance data instead.
   */
  initTableInstanceData?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
  ) => void
  /**
   * Initializes instance-specific data on each cell.
   *
   * This runs for every constructed cell after core cell fields such as `id`,
   * `column`, and `row` have been assigned. Cells are constructed lazily on
   * first access per row/column pair and cached, so this runs once per cell
   * instance. Use this for per-cell mutable data, caches, or annotations.
   * Shared methods should be assigned via `assignCellPrototype` instead.
   */
  initCellInstanceData?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    cell: Cell<TFeatures, TData, TValue>,
  ) => void
  /**
   * Initializes instance-specific data on each column.
   *
   * This runs for every constructed column after core column fields such as
   * `id`, `depth`, `parent`, `columnDef`, and `columns` have been assigned.
   * Use this for per-column mutable data, caches, or annotations. Shared
   * methods should be assigned via `assignColumnPrototype` instead.
   */
  initColumnInstanceData?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue>,
  ) => void
  /**
   * Initializes instance-specific data on each header group.
   *
   * This runs for every constructed header group after `depth`, `id`, and the
   * fully populated `headers` array have been assigned. Header groups have no
   * shared prototype, so this is their only per-instance extension point.
   * Header groups are reconstructed whenever they recompute (e.g. column
   * visibility, order, or pinning changes), so this reruns on every rebuild.
   */
  initHeaderGroupInstanceData?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    headerGroup: HeaderGroup<TFeatures, TData>,
  ) => void
  /**
   * Initializes instance-specific data on each header.
   *
   * This runs for every constructed header after core header fields such as
   * `id`, `column`, `depth`, `index`, and `isPlaceholder` have been assigned,
   * but before `subHeaders` are populated and before `headerGroup` is linked.
   * Headers are reconstructed on every header group rebuild, so this reruns
   * on every rebuild. Use this for per-header mutable data, caches, or
   * annotations. Shared methods should be assigned via `assignHeaderPrototype`
   * instead.
   */
  initHeaderInstanceData?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    header: Header<TFeatures, TData, TValue>,
  ) => void
  /**
   * Initializes instance-specific data on each row.
   *
   * This runs for every constructed row after core row fields such as `id`,
   * `index`, `depth`, `original`, `parentId`, and `subRows` have been assigned.
   * Use this for per-row mutable data, caches, or annotations. Shared methods
   * should be assigned via `assignRowPrototype` instead.
   */
  initRowInstanceData?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    row: Row<TFeatures, TData>,
  ) => void
  /**
   * Resets mutable, non-reactive table-instance data owned by this feature.
   *
   * This runs after internally owned state atoms have been restored to
   * `table.initialState` by `table.reset()`. It is intended for transient
   * feature data, not table state slices or externally controlled state.
   */
  resetTableInstanceData?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
  ) => void
}
