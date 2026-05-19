import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table } from '../../types/Table'
import type { BuiltInAggregationFn } from '../../fns/aggregationFns'
import type {
  CellData,
  OnChangeFn,
  RowData,
  Updater,
} from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type { ColumnDefTemplate } from '../../types/ColumnDef'

export type GroupingState = Array<string>

export interface TableState_ColumnGrouping {
  grouping: GroupingState
}

export interface RowModelFns_ColumnGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  aggregationFns: Record<keyof AggregationFns, AggregationFn<TFeatures, TData>>
}

export interface AggregationFns {}

export type AggregationFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = (
  columnId: string,
  leafRows: Array<Row<TFeatures, TData>>,
  childRows: Array<Row<TFeatures, TData>>,
) => any

export type CustomAggregationFns<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Record<string, AggregationFn<TFeatures, TData>>

export type AggregationFnOption<
  TFeatures extends TableFeatures,
  TData extends RowData,
> =
  | 'auto'
  | keyof AggregationFns
  | BuiltInAggregationFn
  | AggregationFn<TFeatures, TData>

export interface ColumnDef_ColumnGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  /**
   * The cell to display each row for the column if the cell is an aggregate. If a function is passed, it will be passed a props object with the context of the cell and should return the property type for your adapter (the exact type depends on the adapter being used).
   */
  aggregatedCell?: ColumnDefTemplate<
    ReturnType<Cell<TFeatures, TData, TValue>['getContext']>
  >
  /**
   * The resolved aggregation function for the column.
   */
  aggregationFn?: AggregationFnOption<TFeatures, TData>
  /**
   * Allows this column to be added to grouping state.
   *
   * Defaults to `true`; table-level `enableGrouping` must also allow grouping.
   */
  enableGrouping?: boolean
  /**
   * Specify a value to be used for grouping rows on this column. If this option is not specified, the value derived from `accessorKey` / `accessorFn` will be used instead.
   */
  getGroupingValue?: (row: TData) => any
}

export interface Column_ColumnGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns the aggregation function for the column.
   */
  getAggregationFn: () => AggregationFn<TFeatures, TData> | undefined
  /**
   * Returns the automatically inferred aggregation function for the column.
   */
  getAutoAggregationFn: () => AggregationFn<TFeatures, TData> | undefined
  /**
   * Checks whether this column can currently be grouped.
   */
  getCanGroup: () => boolean
  /**
   * Finds this column's position in the ordered grouping state.
   */
  getGroupedIndex: () => number
  /**
   * Checks whether this column id is present in grouping state.
   */
  getIsGrouped: () => boolean
  /**
   * Returns a function that toggles the grouping state of the column. This is useful for passing to the `onClick` prop of a button.
   */
  getToggleGroupingHandler: () => () => void
  /**
   * Toggles the grouping state of the column.
   */
  toggleGrouping: () => void
}

export interface Row_ColumnGrouping {
  _groupingValuesCache: Record<string, any>
  /**
   * Reads the value used to group this row for a column id.
   */
  getGroupingValue: (columnId: string) => unknown
  /**
   * Checks whether this row represents a grouped row.
   */
  getIsGrouped: () => boolean
  /**
   * If this row is grouped, this is the id of the column that this row is grouped by.
   */
  groupingColumnId?: string
  /**
   * If this row is grouped, this is the unique/shared value for the `groupingColumnId` for all of the rows in this group.
   */
  groupingValue?: unknown
}

export interface Cell_ColumnGrouping {
  /**
   * Checks whether this cell should render an aggregated value.
   */
  getIsAggregated: () => boolean
  /**
   * Checks whether this cell represents the active grouping column.
   */
  getIsGrouped: () => boolean
  /**
   * Checks whether this cell is hidden as a grouping placeholder.
   */
  getIsPlaceholder: () => boolean
}

export interface ColumnDefaultOptions {
  enableGrouping: boolean
  onGroupingChange: OnChangeFn<GroupingState>
}

export interface TableOptions_ColumnGrouping {
  /**
   * Allows columns to be grouped for this table.
   */
  enableGrouping?: boolean
  /**
   * Grouping columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.
   */
  groupedColumnMode?: false | 'reorder' | 'remove'
  /**
   * Enables manual grouping. If this option is set to `true`, the table will not automatically group rows using `getGroupedRowModel()` and instead will expect you to manually group the rows before passing them to the table. This is useful if you are doing server-side grouping and aggregation.
   */
  manualGrouping?: boolean
  /**
   * Called with an updater when grouping state changes. Pair this with
   * `state.grouping` when using external state; external atoms can own the
   * slice without this callback.
   */
  onGroupingChange?: OnChangeFn<GroupingState>
}

export type GroupingColumnMode = false | 'reorder' | 'remove'

export interface Table_ColumnGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Resets `grouping` to `initialState.grouping`.
   *
   * Pass `true` to ignore initial state and reset to `[]`.
   */
  resetGrouping: (defaultState?: boolean) => void
  /**
   * Updates grouping state with a next ordered id array or updater function.
   */
  setGrouping: (updater: Updater<GroupingState>) => void
}

export interface Table_RowModels_Grouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Resolves the row model after grouping and aggregation have been applied.
   */
  getGroupedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Reads the row model immediately before grouping.
   */
  getPreGroupedRowModel: () => RowModel<TFeatures, TData>
}

export interface CreateRowModel_Grouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Factory used to retrieve the grouped row model. If using server-side
   * grouping, this is not required. To use client-side grouping, pass
   * `createGroupedRowModel()` or implement your own factory.
   */
  groupedRowModel?: (
    table: Table<TFeatures, TData>,
  ) => () => RowModel<TFeatures, TData>
}

export interface CachedRowModel_Grouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  groupedRowModel: () => RowModel<TFeatures, TData>
}
