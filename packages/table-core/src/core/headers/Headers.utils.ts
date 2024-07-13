import { buildHeaderGroups } from './buildHeaderGroups'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { HeaderGroup } from '../../types/HeaderGroup'
import type { Column } from '../../types/Column'

export function table_getHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  allColumns: Array<Column<TFeatures, TData, unknown>>,
  leafColumns: Array<Column<TFeatures, TData, unknown>>,
  left?: Array<string>,
  right?: Array<string>,
) {
  const leftColumns =
    left
      ?.map((columnId) => leafColumns.find((d) => d.id === columnId)!)
      .filter(Boolean) ?? []

  const rightColumns =
    right
      ?.map((columnId) => leafColumns.find((d) => d.id === columnId)!)
      .filter(Boolean) ?? []

  const centerColumns = leafColumns.filter(
    (column) => !left?.includes(column.id) && !right?.includes(column.id),
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
>(headerGroups: Array<HeaderGroup<TFeatures, TData>>) {
  return [...headerGroups].reverse()
}

export function table_getFlatHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(headerGroups: Array<HeaderGroup<TFeatures, TData>>) {
  return headerGroups
    .map((headerGroup) => {
      return headerGroup.headers
    })
    .flat()
}

export function table_getLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  left: Array<HeaderGroup<TFeatures, TData>>,
  center: Array<HeaderGroup<TFeatures, TData>>,
  right: Array<HeaderGroup<TFeatures, TData>>,
) {
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
