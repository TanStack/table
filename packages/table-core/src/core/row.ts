import { RowData, Cell, Row, Table } from '../types'
import { flattenBy, memo } from '../utils'
import { createCell } from './cell'

export interface CoreRow<TData extends RowData> {
  id: string
  index: number
  original: TData
  depth: number
  _valuesCache: Record<string, unknown>
  _uniqueValuesCache: Record<string, unknown>
  getValue: <TValue>(columnId: string) => TValue
  getUniqueValues: <TValue>(columnId: string) => TValue[]
  renderValue: <TValue>(columnId: string) => TValue
  subRows: Row<TData>[]
  getLeafRows: () => Row<TData>[]
  originalSubRows?: TData[]
  getAllCells: () => Cell<TData, unknown>[]
  _getAllCellsByColumnId: () => Record<string, Cell<TData, unknown>>
}

export const createRow = <TData extends RowData>(
  table: Table<TData>,
  id: string,
  original: TData,
  rowIndex: number,
  depth: number,
  subRows?: Row<TData>[]
): Row<TData> => {
  let row: CoreRow<TData> = {
    id,
    index: rowIndex,
    original,
    depth,
    _valuesCache: {},
    _uniqueValuesCache: {},
    getValue: columnId => {
      if (row._valuesCache.hasOwnProperty(columnId)) {
        return row._valuesCache[columnId]
      }

      const column = table.getColumn(columnId)

      if (!column.accessorFn) {
        return undefined
      }

      row._valuesCache[columnId] = column.accessorFn(
        row.original as TData,
        rowIndex
      )

      return row._valuesCache[columnId] as any
    },
    getUniqueValues: columnId => {
      if (row._uniqueValuesCache.hasOwnProperty(columnId)) {
        return row._uniqueValuesCache[columnId]
      }

      const column = table.getColumn(columnId)

      if (!column.accessorFn) {
        return undefined
      }

      if (!column.columnDef.getUniqueValues) {
        row._uniqueValuesCache[columnId] = [row.getValue(columnId)]
        return row._uniqueValuesCache[columnId]
      }

      row._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(
        row.original as TData,
        rowIndex
      )

      return row._uniqueValuesCache[columnId] as any
    },
    renderValue: columnId =>
      row.getValue(columnId) ?? table.options.renderFallbackValue,
    subRows: subRows ?? [],
    getLeafRows: () => flattenBy(row.subRows, d => d.subRows),
    getAllCells: memo(
      () => [table.getAllLeafColumns()],
      leafColumns => {
        return leafColumns.map(column => {
          return createCell(table, row as Row<TData>, column, column.id)
        })
      },
      {
        key: process.env.NODE_ENV === 'development' && 'row.getAllCells',
        debug: () => table.options.debugAll ?? table.options.debugRows,
      }
    ),

    _getAllCellsByColumnId: memo(
      () => [row.getAllCells()],
      allCells => {
        return allCells.reduce((acc, cell) => {
          acc[cell.column.id] = cell
          return acc
        }, {} as Record<string, Cell<TData, unknown>>)
      },
      {
        key:
          process.env.NODE_ENV === 'production' && 'row.getAllCellsByColumnId',
        debug: () => table.options.debugAll ?? table.options.debugRows,
      }
    ),
  }

  for (let i = 0; i < table._features.length; i++) {
    const feature = table._features[i]
    Object.assign(row, feature?.createRow?.(row, table))
  }

  return row as Row<TData>
}
