import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { getCommonTooltipProps } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { MouseEvent } from 'react'
import type { RowPinningPosition } from '@tanstack/react-table'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_RowPinButtonProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  pinningPosition: RowPinningPosition
  row: MRT_Row<TData>
  table: MRT_TableInstance<TData>
}

export const MRT_RowPinButton = <TData extends MRT_RowData>({
  pinningPosition,
  row,
  table,
  ...rest
}: MRT_RowPinButtonProps<TData>) => {
  const {
    options: {
      icons: { CloseIcon, PushPinIcon },
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
      {...getCommonTooltipProps()}
      open={tooltipOpened}
      title={isPinned ? localization.unpin : localization.pin}
    >
      <IconButton
        aria-label={localization.pin}
        onBlur={() => setTooltipOpened(false)}
        onClick={handleTogglePin}
        onFocus={() => setTooltipOpened(true)}
        onMouseEnter={() => setTooltipOpened(true)}
        onMouseLeave={() => setTooltipOpened(false)}
        size="small"
        {...rest}
        sx={(theme) => ({
          height: '24px',
          width: '24px',
          ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
        })}
      >
        {isPinned ? (
          <CloseIcon />
        ) : (
          <PushPinIcon
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
      </IconButton>
    </Tooltip>
  )
}
