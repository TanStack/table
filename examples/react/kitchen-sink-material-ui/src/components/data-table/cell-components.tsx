import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import CodeIcon from '@mui/icons-material/Code'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GroupIcon from '@mui/icons-material/Group'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { Subscribe } from '@tanstack/react-table'
import type { Person } from '@/lib/make-data'
import { useCellContext, useTableContext } from '@/hooks/table'
import {
  EllipsisText,
  formatDate,
  toSentenceCase,
} from '@/components/data-table/shared'

function DepartmentIcon({
  department,
}: {
  department: Person['department']
}): React.ReactNode {
  const icons: Record<Person['department'], React.ReactElement> = {
    engineering: <CodeIcon fontSize="inherit" />,
    marketing: <SystemUpdateAltIcon fontSize="inherit" />,
    sales: <ShoppingCartIcon fontSize="inherit" />,
    hr: <GroupIcon fontSize="inherit" />,
    finance: <CreditCardIcon fontSize="inherit" />,
  }

  return icons[department]
}

function DepartmentChip({
  department,
}: {
  department: Person['department']
}): React.ReactNode {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        maxWidth: '100%',
        height: 24,
        minWidth: 0,
        alignItems: 'center',
        gap: 0.75,
        px: 1,
        borderRadius: 13,
        border: 1,
        borderColor: 'divider',
        fontSize: '0.8125rem',
      }}
    >
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          width: 16,
          height: 16,
          flex: '0 0 16px',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        <DepartmentIcon department={department} />
      </Box>
      <Box
        component="span"
        sx={{
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {toSentenceCase(department)}
      </Box>
    </Box>
  )
}

function StatusChip({ status }: { status: Person['status'] }): React.ReactNode {
  const color: Record<Person['status'], 'success' | 'error' | 'warning'> = {
    active: 'success',
    inactive: 'error',
    pending: 'warning',
  }

  return (
    <Chip
      icon={<CheckIcon fontSize="small" />}
      label={toSentenceCase(status)}
      color={color[status]}
      variant="outlined"
      size="small"
    />
  )
}

export function SelectCell(): React.ReactNode {
  const cell = useCellContext()
  const table = useTableContext()
  const row = cell.row

  return (
    <Subscribe source={table.atoms.rowSelection}>
      {() => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={(_, checked) => row.toggleSelected(checked)}
          slotProps={{ input: { 'aria-label': 'Select row' } }}
          size="small"
        />
      )}
    </Subscribe>
  )
}

export function TextCell(): React.ReactNode {
  const cell = useCellContext<string>()
  return <EllipsisText>{String(cell.getValue())}</EllipsisText>
}

export function AgeCell(): React.ReactNode {
  const cell = useCellContext<number>()
  return <Typography variant="body2">{String(cell.getValue())}</Typography>
}

export function StatusCell(): React.ReactNode {
  const cell = useCellContext<Person['status'] | undefined>()
  const status = cell.getValue()
  if (!status) return null
  return <StatusChip status={status} />
}

export function DepartmentCell(): React.ReactNode {
  const cell = useCellContext<Person['department'] | undefined>()
  const department = cell.getValue()
  if (!department) return null
  return <DepartmentChip department={department} />
}

export function DateCell(): React.ReactNode {
  const cell = useCellContext<string>()
  return <>{formatDate(cell.getValue())}</>
}

export function GroupedCell(): React.ReactNode {
  const cell = useCellContext()
  const table = useTableContext()
  const row = cell.row

  return (
    <Subscribe source={table.atoms.expanded}>
      {() => (
        <Button
          size="small"
          variant="text"
          startIcon={
            row.getIsExpanded() ? <ExpandLessIcon /> : <ExpandMoreIcon />
          }
          onClick={row.getToggleExpandedHandler()}
          disabled={!row.getCanExpand()}
          sx={{ pl: row.depth * 2 + 1 }}
        >
          <cell.FlexRender />
          <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
            ({row.subRows.length})
          </Typography>
        </Button>
      )}
    </Subscribe>
  )
}

export function ActionsCell(): React.ReactNode {
  const cell = useCellContext()
  const person = cell.row.original as Person
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  return (
    <>
      <IconButton
        size="small"
        aria-label="Open row actions"
        aria-controls={open ? `row-actions-${person.id}` : undefined}
        aria-haspopup="menu"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        id={`row-actions-${person.id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            void navigator.clipboard.writeText(person.id)
            setAnchorEl(null)
          }}
        >
          <ListItemText>Copy ID</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchorEl(null)}>View details</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>View profile</MenuItem>
      </Menu>
    </>
  )
}

export function AgeAggregatedCell(): React.ReactNode {
  const cell = useCellContext<number>()
  return (
    <Typography variant="body2" color="text.secondary">
      Avg: {Math.round(Number(cell.getValue()) * 10) / 10}
    </Typography>
  )
}

export function JoinDateAggregatedCell(): React.ReactNode {
  const cell = useCellContext<string>()
  const earliest = cell.getValue()
  return (
    <Typography variant="body2" color="text.secondary">
      Earliest: {earliest ? formatDate(earliest) : '—'}
    </Typography>
  )
}
