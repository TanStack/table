import { MRT_TableBodyRowGrabHandle } from '../../components/body/MRT_TableBodyRowGrabHandle'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'
import type {RefObject} from 'react';

import type {MRT_ColumnDef, MRT_RowData, MRT_StatefulTableOptions} from '../../types';

export const getMRT_RowDragColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> | null => {
  return {
    Cell: ({ row, rowRef, table }) => (
      <MRT_TableBodyRowGrabHandle
        row={row}
        rowRef={rowRef as RefObject<HTMLTableRowElement>}
        table={table}
      />
    ),
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'move',
      id: 'mrt-row-drag',
      size: 60,
      tableOptions,
    }),
  }
}
