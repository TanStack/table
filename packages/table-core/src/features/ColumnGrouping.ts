import { getRowProto, RowModel } from '..'
import { BuiltInAggregationFn, aggregationFns } from '../aggregationFns'
import {
  AggregationFns,
  Cell,
  Column,
  ColumnDefTemplate,
  OnChangeFn,
  Row,
  RowData,
  Table,
  TableFeature,
  Updater,
} from '../types'
import { isFunction, makeStateUpdater } from '../utils'

export type GroupingState = string[]

export interface GroupingTableState {
  grouping: GroupingState
}

export type AggregationFn<TData extends RowData> = (
  columnId: string,
  leafRows: Row<TData>[],
  childRows: Row<TData>[]
) => any

export type CustomAggregationFns = Record<string, AggregationFn<any>>

export type AggregationFnOption<TData extends RowData> =
  | 'auto'
  | keyof AggregationFns
  | BuiltInAggregationFn
  | AggregationFn<TData>

export interface GroupingColumnDef<TData extends RowData, TValue> {
  /**
   * The cell to display each row for the column if the cell is an aggregate. If a function is passed, it will be passed a props object with the context of the cell and should return the property type for your adapter (the exact type depends on the adapter being used).
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#aggregatedcell)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  aggregatedCell?: ColumnDefTemplate<
    ReturnType<Cell<TData, TValue>['getContext']>
  >
  /**
   * The resolved aggregation function for the column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#aggregationfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  aggregationFn?: AggregationFnOption<TData>
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

export interface GroupingColumn<TData extends RowData> {
  /**
   * Returns the aggregation function for the column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getaggregationfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getAggregationFn: () => AggregationFn<TData> | undefined
  /**
   * Returns the automatically inferred aggregation function for the column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getautoaggregationfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getAutoAggregationFn: () => AggregationFn<TData> | undefined
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

export interface GroupingRow {
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

export interface GroupingCell {
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

interface GroupingOptionsBase {
  /**
   * Enables/disables grouping for the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#enablegrouping)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  enableGrouping?: boolean
  /**
   * Returns the row model after grouping has taken place, but no further.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getGroupedRowModel?: (table: Table<any>) => () => RowModel<any>
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

type ResolvedAggregationFns = keyof AggregationFns extends never
  ? {
      aggregationFns?: Record<string, AggregationFn<any>>
    }
  : {
      aggregationFns: Record<keyof AggregationFns, AggregationFn<any>>
    }

export interface GroupingOptions
  extends GroupingOptionsBase,
    ResolvedAggregationFns {}

export type GroupingColumnMode = false | 'reorder' | 'remove'

export interface GroupingInstance<TData extends RowData> {
  _getGroupedRowModel?: () => RowModel<TData>
  /**
   * Returns the row model for the table after grouping has been applied.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getGroupedRowModel: () => RowModel<TData>
  /**
   * Returns the row model for the table before any grouping has been applied.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getpregroupedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  getPreGroupedRowModel: () => RowModel<TData>
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

//

export const ColumnGrouping: TableFeature = {
  getDefaultColumnDef: <TData extends RowData>(): GroupingColumnDef<
    TData,
    unknown
  > => {
    return {
      aggregatedCell: props => (props.getValue() as any)?.toString?.() ?? null,
      aggregationFn: 'auto',
    }
  },

  getInitialState: (state): GroupingTableState => {
    return {
      grouping: [],
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): GroupingOptions => {
    return {
      onGroupingChange: makeStateUpdater('grouping', table),
      groupedColumnMode: 'reorder',
    }
  },

  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.toggleGrouping = () => {
      table.setGrouping(old => {
        // Find any existing grouping for this column
        if (old?.includes(column.id)) {
          return old.filter(d => d !== column.id)
        }

        return [...(old ?? []), column.id]
      })
    }

    column.getCanGroup = () => {
      return (
        (column.columnDef.enableGrouping ?? true) &&
        (table.options.enableGrouping ?? true) &&
        (!!column.accessorFn || !!column.columnDef.getGroupingValue)
      )
    }

    column.getIsGrouped = () => {
      return table.getState().grouping?.includes(column.id)
    }

    column.getGroupedIndex = () => table.getState().grouping?.indexOf(column.id)

    column.getToggleGroupingHandler = () => {
      const canGroup = column.getCanGroup()

      return () => {
        if (!canGroup) return
        column.toggleGrouping()
      }
    }
    column.getAutoAggregationFn = () => {
      const firstRow = table.getCoreRowModel().flatRows[0]

      const value = firstRow?.getValue(column.id)

      if (typeof value === 'number') {
        return aggregationFns.sum
      }

      if (Object.prototype.toString.call(value) === '[object Date]') {
        return aggregationFns.extent
      }
    }
    column.getAggregationFn = () => {
      if (!column) {
        throw new Error()
      }

      return isFunction(column.columnDef.aggregationFn)
        ? column.columnDef.aggregationFn
        : column.columnDef.aggregationFn === 'auto'
          ? column.getAutoAggregationFn()
          : table.options.aggregationFns?.[
              column.columnDef.aggregationFn as string
            ] ??
            aggregationFns[
              column.columnDef.aggregationFn as BuiltInAggregationFn
            ]
    }
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setGrouping = updater => table.options.onGroupingChange?.(updater)

    table.resetGrouping = defaultState => {
      table.setGrouping(defaultState ? [] : table.initialState?.grouping ?? [])
    }

    table.getPreGroupedRowModel = () => table.getFilteredRowModel()
    table.getGroupedRowModel = () => {
      if (!table._getGroupedRowModel && table.options.getGroupedRowModel) {
        table._getGroupedRowModel = table.options.getGroupedRowModel(table)
      }

      if (table.options.manualGrouping || !table._getGroupedRowModel) {
        return table.getPreGroupedRowModel()
      }

      return table._getGroupedRowModel()
    }

    Object.assign(getRowProto(table), {
      getIsGrouped() {
        return !!this.groupingColumnId
      },
      getGroupingValue(columnId) {
        if (this._groupingValuesCache.hasOwnProperty(columnId)) {
          return this._groupingValuesCache[columnId]
        }

        const column = table.getColumn(columnId)

        if (!column?.columnDef.getGroupingValue) {
          return this.getValue(columnId)
        }

        this._groupingValuesCache[columnId] = column.columnDef.getGroupingValue(
          this.original
        )

        return this._groupingValuesCache[columnId]
      },
    } as GroupingRow & Row<any>)
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    // TODO: move to a lazy-initialized proto getter
    row._groupingValuesCache = {}
  },

  createCell: <TData extends RowData, TValue>(
    cell: Cell<TData, TValue>,
    column: Column<TData, TValue>,
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    const getRenderValue = () =>
      cell.getValue() ?? table.options.renderFallbackValue

    cell.getIsGrouped = () =>
      column.getIsGrouped() && column.id === row.groupingColumnId
    cell.getIsPlaceholder = () => !cell.getIsGrouped() && column.getIsGrouped()
    cell.getIsAggregated = () =>
      !cell.getIsGrouped() && !cell.getIsPlaceholder() && !!row.subRows?.length
  },
}

export function orderColumns<TData extends RowData>(
  leafColumns: Column<TData, unknown>[],
  grouping: string[],
  groupedColumnMode?: GroupingColumnMode
) {
  if (!grouping?.length || !groupedColumnMode) {
    return leafColumns
  }

  const nonGroupingColumns = leafColumns.filter(
    col => !grouping.includes(col.id)
  )

  if (groupedColumnMode === 'remove') {
    return nonGroupingColumns
  }

  const groupingColumns = grouping
    .map(g => leafColumns.find(col => col.id === g)!)
    .filter(Boolean)

  return [...groupingColumns, ...nonGroupingColumns]
}
