import { defineComponent, h } from 'vue'
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
} from '@lucide/vue'
import type { Component } from 'vue'
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

export const SelectCell: Component = defineComponent({
  name: 'SelectCell',
  setup() {
    const cell = useCellContext()
    const table = useTableContext()
    const row = cell.row

    // Reading the atom in render subscribes this cell to selection changes.
    return () => {
      void table.atoms.rowSelection.get()
      return (
        <Checkbox
          modelValue={row.getIsSelected()}
          {...{
            'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
              row.toggleSelected(!!value),
          }}
          aria-label="Select row"
          class="translate-y-0.5"
        />
      )
    }
  },
})

export const TextCell: Component = defineComponent({
  name: 'TextCell',
  setup() {
    const cell = useCellContext<string>()
    return () => <>{String(cell.getValue())}</>
  },
})

export const AgeCell: Component = defineComponent({
  name: 'AgeCell',
  setup() {
    const cell = useCellContext<number>()
    return () => <span>{String(cell.getValue())}</span>
  },
})

export const StatusCell: Component = defineComponent({
  name: 'StatusCell',
  setup() {
    const cell = useCellContext<Person['status'] | undefined>()

    const icons: Record<Person['status'], Component> = {
      active: CheckCircle,
      inactive: XCircle,
      pending: Clock,
    }

    return () => {
      const status = cell.getValue()
      if (!status) return null
      const Icon = icons[status]

      return (
        <Badge
          variant="outline"
          class="gap-1 w-fit [&>svg]:size-3.5 px-3 py-1 [&>svg]:shrink-0 rounded-full"
        >
          {h(Icon)}
          <span class="truncate">{toSentenceCase(status)}</span>
        </Badge>
      )
    }
  },
})

export const DepartmentCell: Component = defineComponent({
  name: 'DepartmentCell',
  setup() {
    const cell = useCellContext<Person['department'] | undefined>()

    const icons: Record<Person['department'], Component> = {
      engineering: Code,
      marketing: Megaphone,
      sales: ShoppingCart,
      hr: Users,
      finance: CreditCard,
    }

    return () => {
      const department = cell.getValue()
      if (!department) return null
      const Icon = icons[department]

      return (
        <Badge
          variant="outline"
          class="gap-1 w-fit [&>svg]:size-3.5 px-3 py-1 [&>svg]:shrink-0 rounded-full"
        >
          {h(Icon)}
          <span class="truncate">{toSentenceCase(department)}</span>
        </Badge>
      )
    }
  },
})

export const DateCell: Component = defineComponent({
  name: 'DateCell',
  setup() {
    const cell = useCellContext<string>()
    return () => <>{formatDate(cell.getValue())}</>
  },
})

export const GroupedCell: Component = defineComponent({
  name: 'GroupedCell',
  setup() {
    const cell = useCellContext()
    const table = useTableContext()
    const row = cell.row

    return () => {
      void table.atoms.expanded.get()
      return (
        <Button
          variant="ghost"
          size="sm"
          class="-ml-2 h-7 gap-1 px-2"
          {...{
            onClick: row.getToggleExpandedHandler(),
            disabled: !row.getCanExpand(),
          }}
          style={{
            paddingLeft: `calc(${row.depth} * 1.5rem + 0.5rem)`,
          }}
        >
          {row.getIsExpanded() ? (
            <ChevronDown class="size-4" />
          ) : (
            <ChevronRight class="size-4" />
          )}
          {h(cell.FlexRender)}
          <span class="text-muted-foreground">({row.subRows.length})</span>
        </Button>
      )
    }
  },
})

export const ActionsCell: Component = defineComponent({
  name: 'ActionsCell',
  setup() {
    const cell = useCellContext()
    const person = cell.row.original as Person

    return () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" class="h-8 w-8 p-0">
            <span class="sr-only">Open menu</span>
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            {...{ onClick: () => navigator.clipboard.writeText(person.id) }}
          >
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>View profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
})

export const AgeAggregatedCell: Component = defineComponent({
  name: 'AgeAggregatedCell',
  setup() {
    const cell = useCellContext<number>()
    return () => (
      <span class="text-muted-foreground">
        Avg: {Math.round(Number(cell.getValue()) * 10) / 10}
      </span>
    )
  },
})

export const JoinDateAggregatedCell: Component = defineComponent({
  name: 'JoinDateAggregatedCell',
  setup() {
    const cell = useCellContext<string>()
    return () => {
      const earliest = cell.getValue()
      return (
        <span class="text-muted-foreground">
          Earliest: {earliest ? formatDate(earliest) : '—'}
        </span>
      )
    }
  },
})
