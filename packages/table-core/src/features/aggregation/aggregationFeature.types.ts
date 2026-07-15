import type { BuiltInAggregationFn } from './aggregationFns'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'
import type { ColumnDefTemplate } from '../../types/ColumnDef'
import type { IsAny, TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Table } from '../../types/Table'
import type { CellData, RowData } from '../../types/type-utils'

/** Declaration-merging fallback for named aggregation definitions. */
export interface AggregationFns {}

/** Values and table objects available while one aggregation is evaluated. */
export interface AggregationContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> {
  /** The column whose values are being aggregated. */
  column: Column<TFeatures, TData, TValue>
  /** Convenience alias for `column.id`. */
  columnId: string
  /** Maximum relative sub-row depth used to select `rows`. */
  maxDepth: number
  /**
   * Immediate sub-rows for grouped aggregation. This property is omitted
   * for root or caller-supplied-row aggregation. At a terminal grouping level
   * these are the direct data rows; at a nested level they are sub-row groups.
   */
  subRows?: ReadonlyArray<Row<TFeatures, TData>>
  /** Reads this column's value from one of `rows`. */
  getValue: (row: Row<TFeatures, TData>) => TValue
  /**
   * The synthetic grouped row receiving this result. This property is omitted
   * for root or caller-supplied-row aggregation. Its `depth` identifies the
   * grouping level when grouped aggregation needs that distinction.
   */
  groupingRow?: Row<TFeatures, TData>
  /**
   * Unique rows selected at `maxDepth`. Branches that end before `maxDepth`
   * contribute their deepest available row.
   */
  rows: ReadonlyArray<Row<TFeatures, TData>>
  /** The table that owns the column and rows. */
  table: Table<TFeatures, TData>
}

/** Additional values available when merging nested grouped results. */
export interface AggregationMergeContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue,
  TResult,
> extends AggregationContext<TFeatures, TData, TValue> {
  /** Results produced for each immediate sub-row group, in sub-row order. */
  subRowResults: ReadonlyArray<TResult>
  /** Immediate sub-row groups corresponding to `subRowResults`. */
  subRows: ReadonlyArray<Row<TFeatures, TData>>
}

/** A context-based aggregation definition and optional grouped-result merge. */
export interface AggregationFnDef<
  TFeatures extends TableFeatures = any,
  TData extends RowData = any,
  TValue = unknown,
  TResult = unknown,
> {
  /** Computes a result directly from the selected `rows`. */
  aggregate: (context: AggregationContext<TFeatures, TData, TValue>) => TResult
  /**
   * Combines already-computed immediate sub-row results. When omitted,
   * nested grouping falls back to `aggregate` over the group's selected rows.
   */
  merge?: (
    context: AggregationMergeContext<TFeatures, TData, TValue, TResult>,
  ) => TResult
}

/**
 * Creates a typed context-based aggregation definition for a column or
 * aggregation-function registry.
 */
export function constructAggregationFn<
  TFeatures extends TableFeatures = any,
  TData extends RowData = any,
  TValue = unknown,
  TResult = unknown,
>(
  definition: AggregationFnDef<TFeatures, TData, TValue, TResult>,
): AggregationFnDef<TFeatures, TData, TValue, TResult> {
  return definition
}

/** Aggregation-definition registry carried by a table feature set. */
export interface RowModelFns_Aggregation<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  aggregationFns: Record<string, AggregationFnDef<TFeatures, TData, any, any>>
}

/** Named context-based aggregation definitions registered on a feature set. */
export type CustomAggregationFns<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Record<string, AggregationFnDef<TFeatures, TData, any, any>>

/** String names available from a feature set's aggregation registry. */
export type ExtractAggregationFnKeys<TFeatures extends TableFeatures> =
  IsAny<TFeatures> extends true
    ? keyof AggregationFns | BuiltInAggregationFn
    : TFeatures extends { aggregationFns: infer TAggregationFns extends object }
      ? Extract<keyof TAggregationFns, string>
      : keyof AggregationFns

/** A registered name, automatic inference, or inline aggregation definition. */
export type AggregationFnRef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
  TResult = unknown,
> =
  | 'auto'
  | ExtractAggregationFnKeys<TFeatures>
  | AggregationFnDef<TFeatures, TData, TValue, TResult>

/** Gives an aggregation reference a stable key in a multiple result. */
export interface AggregationFnDescriptor<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
  TResult = unknown,
> {
  /** The named, automatic, or inline definition to execute. */
  aggregationFn: AggregationFnRef<TFeatures, TData, TValue, TResult>
  /** Stable key used in the object returned by a multiple aggregation. */
  id: string
}

/** One named or explicitly keyed entry in a multiple aggregation option. */
export type AggregationFnListItem<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> =
  | 'auto'
  | ExtractAggregationFnKeys<TFeatures>
  | AggregationFnDescriptor<TFeatures, TData, TValue, any>

/** A scalar aggregation reference or a list that produces a keyed object. */
export type AggregationFnOption<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> =
  | AggregationFnRef<TFeatures, TData, TValue, any>
  | ReadonlyArray<AggregationFnListItem<TFeatures, TData, TValue>>

/** Extracts the result type produced by an aggregation definition. */
export type AggregationResultOf<TDefinition> =
  TDefinition extends AggregationFnDef<any, any, any, infer TResult>
    ? TResult
    : unknown

type RegisteredAggregationDefinition<
  TFeatures extends TableFeatures,
  TKey extends PropertyKey,
> = TFeatures extends {
  aggregationFns: infer TRegistry extends Record<PropertyKey, unknown>
}
  ? TKey extends keyof TRegistry
    ? TRegistry[TKey]
    : never
  : never

