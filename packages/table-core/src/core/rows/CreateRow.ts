import { RowData, Row, Table } from '../../types'
import { _createCell } from '../cells/Cells'
import { Row_Core } from './Rows.types'

export const _createRow = <TData extends RowData>(
  table: Table<TData>,
  id: string,
  original: TData,
  rowIndex: number,
  depth: number,
  subRows?: Row<TData>[],
  parentId?: string
): Row<TData> => {
  const row = {
    _uniqueValuesCache: {},
    _valuesCache: {},
    depth,
    id,
    index: rowIndex,
    original,
    parentId,
    subRows: subRows ?? [],
  } as Row_Core<TData>

  for (let i = 0; i < table._features.length; i++) {
    const feature = table._features[i]
    feature?._createRow?.(row as Row<TData>, table)
  }

  return row as Row<TData>
}
