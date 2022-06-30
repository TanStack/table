import { RowModel } from '..'
import { BuiltInAggregationFn, aggregationFns } from '../aggregationFns'
import { TableFeature } from '../core/instance'
import {
  Cell,
  Column,
  OnChangeFn,
  Table,
  Row,
  Updater,
  ColumnDefTemplate,
  TableGenerics,
  RowData,
} from '../types'
import { isFunction, makeStateUpdater, Overwrite } from '../utils'

export type GroupingState = string[]

export type GroupingTableState = {
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
  | BuiltInAggregationFn
  | AggregationFn<TData>

export type GroupingColumnDef<TData extends RowData, TValue> = {
  aggregationFn?: AggregationFnOption<TData>
  aggregatedCell?: ColumnDefTemplate<
    ReturnType<Cell<TData, TValue>['getContext']>
  >
  enableGrouping?: boolean
}

export type GroupingColumn<TData extends RowData> = {
  getCanGroup: () => boolean
  getIsGrouped: () => boolean
  getGroupedIndex: () => number
  toggleGrouping: () => void
  getToggleGroupingHandler: () => () => void
  getAutoAggregationFn: () => AggregationFn<TData> | undefined
  getAggregationFn: () => AggregationFn<TData> | undefined
}

export type GroupingRow = {
  groupingColumnId?: string
  groupingValue?: any
  getIsGrouped: () => boolean
  _groupingValuesCache: Record<string, any>
}

export type GroupingCell = {
  getIsGrouped: () => boolean
  getIsPlaceholder: () => boolean
  getIsAggregated: () => boolean
}

export type ColumnDefaultOptions = {
  // Column
  onGroupingChange: OnChangeFn<GroupingState>
  enableGrouping: boolean
}

export type GroupingOptions = {
  manualGrouping?: boolean
  onGroupingChange?: OnChangeFn<GroupingState>
  enableGrouping?: boolean
  getGroupedRowModel?: (instance: Table<any>) => () => RowModel<any>
  groupedColumnMode?: false | 'reorder' | 'remove'
}

export type GroupingColumnMode = false | 'reorder' | 'remove'

export type GroupingInstance<TData extends RowData> = {
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
    instance: Table<TData>
  ): GroupingOptions => {
    return {
      onGroupingChange: makeStateUpdater('grouping', instance),
      groupedColumnMode: 'reorder',
    }
  },

  createColumn: <TData extends RowData>(
    column: Column<TData, unknown>,
    instance: Table<TData>
  ): GroupingColumn<TData> => {
    return {
      toggleGrouping: () => {
        instance.setGrouping(old => {
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
          instance.options.enableGrouping ??
          true ??
          !!column.accessorFn
        )
      },

      getIsGrouped: () => {
        return instance.getState().grouping?.includes(column.id)
      },

      getGroupedIndex: () => instance.getState().grouping?.indexOf(column.id),

      getToggleGroupingHandler: () => {
        const canGroup = column.getCanGroup()

        return () => {
          if (!canGroup) return
          column.toggleGrouping()
        }
      },
      getAutoAggregationFn: () => {
        const firstRow = instance.getCoreRowModel().flatRows[0]

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
          : (aggregationFns[
              column.columnDef.aggregationFn as BuiltInAggregationFn
            ] as AggregationFn<TData>)
      },
    }
  },

  createTable: <TData extends RowData>(
    instance: Table<TData>
  ): GroupingInstance<TData> => {
    return {
      setGrouping: updater => instance.options.onGroupingChange?.(updater),

      resetGrouping: defaultState => {
        instance.setGrouping(
          defaultState ? [] : instance.initialState?.grouping ?? []
        )
      },

      getPreGroupedRowModel: () => instance.getFilteredRowModel(),
      getGroupedRowModel: () => {
        if (
          !instance._getGroupedRowModel &&
          instance.options.getGroupedRowModel
        ) {
          instance._getGroupedRowModel =
            instance.options.getGroupedRowModel(instance)
        }

        if (instance.options.manualGrouping || !instance._getGroupedRowModel) {
          return instance.getPreGroupedRowModel()
        }

        return instance._getGroupedRowModel()
      },
    }
  },

  createRow: <TData extends RowData>(row: Row<TData>): GroupingRow => {
    return {
      getIsGrouped: () => !!row.groupingColumnId,
      _groupingValuesCache: {},
    }
  },

  createCell: <TData extends RowData>(
    cell: Cell<TData, unknown>,
    column: Column<TData, unknown>,
    row: Row<TData>,
    instance: Table<TData>
  ): GroupingCell => {
    const getRenderValue = () =>
      cell.getValue() ?? instance.options.renderFallbackValue

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
