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

type CoreColumnDefBase<TData extends RowData> = {
  columns?: ColumnDef<TData>[]
  header?: ColumnDefTemplate<ReturnType<CoreHeader<TData>['getContext']>>
  footer?: ColumnDefTemplate<ReturnType<CoreHeader<TData>['getContext']>>
  cell?: ColumnDefTemplate<ReturnType<CoreCell<TData>['getContext']>>
  meta?: unknown
}

type CoreColumnDefDisplay<TData extends RowData> = CoreColumnDefBase<TData> & {
  id: string
}

type CoreColumnDefDisplayWithStringHeader<TData extends RowData> =
  CoreColumnDefBase<TData> & {
    header: string
    id?: string
  }

type CoreColumnDefAccessorFn<TData extends RowData> =
  CoreColumnDefBase<TData> & {
    accessorFn: AccessorFn<TData>
    id: string
    // accessorKey?: never
  }

type CoreColumnDefAccessorKey<TData extends RowData> =
  CoreColumnDefBase<TData> & {
    accessorKey: keyof TData
    id?: string
    // accessorFn?: never
  }

export type CoreColumnDef<TData extends RowData> =
  | CoreColumnDefDisplay<TData>
  | CoreColumnDefDisplayWithStringHeader<TData>
  | CoreColumnDefAccessorFn<TData>
  | CoreColumnDefAccessorKey<TData>

export type CoreColumnDefResolved<TData extends RowData> = Partial<
  UnionToIntersection<CoreColumnDef<TData>>
>

export type CoreColumn<TData extends RowData> = {
  id: string
  depth: number
  accessorFn?: AccessorFn<TData>
  columnDef: ColumnDef<TData>
  columns: Column<TData>[]
  parent?: Column<TData>
  getFlatColumns: () => Column<TData>[]
  getLeafColumns: () => Column<TData>[]
}

export function createColumn<TData extends RowData>(
  instance: Table<TData>,
  columnDef: ColumnDef<TData>,
  depth: number,
  parent?: Column<TData>
) {
  const defaultColumn = instance._getDefaultColumnDef()

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

  let column: CoreColumn<TData> = {
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
          column as Column<TData>,
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

        return [column as Column<TData>]
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
  return column as Column<TData>
}
