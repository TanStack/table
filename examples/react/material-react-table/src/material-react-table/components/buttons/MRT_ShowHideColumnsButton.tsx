import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MRT_ShowHideColumnsMenu } from '../menus/MRT_ShowHideColumnsMenu'
import type { MouseEvent } from 'react'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { MRT_RowData, MRT_TableInstance } from '../../types'

export interface MRT_ShowHideColumnsButtonProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  table: MRT_TableInstance<TData>
}

export const MRT_ShowHideColumnsButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ShowHideColumnsButtonProps<TData>) => {
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
          table={table}
        />
      )}
    </>
  )
}
