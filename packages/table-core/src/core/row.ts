import { RowData, Cell, Row, Table } from '../types'
import { flattenBy, getMemoOptions, memo } from '../utils'
import { createCell } from './cell'

export interface CoreRow<TData extends RowData> {
  _getAllCellsByColumnId: () => Record<string, Cell<TData, unknown>>
  _uniqueValuesCache: Record<string, unknown>
  _valuesCache: Record<string, unknown>
  /**
   * The depth of the row (if nested or grouped) relative to the root row array.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#depth)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  depth: number
  /**
   * Returns all of the cells for the row.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#getallcells)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  getAllCells: () => Cell<TData, unknown>[]
  /**
   * Returns the leaf rows for the row, not including any parent rows.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#getleafrows)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  getLeafRows: () => Row<TData>[]
  /**
   * Returns the parent row for the row, if it exists.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#getparentrow)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  getParentRow: () => Row<TData> | undefined
  /**
   * Returns the parent rows for the row, all the way up to a root row.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#getparentrows)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  getParentRows: () => Row<TData>[]
  /**
   * Returns a unique array of values from the row for a given columnId.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#getuniquevalues)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  getUniqueValues: <TValue>(columnId: string) => TValue[]
  /**
   * Returns the value from the row for a given columnId.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#getvalue)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  getValue: <TValue>(columnId: string) => TValue
  /**
   * The resolved unique identifier for the row resolved via the `options.getRowId` option. Defaults to the row's index (or relative index if it is a subRow).
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#id)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  id: string
  /**
   * The index of the row within its parent array (or the root data array).
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#index)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  index: number
  /**
   * The original row object provided to the table. If the row is a grouped row, the original row object will be the first original in the group.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#original)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  original: TData
  /**
   * An array of the original subRows as returned by the `options.getSubRows` option.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#originalsubrows)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  originalSubRows?: TData[]
  /**
   * If nested, this row's parent row id.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#parentid)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  parentId?: string
  /**
   * Renders the value for the row in a given columnId the same as `getValue`, but will return the `renderFallbackValue` if no value is found.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#rendervalue)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  renderValue: <TValue>(columnId: string) => TValue
  /**
   * An array of subRows for the row as returned and created by the `options.getSubRows` option.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/row#subrows)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/rows)
   */
  subRows: Row<TData>[]
}

const rowProtosByTable = new WeakMap<Table<any>, any>()

/**
 * Creates a table-specific row prototype object to hold shared row methods, including from all the
 * features that have been registered on the table.
 */
export function getRowProto<TData extends RowData>(table: Table<TData>) {
  let rowProto = rowProtosByTable.get(table)

  if (!rowProto) {
    const proto = {} as CoreRow<TData>

    // Make the default fallback value available on the proto itself to avoid duplicating it on every row instance
    // even if it's not used. This is safe as long as we don't mutate the value directly.
    proto.subRows = [] as const

    proto.getValue = function (columnId: string) {
      if (this._valuesCache.hasOwnProperty(columnId)) {
        return this._valuesCache[columnId]
      }

      const column = table.getColumn(columnId)

      if (!column?.accessorFn) {
        return undefined
      }

      this._valuesCache[columnId] = column.accessorFn(
        this.original as TData,
        this.index
      )

      return this._valuesCache[columnId] as any
    }

    proto.getUniqueValues = function (columnId: string) {
      if (!this.hasOwnProperty('_uniqueValuesCache')) {
        // lazy-init cache on the instance
        this._uniqueValuesCache = {}
      }

      if (this._uniqueValuesCache.hasOwnProperty(columnId)) {
        return this._uniqueValuesCache[columnId]
      }

      const column = table.getColumn(columnId)

      if (!column?.accessorFn) {
        return undefined
      }

      if (!column.columnDef.getUniqueValues) {
        this._uniqueValuesCache[columnId] = [this.getValue(columnId)]
        return this._uniqueValuesCache[columnId]
      }

      this._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(
        this.original as TData,
        this.index
      )

      return this._uniqueValuesCache[columnId] as any
    }

    proto.renderValue = function (columnId: string) {
      return this.getValue(columnId) ?? table.options.renderFallbackValue
    }

    proto.getLeafRows = function () {
      return flattenBy(this.subRows, d => d.subRows)
    }

    proto.getParentRow = function () {
      return this.parentId ? table.getRow(this.parentId, true) : undefined
    }

    proto.getParentRows = function () {
      let parentRows: Row<TData>[] = []
      let currentRow = this
      while (true) {
        const parentRow = currentRow.getParentRow()
        if (!parentRow) break
        parentRows.push(parentRow)
        currentRow = parentRow
      }
      return parentRows.reverse()
    }

    proto.getAllCells = memo(
      function (this: Row<TData>) {
        return [this, table.getAllLeafColumns()]
      },
      (row, leafColumns) => {
        return leafColumns.map(column => {
          return createCell(table, row, column, column.id)
        })
      },
      getMemoOptions(table.options, 'debugRows', 'getAllCells')
    )

    proto._getAllCellsByColumnId = memo(
      function (this: Row<TData>) {
        return [this.getAllCells()]
      },
      allCells => {
        return allCells.reduce(
          (acc, cell) => {
            acc[cell.column.id] = cell
            return acc
          },
          {} as Record<string, Cell<TData, unknown>>
        )
      },
      getMemoOptions(table.options, 'debugRows', 'getAllCellsByColumnId')
    )

    rowProtosByTable.set(table, proto)
    rowProto = proto
  }

  return rowProto as CoreRow<TData>
}

export const createRow = <TData extends RowData>(
  table: Table<TData>,
  id: string,
  original: TData,
  rowIndex: number,
  depth: number,
  subRows?: Row<TData>[],
  parentId?: string
): Row<TData> => {
  const row: CoreRow<TData> = Object.create(getRowProto(table))
  Object.assign(row, {
    id,
    index: rowIndex,
    original,
    depth,
    parentId,
    _valuesCache: {},
  })

  if (subRows) {
    row.subRows = subRows
  }

  for (let i = 0; i < table._features.length; i++) {
    const feature = table._features[i]
    feature?.createRow?.(row as Row<TData>, table)
  }

  return row as Row<TData>
}
