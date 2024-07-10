import { _createColumn } from './createColumn'
import type {
  CellData,
  Column,
  ColumnDef,
  ColumnDefResolved,
  GroupColumnDef,
  RowData,
  Table,
  TableFeatures,
} from '../../types'

export function column_getFlatColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
): Array<Column<TFeatures, TData, TValue>> {
  return [
    column,
    ...column.columns.flatMap((col) => column_getFlatColumns(col)),
  ]
}

export function column_getLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  orderColumns: (
    cols: Array<Column<TFeatures, TData, TValue>>,
  ) => Array<Column<TFeatures, TData, TValue>>,
): Array<Column<TFeatures, TData, TValue>> {
  if (column.columns.length) {
    const leafColumns = column.columns.flatMap((c) => c.getLeafColumns())

    return orderColumns(leafColumns)
  }

  return [column]
}

export function table_getDefaultColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  defaultColumnDef: Partial<ColumnDef<TFeatures, TData, unknown>> = {},
): Partial<ColumnDef<TFeatures, TData, unknown>> {
  return {
    header: (props) => {
      const resolvedColumnDef = props.header.column
        .columnDef as ColumnDefResolved<TFeatures, TData>

      if (resolvedColumnDef.accessorKey) {
        return resolvedColumnDef.accessorKey
      }

      if (resolvedColumnDef.accessorFn) {
        return resolvedColumnDef.id
      }

      return null
    },
    cell: (props) => props.renderValue<any>()?.toString?.() ?? null,
    ...Object.values(table._features).reduce((obj, feature) => {
      return Object.assign(obj ?? {}, feature?._getDefaultColumnDef?.())
    }, {}),
    ...defaultColumnDef,
  } as Partial<ColumnDef<TFeatures, TData, unknown>>
}

export function table_getAllColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  columnDefs: Array<ColumnDef<TFeatures, TData, unknown>>,
): Array<Column<TFeatures, TData, unknown>> {
  const recurseColumns = (
    colDefs: Array<ColumnDef<TFeatures, TData, unknown>>,
    parent?: Column<TFeatures, TData, unknown>,
    depth = 0,
  ): Array<Column<TFeatures, TData, unknown>> => {
    return colDefs.map((columnDef) => {
      const column = _createColumn(table, columnDef, depth, parent)

      const groupingColumnDef = columnDef as GroupColumnDef<
        TFeatures,
        TData,
        unknown
      >

      column.columns = groupingColumnDef.columns
        ? recurseColumns(groupingColumnDef.columns, column, depth + 1)
        : []

      return column
    })
  }

  return recurseColumns(columnDefs)
}

export function table_getAllFlatColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  allColumns: Array<Column<TFeatures, TData, unknown>>,
): Array<Column<TFeatures, TData, unknown>> {
  return allColumns.flatMap((column) => column_getFlatColumns(column))
}

export function table_getAllFlatColumnsById<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  flatColumns: Array<Column<TFeatures, TData, unknown>>,
): Record<string, Column<TFeatures, TData, unknown>> {
  return flatColumns.reduce(
    (acc, column) => {
      acc[column.id] = column
      return acc
    },
    {} as Record<string, Column<TFeatures, TData, unknown>>,
  )
}

export function table_getAllLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  allColumns: Array<Column<TFeatures, TData, unknown>>,
  orderColumns: (
    cols: Array<Column<TFeatures, TData, unknown>>,
  ) => Array<Column<TFeatures, TData, unknown>>,
): Array<Column<TFeatures, TData, unknown>> {
  const leafColumns = allColumns.flatMap((column) => column.getLeafColumns())
  return orderColumns(leafColumns)
}

export function table_getColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  columnId: string,
): Column<TFeatures, TData, unknown> | undefined {
  const column = table._getAllFlatColumnsById()[columnId]

  if (process.env.NODE_ENV !== 'production' && !column) {
    console.error(`[Table] Column with id '${columnId}' does not exist.`)
  }

  return column
}
