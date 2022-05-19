import { Cell, Row, TableGenerics, TableInstance } from '../types'
import { flattenBy, memo } from '../utils'
import { createCell } from './cell'
import { features } from './features'

export type CoreRow<TGenerics extends TableGenerics> = {
  id: string
  index: number
  original?: TGenerics['Row']
  depth: number
  _valuesCache: Record<string, any>
  getValue: (columnId: string) => any
  subRows: Row<TGenerics>[]
  getLeafRows: () => Row<TGenerics>[]
  originalSubRows?: TGenerics['Row'][]
  getAllCells: () => Cell<TGenerics>[]
  _getAllCellsByColumnId: () => Record<string, Cell<TGenerics>>
}

export const createRow = <TGenerics extends TableGenerics>(
  instance: TableInstance<TGenerics>,
  id: string,
  original: TGenerics['Row'] | undefined,
  rowIndex: number,
  depth: number,
  subRows?: Row<TGenerics>[]
): Row<TGenerics> => {
  let row: CoreRow<TGenerics> = {
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

      row._valuesCache[columnId] = column.accessorFn(row.original, rowIndex)

      return row._valuesCache[columnId]
    },
    subRows: subRows ?? [],
    getLeafRows: () => flattenBy(row.subRows, d => d.subRows),
    getAllCells: memo(
      () => [instance.getAllLeafColumns()],
      leafColumns => {
        return leafColumns.map(column => {
          return createCell(instance, row as Row<TGenerics>, column, column.id)
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
        }, {} as Record<string, Cell<TGenerics>>)
      },
      {
        key:
          process.env.NODE_ENV === 'production' && 'row.getAllCellsByColumnId',
        debug: () => instance.options.debugAll ?? instance.options.debugRows,
      }
    ),
  }

  for (let i = 0; i < features.length; i++) {
    const feature = features[i]
    Object.assign(row, feature?.createRow?.(row, instance))
  }

  return row as Row<TGenerics>
}
