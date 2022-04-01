import { CustomFilterTypes } from './features/Filters'
import { CustomAggregationTypes } from './features/Grouping'
import { CustomSortingTypes } from './features/Sorting'
import {
  ColumnDef,
  AccessorFn,
  PartialGenerics,
  _NonGenerated,
  AnyRender,
} from './types'
import { Overwrite, PartialKeys } from './utils'

export type CreateTableFactory<TGenerics extends PartialGenerics> = <
  TSubGenerics extends {
    Row: any
    ColumnMeta?: object
  }
>() => Table<
  Overwrite<
    TGenerics,
    { Row: TSubGenerics['Row']; ColumnMeta: TSubGenerics['ColumnMeta'] }
  >
>

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

export type Table<TGenerics extends PartialGenerics> = {
  __options: CreateTableFactoryOptions<any, any, any, any>
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
      {
        accessorFn?: never
        accessorKey?: never
        // This is sketchy, but allows the column helper pattern we want.
        // Someone smarter than me could probably do this better.
        columns?: ColumnDef<any>[]
      }
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
          _NonGenerated<
            ColumnDef<Overwrite<TGenerics, { Value: ReturnType<TAccessor> }>>
          >
        : TAccessor extends keyof TGenerics['Row']
        ? // Accessor Key
          Overwrite<
            _NonGenerated<
              ColumnDef<
                Overwrite<TGenerics, { Value: TGenerics['Row'][TAccessor] }>
              >
            >,
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
  ) => ColumnDef<
    Overwrite<
      TGenerics,
      {
        Value: TAccessor extends (...args: any[]) => any
          ? ReturnType<TAccessor>
          : TAccessor extends keyof TGenerics['Row']
          ? TGenerics['Row'][TAccessor]
          : never
      }
    >
  >
}

type InitTable<TRender extends AnyRender> = {
  createTableFactory: <TGenerics extends PartialGenerics>(
    options?: CreateTableFactoryOptions<TRender, any, any, any>
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
    createTableFactory: options => () =>
      _createTable(undefined, undefined, { ...options, ...opts }),
    createTable: () => _createTable(undefined, undefined, opts),
  }
}

function _createTable<TGenerics extends PartialGenerics>(
  _?: undefined,
  __?: undefined,
  __options?: CreateTableFactoryOptions<any, any, any, any>
): Table<TGenerics> {
  return {
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
