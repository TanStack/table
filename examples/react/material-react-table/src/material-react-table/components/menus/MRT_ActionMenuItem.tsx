import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import { useMRTContext } from '../../hooks/mrtTableHook'
import type { ReactNode } from 'react'
import type { MenuItemProps } from '@mui/material/MenuItem'

export interface MRT_ActionMenuItemProps extends MenuItemProps {
  icon: ReactNode
  label: string
  onOpenSubMenu?: MenuItemProps['onClick'] | MenuItemProps['onMouseEnter']
}

export const MRT_ActionMenuItem = ({
  icon,
  label,
  onOpenSubMenu,
  ...rest
}: MRT_ActionMenuItemProps) => {
  const table = useMRTContext()
  const {
    options: {
      icons: { ArrowRightIcon },
    },
  } = table

  return (
    <MenuItem
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: '120px',
        my: 0,
        py: '6px',
      }}
      tabIndex={0}
      {...rest}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        {label}
      </Box>
      {onOpenSubMenu && (
        <IconButton
          onClick={onOpenSubMenu as any}
          onMouseEnter={onOpenSubMenu as any}
          size="small"
          sx={{ p: 0 }}
        >
          <ArrowRightIcon />
        </IconButton>
      )}
    </MenuItem>
  )
}
