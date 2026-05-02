import { useState } from 'react'
import { ActionIcon, Tooltip } from '@mantine/core'
import type { MouseEvent } from 'react'

import type { RowPinningPosition } from '@tanstack/react-table'

import type { ActionIconProps } from '@mantine/core'

import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types'

interface Props<TData extends MRT_RowData> extends ActionIconProps {
  pinningPosition: RowPinningPosition
  row: MRT_Row<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_RowPinButton = <TData extends MRT_RowData>({
  pinningPosition,
  row,
  table,
  ...rest
}: Props<TData>) => {
  const {
    options: {
      icons: { IconPinned, IconX },
      localization,
      rowPinningDisplayMode,
    },
  } = table

  const isPinned = row.getIsPinned()

  const [tooltipOpened, setTooltipOpened] = useState(false)

  const handleTogglePin = (event: MouseEvent<HTMLButtonElement>) => {
    setTooltipOpened(false)
    event.stopPropagation()
    row.pin(isPinned ? false : pinningPosition)
  }

  return (
    <Tooltip
      label={isPinned ? localization.unpin : localization.pin}
      openDelay={1000}
      opened={tooltipOpened}
    >
      <ActionIcon
        aria-label={localization.pin}
        color="gray"
        onClick={handleTogglePin}
        onMouseEnter={() => setTooltipOpened(true)}
        onMouseLeave={() => setTooltipOpened(false)}
        size="xs"
        style={{
          height: '24px',
          width: '24px',
        }}
        variant="subtle"
        {...rest}
      >
        {isPinned ? (
          <IconX />
        ) : (
          <IconPinned
            fontSize="small"
            style={{
              transform: `rotate(${
                rowPinningDisplayMode === 'sticky'
                  ? 135
                  : pinningPosition === 'top'
                    ? 180
                    : 0
              }deg)`,
            }}
          />
        )}
      </ActionIcon>
    </Tooltip>
  )
}
