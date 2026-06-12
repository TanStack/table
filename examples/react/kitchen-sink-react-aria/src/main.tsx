'use client'

import * as React from 'react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import * as ReactDOM from 'react-dom/client'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Column as AriaColumn,
  Table as AriaTable,
  Button,
  Cell,
  Checkbox,
  Dialog,
  DialogTrigger,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  ProgressBar,
  Row,
  Select,
  SelectValue,
  Switch,
  TableBody,
  TableHeader,
  Tooltip,
  TooltipTrigger,
} from 'react-aria-components'
import {
  aggregationFns,
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  metaHelper,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/react-table-devtools'
import type { DragEndEvent } from '@dnd-kit/core'
import type { Key } from 'react-aria-components'
import type { Person } from '@/lib/make-data'
import type {
  Column,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  Header,
  ReactTable,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '@/types'

import { dynamicFilterFn, getFilterOperators } from '@/lib/data-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import { departments, makeData, statuses } from '@/lib/make-data'
import './styles/globals.css'

interface MyColumnMeta {
  label?: string
  variant?: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi-select'
  options?: Array<{ label: string; value: string; count?: number }>
}

// Local fuzzy filter implementation for the filterFns registry slot.
// Defined here to avoid a circular type dependency with data-table.ts.
const fuzzyFilterFn = (
  row: { getValue: (id: string) => unknown },
  columnId: string,
  value: unknown,
  addMeta?: (meta: object) => void,
) => {
  const itemRank = rankItem(row.getValue(columnId), value as string)
  addMeta?.({ itemRank })
  return itemRank.passed
}

export const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowExpandingFeature,
  columnFilteringFeature,
  columnFacetingFeature,
  columnOrderingFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnResizingFeature,
  columnPinningFeature,
  columnGroupingFeature,
  globalFilteringFeature,
  columnMeta: metaHelper<MyColumnMeta>(),
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilterFn },
  sortFns,
  aggregationFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()
type AppTable = ReactTable<typeof features, Person>
type AppColumn = Column<typeof features, Person, any>

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function getPageItems(pageIndex: number, pageCount: number) {
  const currentPage = pageIndex + 1
  const pages = new Set<number>([
    1,
    pageCount,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ])

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((a, b) => a - b)
    .reduce<Array<number | 'ellipsis'>>((items, page) => {
      const previous = items[items.length - 1]
      if (typeof previous === 'number' && page - previous > 1) {
        items.push('ellipsis')
      }
      items.push(page)
      return items
    }, [])
}

function SortableFrame({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="cursor-grab"
      style={{
        opacity: isDragging ? 0.6 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {children}
    </div>
  )
}

function toSentenceCase(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1))
}

function formatDate(value: unknown) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(String(value)))
}

function toDateInputValue(value: unknown) {
  if (!value) return ''
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

function getAriaSort(sortDirection: false | 'asc' | 'desc') {
  if (sortDirection === 'asc') return 'ascending'
  if (sortDirection === 'desc') return 'descending'
  return 'none'
}

const SortingContext = React.createContext<SortingState>([])

function getSortDirection(sorting: SortingState, columnId: string) {
  const sort = sorting.find((item) => item.id === columnId)
  return sort ? (sort.desc ? 'desc' : 'asc') : undefined
}

function getCommonPinningStyles(
  column: AppColumn,
  isSelected = false,
): React.CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px var(--border) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px var(--border) inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    borderRight: isLastLeftPinnedColumn ? '1px solid var(--border)' : undefined,
    borderLeft: isFirstRightPinnedColumn
      ? '1px solid var(--border)'
      : undefined,
    background: isSelected
      ? 'color-mix(in srgb, var(--primary) 12%, var(--surface))'
      : isPinned
        ? 'var(--surface)'
        : undefined,
    zIndex: isPinned ? 2 : 0,
  }
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

function SelectionCheckbox({
  ariaLabel,
  isSelected,
  isIndeterminate,
  onChange,
}: {
  ariaLabel: string
  isSelected: boolean
  isIndeterminate?: boolean
  onChange: (selected: boolean) => void
}) {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!isIndeterminate
  }, [isIndeterminate])

  return (
    <input
      ref={ref}
      aria-label={ariaLabel}
      aria-checked={isIndeterminate ? 'mixed' : isSelected}
      checked={isSelected}
      className="native-checkbox"
      type="checkbox"
      onChange={(event) => onChange(event.currentTarget.checked)}
    />
  )
}

