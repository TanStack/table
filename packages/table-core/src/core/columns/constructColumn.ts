import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type {
  AccessorFn,
  ColumnDef,
  ColumnDefResolved,
} from '../../types/ColumnDef'
import type { Column } from '../../types/Column'
import type { Column_CoreProperties } from './Columns.types'

export function constructColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  table: Table<TFeatures, TData>,
  columnDef: ColumnDef<TFeatures, TData, TValue>,
  depth: number,
  parent?: Column<TFeatures, TData, TValue>,
): Column<TFeatures, TData, TValue> {
  const defaultColumn = table.getDefaultColumnDef()

  const resolvedColumnDef = {
    ...defaultColumn,
    ...columnDef,
  } as ColumnDefResolved<TFeatures, TData, TValue>

  const accessorKey = resolvedColumnDef.accessorKey

  const id =
    resolvedColumnDef.id ??
    (accessorKey ? accessorKey.replaceAll('.', '_') : undefined) ??
    (typeof resolvedColumnDef.header === 'string'
      ? resolvedColumnDef.header
      : undefined)

  let accessorFn: AccessorFn<TData, TValue> | undefined

  if (resolvedColumnDef.accessorFn) {
    accessorFn = resolvedColumnDef.accessorFn
  } else if (accessorKey) {
    // Support deep accessor keys
    if (accessorKey.includes('.')) {
      accessorFn = (originalRow: TData) => {
        let result = originalRow as Record<string, any> | undefined

        for (const key of accessorKey.split('.')) {
          result = result?.[key]
          if (process.env.NODE_ENV !== 'production' && result === undefined) {
            console.warn(
              `"${key}" in deeply nested key "${accessorKey}" returned undefined.`,
            )
          }
        }

        return result as TValue
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
          : `Columns require an id when using a non-string header`,
      )
    }
    throw new Error()
  }

  const column: Column_CoreProperties<TFeatures, TData, TValue> = {
    id: `${String(id)}`,
    accessorFn,
    parent: parent,
    depth,
    columnDef: resolvedColumnDef as ColumnDef<TFeatures, TData, TValue>,
    columns: [],
  }

  for (const feature of Object.values(table._features)) {
    feature?.constructColumn?.(
      column as Column<TFeatures, TData, TValue>,
      table,
    )
  }

  return column as Column<TFeatures, TData, TValue>
}
