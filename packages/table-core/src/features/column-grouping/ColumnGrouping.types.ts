import type { Fns } from '../../types/Fns'
import type { BuiltInAggregationFn } from '../../fns/aggregationFns'
import type {
  CellData,
  OnChangeFn,
  RowData,
  Updater,
} from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../types/RowModel'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type { ColumnDefTemplate } from '../../types/ColumnDef'

export type GroupingState = Array<string>

export interface TableState_ColumnGrouping {
  grouping: GroupingState
}

export interface TableState_ColumnGrouping_Unavailable {
  /**
   * @deprecated Import the `ColumnGrouping` feature to use the column grouping APIs.
   */
  grouping?: GroupingState
}

export interface TableFns_ColumnGrouping<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> {
  aggregationFns?: Record<
    keyof AggregationFns,
    AggregationFn<TFeatures, TFns, TData>
  >
}

export interface AggregationFns {}

export type AggregationFn<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> = (
  columnId: string,
  leafRows: Array<Row<TFeatures, TFns, TData>>,
  childRows: Array<Row<TFeatures, TFns, TData>>,
) => any

export type CustomAggregationFns<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> = Record<string, AggregationFn<TFeatures, TFns, TData>>

export type AggregationFnOption<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> =
  | 'auto'
  | keyof AggregationFns
  | BuiltInAggregationFn
  | AggregationFn<TFeatures, TFns, TData>

export interface ColumnDef_ColumnGrouping<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  /**
   * The cell to display each row for the column if the cell is an aggregate. If a function is passed, it will be passed a props object with the context of the cell and should return the property type for your adapter (the exact type depends on the adapter being used).
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#aggregatedcell)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  aggregatedCell?: ColumnDefTemplate<
    ReturnType<Cell<TFeatures, TFns, TData, TValue>['getContext']>
  >
  /**
   * The resolved aggregation function for the column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#aggregationfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  aggregationFn?: AggregationFnOption<TFeatures, TFns, TData>
  /**
   * Enables/disables grouping for this column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#enablegrouping)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  enableGrouping?: boolean
  /**
   * Specify a value to be used for grouping rows on this column. If this option is not specified, the value derived from `accessorKey` / `accessorFn` will be used instead.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupingvalue)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getGroupingValue?: (row: TData) => any
}

export interface ColumnDef_ColumnGrouping_Unavailable<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  /**
   * @deprecated Import the `ColumnGrouping` feature to use the column grouping APIs.
   */
  aggregatedCell?: ColumnDefTemplate<
    ReturnType<Cell<TFeatures, TFns, TData, TValue>['getContext']>
  >
  /**
   * @deprecated Import the `ColumnGrouping` feature to use the column grouping APIs.
   */
  aggregationFn?: AggregationFnOption<TFeatures, TFns, TData>
  /**
   * @deprecated Import the `ColumnGrouping` feature to use the column grouping APIs.
   */
  enableGrouping?: boolean
  /**
   * @deprecated Import the `ColumnGrouping` feature to use the column grouping APIs.
   */
  getGroupingValue?: (row: TData) => any
}

export interface Column_ColumnGrouping<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> {
  /**
   * Returns the aggregation function for the column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getaggregationfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getAggregationFn: () => AggregationFn<TFeatures, TFns, TData> | undefined
  /**
   * Returns the automatically inferred aggregation function for the column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getautoaggregationfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getAutoAggregationFn: () => AggregationFn<TFeatures, TFns, TData> | undefined
  /**
   * Returns whether or not the column can be grouped.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getcangroup)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getCanGroup: () => boolean
  /**
   * Returns the index of the column in the grouping state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedindex)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getGroupedIndex: () => number
  /**
   * Returns whether or not the column is currently grouped.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getisgrouped)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getIsGrouped: () => boolean
  /**
   * Returns a function that toggles the grouping state of the column. This is useful for passing to the `onClick` prop of a button.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#gettogglegroupinghandler)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getToggleGroupingHandler: () => () => void
  /**
   * Toggles the grouping state of the column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#togglegrouping)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  toggleGrouping: () => void
}

export interface Row_ColumnGrouping {
  _groupingValuesCache: Record<string, any>
  /**
   * Returns the grouping value for any row and column (including leaf rows).
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupingvalue)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getGroupingValue: (columnId: string) => unknown
  /**
   * Returns whether or not the row is currently grouped.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getisgrouped)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getIsGrouped: () => boolean
  /**
   * If this row is grouped, this is the id of the column that this row is grouped by.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupingcolumnid)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  groupingColumnId?: string
  /**
   * If this row is grouped, this is the unique/shared value for the `groupingColumnId` for all of the rows in this group.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupingvalue)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  groupingValue?: unknown
}

export interface Cell_ColumnGrouping {
  /**
   * Returns whether or not the cell is currently aggregated.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getisaggregated)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getIsAggregated: () => boolean
  /**
   * Returns whether or not the cell is currently grouped.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getisgrouped)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getIsGrouped: () => boolean
  /**
   * Returns whether or not the cell is currently a placeholder cell.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getisplaceholder)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getIsPlaceholder: () => boolean
}

export interface ColumnDefaultOptions {
  enableGrouping: boolean
  onGroupingChange: OnChangeFn<GroupingState>
}

export interface TableOptions_ColumnGrouping {
  /**
   * Enables/disables grouping for the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#enablegrouping)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  enableGrouping?: boolean
  /**
   * Grouping columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupedcolumnmode)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  groupedColumnMode?: false | 'reorder' | 'remove'
  /**
   * Enables manual grouping. If this option is set to `true`, the table will not automatically group rows using `getGroupedRowModel()` and instead will expect you to manually group the rows before passing them to the table. This is useful if you are doing server-side grouping and aggregation.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#manualgrouping)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  manualGrouping?: boolean
  /**
   * If this function is provided, it will be called when the grouping state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.grouping` option.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#ongroupingchange)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  onGroupingChange?: OnChangeFn<GroupingState>
}

export interface TableOptions_ColumnGrouping_Unavailable {
  /**
   * @deprecated Import the `ColumnGrouping` feature to use the column grouping APIs.
   */
  enableGrouping?: boolean
  /**
   * @deprecated Import the `ColumnGrouping` feature to use the column grouping APIs.
   */
  groupedColumnMode?: false | 'reorder' | 'remove'
  /**
   * @deprecated Import the `ColumnGrouping` feature to use the column grouping APIs.
   */
  manualGrouping?: boolean
  /**
   * @deprecated Import the `ColumnGrouping` feature to use the column grouping APIs.
   */
  onGroupingChange?: OnChangeFn<GroupingState>
}

export type GroupingColumnMode = false | 'reorder' | 'remove'

export interface Table_ColumnGrouping<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> {
  /**
   * Returns the row model for the table after grouping has been applied.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getGroupedRowModel: () => RowModel<TFeatures, TFns, TData>
  /**
   * Returns the row model for the table before any grouping has been applied.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getpregroupedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getPreGroupedRowModel: () => RowModel<TFeatures, TFns, TData>
  /**
   * Resets the **grouping** state to `initialState.grouping`, or `true` can be passed to force a default blank state reset to `[]`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#resetgrouping)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  resetGrouping: (defaultState?: boolean) => void
  /**
   * Updates the grouping state of the table via an update function or value.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#setgrouping)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  setGrouping: (updater: Updater<GroupingState>) => void
}
