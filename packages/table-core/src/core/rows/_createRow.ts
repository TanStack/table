import type { Row, RowData, Table } from '../../types'
import type { Row_CoreProperties } from './Rows.types'

export const _createRow = <TData extends RowData>(
  table: Table<TData>,
  id: string,
  original: TData,
  rowIndex: number,
  depth: number,
  subRows?: Array<Row<TData>>,
  parentId?: string,
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

  for (const feature of table._features) {
    feature._createRow?.(row as Row<TData>, table)
  }

  return row as Row<TData>
}
