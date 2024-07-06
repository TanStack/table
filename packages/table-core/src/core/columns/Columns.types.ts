import type { AccessorFn, Column, ColumnDef, RowData } from '../../types'

export interface Column_CoreProperties<TData extends RowData, TValue> {
  /**
   * The resolved accessor function to use when extracting the value for the column from each row. Will only be defined if the column def has a valid accessor key or function defined.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/column#accessorfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-defs)
   */
  accessorFn?: AccessorFn<TData, TValue>
  /**
   * The original column def used to create the column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/column#columndef)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-defs)
   */
  columnDef: ColumnDef<TData, TValue>
  /**
   * The child column (if the column is a group column). Will be an empty array if the column is not a group column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/column#columns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-defs)
   */
  columns: Array<Column<TData, TValue>>
  /**
   * The depth of the column (if grouped) relative to the root column def array.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/column#depth)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-defs)
   */
  depth: number
  /**
   * The resolved unique identifier for the column resolved in this priority:
      - A manual `id` property from the column def
      - The accessor key from the column def
      - The header string from the column def
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/column#id)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-defs)
   */
  id: string
  /**
   * The parent column for this column. Will be undefined if this is a root column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/column#parent)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-defs)
   */
  parent?: Column<TData, TValue>
}

export interface Column_Core<TData extends RowData, TValue>
  extends Column_CoreProperties<TData, TValue> {
  /**
   * Returns the flattened array of this column and all child/grand-child columns for this column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/column#getflatcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-defs)
   */
  getFlatColumns: () => Array<Column<TData, TValue>>
  /**
   * Returns an array of all leaf-node columns for this column. If a column has no children, it is considered the only leaf-node column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/column#getleafcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-defs)
   */
  getLeafColumns: () => Array<Column<TData, TValue>>
}

export interface TableOptions_Columns<TData extends RowData> {
  /**
   * The array of column defs to use for the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#columns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  columns: Array<ColumnDef<TData, any>>
  /**
   * Set this option to `true` to output column debugging information to the console.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  debugColumns?: boolean
  /**
   * Default column options to use for all column defs supplied to the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#defaultcolumn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  defaultColumn?: Partial<ColumnDef<TData, unknown>>
}

export interface Table_Columns<TData extends RowData> {
  _getAllFlatColumnsById: () => Record<string, Column<TData, unknown>>
  _getDefaultColumnDef: () => Partial<ColumnDef<TData, unknown>>
  /**
   * Returns all columns in the table in their normalized and nested hierarchy.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getallcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getAllColumns: () => Array<Column<TData, unknown>>
  /**
   * Returns all columns in the table flattened to a single level.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getallflatcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getAllFlatColumns: () => Array<Column<TData, unknown>>
  /**
   * Returns all leaf-node columns in the table flattened to a single level. This does not include parent columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getallleafcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getAllLeafColumns: () => Array<Column<TData, unknown>>
  /**
   * Returns a single column by its ID.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getcolumn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getColumn: (columnId: string) => Column<TData, unknown> | undefined
}
