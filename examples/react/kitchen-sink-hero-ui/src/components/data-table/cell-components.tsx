'use client'

import { Button, Checkbox, Chip, Dropdown, ProgressBar } from '@heroui/react'
import type { Person } from '@/lib/make-data'
import { useCellContext, useTableContext } from '@/hooks/table'
import { formatDate, toSentenceCase } from '@/components/data-table/shared'

function EllipsisText({ children }: { children: React.ReactNode }) {
  return <span className="block min-w-0 truncate">{children}</span>
}

export function SelectCell(): React.ReactNode {
  const cell = useCellContext()
  const table = useTableContext()
  const row = cell.row

  return (
    <table.Subscribe selector={(s) => s.rowSelection}>
      {() => (
        <Checkbox
          slot={null}
          isSelected={row.getIsSelected()}
          onChange={(selected: boolean) => row.toggleSelected(selected)}
          aria-label="Select row"
        >
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
          </Checkbox.Content>
        </Checkbox>
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
  return <span className="text-sm">{String(cell.getValue())}</span>
}

export function StatusCell(): React.ReactNode {
  const cell = useCellContext<Person['status'] | undefined>()
  const status = cell.getValue()
  if (!status) return null

  const color: Record<Person['status'], 'success' | 'danger' | 'warning'> = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning',
  }

  return (
    <Chip color={color[status]} size="sm" variant="soft">
      {toSentenceCase(status)}
    </Chip>
  )
}

export function DepartmentCell(): React.ReactNode {
  const cell = useCellContext<Person['department'] | undefined>()
  const department = cell.getValue()
  if (!department) return null

  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border px-2.5 py-1 text-sm">
      <span className="font-mono text-xs text-muted">
        {department.slice(0, 2).toUpperCase()}
      </span>
      <span className="truncate">{toSentenceCase(department)}</span>
    </span>
  )
}

export function DateCell(): React.ReactNode {
  const cell = useCellContext<string>()
  return <>{formatDate(cell.getValue())}</>
}

export function ProgressCell(): React.ReactNode {
  const cell = useCellContext<number>()
  const value = Math.min(100, Math.max(0, Number(cell.getValue())))
  return (
    <ProgressBar value={value} aria-label="Profile progress">
      <ProgressBar.Track>
        <ProgressBar.Fill />
      </ProgressBar.Track>
    </ProgressBar>
  )
}

export function GroupedCell(): React.ReactNode {
  const cell = useCellContext()
  const table = useTableContext()
  const row = cell.row

  return (
    <table.Subscribe selector={(s) => s.expanded}>
      {() => (
        <Button
          size="sm"
          variant="ghost"
          onPress={row.getToggleExpandedHandler()}
          isDisabled={!row.getCanExpand()}
          style={{
            paddingLeft: `calc(${row.depth} * 1.5rem + 0.5rem)`,
          }}
        >
          {row.getIsExpanded() ? '▾' : '▸'}
          <cell.FlexRender />
          <span className="text-muted">({row.subRows.length})</span>
        </Button>
      )}
    </table.Subscribe>
  )
}

export function ActionsCell(): React.ReactNode {
  const cell = useCellContext()
  const person = cell.row.original as Person

  return (
    <Dropdown>
      <Dropdown.Trigger aria-label="Open row actions">{'•••'}</Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Item
            id="copy"
            onAction={() => {
              void navigator.clipboard.writeText(person.id)
            }}
          >
            Copy ID
          </Dropdown.Item>
          <Dropdown.Item id="details">View details</Dropdown.Item>
          <Dropdown.Item id="profile">View profile</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}

export function AgeAggregatedCell(): React.ReactNode {
  const cell = useCellContext<number>()
  return (
    <span className="text-sm text-muted">
      Avg: {Math.round(Number(cell.getValue()) * 10) / 10}
    </span>
  )
}

export function JoinDateAggregatedCell(): React.ReactNode {
  const cell = useCellContext<Date | undefined>()
  const earliest = cell.getValue()
  return (
    <span className="text-sm text-muted">
      Earliest: {earliest ? formatDate(earliest) : '-'}
    </span>
  )
}
