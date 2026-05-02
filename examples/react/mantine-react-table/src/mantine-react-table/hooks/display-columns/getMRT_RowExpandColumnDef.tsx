
import { Flex, Tooltip } from '@mantine/core'

import { MRT_ExpandAllButton } from '../../components/buttons/MRT_ExpandAllButton'
import { MRT_ExpandButton } from '../../components/buttons/MRT_ExpandButton'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'
import type {MRT_ColumnDef, MRT_RowData, MRT_StatefulTableOptions} from '../../types';
import type {ReactNode} from 'react';

export const getMRT_RowExpandColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> | null => {
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
    Cell: ({ cell, column, row, table }) => {
      const expandButtonProps = { row, table }
      const subRowsLength = row.subRows?.length
      if (tableOptions.groupedColumnMode === 'remove' && row.groupingColumnId) {
        return (
          <Flex align="center" gap="0.25rem">
            <MRT_ExpandButton {...expandButtonProps} />
            <Tooltip
              label={table.getColumn(row.groupingColumnId).columnDef.header}
              openDelay={1000}
              position="right"
            >
              <span>{row.groupingValue as ReactNode}</span>
            </Tooltip>
            {!!subRowsLength && <span>({subRowsLength})</span>}
          </Flex>
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
            <Flex align="center">
              <MRT_ExpandAllButton table={table} />
              {groupedColumnMode === 'remove' &&
                grouping
                  ?.map(
                    (groupedColumnId) =>
                      table.getColumn(groupedColumnId).columnDef.header,
                  )
                  ?.join(', ')}
            </Flex>
          )
        }
      : undefined,
    mantineTableBodyCellProps: alignProps,
    mantineTableHeadCellProps: alignProps,
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
