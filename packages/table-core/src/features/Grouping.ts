import { RowModel } from '..'
import { BuiltInAggregationFn, aggregationFns } from '../aggregationFns'
import { TableFeature } from '../core/table'
import {
  Cell,
  Column,
  OnChangeFn,
  Table,
  Row,
  Updater,
  ColumnDefTemplate,
  RowData,
  AggregationFns,
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
  aggregationFn?: AggregationFnOption<TData>
  aggregatedCell?: ColumnDefTemplate<
    ReturnType<Cell<TData, TValue>['getContext']>
  >
  enableGrouping?: boolean
  getGroupingValue?: (row: TData) => any
}

export interface GroupingColumn<TData extends RowData> {
  getCanGroup: () => boolean
  getIsGrouped: () => boolean
  getGroupedIndex: () => number
  toggleGrouping: () => void
  getToggleGroupingHandler: () => () => void
  getAutoAggregationFn: () => AggregationFn<TData> | undefined
  getAggregationFn: () => AggregationFn<TData> | undefined
}

export interface GroupingRow {
  groupingColumnId?: string
  groupingValue?: unknown
  getIsGrouped: () => boolean
  getGroupingValue: (columnId: string) => unknown
  _groupingValuesCache: Record<string, any>
}

export interface GroupingCell {
  getIsGrouped: () => boolean
  getIsPlaceholder: () => boolean
  getIsAggregated: () => boolean
}

export interface ColumnDefaultOptions {
  // Column
  onGroupingChange: OnChangeFn<GroupingState>
  enableGrouping: boolean
}

interface GroupingOptionsBase {
  manualGrouping?: boolean
  onGroupingChange?: OnChangeFn<GroupingState>
  enableGrouping?: boolean
  getGroupedRowModel?: (table: Table<any>) => () => RowModel<any>
  groupedColumnMode?: false | 'reorder' | 'remove'
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
  setGrouping: (updater: Updater<GroupingState>) => void
  resetGrouping: (defaultState?: boolean) => void
  getPreGroupedRowModel: () => RowModel<TData>
  getGroupedRowModel: () => RowModel<TData>
  _getGroupedRowModel?: () => RowModel<TData>
}

//

export const Grouping: TableFeature = {
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
  ): GroupingColumn<TData> => {
    return {
      toggleGrouping: () => {
        table.setGrouping(old => {
          // Find any existing grouping for this column
          if (old?.includes(column.id)) {
            return old.filter(d => d !== column.id)
          }

          return [...(old ?? []), column.id]
        })
      },

      getCanGroup: () => {
        return (
          column.columnDef.enableGrouping ??
          true ??
          table.options.enableGrouping ??
          true ??
          !!column.accessorFn
        )
      },

      getIsGrouped: () => {
        return table.getState().grouping?.includes(column.id)
      },

      getGroupedIndex: () => table.getState().grouping?.indexOf(column.id),

      getToggleGroupingHandler: () => {
        const canGroup = column.getCanGroup()

        return () => {
          if (!canGroup) return
          column.toggleGrouping()
        }
      },
      getAutoAggregationFn: () => {
        const firstRow = table.getCoreRowModel().flatRows[0]

        const value = firstRow?.getValue(column.id)

        if (typeof value === 'number') {
          return aggregationFns.sum
        }

        if (Object.prototype.toString.call(value) === '[object Date]') {
          return aggregationFns.extent
        }
      },
      getAggregationFn: () => {
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
      },
    }
  },

  createTable: <TData extends RowData>(
    table: Table<TData>
  ): GroupingInstance<TData> => {
    return {
      setGrouping: updater => table.options.onGroupingChange?.(updater),

      resetGrouping: defaultState => {
        table.setGrouping(
          defaultState ? [] : table.initialState?.grouping ?? []
        )
      },

      getPreGroupedRowModel: () => table.getFilteredRowModel(),
      getGroupedRowModel: () => {
        if (!table._getGroupedRowModel && table.options.getGroupedRowModel) {
          table._getGroupedRowModel = table.options.getGroupedRowModel(table)
        }

        if (table.options.manualGrouping || !table._getGroupedRowModel) {
          return table.getPreGroupedRowModel()
        }

        return table._getGroupedRowModel()
      },
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): GroupingRow => {
    return {
      getIsGrouped: () => !!row.groupingColumnId,
      getGroupingValue: columnId => {
        if (row._groupingValuesCache.hasOwnProperty(columnId)) {
          return row._groupingValuesCache[columnId]
        }

        const column = table.getColumn(columnId)

        if (!column?.columnDef.getGroupingValue) {
          return row.getValue(columnId)
        }

        row._groupingValuesCache[columnId] = column.columnDef.getGroupingValue(
          row.original
        )

        return row._groupingValuesCache[columnId]
      },
      _groupingValuesCache: {},
    }
  },

  createCell: <TData extends RowData, TValue>(
    cell: Cell<TData, TValue>,
    column: Column<TData, TValue>,
    row: Row<TData>,
    table: Table<TData>
  ): GroupingCell => {
    const getRenderValue = () =>
      cell.getValue() ?? table.options.renderFallbackValue

    return {
      getIsGrouped: () =>
        column.getIsGrouped() && column.id === row.groupingColumnId,
      getIsPlaceholder: () => !cell.getIsGrouped() && column.getIsGrouped(),
      getIsAggregated: () =>
        !cell.getIsGrouped() &&
        !cell.getIsPlaceholder() &&
        !!row.subRows?.length,
    }
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
