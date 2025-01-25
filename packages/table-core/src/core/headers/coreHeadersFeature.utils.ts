import {
  getDefaultColumnPinningState,
  table_getCenterHeaderGroups,
  table_getLeftHeaderGroups,
  table_getRightHeaderGroups,
} from '../../features/column-pinning/columnPinningFeature.utils'
import { table_getVisibleLeafColumns } from '../../features/column-visibility/columnVisibilityFeature.utils'
import { callMemoOrStaticFn } from '../../utils'
import { buildHeaderGroups } from './buildHeaderGroups'
import type { Table_Internal } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Header_Header } from './coreHeadersFeature.types'
import type { Column } from '../../types/Column'

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

export function header_getContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue,
>(header: Header<TFeatures, TData, TValue>) {
  return {
    column: header.column,
    header,
    table: header.column._table,
  }
}

export function table_getHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const { left, right } =
    table.options.state?.columnPinning ?? getDefaultColumnPinningState()
  const allColumns = table.getAllColumns()
  const leafColumns = callMemoOrStaticFn(
    table,
    'getVisibleLeafColumns',
    table_getVisibleLeafColumns,
  ) as unknown as Array<Column<TFeatures, TData, unknown>>

  const leftColumns = left
    .map((columnId) => leafColumns.find((d) => d.id === columnId)!)
    .filter(Boolean)

  const rightColumns = right
    .map((columnId) => leafColumns.find((d) => d.id === columnId)!)
    .filter(Boolean)

  const centerColumns = leafColumns.filter(
    (column) => !left.includes(column.id) && !right.includes(column.id),
  )

  const headerGroups = buildHeaderGroups(
    allColumns,
    [...leftColumns, ...centerColumns, ...rightColumns],
    table,
  )

  return headerGroups
}

export function table_getFooterGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const headerGroups = table.getHeaderGroups()
  return [...headerGroups].reverse()
}

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
