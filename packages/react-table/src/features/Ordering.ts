import { functionalUpdate, makeStateUpdater, memo } from '../utils'

import { ReactTable, OnChangeFn, Updater, Column } from '../types'

import * as Grouping from './Grouping'

export type ColumnOrderState = string[]

export type ColumnOrderTableState = {
  columnOrder: string[]
}

export type ColumnOrderOptions = {
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>
}

export type ColumnOrderDefaultOptions = {
  onColumnOrderChange: OnChangeFn<ColumnOrderState>
}

export type ColumnOrderInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  setColumnOrder: (updater: Updater<ColumnOrderState>) => void
  resetColumnOrder: () => void
  getOrderColumnsFn: () => (
    columns: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
  ) => Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
}

//

export function getInitialState(): ColumnOrderTableState {
  return {
    columnOrder: [],
  }
}

export function getDefaultOptions<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): ColumnOrderDefaultOptions {
  return {
    onColumnOrderChange: makeStateUpdater('columnOrder', instance),
  }
}

export function getInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): ColumnOrderInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> {
  return {
    setColumnOrder: updater =>
      instance.options.onColumnOrderChange?.(
        updater,
        functionalUpdate(updater, instance.getState().columnOrder)
      ),
    resetColumnOrder: () => {
      instance.setColumnOrder(instance.initialState.columnOrder ?? [])
    },
    getOrderColumnsFn: memo(
      () => [
        instance.getState().columnOrder,
        instance.getState().grouping,
        instance.options.groupedColumnMode,
      ],
      (columnOrder, grouping, groupedColumnMode) => columns => {
        // Sort grouped columns to the start of the column list
        // before the headers are built
        let orderedColumns: Column<
          TData,
          TValue,
          TFilterFns,
          TSortingFns,
          TAggregationFns
        >[] = []

        // If there is no order, return the normal columns
        if (!columnOrder?.length) {
          orderedColumns = columns
        } else {
          const columnOrderCopy = [...columnOrder]

          // If there is an order, make a copy of the columns
          const columnsCopy = [...columns]

          // And make a new ordered array of the columns

          // Loop over the columns and place them in order into the new array
          while (columnsCopy.length && columnOrderCopy.length) {
            const targetColumnId = columnOrderCopy.shift()
            const foundIndex = columnsCopy.findIndex(
              d => d.id === targetColumnId
            )
            if (foundIndex > -1) {
              orderedColumns.push(columnsCopy.splice(foundIndex, 1)[0]!)
            }
          }

          // If there are any columns left, add them to the end
          orderedColumns = [...orderedColumns, ...columnsCopy]
        }

        return Grouping.orderColumns(
          orderedColumns,
          grouping,
          groupedColumnMode
        )
      },
      'getOrderColumnsFn',
      instance.options.debug
    ),
  }
}
