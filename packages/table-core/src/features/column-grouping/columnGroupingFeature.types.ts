import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'

export type GroupingState = Array<string>

export interface TableState_ColumnGrouping {
  grouping: GroupingState
}

export interface ColumnDef_ColumnGrouping<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Allows this column to be added to grouping state.
   *
   * Defaults to `true`; table-level `enableGrouping` must also allow grouping.
   */
  enableGrouping?: boolean
  /**
   * Returns the value used to group rows for this column.
   *
   * When omitted, grouping uses the value derived from this column's
   * `accessorKey` or `accessorFn`.
   */
  getGroupingValue?: (
    originalRow: TData,
    index: number,
    row: Row<TFeatures, TData>,
  ) => any
}

export interface Column_ColumnGrouping {
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

export interface Row_ColumnGrouping<
  in out TFeatures extends TableFeatures = TableFeatures,
  in out TData extends RowData = RowData,
> {
  /**
   * Cache of aggregated values computed for this grouped row, keyed by column
   * id. Populated lazily by grouped `row.getValue` reads.
   * @internal
   */
  _aggregationValuesCache?: Record<string, unknown>
  /**
   * The rows the grouped row model partitioned into this group, before
   * aggregation normalization. Grouped `row.getValue` reads resolve grouping
   * values and aggregations from these rows.
   * @internal
   */
  _groupedRows?: Array<Row<TFeatures, TData>>
  _groupingValuesCache?: Record<string, any>
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
  /**
   * If this row is grouped, the normalized unique leaf rows this group
   * aggregates over.
   */
  leafRows?: Array<Row<TFeatures, TData>>
}

export interface Cell_ColumnGrouping {
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
  in out _TFeatures extends TableFeatures,
  in out _TData extends RowData,
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
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Resolves the row model after grouping has been applied.
   */
  getGroupedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Reads the row model immediately before grouping.
   */
  getPreGroupedRowModel: () => RowModel<TFeatures, TData>
}

export interface CachedRowModel_Grouped<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  groupedRowModel: () => RowModel<TFeatures, TData>
}
