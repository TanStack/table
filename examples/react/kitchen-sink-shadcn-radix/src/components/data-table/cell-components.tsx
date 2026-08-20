'use client'

import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  CreditCard,
  Megaphone,
  MoreHorizontal,
  ShoppingCart,
  Users,
  XCircle,
} from 'lucide-react'
import { Subscribe } from '@tanstack/react-table'
import type { Person } from '@/lib/make-data'
import { useCellContext, useTableContext } from '@/hooks/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate, toSentenceCase } from '@/lib/utils'

export function SelectCell(): React.ReactNode {
  const cell = useCellContext()
  const table = useTableContext()
  const row = cell.row

  return (
    <Subscribe source={table.atoms.rowSelection}>
      {() => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      )}
    </Subscribe>
  )
}

export function TextCell(): React.ReactNode {
  const cell = useCellContext<string | undefined>()
  const value = cell.getValue()
  return value == null ? null : <>{String(value)}</>
}

export function AgeCell(): React.ReactNode {
  const cell = useCellContext<number>()
  return <span>{String(cell.getValue())}</span>
}

export function StatusCell(): React.ReactNode {
  const cell = useCellContext<Person['status'] | undefined>()
  const status = cell.getValue()
  if (!status) return null

  const icons: Record<Person['status'], React.ReactNode> = {
    active: <CheckCircle />,
    inactive: <XCircle />,
    pending: <Clock />,
  }

  return (
    <Badge
      variant="outline"
      className="gap-1 w-fit [&>svg]:size-3.5 px-3 py-1 [&>svg]:shrink-0 rounded-full"
    >
      {icons[status]}
      <span className="truncate">{toSentenceCase(status)}</span>
    </Badge>
  )
}

export function DepartmentCell(): React.ReactNode {
  const cell = useCellContext<Person['department'] | undefined>()
  const department = cell.getValue()
  if (!department) return null

  const icons: Record<Person['department'], React.ReactNode> = {
    engineering: <Code />,
    marketing: <Megaphone />,
    sales: <ShoppingCart />,
    hr: <Users />,
    finance: <CreditCard />,
  }

  return (
    <Badge
      variant="outline"
      className="gap-1 w-fit [&>svg]:size-3.5 px-3 py-1 [&>svg]:shrink-0 rounded-full"
    >
      {icons[department]}
      <span className="truncate">{toSentenceCase(department)}</span>
    </Badge>
  )
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
          variant="ghost"
          size="sm"
          className="-ml-2 h-7 gap-1 px-2"
          onClick={row.getToggleExpandedHandler()}
          disabled={!row.getCanExpand()}
          style={{
            paddingLeft: `calc(${row.depth} * 1.5rem + 0.5rem)`,
          }}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
          <cell.FlexRender />
          <span className="text-muted-foreground">({row.subRows.length})</span>
        </Button>
      )}
    </Subscribe>
  )
}

export function ActionsCell(): React.ReactNode {
  const cell = useCellContext()
  const person = cell.row.original as Person

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(person.id)}
        >
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View details</DropdownMenuItem>
        <DropdownMenuItem>View profile</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AgeAggregatedCell(): React.ReactNode {
  const cell = useCellContext<number>()
  return (
    <span className="text-muted-foreground">
      Avg: {Math.round(Number(cell.getValue()) * 10) / 10}
    </span>
  )
}

export function JoinDateAggregatedCell(): React.ReactNode {
  const cell = useCellContext<string>()
  const earliest = cell.getValue()
  return (
    <span className="text-muted-foreground">
      Earliest: {earliest ? formatDate(earliest) : '—'}
    </span>
  )
}
