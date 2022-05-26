import {
  Cell,
  Column,
  Header,
  TableGenerics,
  TableInstance,
  Row,
  AccessorFn,
  ColumnDef,
  Renderable,
} from '../types'
import { memo } from '../utils'

export type CoreColumnDefType = 'data' | 'display' | 'group'

export type CoreColumnDef<TGenerics extends TableGenerics> = {
  id: string
  accessorKey?: string & keyof TGenerics['Row']
  accessorFn?: AccessorFn<TGenerics['Row']>
  columns?: ColumnDef<TGenerics>[]
  header?: Renderable<
    TGenerics,
    {
      instance: TableInstance<TGenerics>
      header: Header<TGenerics>
      column: Column<TGenerics>
    }
  >
  footer?: Renderable<
    TGenerics,
    {
      instance: TableInstance<TGenerics>
      header: Header<TGenerics>
      column: Column<TGenerics>
    }
  >
  cell?: Renderable<
    TGenerics,
    {
      instance: TableInstance<TGenerics>
      row: Row<TGenerics>
      column: Column<TGenerics>
      cell: Cell<TGenerics>
      getValue: () => TGenerics['Value']
    }
  >
  meta?: TGenerics['ColumnMeta']
}

export type CoreColumn<TGenerics extends TableGenerics> = {
  id: string
  depth: number
  accessorFn?: AccessorFn<TGenerics['Row']>
  columnDef: ColumnDef<TGenerics>
  columnDefType: CoreColumnDefType
  columns: Column<TGenerics>[]
  parent?: Column<TGenerics>
  getFlatColumns: () => Column<TGenerics>[]
  getLeafColumns: () => Column<TGenerics>[]
}

export function createColumn<TGenerics extends TableGenerics>(
  instance: TableInstance<TGenerics>,
  columnDef: ColumnDef<TGenerics> & { columnDefType?: CoreColumnDefType },
  depth: number,
  parent?: Column<TGenerics>
) {
  const defaultColumn = instance._getDefaultColumnDef()

  columnDef = {
    ...defaultColumn,
    ...columnDef,
  }

  let id =
    columnDef.id ??
    columnDef.accessorKey ??
    (typeof columnDef.header === 'string' ? columnDef.header : undefined)

  let accessorFn: AccessorFn<TGenerics['Row']> | undefined

  if (columnDef.accessorFn) {
    accessorFn = columnDef.accessorFn
  } else if (columnDef.accessorKey) {
    accessorFn = (originalRow?: TGenerics['Row']) =>
      (originalRow as any)[columnDef.accessorKey]
  }

  if (!id) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        columnDef.accessorFn
          ? `Columns require an id when using an accessorFn`
          : `Columns require an id when using a non-string header`
      )
    }
    throw new Error()
  }

  let column: CoreColumn<TGenerics> = {
    id: `${id}`,
    accessorFn,
    parent: parent as any,
    depth,
    columnDef,
    columnDefType: columnDef.columnDefType as CoreColumnDefType,
    columns: [],
    getFlatColumns: memo(
      () => [true],
      () => {
        return [
          column as Column<TGenerics>,
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

        return [column as Column<TGenerics>]
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
  return column as Column<TGenerics>
}
