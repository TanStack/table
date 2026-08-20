import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { getCommonTooltipProps } from '../../utils/style.utils'
import { useMRTContext } from '../../hooks/mrtTableHook'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { DragEventHandler } from 'react'

export interface MRT_GrabHandleButtonProps extends IconButtonProps {
  iconButtonProps?: IconButtonProps
  location?: 'column' | 'row'
  onDragEnd: DragEventHandler<HTMLButtonElement>
  onDragStart: DragEventHandler<HTMLButtonElement>
}

export const MRT_GrabHandleButton = ({
  location,
  ...rest
}: MRT_GrabHandleButtonProps) => {
  const table = useMRTContext()
  const {
    options: {
      icons: { DragHandleIcon },
      localization,
    },
  } = table

  return (
    <Tooltip
      {...getCommonTooltipProps('top')}
      title={rest?.title ?? localization.move}
    >
      <IconButton
        aria-label={rest.title ?? localization.move}
        disableRipple
        draggable="true"
        size="small"
        {...rest}
        onClick={(e) => {
          e.stopPropagation()
          rest?.onClick?.(e)
        }}
        sx={(theme) => ({
          '&:active': {
            cursor: 'grabbing',
          },
          '&:hover': {
            backgroundColor: 'transparent',
            opacity: 1,
          },
          cursor: 'grab',
          m: '0 -0.1rem',
          opacity: location === 'row' ? 1 : 0.5,
          p: '2px',
          transition: 'all 150ms ease-in-out',
          ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
        })}
        title={undefined}
      >
        <DragHandleIcon />
      </IconButton>
    </Tooltip>
  )
}
