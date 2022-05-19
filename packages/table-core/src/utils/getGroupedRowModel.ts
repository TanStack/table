import { createRow } from '../core/row'
import { TableInstance, Row, RowModel, TableGenerics } from '../types'
import { flattenBy, memo } from '../utils'

export function getGroupedRowModel<TGenerics extends TableGenerics>(): (
  instance: TableInstance<TGenerics>
) => () => RowModel<TGenerics> {
  return instance =>
    memo(
      () => [instance.getState().grouping, instance.getPreGroupedRowModel()],
      (grouping, rowModel) => {
        if (!rowModel.rows.length || !grouping.length) {
          return rowModel
        }

        // Filter the grouping list down to columns that exist
        const existingGrouping = grouping.filter(columnId =>
          instance.getColumn(columnId)
        )

        const groupedFlatRows: Row<TGenerics>[] = []
        const groupedRowsById: Record<string, Row<TGenerics>> = {}
        // const onlyGroupedFlatRows: Row[] = [];
        // const onlyGroupedRowsById: Record<RowId, Row> = {};
        // const nonGroupedFlatRows: Row[] = [];
        // const nonGroupedRowsById: Record<RowId, Row> = {};

        // Recursively group the data
        const groupUpRecursively = (
          rows: Row<TGenerics>[],
          depth = 0,
          parentId: string
        ) => {
          // This is the last level, just return the rows
          if (depth === existingGrouping.length) {
            return rows
          }

          const columnId = existingGrouping[depth]!

          // Group the rows together for this level
          const rowGroupsMap = groupBy(rows, columnId)

          // Peform aggregations for each group
          const aggregatedGroupedRows = Array.from(rowGroupsMap.entries()).map(
            ([groupingValue, groupedRows], index) => {
              let id = `${columnId}:${groupingValue}`
              id = parentId ? `${parentId}>${id}` : id

              // First, Recurse to group sub rows before aggregation
              const subRows = groupUpRecursively(groupedRows, depth + 1, id)

              // Flatten the leaf rows of the rows in this group
              const leafRows = depth
                ? flattenBy(groupedRows, row => row.subRows)
                : groupedRows

              const row = createRow(instance, id, undefined, index, depth)

              Object.assign(row, {
                groupingColumnId: columnId,
                groupingValue,
                subRows,
                leafRows,
                getValue: (columnId: string) => {
                  // Don't aggregate columns that are in the grouping
                  if (existingGrouping.includes(columnId)) {
                    if (row._valuesCache.hasOwnProperty(columnId)) {
                      return row._valuesCache[columnId]
                    }

                    if (groupedRows[0]) {
                      row._valuesCache[columnId] =
                        groupedRows[0].getValue(columnId) ?? undefined
                    }

                    return row._valuesCache[columnId]
                  }

                  if (row.groupingValuesCache.hasOwnProperty(columnId)) {
                    return row.groupingValuesCache[columnId]
                  }

                  // Aggregate the values
                  const column = instance.getColumn(columnId)
                  const aggregateFn = column.getColumnAggregationFn()

                  if (aggregateFn) {
                    row.groupingValuesCache[columnId] = aggregateFn(
                      () =>
                        leafRows.map(row => {
                          let columnValue = row.getValue(columnId)

                          if (!depth && column.columnDef.aggregateValue) {
                            columnValue =
                              column.columnDef.aggregateValue(columnValue)
                          }

                          return columnValue
                        }),
                      () => groupedRows.map(row => row.getValue(columnId))
                    )

                    return row.groupingValuesCache[columnId]
                  } else if (column.aggregationFn) {
                    console.info({ column })
                    throw new Error(
                      process.env.NODE_ENV !== 'production'
                        ? `Table: Invalid column.aggregateType option for column listed above`
                        : ''
                    )
                  }
                },
              })

              subRows.forEach(subRow => {
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
            }
          )

          return aggregatedGroupedRows
        }

        const groupedRows = groupUpRecursively(rowModel.rows, 0, '')

        groupedRows.forEach(subRow => {
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
      {
        key: process.env.NODE_ENV === 'development' && 'getGroupedRowModel',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance._queue(() => {
            instance._autoResetExpanded()
            instance._autoResetPageIndex()
          })
        },
      }
    )
}

function groupBy<TGenerics extends TableGenerics>(
  rows: Row<TGenerics>[],
  columnId: string
) {
  const groupMap = new Map<any, Row<TGenerics>[]>()

  return rows.reduce((map, row) => {
    const resKey = `${row.getValue(columnId)}`
    const previous = map.get(resKey)
    if (!previous) {
      map.set(resKey, [row])
    } else {
      map.set(resKey, [...previous, row])
    }
    return map
  }, groupMap)
}
