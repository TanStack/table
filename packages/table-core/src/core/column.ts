import {
  Column,
  Table,
  AccessorFn,
  ColumnDef,
  ColumnDefTemplate,
  RowData,
  ColumnMeta,
} from '../types'
import { memo, UnionToIntersection } from '../utils'
import { CoreCell } from './cell'
import { CoreHeader } from './headers'

export type CoreColumnDefType = 'data' | 'display' | 'group'

type CoreColumnDefBase<TData extends RowData, TValue> = {
  columns?: ColumnDef<TData>[]
  header?: ColumnDefTemplate<
    ReturnType<CoreHeader<TData, TValue>['getContext']>
  >
  footer?: ColumnDefTemplate<
    ReturnType<CoreHeader<TData, TValue>['getContext']>
  >
  cell?: ColumnDefTemplate<ReturnType<CoreCell<TData, TValue>['getContext']>>
  meta?: ColumnMeta
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

type CoreColumnDefAccessorFn<
  TData extends RowData,
  TValue = unknown
> = CoreColumnDefBase<TData, TValue> & {
  accessorFn: AccessorFn<TData, TValue>
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
  | CoreColumnDefAccessorFn<TData>
  | CoreColumnDefAccessorKey<TData, TValue>

export type CoreColumnDefResolved<
  TData extends RowData,
  TValue = unknown
> = Partial<UnionToIntersection<CoreColumnDef<TData, TValue>>>

export type CoreColumn<TData extends RowData, TValue> = {
  id: string
  depth: number
  accessorFn?: AccessorFn<TData, TValue>
  columnDef: ColumnDef<TData>
  columns: Column<TData, TValue>[]
  parent?: Column<TData, TValue>
  getFlatColumns: () => Column<TData, TValue>[]
  getLeafColumns: () => Column<TData, TValue>[]
}

export function createColumn<TData extends RowData, TValue>(
  table: Table<TData>,
  columnDef: ColumnDef<TData>,
  depth: number,
  parent?: Column<TData, TValue>
) {
  const defaultColumn = table._getDefaultColumnDef()

  const resolvedColumnDef = {
    ...defaultColumn,
    ...columnDef,
  } as CoreColumnDefResolved<TData>

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
    accessorFn = (originalRow: TData) =>
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

  let column: CoreColumn<TData, any> = {
    id: `${String(id)}`,
    accessorFn,
    parent: parent as any,
    depth,
    columnDef: resolvedColumnDef as ColumnDef<TData>,
    columns: [],
    getFlatColumns: memo(
      () => [true],
      () => {
        return [
          column as Column<TData, TValue>,
          ...column.columns?.flatMap(d => d.getFlatColumns()),
        ]
      },
      {
        key: process.env.NODE_ENV === 'production' && 'column.getFlatColumns',
        debug: () => table.options.debugAll ?? table.options.debugColumns,
      }
    ),
    getLeafColumns: memo(
      () => [table._getOrderColumnsFn()],
      orderColumns => {
        if (column.columns?.length) {
          let leafColumns = column.columns.flatMap(column =>
            column.getLeafColumns()
          )

          return orderColumns(leafColumns)
        }

        return [column as Column<TData, TValue>]
      },
      {
        key: process.env.NODE_ENV === 'production' && 'column.getLeafColumns',
        debug: () => table.options.debugAll ?? table.options.debugColumns,
      }
    ),
  }

  column = table._features.reduce((obj, feature) => {
    return Object.assign(obj, feature.createColumn?.(column, table))
  }, column)

  // Yes, we have to convert table to uknown, because we know more than the compiler here.
  return column as Column<TData, TValue>
}
