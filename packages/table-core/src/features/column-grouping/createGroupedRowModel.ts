import { hasOwn, makeObjectMap, tableMemo } from '../../utils'
import { constructRow } from '../../core/rows/constructRow'
import { table_getColumn } from '../../core/columns/coreColumnsFeature.utils'
import { table_autoResetExpanded } from '../row-expanding/rowExpandingFeature.utils'
import { table_autoResetPageIndex } from '../row-pagination/rowPaginationFeature.utils'
import {
  aggregateColumnValue,
  normalizeUniqueAggregationRows,
} from '../row-aggregation/rowAggregationFeature.utils'
import type { Row_ColumnGrouping } from './columnGroupingFeature.types'
import type { Column_Internal } from '../../types/Column'
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
 * When rowAggregationFeature is also registered, grouped rows use its shared
 * executor for non-group values. Grouping remains useful without aggregation.
 */
export function createGroupedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData> {
  return (_table) => {
    const table = _table as unknown as Table_Internal<TFeatures, TData>
    let hasAutoResetDependencies = false
    let previousGrouping: unknown
    let previousPreGroupedRowModel: RowModel<TFeatures, TData> | undefined

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
        const grouping = table.atoms.grouping?.get()
        const preGroupedRowModel = table.getPreGroupedRowModel()
        // The first computation is not a change; auto-resets fire only once
        // a previously observed grouping or pre-grouped row model differs.
        const rowInputsChanged =
          hasAutoResetDependencies &&
          (grouping !== previousGrouping ||
            preGroupedRowModel !== previousPreGroupedRowModel)

        previousGrouping = grouping
        previousPreGroupedRowModel = preGroupedRowModel
        hasAutoResetDependencies = true

        // Column definitions participate in grouped-row computation (for
        // grouping and aggregation metadata), but changing only their
        // reference does not change which rows belong on the current page or
        // which group ids are expanded.
        if (rowInputsChanged) {
          table_autoResetExpanded(table)
          table_autoResetPageIndex(table)
        }
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
    // A previous grouped pass rewrote depth/parentId on these shared row
    // objects, shifting the whole tree down by the number of grouping levels.
    // Restore the natural relationships all the way down, not just at the
    // top level.
    resetRowRelationships(rowModel.rows, 0, undefined)
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
    // Grouping depth has been met
    // Stop grouping and simply rewrite the depth and row relationships
    if (depth >= existingGrouping.length) {
      return rows.map((row) => {
        row.depth = depth

        if (row.subRows.length) {
          row.subRows = groupUpRecursively(row.subRows, depth + 1, row.id)
        }

        return row
      })
    }

    const columnId = existingGrouping[depth] as string

    // Group the rows together for this level
    const rowGroupsMap = groupBy(table, rows, columnId)

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

        // Rows produced by groupBy are disjoint members of the pre-grouped
        // row tree, so the duplicate-id guard is unnecessary; flat groups
        // reuse the partition array as-is.
        const leafRows = normalizeUniqueAggregationRows(
          groupedRows,
          Infinity,
        ) as Array<Row<TFeatures, TData>>

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
              Record<string, unknown> | undefined
            if (aggregationCache && hasOwn(aggregationCache, colId)) {
              return aggregationCache[colId]
            }

            const column = table.getColumn(colId) as any
            if (typeof column.getAggregationFns !== 'function') return undefined

            const cache = ((row as any)._aggregationValuesCache ??=
              makeObjectMap())
            cache[colId] = aggregateColumnValue({
              subRows,
              column,
              groupingRow: row,
              rows: groupedRows,
              uniqueRows: true,
            })
            return cache[colId]
          },
        })

        return row
      },
    )

    return aggregatedGroupedRows
  }

  const groupedRows = groupUpRecursively(rowModel.rows, 0)

  pushGroupedRowsParentFirst(groupedRows, groupedFlatRows, groupedRowsById)

  return {
    rows: groupedRows,
    flatRows: groupedFlatRows,
    rowsById: groupedRowsById,
  }
}

function pushGroupedRowsParentFirst<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rows: Array<Row<TFeatures, TData>>,
  flatRows: Array<Row<TFeatures, TData>>,
  rowsById: Record<string, Row<TFeatures, TData>>,
): void {
  for (const row of rows) {
    flatRows.push(row)
    rowsById[row.id] = row
    if (row.subRows.length) {
      pushGroupedRowsParentFirst(row.subRows, flatRows, rowsById)
    }
  }
}

function resetRowRelationships<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rows: Array<Row<TFeatures, TData>>,
  depth: number,
  parentId: string | undefined,
) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!
    row.depth = depth
    row.parentId = parentId
    if (row.subRows.length) {
      resetRowRelationships(row.subRows, depth + 1, row.id)
    }
  }
}

function groupBy<TFeatures extends TableFeatures, TData extends RowData = any>(
  table: Table_Internal<TFeatures, TData>,
  rows: Array<Row<TFeatures, TData>>,
  columnId: string,
) {
  const groupMap = new Map<any, Array<Row<TFeatures, TData>>>()

  // Resolve the column once instead of per row: `table.getColumn` goes
  // through the memoized-API dispatcher, which is far too expensive to sit
  // inside this per-row loop. The branches below mirror
  // `row_getGroupingValue`'s caching contract exactly.
  const column = table_getColumn(table, columnId) as
    Column_Internal<TFeatures, TData, unknown> | undefined
  const getGroupingValue = column?.columnDef.getGroupingValue

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!
    let groupingValue
    if (getGroupingValue) {
      const cache = (row as any)._groupingValuesCache as
        Record<string, unknown> | undefined
      if (cache && hasOwn(cache, columnId)) {
        groupingValue = cache[columnId]
      } else if (cache) {
        groupingValue = cache[columnId] = getGroupingValue(
          row.original,
          row.index,
          row,
        )
      }
    } else {
      groupingValue = row.getValue(columnId)
    }

    const resKey = `${groupingValue}`
    const previous = groupMap.get(resKey)
    if (!previous) {
      groupMap.set(resKey, [row])
    } else {
      previous.push(row)
    }
  }

  return groupMap
}
