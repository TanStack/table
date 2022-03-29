import { CustomFilterTypes } from './features/Filters'
import { CustomAggregationTypes } from './features/Grouping'
import { CustomSortingTypes } from './features/Sorting'
import {
  ColumnDef,
  AccessorFn,
  DefaultGenerics,
  PartialGenerics,
  _NonGenerated,
} from './types'
import { Overwrite, PartialKeys } from './utils'

export type CreatTableFactory<TGenerics extends Partial<DefaultGenerics>> = <
  TRow
>() => TableFactory<Overwrite<TGenerics, { Row: TRow }>>

export type CreateTableFactoryOptions<
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
  opts: CreateTableFactoryOptions<TFilterFns, TSortingFns, TAggregationFns>
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

export type TableFactory<TGenerics extends Partial<DefaultGenerics>> = {
  __options: CreateTableFactoryOptions<any, any, any>
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
}

export function createTable<TRow>() {
  return _createTable<Overwrite<PartialGenerics, { Row: TRow }>>()
}

function _createTable<TGenerics extends PartialGenerics>(
  _?: undefined,
  __?: undefined,
  __options?: CreateTableFactoryOptions<any, any, any>
): TableFactory<TGenerics> {
  return {
    __options: __options || {},
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
