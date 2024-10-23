import { flattenBy, isDev, tableMemo } from '../../utils'
import { constructRow } from '../../core/rows/constructRow'
import { table_getColumn } from '../../core/columns/Columns.utils'
import { table_autoResetExpanded } from '../row-expanding/RowExpanding.utils'
import { table_autoResetPageIndex } from '../row-pagination/RowPagination.utils'
import { row_getGroupingValue } from './ColumnGrouping.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/RowModels.types'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'

export function createGroupedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData> {
  return (table) =>
    tableMemo({
      debug: isDev && (table.options.debugAll ?? table.options.debugTable),
      fnName: 'table.getGroupedRowModel',
      memoDeps: () => [
        table.getState().grouping,
        table.getPreGroupedRowModel(),
      ],
      fn: () => _createGroupedRowModel(table),
      onAfterUpdate: () => {
        table_autoResetExpanded(table)
        table_autoResetPageIndex(table)
      },
    })
}

function _createGroupedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData> {
  const rowModel = table.getPreGroupedRowModel()
  const grouping = table.getState().grouping

  if (!rowModel.rows.length || !grouping?.length) {
    rowModel.rows.forEach((row) => {
      row.depth = 0
      row.parentId = undefined
    })
    return rowModel
  }

  // Filter the grouping list down to columns that exist
  const existingGrouping = grouping.filter((columnId) =>
    table_getColumn(table, columnId),
  )

  const groupedFlatRows: Array<Row<TFeatures, TData>> = []
  const groupedRowsById: Record<string, Row<TFeatures, TData>> = {}

  // Recursively group the data
  const groupUpRecursively = (
    rows: Array<Row<TFeatures, TData>>,
    depth = 0,
    parentId?: string,
  ) => {
    // Grouping depth has been been met
    // Stop grouping and simply rewrite thd depth and row relationships
    if (depth >= existingGrouping.length) {
      return rows.map((row) => {
        row.depth = depth

        groupedFlatRows.push(row)
        groupedRowsById[row.id] = row

        if (row.subRows.length) {
          row.subRows = groupUpRecursively(row.subRows, depth + 1, row.id)
        }

        return row
      })
    }

    const columnId: string = existingGrouping[depth]!

    // Group the rows together for this level
    const rowGroupsMap = groupBy(rows, columnId, table)

    // Perform aggregations for each group
    const aggregatedGroupedRows = Array.from(rowGroupsMap.entries()).map(
      ([groupingValue, groupedRows], index) => {
        let id = `${columnId}:${groupingValue}`
        id = parentId ? `${parentId}>${id}` : id

        // First, Recurse to group sub rows before aggregation
        const subRows = groupUpRecursively(groupedRows, depth + 1, id)

        subRows.forEach((subRow) => {
          subRow.parentId = id
        })

        // Flatten the leaf rows of the rows in this group
        const leafRows = depth
          ? flattenBy(groupedRows, (row) => row.subRows)
          : groupedRows

        const row = constructRow(
          table,
          id,
          leafRows[0]!.original,
          index,
          depth,
          undefined,
          parentId,
        )

        Object.assign(row, {
          groupingColumnId: columnId,
          groupingValue,
          subRows,
          leafRows,
          getValue: (colId: string) => {
            // Don't aggregate columns that are in the grouping
            if (existingGrouping.includes(colId)) {
              if (row._valuesCache.hasOwnProperty(colId)) {
                return row._valuesCache[colId]
              }

              if (groupedRows[0]) {
                row._valuesCache[colId] =
                  groupedRows[0].getValue(colId) ?? undefined
              }

              return row._valuesCache[colId]
            }

            if (row._groupingValuesCache.hasOwnProperty(colId)) {
              return row._groupingValuesCache[colId]
            }

            // Aggregate the values
            const column = table.getColumn(colId)
            const aggregateFn = column.getAggregationFn()

            if (aggregateFn) {
              row._groupingValuesCache[colId] = aggregateFn(
                colId,
                leafRows,
                groupedRows,
              )

              return row._groupingValuesCache[colId]
            }
          },
        })

        subRows.forEach((subRow) => {
          groupedFlatRows.push(subRow)
          groupedRowsById[subRow.id] = subRow
        })

        return row
      },
    )

    return aggregatedGroupedRows
  }

  const groupedRows = groupUpRecursively(rowModel.rows, 0)

  groupedRows.forEach((subRow) => {
    groupedFlatRows.push(subRow)
    groupedRowsById[subRow.id] = subRow
  })

  return {
    rows: groupedRows,
    flatRows: groupedFlatRows,
    rowsById: groupedRowsById,
  }
}

function groupBy<TFeatures extends TableFeatures, TData extends RowData>(
  rows: Array<Row<TFeatures, TData>>,
  columnId: string,
  table: Table<TFeatures, TData>,
) {
  const groupMap = new Map<any, Array<Row<TFeatures, TData>>>()

  return rows.reduce((map, row) => {
    const resKey = `${row_getGroupingValue(row, table, columnId)}`
    const previous = map.get(resKey)
    if (!previous) {
      map.set(resKey, [row])
    } else {
      previous.push(row)
    }
    return map
  }, groupMap)
}
