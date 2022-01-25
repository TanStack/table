import { ReactTable, Row, RowModel } from '../types'
import { Options } from '../types'
import { GroupingState } from '../features/Grouping'
import { flattenBy } from '../utils'

export const groupRowsFn: Options<any, any, {}, {}, {}>['groupRowsFn'] = <
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  groupingState: GroupingState,
  sortedRowModel: RowModel<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >
): RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> => {
  // Filter the grouping list down to columns that exist
  const existingGrouping = groupingState.filter(columnId =>
    instance.getColumn(columnId)
  )

  // Find the columns that can or are aggregating
  // Uses each column to aggregate rows into a single value
  const aggregateRowsToValues = (
    leafRows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
    groupedRows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
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
        // Get the columnValues to aggregate
        const groupedValues = groupedRows.map(row => row.values[column.id])

        // Get the columnValues to aggregate
        const leafValues = leafRows.map(row => {
          let columnValue = row.values[column.id]

          if (!depth && column.aggregateValue) {
            columnValue = column.aggregateValue(columnValue)
          }

          return columnValue
        })

        values[column.id] = aggregateFn(leafValues, groupedValues)
      } else if (column.aggregationType) {
        console.info({ column })
        throw new Error(
          process.env.NODE_ENV !== 'production'
            ? `React Table: Invalid column.aggregateType option for column listed above`
            : ''
        )
      } else {
        values[column.id] = null
      }
    })

    return values
  }

  const groupedFlatRows: Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[] = []
  const groupedRowsById: Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  > = {}
  // const onlyGroupedFlatRows: Row[] = [];
  // const onlyGroupedRowsById: Record<RowId, Row> = {};
  // const nonGroupedFlatRows: Row[] = [];
  // const nonGroupedRowsById: Record<RowId, Row> = {};

  // Recursively group the data
  const groupUpRecursively = (
    rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
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
          ? flattenBy(groupedRows, row => row.leafRows)
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

function groupBy<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(
  rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
  columnId: string
) {
  const groupMap = new Map<
    any,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
  >()

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
