import { RowModel } from '..'
import { BuiltInAggregationType, aggregationFns } from '../aggregationFns'
import {
  Cell,
  Column,
  Getter,
  OnChangeFn,
  PropGetterValue,
  TableInstance,
  Row,
  Updater,
  PartialGenerics,
  Renderable,
  UseRenderer,
  AnyGenerics,
} from '../types'
import {
  functionalUpdate,
  isFunction,
  makeStateUpdater,
  memo,
  Overwrite,
  propGetter,
} from '../utils'

export type GroupingState = string[]

export type AggregationFn<TGenerics extends AnyGenerics> = (
  getLeafValues: () => TGenerics['Row'][],
  getChildValues: () => TGenerics['Row'][]
) => any

export type CustomAggregationTypes<TGenerics extends AnyGenerics> = Record<
  string,
  AggregationFn<TGenerics>
>

export type AggregationType<TGenerics extends AnyGenerics> =
  | 'auto'
  | BuiltInAggregationType
  | keyof TGenerics['AggregationFns']
  | AggregationFn<TGenerics>

export type GroupingTableState = {
  grouping: GroupingState
}

export type GroupingColumnDef<TGenerics extends AnyGenerics> = {
  aggregationFn?: AggregationType<Overwrite<TGenerics, { Value: any }>>
  aggregateValue?: (columnValue: unknown) => any
  aggregatedCell?: Renderable<
    TGenerics,
    {
      instance: TableInstance<TGenerics>
      row: Row<TGenerics>
      column: Column<TGenerics>
      cell: Cell<TGenerics>
      value: TGenerics['Value']
    }
  >
  enableGrouping?: boolean
  defaultCanGroup?: boolean
}

export type GroupingColumn<TGenerics extends AnyGenerics> = {
  aggregationFn?: AggregationType<Overwrite<TGenerics, { Value: any }>>
  getCanGroup: () => boolean
  getIsGrouped: () => boolean
  getGroupedIndex: () => number
  toggleGrouping: () => void
  getToggleGroupingProps: <TGetter extends Getter<ToggleGroupingProps>>(
    userProps?: TGetter
  ) => undefined | PropGetterValue<ToggleGroupingProps, TGetter>
}

export type GroupingRow = {
  groupingColumnId?: string
  groupingValue?: any
  getIsGrouped: () => boolean
}

export type GroupingCell<TGenerics extends AnyGenerics> = {
  getIsGrouped: () => boolean
  getIsPlaceholder: () => boolean
  getIsAggregated: () => boolean
  renderAggregatedCell: () => string | null | ReturnType<UseRenderer<TGenerics>>
}

export type ColumnDefaultOptions = {
  // Column
  onGroupingChange: OnChangeFn<GroupingState>
  autoResetGrouping: boolean
  enableGrouping: boolean
}

export type GroupingOptions<TGenerics extends AnyGenerics> = {
  aggregationFns?: TGenerics['AggregationFns']
  onGroupingChange?: OnChangeFn<GroupingState>
  autoResetGrouping?: boolean
  enableGrouping?: boolean
  enableGroupingRemoval?: boolean
  getGroupedRowModel?: (
    instance: TableInstance<TGenerics>
  ) => () => RowModel<TGenerics>

  groupedColumnMode?: false | 'reorder' | 'remove'
}

export type GroupingColumnMode = false | 'reorder' | 'remove'

export type ToggleGroupingProps = {
  title?: string
  onClick?: (event: MouseEvent | TouchEvent) => void
}

export type GroupingInstance<TGenerics extends AnyGenerics> = {
  _notifyGroupingReset: () => void
  getColumnAutoAggregationFn: (
    columnId: string
  ) => AggregationFn<TGenerics> | undefined
  getColumnAggregationFn: (
    columnId: string
  ) => AggregationFn<TGenerics> | undefined
  setGrouping: (updater: Updater<GroupingState>) => void
  resetGrouping: () => void
  toggleColumnGrouping: (columnId: string) => void
  getColumnCanGroup: (columnId: string) => boolean
  getColumnIsGrouped: (columnId: string) => boolean
  getColumnGroupedIndex: (columnId: string) => number
  getToggleGroupingProps: <TGetter extends Getter<ToggleGroupingProps>>(
    columnId: string,
    userProps?: TGetter
  ) => undefined | PropGetterValue<ToggleGroupingProps, TGetter>
  getRowIsGrouped: (rowId: string) => boolean
  getPreGroupedRowModel: () => RowModel<TGenerics>
  getGroupedRowModel: () => RowModel<TGenerics>
  _getGroupedRowModel?: () => RowModel<TGenerics>
}

//

