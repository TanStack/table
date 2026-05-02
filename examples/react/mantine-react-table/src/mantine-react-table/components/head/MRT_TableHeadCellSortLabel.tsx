import clsx from 'clsx'

import {
  ActionIcon,
  
  Indicator,
  Tooltip
} from '@mantine/core'
import { dataVariable } from '../../utils/style.utils'
import classes from './MRT_TableHeadCellSortLabel.module.css'
import type {ActionIconProps} from '@mantine/core';


import type { MRT_Header, MRT_RowData, MRT_TableInstance } from '../../types'

interface Props<TData extends MRT_RowData> extends ActionIconProps {
  header: MRT_Header<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_TableHeadCellSortLabel = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: Props<TData>) => {
  const {
    state,
    options: {
      icons: { IconArrowsSort, IconSortAscending, IconSortDescending },
      localization,
    },
  } = table
  const column = header.column
  const { columnDef } = column
  const { sorting } = state
  const sorted = column.getIsSorted()
  const sortIndex = column.getSortIndex()

  const sortTooltip = sorted
    ? sorted === 'desc'
      ? localization.sortedByColumnDesc.replace('{column}', columnDef.header)
      : localization.sortedByColumnAsc.replace('{column}', columnDef.header)
    : column.getNextSortingOrder() === 'desc'
      ? localization.sortByColumnDesc.replace('{column}', columnDef.header)
      : localization.sortByColumnAsc.replace('{column}', columnDef.header)

  const SortActionButton = (
    <ActionIcon
      aria-label={sortTooltip}
      {...dataVariable('sorted', sorted)}
      {...rest}
      className={clsx(
        'mrt-table-head-sort-button',
        classes['sort-icon'],
        rest.className,
      )}
    >
      {sorted === 'desc' ? (
        <IconSortDescending size="100%" />
      ) : sorted === 'asc' ? (
        <IconSortAscending size="100%" />
      ) : (
        <IconArrowsSort size="100%" />
      )}
    </ActionIcon>
  )

  return (
    <Tooltip label={sortTooltip} openDelay={1000} withinPortal>
      {sorting.length < 2 || sortIndex === -1 ? (
        SortActionButton
      ) : (
        <Indicator
          classNames={{
            root: clsx(
              'mrt-table-head-multi-sort-indicator',
              classes['multi-sort-indicator'],
            ),
          }}
          inline
          label={sortIndex + 1}
          offset={4}
        >
          {SortActionButton}
        </Indicator>
      )}
    </Tooltip>
  )
}
