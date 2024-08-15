import { _createRow } from '../../core/rows/createRow'
import { flattenBy, getMemoOptions, memo } from '../../utils'
import { table_getColumn } from '../../core/columns/Columns.utils'
import { _table_getState } from '../../core/table/Tables.utils'
import { table_autoResetExpanded } from '../row-expanding/RowExpanding.utils'
import { table_autoResetPageIndex } from '../row-pagination/RowPagination.utils'
import {
  row_getGroupingValue,
  table_getPreGroupedRowModel,
} from './ColumnGrouping.utils'
import type { Column } from '../../types/Column'
import type {
  Column_ColumnGrouping,
  Row_ColumnGrouping,
} from './ColumnGrouping.types'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../types/RowModel'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'

export function createGroupedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData> {
  return (table) =>
    memo(
      () => [
        _table_getState(table).grouping,
        table_getPreGroupedRowModel(table),
      ],
      (grouping, rowModel) => {
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
        // const onlyGroupedFlatRows: Row[] = [];
        // const onlyGroupedRowsById: Record<RowId, Row> = {};
        // const nonGroupedFlatRows: Row[] = [];
        // const nonGroupedRowsById: Record<RowId, Row> = {};

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

              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              if (row.subRows) {
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

              const row = _createRow(
                table,
                id,
                leafRows[0]!.original,
                index,
                depth,
                undefined,
                parentId,
              ) as Row<TFeatures, TData> & Row_ColumnGrouping

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
                  const column = table.getColumn(colId) as Column<
                    TFeatures,
                    TData
                  > &
                    Column_ColumnGrouping<TFeatures, TData>
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
                // if (subRow.getIsGrouped?.()) {
                //   onlyGroupedFlatRows.push(subRow);
                //   onlyGroupedRowsById[subRow.id] = subRow;
                // } else {
                //   nonGroupedFlatRows.push(subRow);
                //   nonGroupedRowsById[subRow.id] = subRow;
                // }
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
          // if (subRow.getIsGrouped?.()) {
          //   onlyGroupedFlatRows.push(subRow);
          //   onlyGroupedRowsById[subRow.id] = subRow;
          // } else {
          //   nonGroupedFlatRows.push(subRow);
          //   nonGroupedRowsById[subRow.id] = subRow;
          // }
        })

        return {
          rows: groupedRows,
          flatRows: groupedFlatRows,
          rowsById: groupedRowsById,
        }
      },
      getMemoOptions(table.options, 'debugTable', 'getGroupedRowModel', () => {
        table._queue(() => {
          table_autoResetExpanded(table)
          table_autoResetPageIndex(table)
        })
      }),
    )
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
