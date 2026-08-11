import { constructRow } from '../../core/rows/constructRow'
import { makeObjectMap } from '../../utils'
import type { Row_ColumnFiltering } from './columnFilteringFeature.types'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Row } from '../../types/Row'
import type { Table_Internal } from '../../types/Table'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'

/**
 * Filters a row model with the supplied row predicate.
 *
 * The helper supports both filtering from leaf rows upward and filtering parents before descendants, depending on table options.
 */
export function filterRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rows: Array<Row<TFeatures, TData>>,
  filterRowImpl: (row: Row<TFeatures, TData>) => any,
  table: Table_Internal<TFeatures, TData>,
) {
  if (table.options.filterFromLeafRows) {
    return filterRowModelFromLeafs(rows, filterRowImpl, table)
  }

  return filterRowModelFromRoot(rows, filterRowImpl, table)
}

function filterRowModelFromLeafs<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowsToFilter: Array<Row<TFeatures, TData>>,
  filterRow: (
    row: Row<TFeatures, TData>,
  ) => Array<Row<TFeatures, TData>> | undefined,
  table: Table_Internal<TFeatures, TData>,
): RowModel<TFeatures, TData> {
  const newFilteredFlatRows: Array<Row<TFeatures, TData>> = []
  const newFilteredRowsById = makeObjectMap<Row<TFeatures, TData>>()
  const maxDepth = table.options.maxLeafRowFilterDepth ?? 100

  const recurseFilterRows = (
    rowsToFilter: Array<
      Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>
    >,
    depth = 0,
  ) => {
    const filteredRows: Array<Row<TFeatures, TData>> &
      Partial<Row_ColumnFiltering<TFeatures, TData>> = []

    // Filter from children up first
    for (let row of rowsToFilter) {
      const newRow = constructRow(
        table,
        row.id,
        row.original,
        row.index,
        row.depth,
        undefined,
        row.parentId,
      ) as Row<TFeatures, TData> &
        Partial<Row_ColumnFiltering<TFeatures, TData>>
      newRow.columnFilters = row.columnFilters

      if (row.subRows.length && depth < maxDepth) {
        newRow.subRows = recurseFilterRows(row.subRows, depth + 1)
        row = newRow

        if (filterRow(row) && !newRow.subRows.length) {
          filteredRows.push(row)
          newFilteredRowsById[row.id] = row
          newFilteredFlatRows.push(row)
          continue
        }

        if (filterRow(row) || newRow.subRows.length) {
          filteredRows.push(row)
          newFilteredRowsById[row.id] = row
          newFilteredFlatRows.push(row)
          continue
        }
      } else {
        // Past maxLeafRowFilterDepth the subtree is never filtered, so it stays
        // visible through row.subRows and its rows must enter flatRows and
        // rowsById as well, like the root-down path already does
        newRow.subRows = row.subRows
        row = newRow
        if (filterRow(row)) {
          filteredRows.push(row)
          newFilteredRowsById[row.id] = row
          newFilteredFlatRows.push(row)
          addSubRowsToFlatArrays(
            row.subRows,
            newFilteredFlatRows,
            newFilteredRowsById,
          )
        }
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

function filterRowModelFromRoot<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowsToFilter: Array<Row<TFeatures, TData>>,
  filterRow: (row: Row<TFeatures, TData>) => any,
  table: Table_Internal<TFeatures, TData>,
): RowModel<TFeatures, TData> {
  const newFilteredFlatRows: Array<Row<TFeatures, TData>> = []
  const newFilteredRowsById = makeObjectMap<Row<TFeatures, TData>>()
  const maxDepth = table.options.maxLeafRowFilterDepth ?? 100

  // Filters top level and nested rows
  const recurseFilterRows = (
    rowsToFilter: Array<Row<TFeatures, TData>>,
    depth = 0,
  ) => {
    // Filter from parents downward first

    const filteredRows: Array<Row<TFeatures, TData>> = []

    // Apply the filter to any subRows
    for (let row of rowsToFilter) {
      const pass = filterRow(row)

      if (pass) {
        if (row.subRows.length && depth < maxDepth) {
          const newRow = constructRow(
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

        // When maxLeafRowFilterDepth stops the recursion, the kept row's
        // subtree stays visible through row.subRows, so those descendants
        // must still enter flatRows and rowsById to keep the flat
        // representation (and anything derived from it, like facet counts)
        // consistent with the visible tree
        if (row.subRows.length && depth >= maxDepth) {
          addSubRowsToFlatArrays(
            row.subRows,
            newFilteredFlatRows,
            newFilteredRowsById,
          )
        }
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

function addSubRowsToFlatArrays<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  subRows: Array<Row<TFeatures, TData>>,
  flatRows: Array<Row<TFeatures, TData>>,
  rowsById: Record<string, Row<TFeatures, TData>>,
): void {
  for (const subRow of subRows) {
    flatRows.push(subRow)
    rowsById[subRow.id] = subRow
    if (subRow.subRows.length) {
      addSubRowsToFlatArrays(subRow.subRows, flatRows, rowsById)
    }
  }
}
