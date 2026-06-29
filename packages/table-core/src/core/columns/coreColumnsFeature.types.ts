import type { Table_Internal } from '../../types/Table'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { AccessorFn, ColumnDef } from '../../types/ColumnDef'
import type { Column } from '../../types/Column'

export interface Column_CoreProperties<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue extends CellData = CellData,
> {
  /**
   * The resolved accessor function to use when extracting the value for the column from each row. Will only be defined if the column def has a valid accessor key or function defined.
   */
  accessorFn?: AccessorFn<TData, TValue>
  /**
   * The original column def used to create the column.
   */
  columnDef: ColumnDef<TFeatures, TData, TValue>
  /**
   * The child column (if the column is a group column). Will be an empty array if the column is not a group column.
   */
  columns: Array<Column<TFeatures, TData, TValue>>
  /**
   * The depth of the column (if grouped) relative to the root column def array.
   */
  depth: number
  /**
   * The resolved unique identifier for the column resolved in this priority:
      - A manual `id` property from the column def
      - The accessor key from the column def
      - The header string from the column def
   */
  id: string
  /**
   * The parent column for this column. Will be undefined if this is a root column.
   */
  parent?: Column<TFeatures, TData, TValue>
  /**
   * Reference to the parent table instance.
   */
  table: Table_Internal<TFeatures, TData>
}

export interface Column_Column<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue extends CellData = CellData,
> extends Column_CoreProperties<TFeatures, TData, TValue> {
  /**
   * Flattens this column and every descendant column into a single array.
   */
  getFlatColumns: () => Array<Column<TFeatures, TData, TValue>>
  /**
   * Collects the terminal leaf columns below this column, or the column itself
   * when it has no children.
   */
  getLeafColumns: () => Array<Column<TFeatures, TData, TValue>>
}

export interface TableOptions_Columns<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue extends CellData = CellData,
> {
  /**
   * The array of column defs to use for the table.
   */
  columns: ReadonlyArray<ColumnDef<TFeatures, TData, TValue>>
  /**
   * Default column options to use for all column defs supplied to the table.
   */
  defaultColumn?: Partial<ColumnDef<TFeatures, TData, TValue>>
}

export interface Table_Columns<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Returns a map of all flat columns by their ID.
   */
  getAllFlatColumnsById: () => Record<string, Column<TFeatures, TData, unknown>>
  /**
   * Resolves built-in, feature-level, and user-defined default column options.
   */
  getDefaultColumnDef: () => Partial<ColumnDef<TFeatures, TData, unknown>>
  /**
   * Normalizes `options.columns` into the table's nested column hierarchy.
   */
  getAllColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Flattens the nested column hierarchy, including parent/group columns.
   */
  getAllFlatColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Collects all terminal leaf columns, excluding parent/group columns.
   */
  getAllLeafColumns: () => Array<Column<TFeatures, TData, unknown>>
  /**
   * Returns a map of all leaf-node columns by their ID. This does not include parent columns.
   */
  getAllLeafColumnsById: () => Record<string, Column<TFeatures, TData, unknown>>
  /**
   * Returns a single column by its ID.
   */
  getColumn: (columnId: string) => Column<TFeatures, TData, unknown> | undefined
}
