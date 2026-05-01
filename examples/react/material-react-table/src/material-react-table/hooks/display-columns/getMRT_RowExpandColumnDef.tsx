import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import { MRT_ExpandAllButton } from '../../components/buttons/MRT_ExpandAllButton'
import { MRT_ExpandButton } from '../../components/buttons/MRT_ExpandButton'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'
import { getCommonTooltipProps } from '../../utils/style.utils'
import type {
  MRT_ColumnDef,
  MRT_RowData,
  MRT_StatefulTableOptions,
} from '../../types'
import type { ReactNode } from 'react'

export const getMRT_RowExpandColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> => {
  const {
    defaultColumn,
    enableExpandAll,
    groupedColumnMode,
    positionExpandColumn,
    renderDetailPanel,
    state: { grouping },
  } = tableOptions

  const alignProps =
    positionExpandColumn === 'last'
      ? ({
          align: 'right',
        } as const)
      : undefined

  return {
    Cell: ({ cell, column, row, staticRowIndex, table }) => {
      const expandButtonProps = { row, staticRowIndex, table }
      const subRowsLength = row.subRows?.length
      if (groupedColumnMode === 'remove' && row.groupingColumnId) {
        return (
          <Stack
            sx={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: '0.25rem',
            }}
          >
            <MRT_ExpandButton {...expandButtonProps} />
            <Tooltip
              {...getCommonTooltipProps('right')}
              title={table.getColumn(row.groupingColumnId).columnDef.header}
            >
              <span>{row.groupingValue as ReactNode}</span>
            </Tooltip>
            {!!subRowsLength && <span>({subRowsLength})</span>}
          </Stack>
        )
      } else {
        return (
          <>
            <MRT_ExpandButton {...expandButtonProps} />
            {column.columnDef.GroupedCell?.({ cell, column, row, table })}
          </>
        )
      }
    },
    Header: enableExpandAll
      ? ({ table }) => {
          return (
            <>
              <MRT_ExpandAllButton table={table} />
              {groupedColumnMode === 'remove' &&
                grouping
                  ?.map(
                    (groupedColumnId) =>
                      table.getColumn(groupedColumnId).columnDef.header,
                  )
                  ?.join(', ')}
            </>
          )
        }
      : undefined,
    muiTableBodyCellProps: alignProps,
    muiTableHeadCellProps: alignProps,
    ...defaultDisplayColumnProps({
      header: 'expand',
      id: 'mrt-row-expand',
      size:
        groupedColumnMode === 'remove'
          ? (defaultColumn?.size ?? 180)
          : renderDetailPanel
            ? enableExpandAll
              ? 60
              : 70
            : 100,
      tableOptions,
    }),
  }
}
