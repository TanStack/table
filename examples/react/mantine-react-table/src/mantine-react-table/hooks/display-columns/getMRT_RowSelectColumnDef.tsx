import { MRT_SelectCheckbox } from '../../components/inputs/MRT_SelectCheckbox'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'
import type {MRT_ColumnDef, MRT_RowData, MRT_StatefulTableOptions} from '../../types';

export const getMRT_RowSelectColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> | null => {
  const { enableMultiRowSelection, enableSelectAll } = tableOptions

  return {
    Cell: ({ renderedRowIndex, row, table }) => (
      <MRT_SelectCheckbox
        renderedRowIndex={renderedRowIndex}
        row={row}
        table={table}
      />
    ),
    grow: false,
    Header:
      enableSelectAll && enableMultiRowSelection
        ? ({ table }) => <MRT_SelectCheckbox table={table} />
        : undefined,
    ...defaultDisplayColumnProps({
      header: 'select',
      id: 'mrt-row-select',
      size: enableSelectAll ? 60 : 70,
      tableOptions,
    }),
  }
}
