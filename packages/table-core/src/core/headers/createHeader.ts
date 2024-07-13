import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column } from '../../types/Column'
import type { Header_CoreProperties } from './Headers.types'

export function _createHeader<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  table: Table<TFeatures, TData>,
  column: Column<TFeatures, TData, TValue>,
  options: {
    id?: string
    isPlaceholder?: boolean
    placeholderId?: string
    index: number
    depth: number
  },
): Header<TFeatures, TData, TValue> {
  const header: Header_CoreProperties<TFeatures, TData, TValue> = {
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
    feature?._createHeader?.(header as Header<TFeatures, TData, TValue>, table)
  }

  return header as Header<TFeatures, TData, TValue>
}
