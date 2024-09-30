import type { Fns } from '../../types/Fns'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Row_CoreProperties } from './Rows.types'

export const constructRow = <
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  table: Table<TFeatures, TFns, TData>,
  id: string,
  original: TData,
  rowIndex: number,
  depth: number,
  subRows?: Array<Row<TFeatures, TFns, TData>>,
  parentId?: string,
): Row<TFeatures, TFns, TData> => {
  const row: Row_CoreProperties<TFeatures, TFns, TData> = {
    _uniqueValuesCache: {},
    _valuesCache: {},
    depth,
    id,
    index: rowIndex,
    original,
    parentId,
    subRows: subRows ?? [],
  }

  for (const feature of Object.values(table._features)) {
    feature?.constructRow?.(row as Row<TFeatures, TFns, TData>, table)
  }

  return row as Row<TFeatures, TFns, TData>
}
