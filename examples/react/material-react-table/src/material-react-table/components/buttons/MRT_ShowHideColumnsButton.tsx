import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MRT_ShowHideColumnsMenu } from '../menus/MRT_ShowHideColumnsMenu'
import { useMRTContext } from '../../hooks/mrtTableHook'
import type { MouseEvent } from 'react'
import type { IconButtonProps } from '@mui/material/IconButton'

export interface MRT_ShowHideColumnsButtonProps extends IconButtonProps {}

export const MRT_ShowHideColumnsButton = ({
  ...rest
}: MRT_ShowHideColumnsButtonProps) => {
  const table = useMRTContext()
  const {
    options: {
      icons: { ViewColumnIcon },
      localization,
    },
  } = table

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <>
      <Tooltip title={rest?.title ?? localization.showHideColumns}>
        <IconButton
          aria-label={localization.showHideColumns}
          onClick={handleClick}
          {...rest}
          title={undefined}
        >
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>
      {anchorEl && (
        <MRT_ShowHideColumnsMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      )}
    </>
  )
}
