import { CustomFilterTypes } from './features/Filters'
import { CustomAggregationTypes } from './features/Grouping'
import { CustomSortingTypes } from './features/Sorting'
import {
  ColumnDef,
  AccessorFn,
  PartialGenerics,
  AnyRender,
  AnyGenerics,
} from './types'
import { Overwrite, PartialKeys } from './utils'

export type CreateTableFactory<TGenerics extends AnyGenerics> = <
  TSubGenerics extends {
    Row: any
    ColumnMeta?: object
    TableMeta?: object
  }
>() => Table<Overwrite<TGenerics, TSubGenerics>>

export type CreateTableFactoryOptions<
  TRender extends AnyRender,
  TFilterFns extends CustomFilterTypes<any>,
  TSortingFns extends CustomSortingTypes<any>,
  TAggregationFns extends CustomAggregationTypes<any>
> = {
  render: TRender
  filterFns?: TFilterFns
  sortingFns?: TSortingFns
  aggregationFns?: TAggregationFns
}

export type Table<TGenerics extends AnyGenerics> = {
  generics: TGenerics
  __options: CreateTableFactoryOptions<any, any, any, any>
  createColumns: <TColumnDef extends ColumnDef<any>>(
    columns: TColumnDef[]
  ) => TColumnDef[]
  createGroup: (
    column: Overwrite<
      | Overwrite<
          ColumnDef<any>,
          {
            header: string
            id?: string
          }
        >
      | Overwrite<
          ColumnDef<any>,
          {
            id: string
            header?: string | ((...any: any) => any)
          }
        >,
      {
        accessorFn?: never
        accessorKey?: never
        columns?: ColumnDef<any>[]
      }
    >
  ) => ColumnDef<TGenerics>
  createDisplayColumn: (
    column: Overwrite<
      PartialKeys<ColumnDef<TGenerics>, 'accessorFn' | 'accessorKey'>,
      {
        columns?: ColumnDef<any>[]
      }
    >
  ) => ColumnDef<TGenerics>
  createDataColumn: <
    TAccessor extends AccessorFn<TGenerics['Row']> | keyof TGenerics['Row']
  >(
    accessor: TAccessor,
    column: Overwrite<
      TAccessor extends (...args: any[]) => any
        ? // Accessor Fn
          ColumnDef<Overwrite<TGenerics, { Value: ReturnType<TAccessor> }>>
        : TAccessor extends keyof TGenerics['Row']
        ? // Accessor Key
          Overwrite<
            ColumnDef<
              Overwrite<TGenerics, { Value: TGenerics['Row'][TAccessor] }>
            >,
            {
              id?: string
            }
          >
        : never,
      {
        accessorFn?: never
        accessorKey?: never
        columns?: ColumnDef<any>[]
      }
    >
  ) => ColumnDef<TGenerics>
}

type InitTable<TRender extends AnyRender> = {
  createTableFactory: <TGenerics extends AnyGenerics>(
    options: CreateTableFactoryOptions<TRender, any, any, any>
  ) => CreateTableFactory<Overwrite<TGenerics, { Render: TRender }>>
  createTable: CreateTableFactory<
    Overwrite<PartialGenerics, { Render: TRender }>
  >
}

//

export function init<TRender extends AnyRender>(opts: {
  render: TRender
}): InitTable<TRender> {
  return {
    createTableFactory: factoryOptions => () =>
      _createTable(undefined, undefined, { ...factoryOptions, ...opts }),
    createTable: () => _createTable(undefined, undefined, opts),
  }
}

function _createTable<TGenerics extends AnyGenerics>(
  _: undefined,
  __: undefined,
  __options: CreateTableFactoryOptions<any, any, any, any>
): Table<TGenerics> {
  return {
    generics: undefined!,
    __options: __options ?? {
      render: () => {
        throw new Error()
      },
    },
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
  }
}
