import * as React from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TableSortLabel from '@mui/material/TableSortLabel'
import Typography from '@mui/material/Typography'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import GroupIcon from '@mui/icons-material/Group'
import PushPinIcon from '@mui/icons-material/PushPin'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Subscribe } from '@tanstack/react-table'
import { useHeaderContext, useTableContext } from '@/hooks/table'

export function ColumnHeader({ title }: { title?: string }): React.ReactNode {
  const header = useHeaderContext()
  const table = useTableContext()
  const column = header.column

  const displayTitle = column.columnDef.meta?.label ?? title ?? column.id

  const canSort = column.getCanSort()
  const canHide = column.getCanHide()
  const canPin = column.getCanPin()
  const canGroup = column.getCanGroup()

  if (!canSort && !canHide && !canPin && !canGroup) {
    return <Typography variant="subtitle2">{displayTitle}</Typography>
  }

  return (
    <Subscribe
      source={table.store}
      selector={(s) => ({
        sorting: s.sorting,
        grouping: s.grouping,
        columnPinning: s.columnPinning,
      })}
    >
      {() => {
        const sorted = canSort ? column.getIsSorted() : false
        const direction =
          sorted === 'asc' ? 'asc' : sorted === 'desc' ? 'desc' : undefined
        const isSorted = !!direction
        const pinned = canPin ? column.getIsPinned() : false
        const grouped = canGroup ? column.getIsGrouped() : false

        return (
          <ColumnHeaderMenu
            displayTitle={displayTitle}
            canSort={canSort}
            canHide={canHide}
            canPin={canPin}
            canGroup={canGroup}
            direction={direction}
            isSorted={isSorted}
            pinned={pinned}
            grouped={grouped}
            onToggleSorting={column.getToggleSortingHandler()}
            onSortAsc={() => column.toggleSorting(false)}
            onSortDesc={() => column.toggleSorting(true)}
            onToggleGrouping={column.getToggleGroupingHandler()}
            onPinLeft={() => column.pin('left')}
            onPinRight={() => column.pin('right')}
            onUnpin={() => column.pin(false)}
            onHide={() => column.toggleVisibility(false)}
          />
        )
      }}
    </Subscribe>
  )
}

function ColumnHeaderMenu({
  displayTitle,
  canSort,
  canHide,
  canPin,
  canGroup,
  direction,
  isSorted,
  pinned,
  grouped,
  onToggleSorting,
  onSortAsc,
  onSortDesc,
  onToggleGrouping,
  onPinLeft,
  onPinRight,
  onUnpin,
  onHide,
}: {
  displayTitle: string
  canSort: boolean
  canHide: boolean
  canPin: boolean
  canGroup: boolean
  direction: 'asc' | 'desc' | undefined
  isSorted: boolean
  pinned: false | 'left' | 'right'
  grouped: boolean
  onToggleSorting: ((event: unknown) => void) | undefined
  onSortAsc: () => void
  onSortDesc: () => void
  onToggleGrouping: () => void
  onPinLeft: () => void
  onPinRight: () => void
  onUnpin: () => void
  onHide: () => void
}): React.ReactNode {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      {canSort ? (
        <TableSortLabel
          active={isSorted}
          direction={direction}
          IconComponent={ArrowDownwardIcon}
          onClick={onToggleSorting}
          sx={{
            '& .MuiTableSortLabel-icon': {
              opacity: isSorted ? 1 : 0,
              transition: 'opacity 120ms ease',
            },
            '&:hover .MuiTableSortLabel-icon, &:focus-visible .MuiTableSortLabel-icon':
              {
                opacity: 1,
              },
          }}
        >
          {displayTitle}
        </TableSortLabel>
      ) : (
        <Typography variant="subtitle2">{displayTitle}</Typography>
      )}
      <IconButton
        size="small"
        aria-label={`Open ${displayTitle} column menu`}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <ArrowDropDownIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {canSort && (
          <Box>
            <MenuItem
              onClick={() => {
                onSortAsc()
                setAnchorEl(null)
              }}
            >
              <ListItemIcon>
                <ArrowUpwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Asc</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                onSortDesc()
                setAnchorEl(null)
              }}
            >
              <ListItemIcon>
                <ArrowDownwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Desc</ListItemText>
            </MenuItem>
          </Box>
        )}
        {canGroup && (
          <MenuItem
            onClick={() => {
              onToggleGrouping()
              setAnchorEl(null)
            }}
          >
            <ListItemIcon>
              <GroupIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{grouped ? 'Ungroup' : 'Group by'}</ListItemText>
          </MenuItem>
        )}
        {canPin && (
          <Box>
            <Divider />
            <MenuItem
              disabled={pinned === 'left'}
              onClick={() => {
                onPinLeft()
                setAnchorEl(null)
              }}
            >
              <ListItemIcon>
                <PushPinIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Pin left</ListItemText>
            </MenuItem>
            <MenuItem
              disabled={pinned === 'right'}
              onClick={() => {
                onPinRight()
                setAnchorEl(null)
              }}
            >
              <ListItemIcon>
                <PushPinIcon fontSize="small" sx={{ rotate: '180deg' }} />
              </ListItemIcon>
              <ListItemText>Pin right</ListItemText>
            </MenuItem>
            {pinned ? (
              <MenuItem
                onClick={() => {
                  onUnpin()
                  setAnchorEl(null)
                }}
              >
                <ListItemIcon>
                  <PushPinIcon fontSize="small" color="disabled" />
                </ListItemIcon>
                <ListItemText>Unpin</ListItemText>
              </MenuItem>
            ) : null}
          </Box>
        )}
        {canHide && (
          <Box>
            <Divider />
            <MenuItem
              onClick={() => {
                onHide()
                setAnchorEl(null)
              }}
            >
              <ListItemIcon>
                <VisibilityOffIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Hide</ListItemText>
            </MenuItem>
          </Box>
        )}
      </Menu>
    </Stack>
  )
}
