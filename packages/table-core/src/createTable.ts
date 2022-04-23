import { CustomFilterTypes, FilterFn } from './features/Filters'
import { AggregationFn, CustomAggregationTypes } from './features/Grouping'
import { CustomSortingTypes, SortingFn } from './features/Sorting'
import { ColumnDef, AccessorFn, AnyRender, AnyGenerics, Options } from './types'
import { IfDefined, Overwrite, PartialKeys } from './utils'

export type TableFactory<TGenerics extends AnyGenerics> = () => Table<TGenerics>

export type CreateTableOptions<
  TRender extends AnyRender,
  TFilterFns extends CustomFilterTypes<any>,
  TSortingFns extends CustomSortingTypes<any>,
  TAggregationFns extends CustomAggregationTypes<any>,
  TGenerics extends AnyGenerics
> = Partial<
  {
    render?: TRender
    filterFns?: TFilterFns
    sortingFns?: TSortingFns
    aggregationFns?: TAggregationFns
  } & Omit<Options<TGenerics>, 'filterFns' | 'sortingFns' | 'aggregationFns'>
>

export type Table<TGenerics extends AnyGenerics> = {
  generics: TGenerics
  options: Partial<Options<TGenerics>>
  setRowType: <TRow extends object>() => Table<
    Overwrite<TGenerics, { Row: TRow }>
  >
  setTableMetaType: <TTableMeta extends object>() => Table<
    Overwrite<TGenerics, { TableMeta: TTableMeta }>
  >
  setColumnMetaType: <TColumnMeta extends object>() => Table<
    Overwrite<TGenerics, { ColumnMeta: TColumnMeta }>
  >
  setOptions: <
    TFilterFns extends Record<string, FilterFn<any>>,
    TSortingFns extends Record<string, SortingFn<any>>,
    TAggregationFns extends Record<string, AggregationFn<any>>
  >(
    options: CreateTableOptions<
      any,
      TFilterFns,
      TSortingFns,
      TAggregationFns,
      TGenerics
    >
  ) => Table<
    Overwrite<
      TGenerics,
      {
        FilterFns: IfDefined<TFilterFns, TGenerics['FilterFns']>
        SortingFns: IfDefined<TSortingFns, TGenerics['SortingFns']>
        AggregationFns: IfDefined<TAggregationFns, TGenerics['AggregationFns']>
      }
    >
  >
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

//

export function createTableFactory<TRender extends AnyRender>(opts: {
  render: TRender
}): () => Table<{ Render: TRender }> {
  return () => createTable(undefined, undefined, opts)
}

// A lot of returns in here are `as any` for a reason. Unless you
// can find a better way to do this, then don't worry about them
function createTable<TGenerics extends AnyGenerics>(
  _?: undefined,
  __?: undefined,
  options?: CreateTableOptions<any, any, any, any, TGenerics>
): Table<TGenerics> {
  const table: Table<TGenerics> = {
    generics: undefined!,
    options: options ?? {
      render: (() => {
        throw new Error('')
      })(),
    },
    setRowType: () => table as any,
    setTableMetaType: () => table as any,
    setColumnMetaType: () => table as any,
    setOptions: newOptions =>
      createTable(_, __, {
        ...options,
        ...newOptions,
      } as any),
    createColumns: columns => columns,
    createDisplayColumn: column => ({ ...column, columnDefType: 'display' }),
    createGroup: column => ({ ...column, columnDefType: 'group' } as any),
    createDataColumn: (accessor, column): any => {
      column = {
        ...column,
        columnDefType: 'data',
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

  return table
}
