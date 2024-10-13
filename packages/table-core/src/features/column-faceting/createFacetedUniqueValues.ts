import { getMemoOptions, memo } from '../../utils'
import { row_getUniqueValues } from '../../core/rows/Rows.utils'
import { column_getFacetedRowModel } from './ColumnFaceting.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'

export function createFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): (
  table: Table<TFeatures, TData>,
  columnId: string,
) => () => Map<any, number> {
  return (table, columnId) =>
    memo(
      () => [column_getFacetedRowModel(table.getColumn(columnId), table)()],
      (facetedRowModel) => {
        if (!facetedRowModel) return new Map()

        const facetedUniqueValues = new Map<any, number>()

        for (const row of facetedRowModel.flatRows) {
          const values = row_getUniqueValues(row, table, columnId)

          for (const value of values) {
            if (facetedUniqueValues.has(value)) {
              facetedUniqueValues.set(
                value,
                (facetedUniqueValues.get(value) ?? 0) + 1,
              )
            } else {
              facetedUniqueValues.set(value, 1)
            }
          }
        }

        return facetedUniqueValues
      },
      getMemoOptions(
        table.options,
        'debugTable',
        `getFacetedUniqueValues_${columnId}`,
      ),
    )
}
