import { hasOwn, makeObjectMap, tableMemo } from '../../utils'
import { constructRow } from '../../core/rows/constructRow'
import { table_getColumn } from '../../core/columns/coreColumnsFeature.utils'
import { table_autoResetExpanded } from '../row-expanding/rowExpandingFeature.utils'
import { table_autoResetPageIndex } from '../row-pagination/rowPaginationFeature.utils'
import {
  aggregateColumnValue,
  normalizeAggregationRows,
} from '../aggregation/aggregationFeature.utils'
import { row_getGroupingValue } from './columnGroupingFeature.utils'
import type { Row_ColumnGrouping } from './columnGroupingFeature.types'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table, Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { RowData } from '../../types/type-utils'

/**
 * Creates a memoized grouped row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 *
 * When aggregationFeature is also registered, grouped rows use its shared
 * executor for non-group values. Grouping remains useful without aggregation.
 */
export function createGroupedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData> {
  return (_table) => {
    const table = _table as unknown as Table_Internal<TFeatures, TData>
    return tableMemo({
      feature: 'columnGroupingFeature',
      table,
      fnName: 'table.getGroupedRowModel',
      memoDeps: () => [
        table.atoms.grouping?.get(),
        table.getPreGroupedRowModel(),
        table.options.columns,
      ],
      fn: () => _createGroupedRowModel(table),
      onAfterUpdate: () => {
        table_autoResetExpanded(table)
        table_autoResetPageIndex(table)
      },
    })
  }
}

function _createGroupedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  const rowModel = table.getPreGroupedRowModel()
  const grouping = table.atoms.grouping?.get()

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

  const groupedFlatRows: Array<Row<TFeatures, TData>> &
    Partial<Row_ColumnGrouping> = []
  const groupedRowsById = makeObjectMap<Row<TFeatures, TData>>()

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

        // Every row is pushed into flatRows/rowsById exactly once, by its
        // parent frame: rows returned here are pushed by the caller (the
        // parent group's loop or the root loop), so only descendants below
        // the terminal depth are pushed here.
        if (row.subRows.length) {
          row.subRows = groupUpRecursively(row.subRows, depth + 1, row.id)
          for (let i = 0; i < row.subRows.length; i++) {
            const subRow = row.subRows[i]!
            groupedFlatRows.push(subRow)
            groupedRowsById[subRow.id] = subRow
          }
        }

        return row
      })
    }

    const columnId = existingGrouping[depth] as string

    // Group the rows together for this level
    const rowGroupsMap = groupBy(rows, columnId)

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

        const leafRows = normalizeAggregationRows(groupedRows)

        const row = constructRow(
          table,
          id,
          leafRows[0]!.original,
          index,
          depth,
          undefined,
          parentId,
        ) as Row<TFeatures, TData> & Partial<Row_ColumnGrouping>

        Object.assign(row, {
          groupingColumnId: columnId,
          groupingValue,
          subRows,
          leafRows,
          getValue: (colId: string) => {
            const groupingIndex = existingGrouping.indexOf(colId)

            // The active grouping column and ancestor grouping columns expose
            // their inherited grouping values. Columns grouped at deeper
            // levels are still eligible for aggregation here.
            if (groupingIndex !== -1 && groupingIndex <= depth) {
              if (hasOwn(row._valuesCache, colId)) {
                return row._valuesCache[colId]
              }

              if (groupedRows[0]) {
                row._valuesCache[colId] =
                  groupedRows[0].getValue(colId) ?? undefined
              }

              return row._valuesCache[colId]
            }

            const aggregationCache = (row as any)._aggregationValuesCache as
              | Record<string, unknown>
              | undefined
            if (aggregationCache && hasOwn(aggregationCache, colId)) {
              return aggregationCache[colId]
            }

            const column = table.getColumn(colId) as any
            if (typeof column.getAggregationFns !== 'function') return undefined

            const cache = ((row as any)._aggregationValuesCache ??=
              makeObjectMap())
            cache[colId] = aggregateColumnValue({
              childRows: subRows,
              column,
              groupingRow: row,
              rows: leafRows,
            })
            return cache[colId]
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

function groupBy<TFeatures extends TableFeatures, TData extends RowData = any>(
  rows: Array<Row<TFeatures, TData>>,
  columnId: string,
) {
  const groupMap = new Map<any, Array<Row<TFeatures, TData>>>()

  return rows.reduce((map, row) => {
    const resKey = `${row_getGroupingValue(row, columnId)}`
    const previous = map.get(resKey)
    if (!previous) {
      map.set(resKey, [row])
    } else {
      previous.push(row)
    }
    return map
  }, groupMap)
}
