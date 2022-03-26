import * as React from 'react'
import { createTableInstance } from './core'
import { CustomFilterTypes } from './features/Filters'
import { CustomAggregationTypes } from './features/Grouping'
import { CustomSortingTypes } from './features/Sorting'
import {
  TableInstance,
  ColumnDef,
  AccessorFn,
  Options,
  DefaultGenerics,
  PartialGenerics,
  _NonGenerated,
} from './types'
import { Overwrite, PartialKeys } from './utils'

export type CreatTableFactory<TGenerics extends Partial<DefaultGenerics>> = <
  TRow
>() => CreateTable<Overwrite<TGenerics, { Row: TRow }>>

export type CreateTableOptions<
  TFilterFns extends CustomFilterTypes<any>,
  TSortingFns extends CustomSortingTypes<any>,
  TAggregationFns extends CustomAggregationTypes<any>
> = {
  filterFns?: TFilterFns
  sortingFns?: TSortingFns
  aggregationFns?: TAggregationFns
}

export function createTableFactory<
  TFilterFns extends CustomFilterTypes<any>,
  TSortingFns extends CustomSortingTypes<any>,
  TAggregationFns extends CustomAggregationTypes<any>
>(
  opts: CreateTableOptions<TFilterFns, TSortingFns, TAggregationFns>
): CreatTableFactory<
  Overwrite<
    PartialGenerics,
    {
      FilterFns: TFilterFns
      SortingFns: TSortingFns
      AggregationFns: TAggregationFns
    }
  >
> {
  return () => _createTable(undefined, undefined, opts)
}

export type CreateTable<TGenerics extends Partial<DefaultGenerics>> = {
  createColumns: (columns: ColumnDef<TGenerics>[]) => ColumnDef<TGenerics>[]
  createGroup: (
    column: Overwrite<
      | Overwrite<
          _NonGenerated<ColumnDef<TGenerics>>,
          {
            header: string
            id?: string
          }
        >
      | Overwrite<
          _NonGenerated<ColumnDef<TGenerics>>,
          {
            id: string
            header?: string | ColumnDef<TGenerics>['header']
          }
        >,
      { accessorFn?: never; accessorKey?: never }
    >
  ) => ColumnDef<TGenerics>
  createDisplayColumn: (
    column: PartialKeys<
      _NonGenerated<ColumnDef<TGenerics>>,
      'accessorFn' | 'accessorKey'
    >
  ) => ColumnDef<TGenerics>
  createDataColumn: <
    TAccessor extends AccessorFn<TGenerics['Row']> | keyof TGenerics['Row']
  >(
    accessor: TAccessor,
    column: Overwrite<
      TAccessor extends (...args: any[]) => any
        ? // Accessor Fn
          _NonGenerated<ColumnDef<TGenerics>>
        : TAccessor extends keyof TGenerics['Row']
        ? // Accessor Key
          Overwrite<
            _NonGenerated<ColumnDef<TGenerics>>,
            {
              id?: string
            }
          >
        : never,
      {
        accessorFn?: never
        accessorKey?: never
      }
    >
  ) => ColumnDef<TGenerics>
  useTable: (
    options: PartialKeys<
      Omit<Options<TGenerics>, keyof CreateTableOptions<any, any, any>>,
      'state' | 'onStateChange'
    >
  ) => TableInstance<TGenerics>
}

export function createTable<TRow>() {
  return _createTable<Overwrite<PartialGenerics, { Row: TRow }>>()
}

function _createTable<TGenerics extends PartialGenerics>(
  _?: undefined,
  __?: undefined,
  opts?: CreateTableOptions<any, any, any>
): CreateTable<TGenerics> {
  return {
    createColumns: columns => columns,
    createDisplayColumn: column => column as any,
    createGroup: column => column as any,
    createDataColumn: (accessor, column): any => {
      column = {
        ...column,
        id: column.id,
      }

      if (typeof accessor === 'string') {
        return {
          ...column,
          id: column.id ?? accessor,
          accessorKey: accessor,
        }
      }

      if (typeof accessor === 'function') {
        return {
          ...column,
          accessorFn: accessor,
        }
      }

      throw new Error('Invalid accessor')
    },
    useTable: (
      options: PartialKeys<
        Omit<Options<TGenerics>, keyof CreateTableOptions<any, any, any>>,
        'state' | 'onStateChange'
      >
    ): TableInstance<TGenerics> => {
      // Compose in the generic options to the user options
      const resolvedOptions = {
        ...(opts ?? {}),
        state: {}, // Dummy state
        onStateChange: () => {}, // noop
        ...options,
      }

      // Create a new table instance and store it in state
      const [instance] = React.useState(() =>
        createTableInstance<TGenerics>(resolvedOptions)
      )

      // By default, manage table state here using the instance's initial state
      const [state, setState] = React.useState(() => instance.initialState)

      // Compose the default state above with any user state. This will allow the user
      // to only control a subset of the state if desired.
      instance.setOptions(prev => ({
        ...prev,
        ...options,
        state: {
          ...state,
          ...options.state,
        },
        // Similarly, we'll maintain both our internal state and any user-provided
        // state.
        onStateChange: updater => {
          setState(updater)
          options.onStateChange?.(updater)
        },
      }))

      return instance
    },
  }
}
