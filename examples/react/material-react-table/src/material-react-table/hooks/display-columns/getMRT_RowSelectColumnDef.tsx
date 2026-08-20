import { MRT_SelectCheckbox } from '../../components/inputs/MRT_SelectCheckbox'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'
import type {
  MRT_ColumnDef,
  MRT_RowData,
  MRT_StatefulTableOptions,
} from '../../types'

export const getMRT_RowSelectColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> => {
  const { enableMultiRowSelection, enableSelectAll } = tableOptions

  return {
    Cell: ({ row, staticRowIndex }) => (
      <MRT_SelectCheckbox row={row} staticRowIndex={staticRowIndex} />
    ),
    Header:
      enableSelectAll && enableMultiRowSelection
        ? () => <MRT_SelectCheckbox />
        : undefined,
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'select',
      id: 'mrt-row-select',
      size: enableSelectAll ? 60 : 70,
      tableOptions,
    }),
  }
}
