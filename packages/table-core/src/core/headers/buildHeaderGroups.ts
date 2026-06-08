import { callMemoOrStaticFn } from '../../utils'
import { column_getIsVisible } from '../../features/column-visibility/columnVisibilityFeature.utils'
import { constructHeader } from './constructHeader'
import type { Table_Internal } from '../../types/Table'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Header } from '../../types/Header'
import type { HeaderGroup } from '../../types/HeaderGroup'
import type { Column } from '../../types/Column'

/**
 * Builds the nested header group structure for a table.
 *
 * The result accounts for visible leaf columns, pinned column groups, and placeholder headers needed to render multi-level headers.
 */
export function buildHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  allColumns: Array<Column<TFeatures, TData, TValue>>,
  columnsToGroup: Array<Column<TFeatures, TData, TValue>>,
  table: Table_Internal<TFeatures, TData>,
  headerFamily?: 'center' | 'left' | 'right',
) {
  // Find the max depth of the columns:
  // build the leaf column row
  // build each buffer row going up
  //    placeholder for non-existent level
  //    real column for existing level

  let maxDepth = 0

  const findMaxDepth = (
    columns: Array<Column<TFeatures, TData, TValue>>,
    depth = 1,
  ) => {
    maxDepth = Math.max(maxDepth, depth)

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]!
      if (callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)) {
        if (column.columns.length) {
          findMaxDepth(column.columns, depth + 1)
        }
      }
    }
  }

  findMaxDepth(allColumns)

  const headerGroups: Array<HeaderGroup<TFeatures, TData>> = []

  const constructHeaderGroup = (
    headersToGroup: Array<Header<TFeatures, TData, TValue>>,
    depth: number,
  ) => {
    // The header group we are creating
    const headerGroup: HeaderGroup<TFeatures, TData> = {
      depth,
      id: [headerFamily, `${depth}`].filter(Boolean).join('_'),
      headers: [],
    }

    // The parent columns we're going to scan next
    const pendingParentHeaders: Array<Header<TFeatures, TData, TValue>> = []

    // Scan each column for parents
    headersToGroup.forEach((headerToGroup) => {
      // What is the latest (last) parent column?

      const latestPendingParentHeader =
        pendingParentHeaders[pendingParentHeaders.length - 1]

      const isLeafHeader = headerToGroup.column.depth === headerGroup.depth

      let column: Column<TFeatures, TData, TValue>
      let isPlaceholder = false

      if (isLeafHeader && headerToGroup.column.parent) {
        // The parent header is new
        column = headerToGroup.column.parent
      } else {
        // The parent header is repeated
        column = headerToGroup.column
        isPlaceholder = true
      }

      if (
        latestPendingParentHeader &&
        latestPendingParentHeader.column === column
      ) {
        // This column is repeated. Add it as a sub header to the next batch
        latestPendingParentHeader.subHeaders.push(headerToGroup)
      } else {
        // This is a new header. Let's create it
        const header = constructHeader(table, column, {
          id: [headerFamily, depth, column.id, headerToGroup.id]
            .filter(Boolean)
            .join('_'),
          isPlaceholder,
          placeholderId: isPlaceholder
            ? `${pendingParentHeaders.filter((d) => d.column === column).length}`
            : undefined,
          depth,
          index: pendingParentHeaders.length,
        })

        // Add the headerToGroup as a subHeader of the new header
        header.subHeaders.push(headerToGroup)
        // Add the new header to the pendingParentHeaders to get grouped
        // in the next batch
        pendingParentHeaders.push(header)
      }

      headerGroup.headers.push(headerToGroup)
      headerToGroup.headerGroup = headerGroup
    })

    headerGroups.push(headerGroup)

    if (depth > 0) {
      constructHeaderGroup(pendingParentHeaders, depth - 1)
    }
  }

  const bottomHeaders = columnsToGroup.map((column, index) =>
    constructHeader(table, column, {
      depth: maxDepth,
      index,
    }),
  )

  constructHeaderGroup(bottomHeaders, maxDepth - 1)

  headerGroups.reverse()

  const recurseHeadersForSpans = (
    headers: Array<Header<TFeatures, TData, TValue>>,
  ): Array<{ colSpan: number; rowSpan: number }> => {
    const results: Array<{ colSpan: number; rowSpan: number }> = []

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!
      if (
        !callMemoOrStaticFn(header.column, 'getIsVisible', column_getIsVisible)
      ) {
        continue
      }

      let colSpan = 0
      let minChildRowSpan = Infinity

      if (header.subHeaders.length) {
        const childSpans = recurseHeadersForSpans(header.subHeaders)
        for (let j = 0; j < childSpans.length; j++) {
          const child = childSpans[j]!
          colSpan += child.colSpan
          if (child.rowSpan < minChildRowSpan) {
            minChildRowSpan = child.rowSpan
          }
        }
      } else {
        colSpan = 1
        minChildRowSpan = 0
      }

      header.colSpan = colSpan
      header.rowSpan = minChildRowSpan

      results.push({ colSpan, rowSpan: header.rowSpan })
    }

    return results
  }

  recurseHeadersForSpans(
    (headerGroups[0]?.headers ?? []) as Array<Header<TFeatures, TData, TValue>>,
  )

  return headerGroups
}
