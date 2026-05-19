import { callMemoOrStaticFn } from '../../utils'
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

/**
 * Flattens this column and every descendant column into a single array.
 *
 * Group columns appear before their child columns, which matches the normalized
 * column hierarchy produced during table construction.
 *
 * @example
 * ```ts
 * const flatColumns = column_getFlatColumns(column)
 * ```
 */
export function column_getFlatColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
): Array<Column<TFeatures, TData, TValue>> {
  return [column, ...column.columns.flatMap((col) => col.getFlatColumns())]
}

/**
 * Collects the terminal leaf columns below this column.
 *
 * Group columns return their ordered descendants. Non-group columns return an
 * array containing only the column itself.
 *
 * @example
 * ```ts
 * const leafColumns = column_getLeafColumns(column)
 * ```
 */
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
      column.table,
      'getOrderColumns',
      table_getOrderColumnsFn,
    )(leafColumns as any) as any
  }

  return [column]
}

/**
 * Merges built-in, feature, and user default column definitions.
 *
 * Built-in defaults provide a header and fallback cell renderer, feature
 * defaults can add feature-specific column options, and
 * `options.defaultColumn` wins last.
 *
 * @example
 * ```ts
 * const defaultColumn = table_getDefaultColumnDef(table)
 * ```
 */
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

/**
 * Normalizes `options.columns` into the table's nested column tree.
 *
 * Each column definition is constructed with its parent and depth, and group
 * column children are recursively constructed.
 *
 * @example
 * ```ts
 * const columns = table_getAllColumns(table)
 * ```
 */
export function table_getAllColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): Array<Column<TFeatures, TData, unknown>> {
  const recurseColumns = (
    colDefs: ReadonlyArray<ColumnDef<TFeatures, TData, unknown>>,
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

  return recurseColumns(table.options.columns)
}

/**
 * Flattens every table column, including group columns and leaf columns.
 *
 * Use this when parent/group columns must be included in addition to data leaf
 * columns.
 *
 * @example
 * ```ts
 * const flatColumns = table_getAllFlatColumns(table)
 * ```
 */
export function table_getAllFlatColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): Array<Column<TFeatures, TData, unknown>> {
  return table.getAllColumns().flatMap((column) => column.getFlatColumns())
}

/**
 * Builds an id lookup for every flat column in the table.
 *
 * Group columns and leaf columns are included. Later columns with the same id
 * replace earlier entries.
 *
 * @example
 * ```ts
 * const columnsById = table_getAllFlatColumnsById(table)
 * ```
 */
export function table_getAllFlatColumnsById<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): Record<string, Column<TFeatures, TData, unknown>> {
  const result: Record<string, Column<TFeatures, TData, unknown>> = {}
  const flatColumns = table.getAllFlatColumns()
  for (let i = 0; i < flatColumns.length; i++) {
    const column = flatColumns[i]!
    result[column.id] = column
  }
  return result
}

/**
 * Collects all terminal leaf columns in their current table order.
 *
 * Column ordering features can reorder the collected leaves before the result
 * is returned.
 *
 * @example
 * ```ts
 * const leafColumns = table_getAllLeafColumns(table)
 * ```
 */
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
  )(leafColumns)
}

/**
 * Builds an id lookup for terminal leaf columns only.
 *
 * Parent/group columns are excluded, making this lookup appropriate for row
 * cells and feature state keyed by data columns.
 *
 * @example
 * ```ts
 * const leavesById = table_getAllLeafColumnsById(table)
 * ```
 */
export function table_getAllLeafColumnsById<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): Record<string, Column<TFeatures, TData, unknown>> {
  const result: Record<string, Column<TFeatures, TData, unknown>> = {}
  const leafColumns = table.getAllLeafColumns()
  for (let i = 0; i < leafColumns.length; i++) {
    const column = leafColumns[i]!
    result[column.id] = column
  }
  return result
}

/**
 * Looks up a column by id from the flat column map.
 *
 * The lookup can return group columns or leaf columns. In development, a
 * missing id logs a warning to help catch stale column references.
 *
 * @example
 * ```ts
 * const column = table_getColumn(table, 'firstName')
 * ```
 */
export function table_getColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  columnId: string,
): Column<TFeatures, TData, unknown> | undefined {
  const column = table.getAllFlatColumnsById()[columnId]

  if (process.env.NODE_ENV === 'development' && !column) {
    console.warn(`[Table] Column with id '${columnId}' does not exist.`)
  }

  return column
}