type AggregationResultOfRef<TRef, TFeatures extends TableFeatures> =
  TRef extends AggregationFnDef<any, any, any, any>
    ? AggregationResultOf<TRef>
    : TRef extends 'auto'
      ? RegisteredAggregationResult<TFeatures>
      : TRef extends PropertyKey
        ? AggregationResultOf<RegisteredAggregationDefinition<TFeatures, TRef>>
        : unknown

type AggregationEntryId<TEntry> = TEntry extends string
  ? TEntry
  : TEntry extends { id: infer TId extends string }
    ? TId
    : never

type AggregationEntryDefinition<TEntry> = TEntry extends {
  aggregationFn: infer TDefinition
}
  ? TDefinition
  : TEntry

/** Infers the scalar or keyed result produced by an aggregation option. */
export type AggregationResult<TOption, TFeatures extends TableFeatures = any> =
  TOption extends ReadonlyArray<infer TEntry>
    ? {
        [TKey in AggregationEntryId<TEntry>]: AggregationResultOfRef<
          AggregationEntryDefinition<Extract<TEntry, TKey | { id: TKey }>>,
          TFeatures
        >
      }
    : AggregationResultOfRef<TOption, TFeatures>

type RegisteredAggregationResult<TFeatures extends TableFeatures> =
  TFeatures extends {
    aggregationFns: infer TRegistry extends Record<string, unknown>
  }
    ? AggregationResultOf<TRegistry[keyof TRegistry]>
    : unknown

/** Default public result union when a column's precise option is not known. */
export type ColumnAggregationValue<TFeatures extends TableFeatures> =
  | RegisteredAggregationResult<TFeatures>
  | Record<string, RegisteredAggregationResult<TFeatures> | undefined>
  | undefined

/** A validated aggregation entry returned by `column.getAggregationFns()`. */
export interface ResolvedAggregationFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /** Resolved definition, or `undefined` when configuration is invalid. */
  aggregationFn: AggregationFnDef<TFeatures, TData, any, any> | undefined
  /** Key used for a multiple result; scalar inline definitions have no id. */
  id: string | undefined
}

/** Column-definition options installed by `aggregationFeature`. */
export interface ColumnDef_Aggregation<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue extends CellData = CellData,
> {
  /** Renderer used for a grouped row's aggregated cell. */
  aggregatedCell?: ColumnDefTemplate<
    ReturnType<Cell<TFeatures, TData, TValue>['getContext']>
  >
  /**
   * One aggregation reference for a scalar result, or an array for a keyed
   * result object. Inline definitions in an array require an explicit `id`.
   */
  aggregationFn?: AggregationFnOption<TFeatures, TData, TValue>
  /**
   * Maximum relative sub-row depth used for grouped aggregation and cached
   * default totals. `0` selects the supplied root rows, `1` their direct
   * sub-rows, and so on. Defaults to `0`.
   */
  maxAggregationDepth?: number
  /**
   * Optionally supplies a precomputed aggregation value for this column.
   * Return `{ value }` to handle the request, including `{ value: undefined }`;
   * return `undefined` to use the local aggregation fallback.
   */
  getAggregationValue?: (
    context: AggregationValueContext<TFeatures, TData, TValue>,
  ) => AggregationValueResult | undefined
}

/** Column instance APIs installed by `aggregationFeature`. */
export interface Column_Aggregation<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /** Resolves the configured scalar or multiple aggregation definitions. */
  getAggregationFns: () => ReadonlyArray<
    ResolvedAggregationFn<TFeatures, TData>
  >
  /**
   * Aggregates this column over the default pre-grouped row model, or over a
   * caller-provided array of rows. `options.maxDepth` overrides the column's
   * `maxAggregationDepth`. Explicit-row calls are intentionally not cached.
   */
  getAggregationValue: <TResult = ColumnAggregationValue<TFeatures>>(
    options?: AggregationValueOptions<TFeatures, TData>,
  ) => TResult
  /** Infers `sum` for a numeric first row and `extent` for a Date first row. */
  getAutoAggregationFn: () =>
    | AggregationFnDef<TFeatures, TData, any, any>
    | undefined
}

/** Options for a caller-requested column aggregation value. */
export interface AggregationValueOptions<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /** Overrides the column's `maxAggregationDepth` for this request. */
  maxDepth?: number
  /** Rows to aggregate instead of the default pre-grouped row model. */
  rows?: ReadonlyArray<Row<TFeatures, TData>>
}

/** Cell instance APIs installed by `aggregationFeature`. */
export interface Cell_Aggregation {
  /** Whether this cell displays an aggregate on a synthetic grouped row. */
  getIsAggregated: () => boolean
}

/** Internal per-row cache used while grouped aggregates are evaluated. */
export interface Row_Aggregation {
  /** Cached aggregate results keyed by column id. */
  _aggregationValuesCache: Record<string, unknown>
}

/** Values passed to a column-level aggregation-value provider. */
export interface AggregationValueContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  /** The column whose value was requested. */
  column: Column<TFeatures, TData, TValue>
  /** Maximum relative sub-row depth used for the request. */
  maxDepth: number
  /** Caller-provided rows, or `undefined` for the default row model. */
  rows?: ReadonlyArray<Row<TFeatures, TData>>
  /** The table that owns the column. */
  table: Table<TFeatures, TData>
}

/** Marks an aggregation-value override as handled. */
export interface AggregationValueResult<TResult = unknown> {
  /** The supplied value. `undefined` is still a handled result. */
  value: TResult
}

/** Table options installed by `aggregationFeature`. */
export interface TableOptions_Aggregation {
  /**
   * Disables local `column.getAggregationValue()` calculation when a column
   * override does not handle the request. Group values supplied by manually
   * grouped rows remain the responsibility of the data owner.
   */
  manualAggregation?: boolean
}
