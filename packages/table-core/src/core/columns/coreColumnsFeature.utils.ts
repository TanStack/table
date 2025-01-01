import { callMemoOrStaticFn, isDev } from '../../utils'
import { table_getOrderColumnsFn } from '../../features/column-ordering/columnOrderingFeature.utils'
import { constructColumn } from './constructColumn'
import type { Table_Internal } from '../../types/Table'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
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
  return [column, ...column.columns.flatMap((col) => col.getFlatColumns())]
}

export function column_getLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
): Array<Column<TFeatures, TData, TValue>> {
  if (column.columns.length) {
    const leafColumns = column.columns.flatMap(
      (col) => col.getLeafColumns(), // recursive
    )

    return callMemoOrStaticFn(
      column._table,
      'getOrderColumns',
      table_getOrderColumnsFn,
    )(leafColumns as any) as any
  }

  return [column]
}

export function table_getDefaultColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): Partial<ColumnDef<TFeatures, TData, unknown>> {
  return {
    header: (props) => {
      const resolvedColumnDef = props.header.column
        .columnDef as ColumnDefResolved<{}, TData>

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
      return Object.assign(obj, feature.getDefaultColumnDef?.())
    }, {}),
    ...table.options.defaultColumn,
  } as Partial<ColumnDef<TFeatures, TData, unknown>>
}

export function table_getAllColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): Array<Column<TFeatures, TData, unknown>> {
  const recurseColumns = (
    colDefs: Array<ColumnDef<TFeatures, TData, unknown>>,
    parent?: Column<TFeatures, TData, unknown>,
    depth = 0,
  ): Array<Column<TFeatures, TData, unknown>> => {
    return colDefs.map((columnDef) => {
      const column = constructColumn(table, columnDef, depth, parent)

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
>(
  table: Table_Internal<TFeatures, TData>,
): Array<Column<TFeatures, TData, unknown>> {
  return table.getAllColumns().flatMap((column) => column.getFlatColumns())
}

export function table_getAllFlatColumnsById<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): Record<string, Column<TFeatures, TData, unknown>> {
  return table.getAllFlatColumns().reduce(
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
  table: Table_Internal<TFeatures, TData>,
): Array<Column<TFeatures, TData, unknown>> {
  const leafColumns = table.getAllColumns().flatMap(
    (c) => c.getLeafColumns(), // recursive
  )
  return callMemoOrStaticFn(
    table,
    'getOrderColumns',
    table_getOrderColumnsFn,
  )(leafColumns as any) as any
}

export function table_getColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  columnId: string,
): Column<TFeatures, TData, unknown> | undefined {
  const column = table.getAllFlatColumnsById()[columnId]

  if (isDev && !column) {
    console.warn(`[Table] Column with id '${columnId}' does not exist.`)
  }

  return column
}
