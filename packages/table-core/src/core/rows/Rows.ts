import { RowData, Cell, Row, Table } from '../../types'
import { flattenBy, getMemoOptions, memo } from '../../utils'
import { _createCell } from '../cells/Cells'
import { Row_Core } from './Rows.types'

export const _createRow = <TData extends RowData>(
  table: Table<TData>,
  id: string,
  original: TData,
  rowIndex: number,
  depth: number,
  subRows?: Row<TData>[],
  parentId?: string
): Row<TData> => {
  let row: Row_Core<TData> = {
    id,
    index: rowIndex,
    original,
    depth,
    parentId,
    _valuesCache: {},
    _uniqueValuesCache: {},
    getValue: columnId => {
      if (row._valuesCache.hasOwnProperty(columnId)) {
        return row._valuesCache[columnId]
      }

      const column = table.getColumn(columnId)

      if (!column?.accessorFn) {
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

      if (!column?.accessorFn) {
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
    getParentRow: () =>
      row.parentId ? table.getRow(row.parentId, true) : undefined,
    getParentRows: () => {
      let parentRows: Row<TData>[] = []
      let currentRow = row
      while (true) {
        const parentRow = currentRow.getParentRow()
        if (!parentRow) break
        parentRows.push(parentRow)
        currentRow = parentRow
      }
      return parentRows.reverse()
    },
    getAllCells: memo(
      () => [table.getAllLeafColumns()],
      leafColumns => {
        return leafColumns.map(column => {
          return _createCell(table, row as Row<TData>, column, column.id)
        })
      },
      getMemoOptions(table.options, 'debugRows', 'getAllCells')
    ),

    _getAllCellsByColumnId: memo(
      () => [row.getAllCells()],
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
    ),
  }

  for (let i = 0; i < table._features.length; i++) {
    const feature = table._features[i]
    feature?._createRow?.(row as Row<TData>, table)
  }

  return row as Row<TData>
}
