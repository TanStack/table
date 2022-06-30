import {
  Cell,
  Column,
  Header,
  TableGenerics,
  Table,
  Row,
  AccessorFn,
  ColumnDef,
  ColumnDefTemplate,
  RowData,
} from '../types'
import { memo, UnionToIntersection } from '../utils'
import { CoreCell } from './cell'
import { CoreHeader } from './headers'

export type CoreColumnDefType = 'data' | 'display' | 'group'

type CoreColumnDefBase<TData extends RowData, TValue> = {
  columns?: ColumnDef<TData, TValue>[]
  header?: ColumnDefTemplate<ReturnType<CoreHeader<TData>['getContext']>>
  footer?: ColumnDefTemplate<ReturnType<CoreHeader<TData>['getContext']>>
  cell?: ColumnDefTemplate<ReturnType<CoreCell<TData, TValue>['getContext']>>
  meta?: unknown
}

type CoreColumnDefDisplay<TData extends RowData, TValue> = CoreColumnDefBase<
  TData,
  TValue
> & {
  id: string
}

type CoreColumnDefDisplayWithStringHeader<
  TData extends RowData,
  TValue
> = CoreColumnDefBase<TData, TValue> & {
  header: string
  id?: string
}

type CoreColumnDefAccessorFn<TData extends RowData, TValue> = CoreColumnDefBase<
  TData,
  TValue
> & {
  accessorFn: AccessorFn<TData>
  id: string
  // accessorKey?: never
}

type CoreColumnDefAccessorKey<
  TData extends RowData,
  TValue
> = CoreColumnDefBase<TData, TValue> & {
  accessorKey: keyof TData
  id?: string
  // accessorFn?: never
}

export type CoreColumnDef<TData extends RowData, TValue> =
  | CoreColumnDefDisplay<TData, TValue>
  | CoreColumnDefDisplayWithStringHeader<TData, TValue>
  | CoreColumnDefAccessorFn<TData, TValue>
  | CoreColumnDefAccessorKey<TData, TValue>

export type CoreColumnDefResolved<TData extends RowData, TValue> = Partial<
  UnionToIntersection<CoreColumnDef<TData, TValue>>
>

export type CoreColumn<TData extends RowData, TValue> = {
  id: string
  depth: number
  accessorFn?: AccessorFn<TData>
  columnDef: ColumnDef<TData, TValue>
  columns: Column<TData, unknown>[]
  parent?: Column<TData, unknown>
  getFlatColumns: () => Column<TData, unknown>[]
  getLeafColumns: () => Column<TData, unknown>[]
}

export function createColumn<TData extends RowData, TValue>(
  instance: Table<TData>,
  columnDef: ColumnDef<TData, TValue>,
  depth: number,
  parent?: Column<TData, TValue>
) {
  const defaultColumn = instance._getDefaultColumnDef()

  const resolvedColumnDef = {
    ...defaultColumn,
    ...columnDef,
  } as CoreColumnDefResolved<TData, TValue>

  let id =
    resolvedColumnDef.id ??
    resolvedColumnDef.accessorKey ??
    (typeof resolvedColumnDef.header === 'string'
      ? resolvedColumnDef.header
      : undefined)

  let accessorFn: AccessorFn<TData> | undefined

  if (resolvedColumnDef.accessorFn) {
    accessorFn = resolvedColumnDef.accessorFn
  } else if (resolvedColumnDef.accessorKey) {
    accessorFn = (originalRow?: TData) =>
      (originalRow as any)[resolvedColumnDef.accessorKey]
  }

  if (!id) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        resolvedColumnDef.accessorFn
          ? `Columns require an id when using an accessorFn`
          : `Columns require an id when using a non-string header`
      )
    }
    throw new Error()
  }

  let column: CoreColumn<TData, TValue> = {
    id: `${String(id)}`,
    accessorFn,
    parent: parent as any,
    depth,
    columnDef,
    columns: [],
    getFlatColumns: memo(
      () => [true],
      () => {
        return [
          column as Column<TData, unknown>,
          ...column.columns?.flatMap(d => d.getFlatColumns()),
        ]
      },
      {
        key: process.env.NODE_ENV === 'production' && 'column.getFlatColumns',
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
      }
    ),
    getLeafColumns: memo(
      () => [instance._getOrderColumnsFn()],
      orderColumns => {
        if (column.columns?.length) {
          let leafColumns = column.columns.flatMap(column =>
            column.getLeafColumns()
          )

          return orderColumns(leafColumns)
        }

        return [column as Column<TData, unknown>]
      },
      {
        key: process.env.NODE_ENV === 'production' && 'column.getLeafColumns',
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
      }
    ),
  }

  column = instance._features.reduce((obj, feature) => {
    return Object.assign(obj, feature.createColumn?.(column, instance))
  }, column)

  // Yes, we have to convert instance to uknown, because we know more than the compiler here.
  return column as Column<TData, TValue>
}
