import {
  TableInstance,
  Row,
  RowModel,
  AnyGenerics,
  PartialGenerics,
} from '../types'
import { flattenBy } from '../utils'

export function groupRowsFn<TGenerics extends AnyGenerics>(
  instance: TableInstance<TGenerics>,
  sortedRowModel: RowModel<TGenerics>
): RowModel<TGenerics> {
  const groupingState = instance.getState().grouping
  // Filter the grouping list down to columns that exist
  const existingGrouping = groupingState.filter(columnId =>
    instance.getColumn(columnId)
  )

  // Find the columns that can or are aggregating
  // Uses each column to aggregate rows into a single value
  const aggregateRowsToValues = (
    leafRows: Row<TGenerics>[],
    groupedRows: Row<TGenerics>[],
    depth: number
  ) => {
    const values: Record<string, unknown> = {}

    instance.getAllLeafColumns().forEach(column => {
      // Don't aggregate columns that are in the grouping
      if (existingGrouping.includes(column.id)) {
        values[column.id] = groupedRows[0]
          ? groupedRows[0].values[column.id]
          : null
        return
      }

      // Aggregate the values
      const aggregateFn = instance.getColumnAggregationFn(column.id)

      if (aggregateFn) {
        values[column.id] = aggregateFn(
          () =>
            leafRows.map(row => {
              let columnValue = row.values[column.id]

              if (!depth && column.aggregateValue) {
                columnValue = column.aggregateValue(columnValue)
              }

              return columnValue
            }),
          () => groupedRows.map(row => row.values[column.id])
        )
      } else if (column.aggregationType) {
        console.info({ column })
        throw new Error(
          process.env.NODE_ENV !== 'production'
            ? `Table: Invalid column.aggregateType option for column listed above`
            : ''
        )
      } else {
        values[column.id] = null
      }
    })

    return values
  }

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

        const values = aggregateRowsToValues(leafRows, groupedRows, depth)

        const row = instance.createRow(id, undefined, index, depth, values)

        Object.assign(row, {
          groupingColumnId: columnId,
          groupingValue,
          subRows,
          leafRows,
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

  const groupedRows = groupUpRecursively(sortedRowModel.rows, 0, '')

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
}

function groupBy<TGenerics extends AnyGenerics>(
  rows: Row<TGenerics>[],
  columnId: string
) {
  const groupMap = new Map<any, Row<TGenerics>[]>()

  return rows.reduce((map, row) => {
    const resKey = `${row.values[columnId]}`
    const previous = map.get(resKey)
    if (!previous) {
      map.set(resKey, [row])
    } else {
      map.set(resKey, [...previous, row])
    }
    return map
  }, groupMap)
}
