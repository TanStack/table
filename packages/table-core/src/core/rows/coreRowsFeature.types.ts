import type { Table_Internal } from '../../types/Table'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'

export interface Row_CoreProperties<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  _uniqueValuesCache: Record<string, unknown>
  _valuesCache: Record<string, unknown>
  /**
   * The depth of the row (if nested or grouped) relative to the root row array.
   */
  depth: number
  /**
   * The resolved unique identifier for the row resolved via the `options.getRowId` option. Defaults to the row's index (or relative index if it is a subRow).
   */
  id: string
  /**
   * The index of the row within its parent array (or the root data array).
   */
  index: number
  /**
   * The original row object provided to the table. If the row is a grouped row, the original row object will be the first original in the group.
   */
  original: TData
  /**
   * An array of the original subRows as returned by the `options.getSubRows` option.
   */
  originalSubRows?: ReadonlyArray<TData>
  /**
   * If nested, this row's parent row id.
   */
  parentId?: string
  /**
   * An array of subRows for the row as returned and created by the `options.getSubRows` option.
   */
  subRows: Array<Row<TFeatures, TData>>
  /**
   * Reference to the parent table instance.
   */
  table: Table_Internal<TFeatures, TData>
}

export interface Row_Row<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> extends Row_CoreProperties<TFeatures, TData> {
  /**
   * Builds a lookup of this row's cells keyed by leaf column id.
   */
  getAllCellsByColumnId: () => Record<string, Cell<TFeatures, TData, unknown>>
  /**
   * Builds one cell for each leaf column, including cells for hidden columns.
   */
  getAllCells: () => Array<Cell<TFeatures, TData, unknown>>
  /**
   * Returns the leaf rows for the row, not including any parent rows.
   */
  getLeafRows: () => Array<Row<TFeatures, TData>>
  /**
   * Returns the parent row for the row, if it exists.
   */
  getParentRow: () => Row<TFeatures, TData> | undefined
  /**
   * Returns the parent rows for the row, all the way up to a root row.
   */
  getParentRows: () => Array<Row<TFeatures, TData>>
  /**
   * Reads the values this row contributes to faceting/grouping for a column.
   */
  getUniqueValues: <TValue>(columnId: string) => Array<TValue>
  /**
   * Reads this row's accessor value for a column id and caches the result.
   */
  getValue: <TValue>(columnId: string) => TValue
  /**
   * Renders the value for the row in a given columnId the same as `getValue`, but will return the `renderFallbackValue` if no value is found.
   */
  renderValue: <TValue>(columnId: string) => TValue
}

export interface TableOptions_Rows<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * This optional function is used to derive a unique ID for any given row. If not provided the rows index is used (nested rows join together with `.` using their grandparents' index eg. `index.index.index`). If you need to identify individual rows that are originating from any server-side operations, it's suggested you use this function to return an ID that makes sense regardless of network IO/ambiguity eg. a userId, taskId, database ID field, etc.
   * @example getRowId: row => row.userId
   */
  getRowId?: (
    originalRow: TData,
    index: number,
    parent?: Row<TFeatures, TData>,
  ) => string
  /**
   * This optional function is used to access the sub rows for any given row. If you are using nested rows, you will need to use this function to return the sub rows object (or undefined) from the row.
   * @example getSubRows: row => row.subRows
   */
  getSubRows?: (
    originalRow: TData,
    index: number,
  ) => undefined | ReadonlyArray<TData>
}

export interface Table_Rows<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  getRowId: (_: TData, index: number, parent?: Row<TFeatures, TData>) => string
  /**
   * Returns the row with the given ID.
   */
  getRow: (id: string, searchAll?: boolean) => Row<TFeatures, TData>
}
