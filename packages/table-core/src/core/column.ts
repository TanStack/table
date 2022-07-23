import {
  Column,
  Table,
  AccessorFn,
  ColumnDef,
  ColumnDefTemplate,
  RowData,
  ColumnMeta,
} from '../types'
import { DeepKeys, IsKnown, memo, UnionToIntersection } from '../utils'
import { CellContext } from './cell'
import { HeaderContext } from './headers'

export type CoreColumnDefBase<TData extends RowData, TValue> = {
  columns?: ColumnDef<TData, unknown>[]
  header?: ColumnDefTemplate<HeaderContext<TData, TValue>>
  footer?: ColumnDefTemplate<HeaderContext<TData, TValue>>
  cell?: ColumnDefTemplate<CellContext<TData, TValue>>
  meta?: ColumnMeta<TData, TValue>
}

export type CoreColumnDefDisplay<
  TData extends RowData,
  TValue
> = CoreColumnDefBase<TData, TValue> & {
  id: string
}

export type CoreColumnDefDisplayWithStringHeader<
  TData extends RowData,
  TValue
> = CoreColumnDefBase<TData, TValue> & {
  header: string
  id?: string
}

export type CoreColumnDefAccessorFn<
  TData extends RowData,
  TValue
> = CoreColumnDefBase<TData, TValue> & {
  accessorFn: AccessorFn<TData, TValue>
  id: string
}

export type CoreColumnDefAccessorKey<
  TData extends RowData,
  TValue
> = CoreColumnDefBase<TData, TValue> & {
  accessorKey: DeepKeys<TData>
  id?: string
}

export type CoreColumnDef<TData extends RowData, TValue> =
  | CoreColumnDefDisplay<TData, TValue>
  | CoreColumnDefDisplayWithStringHeader<TData, TValue>
  | CoreColumnDefAccessorFn<TData, TValue>
  | CoreColumnDefAccessorKey<TData, TValue>

export type CoreColumnDefResolved<
  TData extends RowData,
  TValue = unknown
> = Partial<UnionToIntersection<CoreColumnDef<TData, TValue>>> & {
  accessorKey?: string
}

export type CoreColumn<TData extends RowData, TValue> = {
  id: string
  depth: number
  accessorFn?: AccessorFn<TData, TValue>
  columnDef: ColumnDef<TData, TValue>
  columns: Column<TData, TValue>[]
  parent?: Column<TData, TValue>
  getFlatColumns: () => Column<TData, TValue>[]
  getLeafColumns: () => Column<TData, TValue>[]
}

export function createColumn<TData extends RowData, TValue>(
  table: Table<TData>,
  columnDef: ColumnDef<TData, TValue>,
  depth: number,
  parent?: Column<TData, TValue>
) {
  const defaultColumn = table._getDefaultColumnDef()

  const resolvedColumnDef = {
    ...defaultColumn,
    ...columnDef,
  } as CoreColumnDefResolved<TData>

  const accessorKey = resolvedColumnDef.accessorKey

  let id =
    resolvedColumnDef.id ??
    (accessorKey ? accessorKey.replace('.', '_') : undefined) ??
    (typeof resolvedColumnDef.header === 'string'
      ? resolvedColumnDef.header
      : undefined)

  let accessorFn: AccessorFn<TData> | undefined

  if (resolvedColumnDef.accessorFn) {
    accessorFn = resolvedColumnDef.accessorFn
  } else if (accessorKey) {
    // Support deep accessor keys
    if (accessorKey.includes('.')) {
      accessorFn = (originalRow: TData) => {
        let result = originalRow as Record<string, any>

        for (const key of accessorKey.split('.')) {
          result = result[key]
        }

        return result
      }
    } else {
      accessorFn = (originalRow: TData) =>
        (originalRow as any)[resolvedColumnDef.accessorKey]
    }
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
    columnDef: resolvedColumnDef as ColumnDef<TData, any>,
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
