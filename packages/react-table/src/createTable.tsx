import * as React from 'react'
import { Cell, Column, Row } from '.'
import { createTableInstance } from './core'
import { ReactTable, ColumnDef, AccessorFn, Options } from './types'
import { Overwrite } from './utils'

type TableHelper<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> = {
  RowType<TTData>(): TableHelper<
    TTData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >

  FilterFns: <TTFilterFns>(
    filterFns: TTFilterFns
  ) => TableHelper<TData, TValue, TTFilterFns, TSortingFns, TAggregationFns>

  SortingFns: <TTSortingFns>(
    sortingFns: TTSortingFns
  ) => TableHelper<TData, TValue, TFilterFns, TTSortingFns, TAggregationFns>

  AggregationFns: <TTAggregationFns>(
    aggregationFns: TTAggregationFns
  ) => TableHelper<TData, TValue, TFilterFns, TSortingFns, TTAggregationFns>

  createColumns: (
    columns: ColumnDef<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >[]
  ) => ColumnDef<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]

  createGroup: (
    column: Overwrite<
      ColumnDef<TData, unknown, TFilterFns, TSortingFns, TAggregationFns>,
      { __generated?: never; accessorFn?: never; accessorKey?: never }
    >
  ) => ColumnDef<TData, unknown, TFilterFns, TSortingFns, TAggregationFns>

  createColumn: <TAccessor extends AccessorFn<TData> | keyof TData>(
    accessor: TAccessor,
    column: TAccessor extends (...args: any[]) => any
      ? // Accessor Fn
        Overwrite<
          ColumnDef<
            TData,
            ReturnType<TAccessor>,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >,
          {
            __generated?: never
            accessorFn?: never
            accessorKey?: never
            id: string
          }
        >
      : TAccessor extends keyof TData
      ? // Accessor Key
        Overwrite<
          ColumnDef<
            TData,
            TData[TAccessor],
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >,
          { __generated?: never; accessorFn?: never; accessorKey?: never }
        >
      : never
  ) => ColumnDef<
    TData,
    TAccessor extends (...args: any[]) => any
      ? ReturnType<TAccessor>
      : TAccessor extends keyof TData
      ? TData[TAccessor]
      : never,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >

  useTable: <TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(
    options: Options<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  ) => ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>

  types: {
    instance: ReactTable<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >
    columnDef: ColumnDef<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >
    column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    cell: Cell<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  }
}

export function createTable<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(): TableHelper<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  return {
    RowType: () => createTable(),
    FilterFns: () => createTable(),
    SortingFns: () => createTable(),
    AggregationFns: () => createTable(),
    createColumns: columns => columns,
    createColumn: (accessor, column) => {
      column = {
        ...column,
        id: column.id,
      }

      if (typeof accessor === 'string') {
        return {
          ...column,
          id: column.id ?? accessor,
          accessorKey: accessor,
          __generated: true,
        }
      }

      if (typeof accessor === 'function') {
        return {
          ...column,
          accessorFn: accessor,
          __generated: true,
        }
      }

      throw new Error('Invalid accessor')
    },
    createGroup: column => ({
      ...column,
      __generated: true,
    }),
    useTable: <TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(
      options: Options<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
    ): ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> => {
      const instanceRef = React.useRef<
        ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
      >(undefined!)

      const rerender = React.useReducer(() => ({}), {})[1]

      if (!instanceRef.current) {
        instanceRef.current = createTableInstance<
          TData,
          TValue,
          TFilterFns,
          TSortingFns,
          TAggregationFns
        >(options, rerender)
      }

      instanceRef.current.updateOptions(options)

      return instanceRef.current
    },
    types: undefined as any,
  } as TableHelper<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
}
