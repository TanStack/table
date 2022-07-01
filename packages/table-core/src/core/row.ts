import { RowData, Cell, Row, TableGenerics, Table } from '../types'
import { flattenBy, memo } from '../utils'
import { createCell } from './cell'

export type CoreRow<TData extends RowData> = {
  id: string
  index: number
  original?: TData
  depth: number
  _valuesCache: Record<string, any>
  getValue: (columnId: string) => any
  renderValue: (columnId: string) => unknown
  subRows: Row<TData>[]
  getLeafRows: () => Row<TData>[]
  originalSubRows?: TData[]
  getAllCells: () => Cell<TData>[]
  _getAllCellsByColumnId: () => Record<string, Cell<TData>>
}

export const createRow = <TData extends RowData>(
  table: Table<TData>,
  id: string,
  original: TData | undefined,
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

      return row._valuesCache[columnId]
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
        }, {} as Record<string, Cell<TData>>)
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
