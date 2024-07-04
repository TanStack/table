import { RowData, Row, Table } from '../../types'
import { _createCell } from '../cells/CreateCell'
import { Row_CoreProperties } from './Rows.types'

export const _createRow = <TData extends RowData>(
  table: Table<TData>,
  id: string,
  original: TData,
  rowIndex: number,
  depth: number,
  subRows?: Row<TData>[],
  parentId?: string
): Row<TData> => {
  const row: Row_CoreProperties<TData> = {
    _uniqueValuesCache: {},
    _valuesCache: {},
    depth,
    id,
    index: rowIndex,
    original,
    parentId,
    subRows: subRows ?? [],
  }

  for (let i = 0; i < table._features.length; i++) {
    const feature = table._features[i]
    feature?._createRow?.(row as Row<TData>, table)
  }

  return row as Row<TData>
}