function RowActions({ person }: { person: Person }) {
  return (
    <MenuTrigger>
      <Button
        aria-label="Open row actions"
        className="react-aria-Button icon-button"
      >
        •••
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

function SortIcon({ direction }: { direction: 'asc' | 'desc' | undefined }) {
  if (direction === 'asc') return <span aria-hidden="true">↑</span>
  if (direction === 'desc') return <span aria-hidden="true">↓</span>
  return (
    <span aria-hidden="true" className="sort-icon-unsorted text-muted">
      ↕
    </span>
  )
}

function ColumnHeaderMenu({
  column,
  title,
}: {
  column: AppColumn
  title: string
}) {
  const canSort = column.getCanSort()
  const canHide = column.getCanHide()
  const canPin = column.getCanPin()
  const canGroup = column.getCanGroup()
  const sorting = React.useContext(SortingContext)
  const direction = canSort ? getSortDirection(sorting, column.id) : undefined
  const pinned = canPin ? column.getIsPinned() : false
  const grouped = canGroup ? column.getIsGrouped() : false

  if (!canSort && !canHide && !canPin && !canGroup) {
    return <span className="font-semibold">{title}</span>
  }

  return (
    <div className="flex min-w-0 items-center gap-1">
      {canSort ? (
        <Button
          className="header-sort-button"
          onPress={() => column.toggleSorting()}
        >
          <span className="truncate font-semibold">{title}</span>
          <SortIcon direction={direction} />
        </Button>
      ) : (
        <span className="font-semibold">{title}</span>
      )}
      <MenuTrigger>
        <Button
          className="react-aria-Button icon-button"
          aria-label={`Open ${title} column menu`}
        >
          ▾
        </Button>
        <Popover>
          <Menu>
            {canSort ? (
              <>
                <MenuItem id="asc" onAction={() => column.toggleSorting(false)}>
                  Asc
                </MenuItem>
                <MenuItem id="desc" onAction={() => column.toggleSorting(true)}>
                  Desc
                </MenuItem>
              </>
            ) : null}
            {canGroup ? (
              <MenuItem id="group" onAction={column.getToggleGroupingHandler()}>
                {grouped ? 'Ungroup' : 'Group by'}
              </MenuItem>
            ) : null}
            {canPin ? (
              <>
                <MenuItem
                  id="pin-left"
                  isDisabled={pinned === 'left'}
                  onAction={() => column.pin('left')}
                >
                  Pin left
                </MenuItem>
                <MenuItem
                  id="pin-right"
                  isDisabled={pinned === 'right'}
                  onAction={() => column.pin('right')}
                >
                  Pin right
                </MenuItem>
                {pinned ? (
                  <MenuItem id="unpin" onAction={() => column.pin(false)}>
                    Unpin
                  </MenuItem>
                ) : null}
              </>
            ) : null}
            {canHide ? (
              <MenuItem
                id="hide"
                onAction={() => column.toggleVisibility(false)}
              >
                Hide
              </MenuItem>
            ) : null}
          </Menu>
        </Popover>
      </MenuTrigger>
    </div>
  )
}

function AriaSelect({
  label,
  value,
  options,
  className,
  showLabel = true,
  onChange,
}: {
  label: string
  value: string | null
  options: Array<{ value: string; label: string }>
  className?: string
  showLabel?: boolean
  onChange: (value: string) => void
}) {
  return (
    <Select
      aria-label={label}
      className={cx('react-aria-select', className)}
      selectedKey={value}
      onSelectionChange={(key: Key | null) => {
        if (key != null) onChange(String(key))
      }}
    >
      {showLabel ? <Label>{label}</Label> : null}
      <Button>
        <SelectValue />
        <span aria-hidden="true">⌄</span>
      </Button>
      <Popover>
        <ListBox>
          {options.map((option) => (
            <ListBoxItem
              key={option.value}
              id={option.value}
              textValue={option.label}
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

function ViewOptionsPopover({
  table,
  columnOrder,
  onColumnOrderChange,
}: {
  table: AppTable
  columnOrder: Array<string>
  onColumnOrderChange: React.Dispatch<React.SetStateAction<Array<string>>>
}) {
  const [query, setQuery] = React.useState('')
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )
  const columns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== 'undefined')
    .sort((a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id))
    .filter((column) =>
      (column.columnDef.meta?.label ?? column.id)
        .toLowerCase()
        .includes(query.toLowerCase()),
    )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    onColumnOrderChange((current) => {
      const oldIndex = current.indexOf(String(active.id))
      const newIndex = current.indexOf(String(over.id))
      return oldIndex >= 0 && newIndex >= 0
        ? arrayMove(current, oldIndex, newIndex)
        : current
    })
  }

  return (
    <DialogTrigger>
      <Button>View</Button>
      <Popover className="react-aria-Popover w-80">
        <Dialog className="space-y-3 p-3">
          <Input
            aria-label="Search columns"
            placeholder="Search columns"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={columns.map((column) => column.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {columns.map((column) => (
                  <SortableFrame key={column.id} id={column.id}>
                    <div className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted/40">
                      <Checkbox
                        isSelected={column.getIsVisible()}
                        onChange={(selected) =>
                          column.toggleVisibility(selected)
                        }
                      >
                        {column.columnDef.meta?.label ?? column.id}
                      </Checkbox>
                      <span className="text-muted">≡</span>
                    </div>
                  </SortableFrame>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

function SortListPopover({
  table,
  sorting,
  onSortingChange,
}: {
  table: AppTable
  sorting: SortingState
  onSortingChange: React.Dispatch<React.SetStateAction<SortingState>>
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )
  const sortableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanSort())
  const columnOptions = sortableColumns.map((column) => ({
    value: column.id,
    label: column.columnDef.meta?.label ?? column.id,
  }))

  const updateSort = (index: number, patch: Partial<SortingState[number]>) => {
    onSortingChange((current) =>
      current.map((sort, sortIndex) =>
        sortIndex === index ? { ...sort, ...patch } : sort,
      ),
    )
  }

  const addSort = () => {
    const nextColumn = sortableColumns.find(
      (column) => !sorting.some((sort) => sort.id === column.id),
    )
    if (nextColumn) {
      onSortingChange((current) => [
        ...current,
        { id: nextColumn.id, desc: false },
      ])
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    onSortingChange((current) => {
      const oldIndex = current.findIndex((sort) => sort.id === active.id)
      const newIndex = current.findIndex((sort) => sort.id === over.id)
      return oldIndex >= 0 && newIndex >= 0
        ? arrayMove(current, oldIndex, newIndex)
        : current
    })
  }

  return (
    <DialogTrigger>
      <Button>Sort{sorting.length ? ` (${sorting.length})` : ''}</Button>
      <Popover className="react-aria-Popover w-[520px]">
        <Dialog className="space-y-4 p-3">
          <div className="font-semibold">
            {sorting.length ? 'Sort by' : 'No sorting applied'}
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={sorting.map((sort) => sort.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sorting.map((sort, index) => (
                  <SortableFrame key={sort.id} id={sort.id}>
                    <div className="grid grid-cols-[auto_1fr_7rem_auto] items-end gap-2">
                      <span className="pb-2 text-muted">≡</span>
                      <AriaSelect
                        label="Column"
                        value={sort.id}
                        options={columnOptions}
                        onChange={(value) => updateSort(index, { id: value })}
                      />
                      <AriaSelect
                        label="Direction"
                        value={sort.desc ? 'desc' : 'asc'}
                        options={[
                          { value: 'asc', label: 'Asc' },
                          { value: 'desc', label: 'Desc' },
                        ]}
                        onChange={(value) =>
                          updateSort(index, { desc: value === 'desc' })
                        }
                      />
                      <Button
                        onPress={() =>
                          onSortingChange((current) =>
                            current.filter(
                              (_, sortIndex) => sortIndex !== index,
                            ),
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </SortableFrame>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <div className="flex gap-2">
            <Button
              onPress={addSort}
              isDisabled={sorting.length >= sortableColumns.length}
            >
              Add sort
            </Button>
            <Button onPress={() => table.resetSorting()}>Reset</Button>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

function FilterValueInput({
  column,
  filter,
  onFilterUpdate,
}: {
  column: AppColumn
  filter: ExtendedColumnFilter
  onFilterUpdate: (
    filterId: string,
    patch: Partial<ExtendedColumnFilter>,
  ) => void
}) {
  if (!filter.filterId) return null
  const variant = column.columnDef.meta?.variant ?? 'text'
  const operator = filter.operator ?? 'includesString'
  const disabled = operator === 'isEmpty' || operator === 'isNotEmpty'

  if (disabled)
    return <div className="pb-2 text-sm text-muted">No value required</div>

  if (variant === 'select') {
    const options = column.columnDef.meta?.options ?? []
    return (
      <AriaSelect
        label="Value"
        value={typeof filter.value === 'string' ? filter.value : null}
        options={options}
        onChange={(value) => onFilterUpdate(filter.filterId!, { value })}
      />
    )
  }

  if (variant === 'multi-select') {
    const options = column.columnDef.meta?.options ?? []
    const values = Array.isArray(filter.value)
      ? filter.value.map(String)
      : typeof filter.value === 'string' && filter.value
        ? [filter.value]
        : []
    return (
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Value</span>
        <select
          multiple
          className="min-h-24 rounded-md border border-border bg-background p-2"
          value={values}
          onChange={(event) =>
            onFilterUpdate(filter.filterId!, {
              value: Array.from(event.currentTarget.selectedOptions).map(
                (option) => option.value,
              ),
            })
          }
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (variant === 'date') {
    if (operator === 'inRange') {
      const value = Array.isArray(filter.value) ? filter.value : []
      return (
        <div className="grid grid-cols-2 gap-2">
          <Input
            aria-label="From"
            type="date"
            value={toDateInputValue(value[0])}
            onChange={(event) =>
              onFilterUpdate(filter.filterId!, {
                value: [
                  event.currentTarget.value
                    ? new Date(event.currentTarget.value).toISOString()
                    : undefined,
                  value[1],
                ],
              })
            }
          />
          <Input
            aria-label="To"
            type="date"
            value={toDateInputValue(value[1])}
            onChange={(event) =>
              onFilterUpdate(filter.filterId!, {
                value: [
                  value[0],
                  event.currentTarget.value
                    ? new Date(event.currentTarget.value).toISOString()
                    : undefined,
                ],
              })
            }
          />
        </div>
      )
    }

    return (
      <Input
        aria-label="Value"
        type="date"
        value={toDateInputValue(filter.value)}
        onChange={(event) =>
          onFilterUpdate(filter.filterId!, {
            value: event.currentTarget.value
              ? new Date(event.currentTarget.value).toISOString()
              : undefined,
          })
        }
      />
    )
  }

  if (variant === 'number') {
    return (
      <Input
        aria-label="Value"
        type="number"
        value={
          typeof filter.value === 'number' || typeof filter.value === 'string'
            ? String(filter.value)
            : ''
        }
        onChange={(event) =>
          onFilterUpdate(filter.filterId!, {
            value:
              event.currentTarget.value === ''
                ? ''
                : Number(event.currentTarget.value),
          })
        }
      />
    )
  }

  return (
    <Input
      aria-label="Value"
      value={typeof filter.value === 'string' ? filter.value : ''}
      onChange={(event) =>
        onFilterUpdate(filter.filterId!, { value: event.currentTarget.value })
      }
    />
  )
}

function FilterListPopover({
  table,
  columnFilters,
  onColumnFiltersChange,
}: {
  table: AppTable
  columnFilters: Array<ExtendedColumnFilter>
  onColumnFiltersChange: React.Dispatch<
    React.SetStateAction<Array<ExtendedColumnFilter>>
  >
}) {
  const filterableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanFilter())
  const fieldOptions = filterableColumns.map((column) => ({
    value: column.id,
    label: column.columnDef.meta?.label ?? column.id,
  }))

  const updateFilter = (
    filterId: string,
    patch: Partial<ExtendedColumnFilter>,
  ) => {
    onColumnFiltersChange((current) =>
      current.map((filter) =>
        filter.filterId === filterId ? { ...filter, ...patch } : filter,
      ),
    )
  }

  const addFilter = () => {
    const [column] = filterableColumns
    if (!column) return
    onColumnFiltersChange((current) => [
      ...current,
      {
        id: column.id,
        filterId: crypto.randomUUID(),
        value: '',
        operator: 'includesString',
        joinOperator: current[0]?.joinOperator ?? 'and',
      },
    ])
  }

  return (
    <DialogTrigger>
      <Button>
        Filter{columnFilters.length ? ` (${columnFilters.length})` : ''}
      </Button>
      <Popover className="react-aria-Popover w-[760px]">
        <Dialog className="space-y-4 p-3">
          <div className="font-semibold">Filters</div>
          {columnFilters.map((filter, index) => {
            const column = table.getColumn(filter.id)
            if (!column || !filter.filterId) return null
            const variant = column.columnDef.meta?.variant ?? 'text'
            const operators = getFilterOperators(variant)
            return (
              <div
                key={filter.filterId}
                className="grid grid-cols-[4.5rem_11rem_11rem_1fr_auto] items-end gap-2"
              >
                {index === 0 ? (
                  <div className="pb-2 text-sm">Where</div>
                ) : index === 1 ? (
                  <AriaSelect
                    label="Join"
                    value={filter.joinOperator ?? 'and'}
                    options={[
                      { value: 'and', label: 'and' },
                      { value: 'or', label: 'or' },
                    ]}
                    onChange={(joinOperator) =>
                      onColumnFiltersChange((current) =>
                        current.map((item) => ({
                          ...item,
                          joinOperator: joinOperator as 'and' | 'or',
                        })),
                      )
                    }
                  />
                ) : (
                  <div className="pb-2 text-sm">
                    {filter.joinOperator ?? 'and'}
                  </div>
                )}
                <AriaSelect
                  label="Field"
                  value={column.id}
                  options={fieldOptions}
                  onChange={(nextColumnId) => {
                    const nextColumn = table.getColumn(nextColumnId)
                    if (nextColumn) {
                      updateFilter(filter.filterId!, {
                        id: nextColumn.id,
                        operator: getFilterOperators(
                          nextColumn.columnDef.meta?.variant ?? 'text',
                        )[0].value,
                        value: '',
                      })
                    }
                  }}
                />
                <AriaSelect
                  label="Operator"
                  value={filter.operator ?? operators[0].value}
                  options={operators.map((operator) => ({
                    value: operator.value,
                    label: operator.label,
                  }))}
                  onChange={(operator) =>
                    updateFilter(filter.filterId!, {
                      operator: operator as ExtendedColumnFilter['operator'],
                      value: '',
                    })
                  }
                />
                <FilterValueInput
                  column={column}
                  filter={filter}
                  onFilterUpdate={updateFilter}
                />
                <Button
                  onPress={() =>
                    onColumnFiltersChange((current) =>
                      current.filter(
                        (item) => item.filterId !== filter.filterId,
                      ),
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            )
          })}
          <div className="flex gap-2">
            <Button onPress={addFilter}>Add filter</Button>
            <Button onPress={() => onColumnFiltersChange([])}>Reset</Button>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

function Pagination({ table }: { table: AppTable }) {
  const pageIndex = table.state.pagination.pageIndex
  const pageSize = table.state.pagination.pageSize
  const pageItems = getPageItems(pageIndex, table.getPageCount())

  return (
    <div className="table-pagination">
      <div className="table-pagination-summary">
        {table.getFilteredSelectedRowModel().rows.length.toLocaleString()} of{' '}
        {table.getFilteredRowModel().rows.length.toLocaleString()} row(s)
        selected.
      </div>
      <div className="table-pagination-controls">
        <span className="whitespace-nowrap text-sm">Rows per page:</span>
        <AriaSelect
          label="Rows per page"
          className="w-24"
          showLabel={false}
          value={String(pageSize)}
          options={['10', '20', '30', '40', '50'].map((value) => ({
            value,
            label: value,
          }))}
          onChange={(value) => {
            table.setPageSize(Number(value))
            table.setPageIndex(0)
          }}
        />
        <Button
          onPress={() => table.setPageIndex(0)}
          isDisabled={!table.getCanPreviousPage()}
        >
          «
        </Button>
        <nav aria-label="Pagination" className="pagination">
          <Button
            isDisabled={!table.getCanPreviousPage()}
            onPress={() => table.previousPage()}
          >
            ‹ Prev
          </Button>
          {pageItems.map((page, index) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="page-ellipsis">
                …
              </span>
            ) : (
              <Button
                key={page}
                className={cx(
                  'react-aria-Button',
                  page === pageIndex + 1 && 'is-active',
                )}
                onPress={() => table.setPageIndex(page - 1)}
              >
                {page}
              </Button>
            ),
          )}
          <Button
            isDisabled={!table.getCanNextPage()}
            onPress={() => table.nextPage()}
          >
            Next ›
          </Button>
        </nav>
        <Button
          onPress={() => table.setPageIndex(table.getPageCount() - 1)}
          isDisabled={!table.getCanNextPage()}
        >
          »
        </Button>
      </div>
    </div>
  )
}

function ModeSwitch() {
  const [isDark, setIsDark] = React.useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <TooltipTrigger>
      <Switch aria-label="Theme" isSelected={isDark} onChange={setIsDark}>
        <span className="switch-track">
          <span className="switch-thumb" />
        </span>
      </Switch>
      <Tooltip>Theme</Tooltip>
    </TooltipTrigger>
  )
}

function DebouncedTextInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.ComponentProps<typeof Input>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })

  return (
    <Input
      {...props}
      className={cx(
        'react-aria-Input',
        typeof props.className === 'string' ? props.className : undefined,
      )}
      value={String(value)}
      onChange={(event) => {
        setValue(event.currentTarget.value)
        debouncedOnChange(event.currentTarget.value)
      }}
    />
  )
}

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<
    Array<ExtendedColumnFilter>
  >([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: ['select'],
    right: ['actions'],
  })
  const [grouping, setGrouping] = React.useState<GroupingState>([])
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [data, setData] = React.useState(() => makeData(1_000))

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: 'select',
          header: ({ table }) => (
            <SelectionCheckbox
              ariaLabel="Select all"
              isSelected={table.getIsAllPageRowsSelected()}
              isIndeterminate={
                !table.getIsAllPageRowsSelected() &&
                table.getIsSomePageRowsSelected()
              }
              onChange={(selected) => table.toggleAllPageRowsSelected(selected)}
            />
          ),
          cell: ({ row }) => (
            <SelectionCheckbox
              ariaLabel="Select row"
              isSelected={row.getIsSelected()}
              onChange={(selected) => row.toggleSelected(selected)}
            />
          ),
          size: 64,
          minSize: 64,
          maxSize: 64,
          enableSorting: false,
          enableHiding: false,
          enableResizing: false,
        }),
        columnHelper.accessor('firstName', {
          id: 'firstName',
          header: ({ column }) => (
            <ColumnHeaderMenu column={column} title="First Name" />
          ),
          cell: (info) => (
            <EllipsisText>{String(info.getValue())}</EllipsisText>
          ),
          meta: { label: 'First Name', variant: 'text' },
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          header: ({ column }) => (
            <ColumnHeaderMenu column={column} title="Last Name" />
          ),
          cell: (info) => (
            <EllipsisText>{String(info.getValue())}</EllipsisText>
          ),
          meta: { label: 'Last Name', variant: 'text' },
        }),
        columnHelper.accessor('age', {
          id: 'age',
          header: ({ column }) => (
            <ColumnHeaderMenu column={column} title="Age" />
          ),
          cell: (info) => (
            <span className="text-sm">{String(info.getValue())}</span>
          ),
          aggregationFn: 'mean',
          aggregatedCell: ({ getValue }) => (
            <span className="text-sm text-muted">
              Avg: {Math.round(Number(getValue()) * 10) / 10}
            </span>
          ),
          meta: { label: 'Age', variant: 'number' },
        }),
        columnHelper.accessor('email', {
          id: 'email',
          header: ({ column }) => (
            <ColumnHeaderMenu column={column} title="Email" />
          ),
          cell: (info) => (
            <EllipsisText>{info.cell.getValue<string>()}</EllipsisText>
          ),
          meta: { label: 'Email', variant: 'text' },
        }),
        columnHelper.accessor('status', {
          id: 'status',
          header: ({ column }) => (
            <ColumnHeaderMenu column={column} title="Status" />
          ),
          cell: (info) => {
            const status = info.getValue<Person['status'] | undefined>()
            return status ? <StatusBadge status={status} /> : null
          },
          aggregatedCell: () => null,
          meta: {
            label: 'Status',
            variant: 'select',
            options: statuses.map((status) => ({
              label: toSentenceCase(status),
              value: status,
            })),
          },
        }),
        columnHelper.accessor('department', {
          id: 'department',
          header: ({ column }) => (
            <ColumnHeaderMenu column={column} title="Department" />
          ),
          cell: (info) => {
            const department = info.getValue<Person['department'] | undefined>()
            return department ? (
              <DepartmentPill department={department} />
            ) : null
          },
          aggregatedCell: () => null,
          meta: {
            label: 'Department',
            variant: 'multi-select',
            options: departments.map((department) => ({
              label: toSentenceCase(department),
              value: department,
            })),
          },
        }),
        columnHelper.accessor('joinDate', {
          id: 'joinDate',
          header: ({ column }) => (
            <ColumnHeaderMenu column={column} title="Join Date" />
          ),
          cell: (info) => formatDate(info.getValue()),
          aggregationFn: 'min',
          aggregatedCell: ({ getValue }) => {
            const earliest = getValue<Date | undefined>()
            return (
              <span className="text-sm text-muted">
                Earliest: {earliest ? formatDate(earliest) : '-'}
              </span>
            )
          },
          meta: { label: 'Join Date', variant: 'date' },
        }),
        columnHelper.accessor((row) => row.age, {
          id: 'progress',
          header: ({ column }) => (
            <ColumnHeaderMenu column={column} title="Profile Progress" />
          ),
          cell: (info) => {
            const value = Math.min(100, Math.max(0, Number(info.getValue())))
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
          },
          meta: { label: 'Profile Progress', variant: 'number' },
        }),
        columnHelper.display({
          id: 'actions',
          enableHiding: false,
          cell: ({ row }) => <RowActions person={row.original} />,
          size: 72,
          minSize: 72,
          maxSize: 72,
          enableResizing: false,
        }),
      ]),
    [],
  )

  const [columnOrder, setColumnOrder] = React.useState<Array<string>>(() =>
    columns.map((column) => column.id ?? ''),
  )

  const table = useTable(
    {
      key: 'kitchen-sink-react-aria', // needed for devtools
      features,
      columns,
      data,
      defaultColumn: {
        minSize: 60,
        maxSize: 800,
        filterFn: dynamicFilterFn,
      },
      globalFilterFn: 'fuzzy',
      state: {
        rowSelection,
        sorting,
        columnVisibility,
        columnOrder,
        columnSizing,
        columnFilters,
        globalFilter,
        columnPinning,
        grouping,
        expanded,
      },
      onSortingChange: setSorting,
      onColumnVisibilityChange: setColumnVisibility,
      onColumnOrderChange: setColumnOrder,
      onColumnSizingChange: setColumnSizing,
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      onColumnPinningChange: setColumnPinning,
      onGroupingChange: setGrouping,
      onExpandedChange: setExpanded,
      getRowId: (row) => row.id,
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      columnResizeMode: 'onChange',
      debugTable: true,
    },
    (state) => state, // default selector
  )

  useTanStackTableDevtools(table)

  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: Record<string, number> = {}
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.state.columnSizing])

  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(200_000))

  return (
    <SortingContext.Provider value={sorting}>
      <main className="app-shell">
        <div className="flex flex-col gap-4">
          <div className="control-panel">
            <div className="control-panel-actions">
              <ModeSwitch />
              <Button onPress={refreshData}>Regenerate Data</Button>
              <Button onPress={stressTest}>Stress Test (200k rows)</Button>
              <Button onPress={() => rerender()}>Force Rerender</Button>
              <Button
                onPress={() =>
                  console.info(
                    'table.getSelectedRowModel().flatRows',
                    table.getSelectedRowModel().flatRows,
                  )
                }
              >
                Log Selected Rows
              </Button>
            </div>
          </div>

          <div className="table-toolbar">
            <div className="table-toolbar-search">
              <DebouncedTextInput
                aria-label="Search all columns"
                value={globalFilter}
                onChange={(value) => setGlobalFilter(String(value))}
                placeholder="Search all columns..."
              />
            </div>
            <div className="table-toolbar-actions">
              <FilterListPopover
                table={table}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
              />
              <SortListPopover
                table={table}
                sorting={sorting}
                onSortingChange={setSorting}
              />
              <ViewOptionsPopover
                table={table}
                columnOrder={columnOrder}
                onColumnOrderChange={setColumnOrder}
              />
            </div>
          </div>

          <div className="table-shell">
            <div className="table-scroll max-h-[680px]">
              <AriaTable
                aria-label="React Aria TanStack Table kitchen sink"
                className="data-table min-w-[1200px]"
                style={{
                  width: `max(100%, ${table.getTotalSize()}px)`,
                  tableLayout: 'fixed',
                  ...columnSizeVars,
                }}
              >
                <TableHeader>
                  {table
                    .getHeaderGroups()[0]
                    ?.headers.filter((header) => header.column.getIsVisible())
                    .map((header) => (
                      <ResizableHeaderCell
                        key={header.id}
                        header={header}
                        table={table}
                      />
                    ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => {
                    const selected = row.getIsSelected()
                    return (
                      <Row
                        key={row.id}
                        id={row.id}
                        aria-selected={selected}
                        className={cx(selected && 'bg-primary/10')}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Cell
                            key={cell.id}
                            className={cx(
                              'overflow-hidden',
                              cell.column.id === 'select' && 'select-cell',
                              cell.column.id === 'actions' && 'action-cell',
                            )}
                            style={{
                              width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                              ...getCommonPinningStyles(cell.column, selected),
                            }}
                          >
                            {cell.getIsGrouped() ? (
                              <Button
                                className="group-toggle-button"
                                onPress={row.getToggleExpandedHandler()}
                                isDisabled={!row.getCanExpand()}
                                style={{
                                  paddingLeft: `calc(${row.depth} * 1.5rem + 0.5rem)`,
                                }}
                              >
                                {row.getIsExpanded() ? '▾' : '▸'}
                                <table.FlexRender cell={cell} />
                                <span className="text-muted">
                                  ({row.subRows.length})
                                </span>
                              </Button>
                            ) : (
                              <table.FlexRender cell={cell} />
                            )}
                          </Cell>
                        ))}
                      </Row>
                    )
                  })}
                </TableBody>
              </AriaTable>
            </div>
            <Pagination table={table} />
          </div>
        </div>
      </main>
    </SortingContext.Provider>
  )
}

function ResizableHeaderCell({
  header,
  table,
}: {
  header: Header<typeof features, Person>
  table: {
    FlexRender: React.ComponentType<{
      header: Header<typeof features, Person>
    }>
  }
}) {
  const sorting = React.useContext(SortingContext)
  const sortDirection = getSortDirection(sorting, header.column.id)

  return (
    <AriaColumn
      id={header.id}
      allowsSorting={header.column.getCanSort()}
      isRowHeader={header.column.id === 'firstName'}
      aria-sort={getAriaSort(sortDirection || false)}
      className={cx(
        'header-cell',
        header.column.id === 'select' && 'select-cell',
        header.column.id === 'actions' && 'action-cell',
      )}
      style={{
        width: `calc(var(--header-${header.id}-size) * 1px)`,
        ...getCommonPinningStyles(header.column),
      }}
    >
      <div className="header-cell-content">
        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
        {header.column.getCanResize() ? (
          <div
            onDoubleClick={() => header.column.resetSize()}
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            className={cx(
              'column-resizer',
              header.column.getIsResizing() && 'bg-primary',
            )}
          />
        ) : null}
      </div>
    </AriaColumn>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
  </React.StrictMode>,
)
