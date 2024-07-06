import { Column, HeaderGroup, RowData, Table } from '../../types'
import { buildHeaderGroups } from './buildHeaderGroups'

export function table_getHeaderGroups<TData extends RowData>(
  table: Table<TData>,
  allColumns: Column<TData, unknown>[],
  leafColumns: Column<TData, unknown>[],
  left?: string[],
  right?: string[],
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

export function table_getFooterGroups<TData extends RowData>(
  headerGroups: HeaderGroup<TData>[],
) {
  return [...headerGroups].reverse()
}

export function table_getFlatHeaders<TData extends RowData>(
  headerGroups: HeaderGroup<TData>[],
) {
  return headerGroups
    .map((headerGroup) => {
      return headerGroup.headers
    })
    .flat()
}

export function table_getLeafHeaders<TData extends RowData>(
  left: HeaderGroup<TData>[],
  center: HeaderGroup<TData>[],
  right: HeaderGroup<TData>[],
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
