import { CustomFilterFns, FilterFn } from './features/Filters'
import { AggregationFn, CustomAggregationFns } from './features/Grouping'
import { CustomSortingFns, SortingFn } from './features/Sorting'
import {
  ColumnDef,
  AccessorFn,
  AnyRender,
  TableGenerics,
  TableOptionsResolved,
  TableOptions,
} from './types'
import { IfDefined, Overwrite } from './utils'

export type TableFactory<TGenerics extends TableGenerics> =
  () => Table<TGenerics>

export type CreateTableOptions<
  TRender extends AnyRender,
  TFilterFns extends CustomFilterFns<any>,
  TSortingFns extends CustomSortingFns<any>,
  TAggregationFns extends CustomAggregationFns<any>,
  TGenerics extends TableGenerics
> = Partial<
  {
    render?: TRender
    filterFns?: TFilterFns
    sortingFns?: TSortingFns
    aggregationFns?: TAggregationFns
  } & Omit<
    TableOptionsResolved<TGenerics>,
    'filterFns' | 'sortingFns' | 'aggregationFns'
  >
>

export type Table<TGenerics extends TableGenerics> = {
  generics: TGenerics
  options: Partial<TableOptionsResolved<TGenerics>>
  // setGenerics: <T extends TableGenerics>() => Table<T>
  setRowType: <TRow>() => Table<Overwrite<TGenerics, { Row: TRow }>>
  setTableMetaType: <TTableMeta>() => Table<
    Overwrite<TGenerics, { TableMeta: TTableMeta }>
  >
  setColumnMetaType: <TColumnMeta>() => Table<
    Overwrite<TGenerics, { ColumnMeta: TColumnMeta }>
  >
  setFilterMetaType: <TFilterMeta>() => Table<
    Overwrite<TGenerics, { FilterMeta: TFilterMeta }>
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
    column: Omit<ColumnDef<TGenerics>, 'columns'>
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
  createOptions: (options: TableOptions<TGenerics>) => TableOptions<TGenerics>
}

//

export function createTableFactory<TRenderer extends AnyRender>(opts: {
  render: TRenderer
}): () => Table<{ Renderer: TRenderer; Rendered: ReturnType<TRenderer> }> {
  return () => createTable(undefined, undefined, opts)
}

// A lot of returns in here are `as any` for a reason. Unless you
// can find a better way to do this, then don't worry about them
function createTable<TGenerics extends TableGenerics>(
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
    // setGenerics: () => table as any,
    setRowType: () => table as any,
    setTableMetaType: () => table as any,
    setColumnMetaType: () => table as any,
    setFilterMetaType: () => table as any,
    setOptions: newOptions =>
      createTable(_, __, {
        ...options,
        ...newOptions,
      } as any),
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
    createOptions: options => options,
  }

  return table
}
