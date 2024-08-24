import { table_getOrderColumnsFn } from '../../features/column-ordering/ColumnOrdering.utils'
import { _createColumn } from './createColumn'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type {
  ColumnDef,
  ColumnDefResolved,
  GroupColumnDef,
} from '../../types/ColumnDef'
import type { Column } from '../../types/Column'

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
  table: Table<TFeatures, TData>,
): Array<Column<TFeatures, TData, TValue>> {
  if (column.columns.length) {
    const leafColumns = column.columns.flatMap(
      (col) => column_getLeafColumns(col, table), // recursive
    )

    return table_getOrderColumnsFn(table)(leafColumns as any) as any
  }

  return [column]
}

export function table_getDefaultColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
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
      return Object.assign(obj ?? {}, feature?.getDefaultColumnDef?.())
    }, {}),
    ...table.options.defaultColumn,
  } as Partial<ColumnDef<TFeatures, TData, unknown>>
}

export function table_getAllColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): Array<Column<TFeatures, TData, unknown>> {
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

  return recurseColumns(table.options.columns as any)
}

export function table_getAllFlatColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): Array<Column<TFeatures, TData, unknown>> {
  return table_getAllColumns(table).flatMap((column) =>
    column_getFlatColumns(column),
  )
}

export function table_getAllFlatColumnsById<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
): Record<string, Column<TFeatures, TData, unknown>> {
  return table_getAllFlatColumns(table).reduce(
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
>(table: Table<TFeatures, TData>): Array<Column<TFeatures, TData, unknown>> {
  const leafColumns = table_getAllColumns(table).flatMap(
    (c) => column_getLeafColumns(c, table), // recursive
  )
  return table_getOrderColumnsFn(table)(leafColumns)
}

export function table_getColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  columnId: string,
): Column<TFeatures, TData, unknown> | undefined {
  const column = table_getAllFlatColumnsById(table)[columnId]

  if (process.env.NODE_ENV !== 'production' && !column) {
    console.warn(`[Table] Column with id '${columnId}' does not exist.`)
  }

  return column
}
