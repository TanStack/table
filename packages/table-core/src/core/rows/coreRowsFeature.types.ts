import type { Table_Internal } from '../../types/Table'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'

export interface Row_CoreProperties<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  _uniqueValuesCache: Record<string, unknown>
  _valuesCache: Record<string, unknown>
  /**
   * The depth of the row (if nested or grouped) relative to the root row array.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#depth)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  depth: number
  /**
   * The resolved unique identifier for the row resolved via the `options.getRowId` option. Defaults to the row's index (or relative index if it is a subRow).
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#id)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  id: string
  /**
   * The index of the row within its parent array (or the root data array).
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#index)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  index: number
  /**
   * The original row object provided to the table. If the row is a grouped row, the original row object will be the first original in the group.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#original)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  original: TData
  /**
   * An array of the original subRows as returned by the `options.getSubRows` option.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#originalsubrows)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  originalSubRows?: Array<TData>
  /**
   * If nested, this row's parent row id.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#parentid)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  parentId?: string
  /**
   * An array of subRows for the row as returned and created by the `options.getSubRows` option.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#subrows)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  subRows: Array<Row<TFeatures, TData>>
  /**
   * Reference to the parent table instance.
   */
  _table: Table_Internal<TFeatures, TData>
}

export interface Row_Row<TFeatures extends TableFeatures, TData extends RowData>
  extends Row_CoreProperties<TFeatures, TData> {
  getAllCellsByColumnId: () => Record<string, Cell<TFeatures, TData, unknown>>
  /**
   * Returns all of the cells for the row.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#getallcells)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  getAllCells: () => Array<Cell<TFeatures, TData, unknown>>
  /**
   * Returns the leaf rows for the row, not including any parent rows.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#getleafrows)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  getLeafRows: () => Array<Row<TFeatures, TData>>
  /**
   * Returns the parent row for the row, if it exists.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#getparentrow)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  getParentRow: () => Row<TFeatures, TData> | undefined
  /**
   * Returns the parent rows for the row, all the way up to a root row.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#getparentrows)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  getParentRows: () => Array<Row<TFeatures, TData>>
  /**
   * Returns a unique array of values from the row for a given columnId.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#getuniquevalues)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  getUniqueValues: <TValue>(columnId: string) => Array<TValue>
  /**
   * Returns the value from the row for a given columnId.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#getvalue)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  getValue: <TValue>(columnId: string) => TValue
  /**
   * Renders the value for the row in a given columnId the same as `getValue`, but will return the `renderFallbackValue` if no value is found.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/row#rendervalue)
   * [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  renderValue: <TValue>(columnId: string) => TValue
}

export interface TableOptions_Rows<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * This optional function is used to derive a unique ID for any given row. If not provided the rows index is used (nested rows join together with `.` using their grandparents' index eg. `index.index.index`). If you need to identify individual rows that are originating from any server-side operations, it's suggested you use this function to return an ID that makes sense regardless of network IO/ambiguity eg. a userId, taskId, database ID field, etc.
   * @example getRowId: row => row.userId
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getrowid)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getRowId?: (
    originalRow: TData,
    index: number,
    parent?: Row<TFeatures, TData>,
  ) => string
  /**
   * This optional function is used to access the sub rows for any given row. If you are using nested rows, you will need to use this function to return the sub rows object (or undefined) from the row.
   * @example getSubRows: row => row.subRows
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getsubrows)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getSubRows?: (originalRow: TData, index: number) => undefined | Array<TData>
}

export interface Table_Rows<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  getRowId: (_: TData, index: number, parent?: Row<TFeatures, TData>) => string
  /**
   * Returns the row with the given ID.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getrow)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getRow: (id: string, searchAll?: boolean) => Row<TFeatures, TData>
}
