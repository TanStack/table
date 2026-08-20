import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  ProgressBar,
} from 'react-aria-components'
import type { Person } from '@/lib/make-data'
import { useCellContext, useTableContext } from '@/hooks/table'
import {
  SelectionCheckbox,
  toSentenceCase,
} from '@/components/data-table/shared'

function EllipsisText({ children }: { children: React.ReactNode }) {
  return <span className="block min-w-0 truncate">{children}</span>
}

function StatusBadge({ status }: { status: Person['status'] }) {
  const className: Record<Person['status'], string> = {
    active: 'status-badge status-active',
    inactive: 'status-badge status-inactive',
    pending: 'status-badge status-pending',
  }
  return <span className={className[status]}>{toSentenceCase(status)}</span>
}

function DepartmentPill({ department }: { department: Person['department'] }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border px-2.5 py-1 text-sm">
      <span className="font-mono text-xs text-muted">
        {department.slice(0, 2).toUpperCase()}
      </span>
      <span className="truncate">{toSentenceCase(department)}</span>
    </span>
  )
}

function formatDate(value: unknown) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(String(value)))
}

export function SelectCell(): React.ReactNode {
  const cell = useCellContext()
  const table = useTableContext()
  const row = cell.row

  return (
    <table.Subscribe source={table.atoms.rowSelection}>
      {() => (
        <SelectionCheckbox
          ariaLabel="Select row"
          isSelected={row.getIsSelected()}
          onChange={(selected) => row.toggleSelected(selected)}
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
  return <span className="text-sm">{String(cell.getValue())}</span>
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

export function ProgressCell(): React.ReactNode {
  const cell = useCellContext<number>()
  const value = Math.min(100, Math.max(0, Number(cell.getValue())))
  return (
    <ProgressBar value={value} aria-label="Profile progress">
      {({ percentage }) => (
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${percentage ?? 0}%` }}
          />
        </div>
      )}
    </ProgressBar>
  )
}

export function GroupedCell(): React.ReactNode {
  const cell = useCellContext()
  const table = useTableContext()
  const row = cell.row

  return (
    <table.Subscribe source={table.atoms.expanded}>
      {() => (
        <Button
          className="group-toggle-button"
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
    <MenuTrigger>
      <Button
        aria-label="Open row actions"
        className="react-aria-Button icon-button"
      >
        {'•••'}
      </Button>
      <Popover>
        <Menu>
          <MenuItem
            id="copy"
            onAction={() => {
              void navigator.clipboard.writeText(person.id)
            }}
          >
            Copy ID
          </MenuItem>
          <MenuItem id="details">View details</MenuItem>
          <MenuItem id="profile">View profile</MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
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
