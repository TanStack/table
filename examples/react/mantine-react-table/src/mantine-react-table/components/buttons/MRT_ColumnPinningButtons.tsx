import clsx from 'clsx'

import { ActionIcon, Flex, Tooltip } from '@mantine/core'

import classes from './MRT_ColumnPinningButtons.module.css'
import type { MRT_Column, MRT_RowData, MRT_TableInstance } from '../../types'

interface Props<TData extends MRT_RowData> {
  column: MRT_Column<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_ColumnPinningButtons = <TData extends MRT_RowData>({
  column,
  table,
}: Props<TData>) => {
  const {
    options: {
      icons: { IconPinned, IconPinnedOff },
      localization,
    },
  } = table
  return (
    <Flex className={clsx('mrt-column-pinning-buttons', classes.root)}>
      {column.getIsPinned() ? (
        <Tooltip label={localization.unpin} withinPortal>
          <ActionIcon
            color="gray"
            onClick={() => column.pin(false)}
            size="md"
            variant="subtle"
          >
            <IconPinnedOff />
          </ActionIcon>
        </Tooltip>
      ) : (
        <>
          <Tooltip label={localization.pinToLeft} withinPortal>
            <ActionIcon
              color="gray"
              onClick={() => column.pin('left')}
              size="md"
              variant="subtle"
            >
              <IconPinned className={classes.left} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={localization.pinToRight} withinPortal>
            <ActionIcon
              color="gray"
              onClick={() => column.pin('right')}
              size="md"
              variant="subtle"
            >
              <IconPinned className={classes.right} />
            </ActionIcon>
          </Tooltip>
        </>
      )}
    </Flex>
  )
}
