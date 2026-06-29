import { getDefaultColumnPinningState } from '../../features/column-pinning/columnPinningFeature.utils'
import {
  column_getIsVisible,
  table_getVisibleLeafColumns,
} from '../../features/column-visibility/columnVisibilityFeature.utils'
import { callMemoOrStaticFn } from '../../utils'
import { buildHeaderGroups } from './buildHeaderGroups'
import type { Table_Internal } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Header_Header } from './coreHeadersFeature.types'
import type { Column } from '../../types/Column'

/**
 * Walks a header tree and collects all descendant leaf headers.
 *
 * The header itself is included after its descendants, matching the recursive
 * shape used by nested header groups.
 *
 * @example
 * ```ts
 * const leafHeaders = header_getLeafHeaders(header)
 * ```
 */
export function header_getLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue,
>(header: Header<TFeatures, TData, TValue>) {
  const leafHeaders: Array<Header<TFeatures, TData, TValue>> = []

  const recurseHeader = (h: Header_Header<TFeatures, TData, TValue>) => {
    if (h.subHeaders.length) {
      h.subHeaders.map(recurseHeader)
    }
    leafHeaders.push(h as Header<TFeatures, TData, TValue>)
  }

  recurseHeader(header)

  return leafHeaders
}

/**
 * Builds the render context passed to a column's `header` or `footer` template.
 *
 * The context contains the header, its column, and the owning table instance.
 *
 * @example
 * ```ts
 * const context = header_getContext(header)
 * ```
 */
export function header_getContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue,
>(header: Header<TFeatures, TData, TValue>) {
  return {
    column: header.column,
    header,
    table: header.column.table,
  }
}

/**
 * Builds visible header groups for the current column tree.
 *
 * Column visibility and pinning are applied before groups are built. When no
 * columns are pinned, the fast path skips pin partitioning.
 *
 * @example
 * ```ts
 * const headerGroups = table_getHeaderGroups(table)
 * ```
 */
export function table_getHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const { left, right } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  const allColumns = table.getAllColumns()
  const leafColumns = callMemoOrStaticFn(
    table,
    'getVisibleLeafColumns',
    table_getVisibleLeafColumns,
  )

  // Fast path: no columns are pinned — skip per-side lookups, partition, and spread.
  if (!left.length && !right.length) {
    return buildHeaderGroups(allColumns, leafColumns, table)
  }

  const leafColumnsById = table.getAllLeafColumnsById()

  const leftColumns: typeof leafColumns = []
  for (let i = 0; i < left.length; i++) {
    const column = leafColumnsById[left[i]!]
    if (
      column &&
      callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)
    ) {
      leftColumns.push(column)
    }
  }

  const rightColumns: typeof leafColumns = []
  for (let i = 0; i < right.length; i++) {
    const column = leafColumnsById[right[i]!]
    if (
      column &&
      callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)
    ) {
      rightColumns.push(column)
    }
  }

  const centerColumns = leafColumns.filter(
    (column) => !left.includes(column.id) && !right.includes(column.id),
  )

  return buildHeaderGroups(
    allColumns,
    [...leftColumns, ...centerColumns, ...rightColumns],
    table,
  )
}

/**
 * Builds footer groups by reversing the current header groups.
 *
 * Footer rendering uses the same header objects and grouping structure, but
 * renders them from leaf level back toward the root.
 *
 * @example
 * ```ts
 * const footerGroups = table_getFooterGroups(table)
 * ```
 */
export function table_getFooterGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const headerGroups = table.getHeaderGroups()
  return [...headerGroups].reverse()
}

/**
 * Flattens every header from every header group into one array.
 *
 * The result includes parent headers and placeholder headers, in header-group
 * order from top to bottom.
 *
 * @example
 * ```ts
 * const flatHeaders = table_getFlatHeaders(table)
 * ```
 */
export function table_getFlatHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const headerGroups = table.getHeaderGroups()
  const result: Array<Header<TFeatures, TData, unknown>> = []
  for (let i = 0; i < headerGroups.length; i++) {
    const headers = headerGroups[i]!.headers
    for (let j = 0; j < headers.length; j++) {
      result.push(headers[j]!)
    }
  }
  return result
}

/**
 * Collects only the leaf headers from the current header tree.
 *
 * Parent/group headers are skipped, making the result suitable for rendering
 * one header per visible leaf column.
 *
 * @example
 * ```ts
 * const leafHeaders = table_getLeafHeaders(table)
 * ```
 */
export function table_getLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const topHeaders = table.getHeaderGroups()[0]?.headers ?? []
  const result: Array<Header<TFeatures, TData, unknown>> = []
  for (let i = 0; i < topHeaders.length; i++) {
    const leafHeaders = topHeaders[i]!.getLeafHeaders()
    for (let j = 0; j < leafHeaders.length; j++) {
      result.push(leafHeaders[j]!)
    }
  }
  return result
}
