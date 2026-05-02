import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'
import type {
  MRT_ColumnDef,
  MRT_RowData,
  MRT_StatefulTableOptions,
} from '../../types'

export const getMRT_RowNumbersColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> | null => {
  const { localization, rowNumberDisplayMode } = tableOptions
  const {
    pagination: { pageIndex, pageSize },
  } = tableOptions.state

  return {
    Cell: ({ renderedRowIndex = 0, row }) =>
      ((rowNumberDisplayMode === 'static'
        ? renderedRowIndex + pageSize * pageIndex
        : row.index) ?? 0) + 1,
    grow: false,
    Header: () => localization.rowNumber,
    ...defaultDisplayColumnProps({
      header: 'rowNumbers',
      id: 'mrt-row-numbers',
      size: 50,
      tableOptions,
    }),
  }
}