export const Grouping = {
  getDefaultColumn: <
    TGenerics extends AnyGenerics
  >(): GroupingColumnDef<TGenerics> => {
    return {
      aggregationFn: 'auto',
    }
  },

  getInitialState: (): GroupingTableState => {
    return {
      grouping: [],
    }
  },

  getDefaultOptions: <TGenerics extends AnyGenerics>(
    instance: TableInstance<TGenerics>
  ): GroupingOptions<TGenerics> => {
    return {
      onGroupingChange: makeStateUpdater('grouping', instance),
      autoResetGrouping: true,
      groupedColumnMode: 'reorder',
    }
  },

  createColumn: <TGenerics extends AnyGenerics>(
    column: Column<TGenerics>,
    instance: TableInstance<TGenerics>
  ): GroupingColumn<TGenerics> => {
    return {
      aggregationFn: column.aggregationFn,
      getCanGroup: () => instance.getColumnCanGroup(column.id),
      getGroupedIndex: () => instance.getColumnGroupedIndex(column.id),
      getIsGrouped: () => instance.getColumnIsGrouped(column.id),
      toggleGrouping: () => instance.toggleColumnGrouping(column.id),
      getToggleGroupingProps: userProps =>
        instance.getToggleGroupingProps(column.id, userProps),
    }
  },

  getInstance: <TGenerics extends AnyGenerics>(
    instance: TableInstance<TGenerics>
  ): GroupingInstance<TGenerics> => {
    let registered = false

    return {
      _notifyGroupingReset: () => {
        instance._notifyExpandedReset()

        if (!registered) {
          registered = true
          return
        }

        if (instance.options.autoResetAll === false) {
          return
        }

        if (
          instance.options.autoResetAll === true ||
          instance.options.autoResetGrouping
        ) {
          instance.resetGrouping()
        }
      },
      getColumnAutoAggregationFn: columnId => {
        const firstRow = instance.getCoreRowModel().flatRows[0]

        const value = firstRow?.values[columnId]

        if (typeof value === 'number') {
          return aggregationFns.sum
        }

        if (Object.prototype.toString.call(value) === '[object Date]') {
          return aggregationFns.extent
        }

        return aggregationFns.count
      },
      getColumnAggregationFn: columnId => {
        const column = instance.getColumn(columnId)
        const userAggregationTypes = instance.options.aggregationFns

        if (!column) {
          throw new Error()
        }

        return isFunction(column.aggregationFn)
          ? column.aggregationFn
          : column.aggregationFn === 'auto'
          ? instance.getColumnAutoAggregationFn(columnId)
          : (userAggregationTypes as Record<string, any>)?.[
              column.aggregationFn as string
            ] ??
            (aggregationFns[
              column.aggregationFn as BuiltInAggregationType
            ] as AggregationFn<TGenerics>)
      },

      setGrouping: updater =>
        instance.options.onGroupingChange?.(
          updater,
          functionalUpdate(updater, instance.getState().grouping)
        ),

      toggleColumnGrouping: columnId => {
        instance.setGrouping(old => {
          // Find any existing grouping for this column
          if (old?.includes(columnId)) {
            return old.filter(d => d !== columnId)
          }

          return [...(old ?? []), columnId]
        })
      },

      getColumnCanGroup: columnId => {
        const column = instance.getColumn(columnId)

        if (!column) {
          throw new Error()
        }

        return (
          column.enableGrouping ??
          instance.options.enableGrouping ??
          column.defaultCanGroup ??
          !!column.accessorFn
        )
      },

      getColumnIsGrouped: columnId => {
        return instance.getState().grouping?.includes(columnId)
      },

      getColumnGroupedIndex: columnId =>
        instance.getState().grouping?.indexOf(columnId),

      resetGrouping: () => {
        instance.setGrouping(instance.initialState?.grouping ?? [])
      },

      getToggleGroupingProps: (columnId, userProps) => {
        const column = instance.getColumn(columnId)

        const canGroup = column.getCanGroup()

        const initialProps: ToggleGroupingProps = {
          title: canGroup ? 'Toggle Grouping' : undefined,
          onClick: canGroup
            ? (e: MouseEvent | TouchEvent) => {
                column.toggleGrouping?.()
              }
            : undefined,
        }

        return propGetter(initialProps, userProps)
      },

      getRowIsGrouped: rowId => !!instance.getRow(rowId)?.groupingColumnId,

      getPreGroupedRowModel: () => instance.getSortedRowModel(),
      getGroupedRowModel: () => {
        if (
          !instance._getGroupedRowModel &&
          instance.options.getGroupedRowModel
        ) {
          instance._getGroupedRowModel =
            instance.options.getGroupedRowModel(instance)
        }

        if (!instance._getGroupedRowModel) {
          return instance.getPreGroupedRowModel()
        }

        return instance._getGroupedRowModel()
      },
    }
  },

  createRow: <TGenerics extends AnyGenerics>(
    row: Row<TGenerics>,
    instance: TableInstance<TGenerics>
  ): GroupingRow => {
    return {
      getIsGrouped: () => instance.getRowIsGrouped(row.id),
    }
  },

  createCell: <TGenerics extends AnyGenerics>(
    cell: Cell<TGenerics>,
    column: Column<TGenerics>,
    row: Row<TGenerics>,
    instance: TableInstance<TGenerics>
  ): GroupingCell<TGenerics> => {
    return {
      getIsGrouped: () =>
        column.getIsGrouped() && column.id === row.groupingColumnId,
      getIsPlaceholder: () => !cell.getIsGrouped() && column.getIsGrouped(),
      getIsAggregated: () =>
        !cell.getIsGrouped() &&
        !cell.getIsPlaceholder() &&
        row.subRows?.length > 1,
      renderAggregatedCell: () => {
        const template = column.aggregatedCell ?? column.cell

        return template
          ? instance.render(template, {
              instance,
              column,
              row,
              cell,
              value: cell.value,
            })
          : null
      },
    }
  },

  orderColumns: <TGenerics extends AnyGenerics>(
    leafColumns: Column<TGenerics>[],
    grouping: string[],
    groupedColumnMode?: GroupingColumnMode
  ) => {
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
  },
}
