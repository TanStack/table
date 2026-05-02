import { MRT_ToggleRowActionMenuButton } from '../../components/buttons/MRT_ToggleRowActionMenuButton'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'
import type {
  MRT_ColumnDef,
  MRT_RowData,
  MRT_StatefulTableOptions,
} from '../../types'

export const getMRT_RowActionsColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> => {
  return {
    Cell: ({ cell, row, staticRowIndex, table }) => (
      <MRT_ToggleRowActionMenuButton
        cell={cell}
        row={row}
        staticRowIndex={staticRowIndex}
        table={table}
      />
    ),
    ...defaultDisplayColumnProps({
      header: 'actions',
      id: 'mrt-row-actions',
      size: 70,
      tableOptions,
    }),
  }
}
