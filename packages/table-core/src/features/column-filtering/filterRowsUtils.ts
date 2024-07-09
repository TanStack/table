import { _createRow } from '../../core/rows/createRow'
import type { Row, RowData, RowModel, Table } from '../../types'

export function filterRows<TData extends RowData>(
  rows: Array<Row<TData>>,
  filterRowImpl: (row: Row<TData>) => any,
  table: Table<TData>,
) {
  if (table.options.filterFromLeafRows) {
    return filterRowModelFromLeafs(rows, filterRowImpl, table)
  }

  return filterRowModelFromRoot(rows, filterRowImpl, table)
}

function filterRowModelFromLeafs<TData extends RowData>(
  rowsToFilter: Array<Row<TData>>,
  filterRow: (row: Row<TData>) => Array<Row<TData>>,
  table: Table<TData>,
): RowModel<TData> {
  const newFilteredFlatRows: Array<Row<TData>> = []
  const newFilteredRowsById: Record<string, Row<TData>> = {}
  const maxDepth = table.options.maxLeafRowFilterDepth ?? 100

  const recurseFilterRows = (rows: Array<Row<TData>>, depth = 0) => {
    const filteredRows: Array<Row<TData>> = []

    // Filter from children up first
    for (let row of rows) {
      const newRow = _createRow(
        table,
        row.id,
        row.original,
        row.index,
        row.depth,
        undefined,
        row.parentId,
      )
      newRow.columnFilters = row.columnFilters

      if (row.subRows.length && depth < maxDepth) {
        newRow.subRows = recurseFilterRows(row.subRows, depth + 1)
        row = newRow

        if (!newRow.subRows.length) {
          filteredRows.push(row)
          newFilteredRowsById[row.id] = row
          newFilteredFlatRows.push(row)
          continue
        }

        if (newRow.subRows.length) {
          filteredRows.push(row)
          newFilteredRowsById[row.id] = row
          newFilteredFlatRows.push(row)
          continue
        }
      } else {
        row = newRow
        filteredRows.push(row)
        newFilteredRowsById[row.id] = row
        newFilteredFlatRows.push(row)
      }
    }

    return filteredRows
  }

  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById,
  }
}

function filterRowModelFromRoot<TData extends RowData>(
  rowsToFilter: Array<Row<TData>>,
  filterRow: (row: Row<TData>) => any,
  table: Table<TData>,
): RowModel<TData> {
  const newFilteredFlatRows: Array<Row<TData>> = []
  const newFilteredRowsById: Record<string, Row<TData>> = {}
  const maxDepth = table.options.maxLeafRowFilterDepth ?? 100

  // Filters top level and nested rows
  const recurseFilterRows = (rows: Array<Row<TData>>, depth = 0) => {
    // Filter from parents downward first

    const filteredRows: Array<Row<TData>> = []

    // Apply the filter to any subRows
    for (let row of rows) {
      const pass = filterRow(row)

      if (pass) {
        if (row.subRows.length && depth < maxDepth) {
          const newRow = _createRow(
            table,
            row.id,
            row.original,
            row.index,
            row.depth,
            undefined,
            row.parentId,
          )
          newRow.subRows = recurseFilterRows(row.subRows, depth + 1)
          row = newRow
        }

        filteredRows.push(row)
        newFilteredFlatRows.push(row)
        newFilteredRowsById[row.id] = row
      }
    }

    return filteredRows
  }

  return {
    rows: recurseFilterRows(rowsToFilter),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById,
  }
}
