import type { Column, Header, RowData, Table } from '../../types'
import type { Header_CoreProperties } from './Headers.types'

export function _createHeader<TData extends RowData, TValue>(
  table: Table<TData>,
  column: Column<TData, TValue>,
  options: {
    id?: string
    isPlaceholder?: boolean
    placeholderId?: string
    index: number
    depth: number
  },
): Header<TData, TValue> {
  const header: Header_CoreProperties<TData, TValue> = {
    colSpan: 0,
    column,
    depth: options.depth,
    headerGroup: null,
    id: options.id ?? column.id,
    index: options.index,
    isPlaceholder: !!options.isPlaceholder,
    placeholderId: options.placeholderId,
    rowSpan: 0,
    subHeaders: [],
  }

  for (const feature of Object.values(table._features)) {
    feature?._createHeader?.(header as Header<TData, TValue>, table)
  }

  return header as Header<TData, TValue>
}
