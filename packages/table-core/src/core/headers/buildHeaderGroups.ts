import { callMemoOrStaticFn } from '../../utils'
import { column_getIsVisible } from '../../features/column-visibility/columnVisibilityFeature.utils'
import { constructHeader } from './constructHeader'
import type { Table_Internal } from '../../types/Table'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Header } from '../../types/Header'
import type { HeaderGroup } from '../../types/HeaderGroup'
import type { Column } from '../../types/Column'

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

    columns
      .filter((column) =>
        callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
      )
      .forEach((column) => {
        if (column.columns.length) {
          findMaxDepth(column.columns, depth + 1)
        }
      }, 0)
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
    } as any

    // The parent columns we're going to scan next
    const pendingParentHeaders: Array<Header<TFeatures, TData, TValue>> = []

    // Scan each column for parents
    headersToGroup.forEach((headerToGroup) => {
      // What is the latest (last) parent column?

      const latestPendingParentHeader = [...pendingParentHeaders].reverse()[0]

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

  // headerGroups = headerGroups.filter(headerGroup => {
  //   return !headerGroup.headers.every(header => header.isPlaceholder)
  // })

  const recurseHeadersForSpans = (
    headers: Array<Header<TFeatures, TData, TValue>>,
  ): Array<{ colSpan: number; rowSpan: number }> => {
    const filteredHeaders = headers.filter((header) =>
      callMemoOrStaticFn(header.column, 'getIsVisible', column_getIsVisible),
    )

    return filteredHeaders.map((header) => {
      let colSpan = 0
      let rowSpan = 0
      let childRowSpans = [0]

      if (header.subHeaders.length) {
        childRowSpans = []

        recurseHeadersForSpans(header.subHeaders).forEach(
          ({ colSpan: childColSpan, rowSpan: childRowSpan }) => {
            colSpan += childColSpan
            childRowSpans.push(childRowSpan)
          },
        )
      } else {
        colSpan = 1
      }

      const minChildRowSpan = Math.min(...childRowSpans)
      rowSpan = rowSpan + minChildRowSpan

      header.colSpan = colSpan
      header.rowSpan = rowSpan

      return { colSpan, rowSpan }
    })
  }

  recurseHeadersForSpans(
    (headerGroups[0]?.headers ?? []) as Array<Header<TFeatures, TData, TValue>>,
  )

  return headerGroups
}
