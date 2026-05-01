import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_ToggleFullScreenButtonProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  table: MRT_TableInstance<TData>
}

export const MRT_ToggleFullScreenButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToggleFullScreenButtonProps<TData>) => {
  const {
    state,
    options: {
      icons: { FullscreenExitIcon, FullscreenIcon },
      localization,
    },
    setIsFullScreen,
  } = table
  const { isFullScreen } = state

  const [tooltipOpened, setTooltipOpened] = useState(false)

  const handleToggleFullScreen = () => {
    setTooltipOpened(false)
    setIsFullScreen(!isFullScreen)
  }

  return (
    <Tooltip
      open={tooltipOpened}
      title={rest?.title ?? localization.toggleFullScreen}
    >
      <IconButton
        aria-label={localization.toggleFullScreen}
        onBlur={() => setTooltipOpened(false)}
        onClick={handleToggleFullScreen}
        onFocus={() => setTooltipOpened(true)}
        onMouseEnter={() => setTooltipOpened(true)}
        onMouseLeave={() => setTooltipOpened(false)}
        {...rest}
        title={undefined}
      >
        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Tooltip>
  )
}
