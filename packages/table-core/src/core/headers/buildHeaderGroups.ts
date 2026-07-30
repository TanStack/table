import { callMemoOrStaticFn } from '../../utils'
import { column_getIsVisible } from '../../features/column-visibility/columnVisibilityFeature.utils'
import { constructHeader } from './constructHeader'
import type { Table_Internal } from '../../types/Table'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Header } from '../../types/Header'
import type { HeaderGroup } from '../../types/HeaderGroup'
import type { Column } from '../../types/Column'

type HeaderFamily = 'center' | 'start' | 'end' | undefined

function getMaxHeaderDepth<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>(columns: Array<Column<TFeatures, TData, TValue>>, depth = 1): number {
  let maxDepth = depth

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i]!
    if (
      callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible) &&
      column.columns.length
    ) {
      maxDepth = Math.max(
        maxDepth,
        getMaxHeaderDepth(column.columns, depth + 1),
      )
    }
  }

  return maxDepth
}

function formatHeaderGroupId(headerFamily: HeaderFamily, depth: number) {
  return headerFamily ? `${headerFamily}_${depth}` : String(depth)
}

function formatHeaderId(
  headerFamily: HeaderFamily,
  depth: number,
  columnId: string,
  childHeaderId: string,
) {
  let id = headerFamily ?? ''

  if (depth) {
    id = id ? `${id}_${depth}` : String(depth)
  }
  if (columnId) {
    id = id ? `${id}_${columnId}` : columnId
  }
  if (childHeaderId) {
    id = id ? `${id}_${childHeaderId}` : childHeaderId
  }

  return id
}

function countPendingHeadersForColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>(
  headers: Array<Header<TFeatures, TData, TValue>>,
  column: Column<TFeatures, TData, TValue>,
) {
  let count = 0

  for (let i = 0; i < headers.length; i++) {
    if (headers[i]!.column === column) {
      count++
    }
  }

  return count
}

function constructHeaderGroup<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>(
  headersToGroup: Array<Header<TFeatures, TData, TValue>>,
  depth: number,
  table: Table_Internal<TFeatures, TData>,
  headerFamily: HeaderFamily,
  headerGroups: Array<HeaderGroup<TFeatures, TData>>,
  headerGroupInitFns: Table_Internal<
    TFeatures,
    TData
  >['_headerGroupInstanceInitFns'],
): void {
  const headerGroup: HeaderGroup<TFeatures, TData> = {
    depth,
    id: formatHeaderGroupId(headerFamily, depth),
    headers: [],
  }
  const pendingParentHeaders: Array<Header<TFeatures, TData, TValue>> = []

  for (let i = 0; i < headersToGroup.length; i++) {
    if (!(i in headersToGroup)) {
      continue
    }

    const headerToGroup = headersToGroup[i]!
    const latestPendingParentHeader =
      pendingParentHeaders[pendingParentHeaders.length - 1]
    const isLeafHeader = headerToGroup.column.depth === headerGroup.depth

    let column: Column<TFeatures, TData, TValue>
    let isPlaceholder = false

    if (isLeafHeader && headerToGroup.column.parent) {
      column = headerToGroup.column.parent
    } else {
      column = headerToGroup.column
      isPlaceholder = true
    }

    if (
      latestPendingParentHeader &&
      latestPendingParentHeader.column === column
    ) {
      latestPendingParentHeader.subHeaders.push(headerToGroup)
    } else {
      const header = constructHeader(table, column, {
        id: formatHeaderId(headerFamily, depth, column.id, headerToGroup.id),
        isPlaceholder,
        placeholderId: isPlaceholder
          ? String(countPendingHeadersForColumn(pendingParentHeaders, column))
          : undefined,
        depth,
        index: pendingParentHeaders.length,
      })

      header.subHeaders.push(headerToGroup)
      pendingParentHeaders.push(header)
    }

    headerGroup.headers.push(headerToGroup as Header<TFeatures, TData, unknown>)
    headerToGroup.headerGroup = headerGroup
  }

  for (let i = 0; i < headerGroupInitFns.length; i++) {
    headerGroupInitFns[i]!(headerGroup)
  }

  headerGroups.push(headerGroup)

  if (depth > 0) {
    constructHeaderGroup(
      pendingParentHeaders,
      depth - 1,
      table,
      headerFamily,
      headerGroups,
      headerGroupInitFns,
    )
  }
}

function updateHeaderSpans<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>(headers: Array<Header<TFeatures, TData, TValue>>): void {
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
      updateHeaderSpans(header.subHeaders)

      for (let j = 0; j < header.subHeaders.length; j++) {
        const child = header.subHeaders[j]!
        if (
          !callMemoOrStaticFn(child.column, 'getIsVisible', column_getIsVisible)
        ) {
          continue
        }

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
  }
}

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
  headerFamily?: 'center' | 'start' | 'end',
) {
  // Find the max depth of the columns:
  // build the leaf column row
  // build each buffer row going up
  //    placeholder for non-existent level
  //    real column for existing level

  const maxDepth = getMaxHeaderDepth(allColumns)
  const headerGroups: Array<HeaderGroup<TFeatures, TData>> = []
  const headerGroupInitFns = table._headerGroupInstanceInitFns
  const bottomHeaders = new Array<Header<TFeatures, TData, TValue>>(
    columnsToGroup.length,
  )

  for (let i = 0; i < columnsToGroup.length; i++) {
    if (!(i in columnsToGroup)) {
      continue
    }

    bottomHeaders[i] = constructHeader(table, columnsToGroup[i]!, {
      depth: maxDepth,
      index: i,
    })
  }

  constructHeaderGroup(
    bottomHeaders,
    maxDepth - 1,
    table,
    headerFamily,
    headerGroups,
    headerGroupInitFns,
  )

  headerGroups.reverse()
  updateHeaderSpans(
    (headerGroups[0]?.headers ?? []) as Array<Header<TFeatures, TData, TValue>>,
  )

  return headerGroups
}
