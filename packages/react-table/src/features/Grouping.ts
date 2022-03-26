import React, { MouseEvent, TouchEvent } from 'react'
import { RowModel } from '..'
import { BuiltInAggregationType, aggregationTypes } from '../aggregationTypes'
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

export type AggregationFn<TGenerics extends PartialGenerics> = (
  leafValues: TGenerics['Row'][],
  childValues: TGenerics['Row'][]
) => any

export type CustomAggregationTypes<TGenerics extends PartialGenerics> = Record<
  string,
  AggregationFn<TGenerics>
>

export type AggregationType<TGenerics extends PartialGenerics> =
  | 'auto'
  | BuiltInAggregationType
  | keyof TGenerics['AggregationFns']
  | AggregationFn<TGenerics>

export type GroupingTableState = {
  grouping: GroupingState
}

export type GroupingColumnDef<TGenerics extends PartialGenerics> = {
  aggregationType?: AggregationType<Overwrite<TGenerics, { Value: any }>>
  aggregateValue?: (columnValue: unknown) => any
  renderAggregatedCell?: () => React.ReactNode
  enableGrouping?: boolean
  defaultCanGroup?: boolean
}

export type GroupingColumn<TGenerics extends PartialGenerics> = {
  aggregationType?: AggregationType<Overwrite<TGenerics, { Value: any }>>
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

export type GroupingCell = {
  getIsGrouped: () => boolean
  getIsPlaceholder: () => boolean
  getIsAggregated: () => boolean
}

export type ColumnDefaultOptions = {
  // Column
  onGroupingChange: OnChangeFn<GroupingState>
  autoResetGrouping: boolean
  enableGrouping: boolean
}

export type GroupingOptions<TGenerics extends PartialGenerics> = {
  aggregationTypes?: TGenerics['AggregationFns']
  onGroupingChange?: OnChangeFn<GroupingState>
  autoResetGrouping?: boolean
  enableGrouping?: boolean
  enableGroupingRemoval?: boolean
  groupRowsFn?: (
    instance: TableInstance<TGenerics>,
    rowModel: RowModel<TGenerics>
  ) => RowModel<TGenerics>

  groupedColumnMode?: false | 'reorder' | 'remove'
}

export type GroupingColumnMode = false | 'reorder' | 'remove'

export type ToggleGroupingProps = {
  title?: string
  onClick?: (event: MouseEvent | TouchEvent) => void
}

export type GroupingInstance<TGenerics extends PartialGenerics> = {
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
  getGroupedRowModel: () => RowModel<TGenerics>
  getGroupedRows: () => Row<TGenerics>[]
  getGroupedFlatRows: () => Row<TGenerics>[]
  getGroupedRowsById: () => Record<string, Row<TGenerics>>
  getPreGroupedRows: () => Row<TGenerics>[]
  getPreGroupedFlatRows: () => Row<TGenerics>[]
  getPreGroupedRowsById: () => Record<string, Row<TGenerics>>
}

//

export function getDefaultColumn<
  TGenerics extends PartialGenerics
>(): GroupingColumnDef<TGenerics> {
  return {
    aggregationType: 'auto',
  }
}

export function getInitialState(): GroupingTableState {
  return {
    grouping: [],
  }
}

export function getDefaultOptions<TGenerics extends PartialGenerics>(
  instance: TableInstance<TGenerics>
): GroupingOptions<TGenerics> {
  return {
    onGroupingChange: makeStateUpdater('grouping', instance),
    autoResetGrouping: true,
    groupedColumnMode: 'reorder',
  }
}

export function createColumn<TGenerics extends PartialGenerics>(
  column: Column<TGenerics>,
  instance: TableInstance<TGenerics>
): GroupingColumn<TGenerics> {
  return {
    aggregationType: column.aggregationType,
    getCanGroup: () => instance.getColumnCanGroup(column.id),
    getGroupedIndex: () => instance.getColumnGroupedIndex(column.id),
    getIsGrouped: () => instance.getColumnIsGrouped(column.id),
    toggleGrouping: () => instance.toggleColumnGrouping(column.id),
    getToggleGroupingProps: userProps =>
      instance.getToggleGroupingProps(column.id, userProps),
  }
}

export function getInstance<TGenerics extends PartialGenerics>(
  instance: TableInstance<TGenerics>
): GroupingInstance<TGenerics> {
  let registered = false

  return {
    _notifyGroupingReset: () => {
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
      const firstRow = instance.getCoreFlatRows()[0]

      const value = firstRow?.values[columnId]

      if (typeof value === 'number') {
        return aggregationTypes.sum
      }

      if (Object.prototype.toString.call(value) === '[object Date]') {
        return aggregationTypes.extent
      }

      return aggregationTypes.count
    },
    getColumnAggregationFn: columnId => {
      const column = instance.getColumn(columnId)
      const userAggregationTypes = instance.options.aggregationTypes

      if (!column) {
        throw new Error()
      }

      return isFunction(column.aggregationType)
        ? column.aggregationType
        : column.aggregationType === 'auto'
        ? instance.getColumnAutoFilterFn(columnId)
        : (userAggregationTypes as Record<string, any>)?.[
            column.aggregationType as string
          ] ??
          (aggregationTypes[
            column.aggregationType as BuiltInAggregationType
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
              e.persist()
              column.toggleGrouping?.()
            }
          : undefined,
      }

      return propGetter(initialProps, userProps)
    },

    getRowIsGrouped: rowId => !!instance.getRow(rowId)?.groupingColumnId,

    getGroupedRowModel: memo(
      () => [
        instance.getState().grouping,
        instance.getSortedRowModel(),
        instance.options.groupRowsFn,
      ],
      (grouping, rowModel, groupRowsFn) => {
        if (!groupRowsFn || !grouping.length) {
          return rowModel
        }

        return groupRowsFn(instance, rowModel)
      },
      {
        key: 'getGroupedRowModel',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => instance._notifyExpandedReset(),
      }
    ),

    getPreGroupedRows: () => instance.getSortedRowModel().rows,
    getPreGroupedFlatRows: () => instance.getSortedRowModel().flatRows,
    getPreGroupedRowsById: () => instance.getSortedRowModel().rowsById,
    getGroupedRows: () => instance.getGroupedRowModel().rows,
    getGroupedFlatRows: () => instance.getGroupedRowModel().flatRows,
    getGroupedRowsById: () => instance.getGroupedRowModel().rowsById,
  }
}

export function createRow<TGenerics extends PartialGenerics>(
  row: Row<TGenerics>,
  instance: TableInstance<TGenerics>
): GroupingRow {
  return {
    getIsGrouped: () => instance.getRowIsGrouped(row.id),
  }
}

export function createCell<TGenerics extends PartialGenerics>(
  cell: Cell<TGenerics> & GroupingCell,
  column: Column<TGenerics>,
  row: Row<TGenerics>,
  _instance: TableInstance<TGenerics>
): GroupingCell {
  return {
    getIsGrouped: () =>
      column.getIsGrouped() && column.id === row.groupingColumnId,
    getIsPlaceholder: () => !cell.getIsGrouped() && column.getIsGrouped(),
    getIsAggregated: () =>
      !cell.getIsGrouped() &&
      !cell.getIsPlaceholder() &&
      row.subRows?.length > 1,
  }
}

export function orderColumns<TGenerics extends PartialGenerics>(
  leafColumns: Column<TGenerics>[],
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
