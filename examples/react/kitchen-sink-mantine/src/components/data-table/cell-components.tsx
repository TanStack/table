'use client'

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Menu,
  Text,
} from '@mantine/core'
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
import { Subscribe } from '@tanstack/react-table'
import type { Person } from '@/lib/make-data'
import { useCellContext, useTableContext } from '@/hooks/table'
import { formatDate, toSentenceCase } from '@/components/data-table/shared'

export function SelectCell(): React.ReactNode {
  const cell = useCellContext()
  const table = useTableContext()
  const row = cell.row

  return (
    <Subscribe source={table.atoms.rowSelection}>
      {() => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={(event) => row.toggleSelected(event.currentTarget.checked)}
          aria-label="Select row"
        />
      )}
    </Subscribe>
  )
}

export function TextCell(): React.ReactNode {
  const cell = useCellContext<string>()
  return (
    <Box
      component="span"
      style={{
        display: 'block',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {String(cell.getValue())}
    </Box>
  )
}

export function AgeCell(): React.ReactNode {
  const cell = useCellContext<number>()
  return <Text size="sm">{String(cell.getValue())}</Text>
}

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
      component="span"
      style={{
        display: 'inline-flex',
        maxWidth: '100%',
        height: 24,
        minWidth: 0,
        alignItems: 'center',
        gap: 6,
        paddingInline: 10,
        borderRadius: 999,
        border: '1px solid var(--mantine-color-default-border)',
        fontSize: 'var(--mantine-font-size-sm)',
      }}
    >
      <Box
        component="span"
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
        component="span"
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

function StatusBadge({ status }: { status: Person['status'] }) {
  const color: Record<Person['status'], string> = {
    active: 'green',
    inactive: 'red',
    pending: 'yellow',
  }

  return (
    <Badge
      color={color[status]}
      variant="light"
      leftSection={<IconCheck size={14} />}
    >
      {toSentenceCase(status)}
    </Badge>
  )
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
    <Subscribe source={table.atoms.expanded}>
      {() => (
        <Button
          size="xs"
          variant="subtle"
          leftSection={
            row.getIsExpanded() ? (
              <IconChevronDown size={16} />
            ) : (
              <IconChevronRight size={16} />
            )
          }
          onClick={row.getToggleExpandedHandler()}
          disabled={!row.getCanExpand()}
          style={{
            paddingLeft: `calc(${row.depth} * 1.5rem + 0.5rem)`,
          }}
        >
          <cell.FlexRender />
          <Text span c="dimmed" ml={4}>
            ({row.subRows.length})
          </Text>
        </Button>
      )}
    </Subscribe>
  )
}

export function ActionsCell(): React.ReactNode {
  const cell = useCellContext()
  const person = cell.row.original as Person

  return (
    <Menu shadow="md" width={180}>
      <Menu.Target>
        <ActionIcon variant="subtle" aria-label="Open row actions">
          <IconDotsVertical size={18} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => {
            void navigator.clipboard.writeText(person.id)
          }}
        >
          Copy ID
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>View details</Menu.Item>
        <Menu.Item>View profile</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export function AgeAggregatedCell(): React.ReactNode {
  const cell = useCellContext<number>()
  return (
    <Text size="sm" c="dimmed">
      Avg: {Math.round(Number(cell.getValue()) * 10) / 10}
    </Text>
  )
}

export function JoinDateAggregatedCell(): React.ReactNode {
  const cell = useCellContext<string>()
  const earliest = cell.getValue()
  return (
    <Text size="sm" c="dimmed">
      Earliest: {earliest ? formatDate(earliest) : '-'}
    </Text>
  )
}
