import {
  CellData,
  Column,
  ColumnDef,
  ColumnDefResolved,
  GroupColumnDef,
  RowData,
  Table,
} from '../../types'
import { _createColumn } from './_createColumn'

export function column_getFlatColumns<
  TData extends RowData,
  TValue extends CellData,
>(column: Column<TData, TValue>): Column<TData, TValue>[] {
  return [
    column as Column<TData, TValue>,
    ...column.columns?.flatMap(col => column_getFlatColumns(col)),
  ]
}

export function column_getLeafColumns<
  TData extends RowData,
  TValue extends CellData,
>(
  column: Column<TData, TValue>,
  orderColumns: (cols: Column<TData, TValue>[]) => Column<TData, TValue>[]
): Column<TData, TValue>[] {
  if (column.columns?.length) {
    let leafColumns = column.columns.flatMap(column => column.getLeafColumns())

    return orderColumns(leafColumns)
  }

  return [column as Column<TData, TValue>]
}

export function table_getDefaultColumnDef<TData extends RowData>(
  table: Table<TData>,
  defaultColumnDef: Partial<ColumnDef<TData, unknown>> = {}
): Partial<ColumnDef<TData, unknown>> {
  return {
    header: props => {
      const resolvedColumnDef = props.header.column
        .columnDef as ColumnDefResolved<TData>

      if (resolvedColumnDef.accessorKey) {
        return resolvedColumnDef.accessorKey
      }

      if (resolvedColumnDef.accessorFn) {
        return resolvedColumnDef.id
      }

      return null
    },
    cell: props => props.renderValue<any>()?.toString?.() ?? null,
    ...table._features.reduce((obj, feature) => {
      return Object.assign(obj, feature._getDefaultColumnDef?.())
    }, {}),
    ...defaultColumnDef,
  } as Partial<ColumnDef<TData, unknown>>
}

export function table_getAllColumns<TData extends RowData>(
  table: Table<TData>,
  columnDefs: ColumnDef<TData, unknown>[]
): Column<TData, unknown>[] {
  const recurseColumns = (
    columnDefs: ColumnDef<TData, unknown>[],
    parent?: Column<TData, unknown>,
    depth = 0
  ): Column<TData, unknown>[] => {
    return columnDefs.map(columnDef => {
      const column = _createColumn(table, columnDef, depth, parent)

      const groupingColumnDef = columnDef as GroupColumnDef<TData, unknown>

      column.columns = groupingColumnDef.columns
        ? recurseColumns(groupingColumnDef.columns, column, depth + 1)
        : []

      return column
    })
  }

  return recurseColumns(columnDefs)
}

export function table_getAllFlatColumns<TData extends RowData>(
  allColumns: Column<TData, unknown>[]
): Column<TData, unknown>[] {
  return allColumns.flatMap(column => column_getFlatColumns(column))
}

export function table_getAllFlatColumnsById<TData extends RowData>(
  flatColumns: Column<TData, unknown>[]
): Record<string, Column<TData, unknown>> {
  return flatColumns.reduce(
    (acc, column) => {
      acc[column.id] = column
      return acc
    },
    {} as Record<string, Column<TData, unknown>>
  )
}

export function table_getAllLeafColumns<TData extends RowData>(
  allColumns: Column<TData, unknown>[],
  orderColumns: (cols: Column<TData, unknown>[]) => Column<TData, unknown>[]
): Column<TData, unknown>[] {
  let leafColumns = allColumns.flatMap(column => column.getLeafColumns())
  return orderColumns(leafColumns)
}

export function table_getColumn<TData extends RowData>(
  table: Table<TData>,
  columnId: string
): Column<TData, unknown> | undefined {
  const column = table._getAllFlatColumnsById()[columnId]

  if (process.env.NODE_ENV !== 'production' && !column) {
    console.error(`[Table] Column with id '${columnId}' does not exist.`)
  }

  return column
}
