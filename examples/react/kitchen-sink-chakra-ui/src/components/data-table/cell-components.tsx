'use client'

import { Badge, Box, Button, IconButton, Menu, Text } from '@chakra-ui/react'
import {
  IconBriefcase,
  IconBuildingStore,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconCode,
  IconCreditCard,
  IconDotsVertical,
  IconUsersGroup,
} from '@tabler/icons-react'
import type { Person } from '@/lib/make-data'
import { useCellContext, useTableContext } from '@/hooks/table'
import {
  CheckboxField,
  DropdownMenu,
  DropdownMenuItem,
  EllipsisText,
  formatDate,
  toSentenceCase,
} from '@/components/data-table/shared'

// ---------------------------------------------------------------------------
// Department helpers
// ---------------------------------------------------------------------------

function DepartmentIcon({ department }: { department: Person['department'] }) {
  const icons: Record<Person['department'], React.ReactElement> = {
    engineering: <IconCode size={16} />,
    marketing: <IconBriefcase size={16} />,
    sales: <IconBuildingStore size={16} />,
    hr: <IconUsersGroup size={16} />,
    finance: <IconCreditCard size={16} />,
  }

  return icons[department]
}

function DepartmentPill({ department }: { department: Person['department'] }) {
  return (
    <Box
      as="span"
      style={{
        display: 'inline-flex',
        maxWidth: '100%',
        height: 24,
        minWidth: 0,
        alignItems: 'center',
        gap: 6,
        paddingInline: 10,
        borderRadius: 999,
        border: '1px solid var(--chakra-colors-border)',
        fontSize: 'var(--chakra-font-sizes-sm)',
      }}
    >
      <Box
        as="span"
        style={{
          display: 'inline-flex',
          width: 16,
          height: 16,
          flex: '0 0 16px',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <DepartmentIcon department={department} />
      </Box>
      <Box
        as="span"
        style={{
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

// ---------------------------------------------------------------------------
// Status Badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: Person['status'] }) {
  const colorPalette: Record<Person['status'], string> = {
    active: 'green',
    inactive: 'red',
    pending: 'yellow',
  }

  return (
    <Badge colorPalette={colorPalette[status]} variant="subtle">
      <IconCheck size={14} />
      {toSentenceCase(status)}
    </Badge>
  )
}

// ---------------------------------------------------------------------------
// Row Actions
// ---------------------------------------------------------------------------

function RowActions({ person }: { person: Person }) {
  return (
    <DropdownMenu
      trigger={
        <IconButton variant="subtle" aria-label="Open row actions">
          <IconDotsVertical size={18} />
        </IconButton>
      }
    >
      <DropdownMenuItem
        value="copy-id"
        onSelect={() => {
          void navigator.clipboard.writeText(person.id)
        }}
      >
        Copy ID
      </DropdownMenuItem>
      <Menu.Separator />
      <DropdownMenuItem value="view-details">View details</DropdownMenuItem>
      <DropdownMenuItem value="view-profile">View profile</DropdownMenuItem>
    </DropdownMenu>
  )
}

// ---------------------------------------------------------------------------
// Cell components (registered via createTableHook)
// ---------------------------------------------------------------------------

export function SelectCell(): React.ReactNode {
  const cell = useCellContext()
  const table = useTableContext()
  const row = cell.row

  return (
    <table.Subscribe source={table.atoms.rowSelection}>
      {() => (
        <CheckboxField
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(checked)}
          aria-label="Select row"
        />
      )}
    </table.Subscribe>
  )
}

export function TextCell(): React.ReactNode {
  const cell = useCellContext<string>()
  return <EllipsisText>{String(cell.getValue())}</EllipsisText>
}

export function AgeCell(): React.ReactNode {
  const cell = useCellContext<number>()
  return <Text fontSize="sm">{String(cell.getValue())}</Text>
}

export function StatusCell(): React.ReactNode {
  const cell = useCellContext<Person['status'] | undefined>()
  const status = cell.getValue()
  if (!status) return null
  return <StatusBadge status={status} />
}

export function DepartmentCell(): React.ReactNode {
  const cell = useCellContext<Person['department'] | undefined>()
  const department = cell.getValue()
  if (!department) return null
  return <DepartmentPill department={department} />
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
    <table.Subscribe source={table.atoms.expanded}>
      {() => (
        <Button
          size="xs"
          variant="subtle"
          onClick={row.getToggleExpandedHandler()}
          disabled={!row.getCanExpand()}
          style={{
            paddingLeft: `calc(${row.depth} * 1.5rem + 0.5rem)`,
          }}
        >
          {row.getIsExpanded() ? (
            <IconChevronDown size={16} />
          ) : (
            <IconChevronRight size={16} />
          )}
          <cell.FlexRender />
          <Text as="span" color="fg.muted" ml="4">
            ({row.subRows.length})
          </Text>
        </Button>
      )}
    </table.Subscribe>
  )
}

export function ActionsCell(): React.ReactNode {
  const cell = useCellContext()
  const person = cell.row.original as Person
  return <RowActions person={person} />
}

// ---------------------------------------------------------------------------
// Aggregated cell components (used directly in column defs, not registered)
// ---------------------------------------------------------------------------

export function AgeAggregatedCell(): React.ReactNode {
  const cell = useCellContext<number>()
  return (
    <Text fontSize="sm" color="fg.muted">
      Avg: {Math.round(Number(cell.getValue()) * 10) / 10}
    </Text>
  )
}

export function JoinDateAggregatedCell(): React.ReactNode {
  const cell = useCellContext<string>()
  const earliest = cell.getValue()
  return (
    <Text fontSize="sm" color="fg.muted">
      Earliest: {earliest ? formatDate(earliest) : '-'}
    </Text>
  )
}
