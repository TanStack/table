import { table_getAllColumns } from '../columns/Columns.utils'
import { table_getVisibleLeafColumns } from '../../features/column-visibility/ColumnVisibility.utils'
import { _table_getState } from '../table/Tables.utils'
import {
  getDefaultColumnPinningState,
  table_getCenterHeaderGroups,
  table_getLeftHeaderGroups,
  table_getRightHeaderGroups,
} from '../../features/column-pinning/ColumnPinning.utils'
import { buildHeaderGroups } from './buildHeaderGroups'
import type { Header } from '../../types/Header'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { HeaderGroup } from '../../types/HeaderGroup'
import type { Header_Header } from './Headers.types'

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
>(header: Header<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  return {
    column: header.column,
    header,
    table,
  }
}

export function table_getHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const { left, right } =
    _table_getState(table).columnPinning ?? getDefaultColumnPinningState()
  const allColumns = table_getAllColumns(table)
  const leafColumns = table_getVisibleLeafColumns(table)

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
>(table: Table<TFeatures, TData>) {
  const headerGroups = table_getHeaderGroups(table)
  return [...headerGroups].reverse()
}

export function table_getFlatHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const headerGroups = table_getHeaderGroups(table)
  return headerGroups
    .map((headerGroup) => {
      return headerGroup.headers
    })
    .flat()
}

export function table_getLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const left = table_getLeftHeaderGroups(table)
  const center = table_getCenterHeaderGroups(table)
  const right = table_getRightHeaderGroups(table)

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
