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
  getAllCells: () => Cell<TData, unknown>[]
  _getAllCellsByColumnId: () => Record<string, Cell<TData, unknown>>
}

export const createRow = <TData extends RowData>(
  instance: Table<TData>,
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

      const column = instance.getColumn(columnId)

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
      row.getValue(columnId) ?? instance.options.renderFallbackValue,
    subRows: subRows ?? [],
    getLeafRows: () => flattenBy(row.subRows, d => d.subRows),
    getAllCells: memo(
      () => [instance.getAllLeafColumns()],
      leafColumns => {
        return leafColumns.map(column => {
          return createCell(instance, row as Row<TData>, column, column.id)
        })
      },
      {
        key: process.env.NODE_ENV === 'development' && 'row.getAllCells',
        debug: () => instance.options.debugAll ?? instance.options.debugRows,
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
        debug: () => instance.options.debugAll ?? instance.options.debugRows,
      }
    ),
  }

  for (let i = 0; i < instance._features.length; i++) {
    const feature = instance._features[i]
    Object.assign(row, feature?.createRow?.(row, instance))
  }

  return row as Row<TData>
}
