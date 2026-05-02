import { MRT_TableBodyRowPinButton } from '../../components/body/MRT_TableBodyRowPinButton'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'
import type {MRT_ColumnDef, MRT_RowData, MRT_StatefulTableOptions} from '../../types';

export const getMRT_RowPinningColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> | null => {
  return {
    Cell: ({ row, table }) => (
      <MRT_TableBodyRowPinButton row={row} table={table} />
    ),
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'pin',
      id: 'mrt-row-pin',
      size: 60,
      tableOptions,
    }),
  }
}
