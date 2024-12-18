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
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#aggregatedcell)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  aggregatedCell?: ColumnDefTemplate<
    ReturnType<Cell<TFeatures, TData, TValue>['getContext']>
  >
  /**
   * The resolved aggregation function for the column.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#aggregationfn)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  aggregationFn?: AggregationFnOption<TFeatures, TData>
  /**
   * Enables/disables grouping for this column.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#enablegrouping)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  enableGrouping?: boolean
  /**
   * Specify a value to be used for grouping rows on this column. If this option is not specified, the value derived from `accessorKey` / `accessorFn` will be used instead.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupingvalue)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getGroupingValue?: (row: TData) => any
}

export interface Column_ColumnGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns the aggregation function for the column.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getaggregationfn)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getAggregationFn: () => AggregationFn<TFeatures, TData> | undefined
  /**
   * Returns the automatically inferred aggregation function for the column.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getautoaggregationfn)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getAutoAggregationFn: () => AggregationFn<TFeatures, TData> | undefined
  /**
   * Returns whether or not the column can be grouped.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getcangroup)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getCanGroup: () => boolean
  /**
   * Returns the index of the column in the grouping state.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedindex)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getGroupedIndex: () => number
  /**
   * Returns whether or not the column is currently grouped.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getisgrouped)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getIsGrouped: () => boolean
  /**
   * Returns a function that toggles the grouping state of the column. This is useful for passing to the `onClick` prop of a button.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#gettogglegroupinghandler)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getToggleGroupingHandler: () => () => void
  /**
   * Toggles the grouping state of the column.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#togglegrouping)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  toggleGrouping: () => void
}

export interface Row_ColumnGrouping {
  _groupingValuesCache: Record<string, any>
  /**
   * Returns the grouping value for any row and column (including leaf rows).
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupingvalue)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getGroupingValue: (columnId: string) => unknown
  /**
   * Returns whether or not the row is currently grouped.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getisgrouped)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getIsGrouped: () => boolean
  /**
   * If this row is grouped, this is the id of the column that this row is grouped by.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupingcolumnid)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  groupingColumnId?: string
  /**
   * If this row is grouped, this is the unique/shared value for the `groupingColumnId` for all of the rows in this group.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupingvalue)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  groupingValue?: unknown
}

export interface Cell_ColumnGrouping {
  /**
   * Returns whether or not the cell is currently aggregated.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getisaggregated)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getIsAggregated: () => boolean
  /**
   * Returns whether or not the cell is currently grouped.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getisgrouped)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getIsGrouped: () => boolean
  /**
   * Returns whether or not the cell is currently a placeholder cell.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getisplaceholder)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
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
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#enablegrouping)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  enableGrouping?: boolean
  /**
   * Grouping columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupedcolumnmode)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  groupedColumnMode?: false | 'reorder' | 'remove'
  /**
   * Enables manual grouping. If this option is set to `true`, the table will not automatically group rows using `getGroupedRowModel()` and instead will expect you to manually group the rows before passing them to the table. This is useful if you are doing server-side grouping and aggregation.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#manualgrouping)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  manualGrouping?: boolean
  /**
   * If this function is provided, it will be called when the grouping state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.grouping` option.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#ongroupingchange)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  onGroupingChange?: OnChangeFn<GroupingState>
}

export type GroupingColumnMode = false | 'reorder' | 'remove'

export interface Table_ColumnGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Resets the **grouping** state to `initialState.grouping`, or `true` can be passed to force a default blank state reset to `[]`.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#resetgrouping)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  resetGrouping: (defaultState?: boolean) => void
  /**
   * Updates the grouping state of the table via an update function or value.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#setgrouping)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  setGrouping: (updater: Updater<GroupingState>) => void
}

export interface Table_RowModels_Grouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns the row model for the table after grouping has been applied.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getGroupedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the row model for the table before any grouping has been applied.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getpregroupedrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getPreGroupedRowModel: () => RowModel<TFeatures, TData>
}

export interface CreateRowModel_Grouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns the row model after grouping has taken place, but no further.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
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
