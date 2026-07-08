import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useMRTContext } from '../../hooks/mrtTableHook'
import type { IconButtonProps } from '@mui/material/IconButton'

export interface MRT_ToggleFullScreenButtonProps extends IconButtonProps {}

export const MRT_ToggleFullScreenButton = ({
  ...rest
}: MRT_ToggleFullScreenButtonProps) => {
  const table = useMRTContext()
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
