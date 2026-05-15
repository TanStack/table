import {
  getDefaultColumnPinningState,
  table_getCenterHeaderGroups,
  table_getLeftHeaderGroups,
  table_getRightHeaderGroups,
} from '../../features/column-pinning/columnPinningFeature.utils'
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
 * Returns leaf headers for a header.
 *
 * This is the static implementation behind the matching header instance API and can account for nested header groups.
 *
 * @example
 * ```ts
 * const value = header_getLeafHeaders(header)
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
 * Returns context for a header.
 *
 * This is the static implementation behind the matching header instance API and can account for nested header groups.
 *
 * @example
 * ```ts
 * const value = header_getContext(header)
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
 * Returns header groups for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getHeaderGroups(table)
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
  ) as Array<Column<TFeatures, TData, unknown>>

  // Fast path: no columns are pinned — skip per-side lookups, partition, and spread.
  if (!left.length && !right.length) {
    return buildHeaderGroups(allColumns, leafColumns, table)
  }

  const leafColumnsById = table.getAllLeafColumnsById()

  const leftColumns: typeof leafColumns = []
  for (const columnId of left) {
    const column = leafColumnsById[columnId]
    if (
      column &&
      callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)
    ) {
      leftColumns.push(column)
    }
  }

  const rightColumns: typeof leafColumns = []
  for (const columnId of right) {
    const column = leafColumnsById[columnId]
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
 * Returns footer groups for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getFooterGroups(table)
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
 * Returns flat headers for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getFlatHeaders(table)
 * ```
 */
export function table_getFlatHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const headerGroups = table.getHeaderGroups()
  return headerGroups
    .map((headerGroup) => {
      return headerGroup.headers
    })
    .flat()
}

/**
 * Returns leaf headers for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getLeafHeaders(table)
 * ```
 */
export function table_getLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const left = callMemoOrStaticFn(
    table,
    'getLeftHeaderGroups',
    table_getLeftHeaderGroups,
  )
  const center = callMemoOrStaticFn(
    table,
    'getCenterHeaderGroups',
    table_getCenterHeaderGroups,
  )
  const right = callMemoOrStaticFn(
    table,
    'getRightHeaderGroups',
    table_getRightHeaderGroups,
  )

  return [
    ...(left[0]?.headers ?? []),
    ...(center[0]?.headers ?? []),
    ...(right[0]?.headers ?? []),
  ]
    .map((header) => {
      return header.getLeafHeaders()
    })
    .flat()
}
