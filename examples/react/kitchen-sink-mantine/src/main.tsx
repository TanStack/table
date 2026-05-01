'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
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
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  Pagination as MantinePagination,
  MantineProvider,
  Table as MantineTable,
  Menu,
  MultiSelect,
  Paper,
  Popover,
  Progress,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import '@mantine/core/styles.css'
import {
  IconArrowDown,
  IconArrowUp,
  IconArrowsSort,
  IconBriefcase,
  IconBuildingStore,
  IconCategory,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCode,
  IconCreditCard,
  IconDeviceDesktop,
  IconDotsVertical,
  IconEyeOff,
  IconFilter,
  IconGripVertical,
  IconMoon,
  IconPinned,
  IconSearch,
  IconSettings,
  IconSun,
  IconTrash,
  IconUsersGroup,
} from '@tabler/icons-react'
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
  createCoreRowModel,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type { Person } from '@/lib/make-data'
import type { DragEndEvent } from '@dnd-kit/core'
import type {
  CellData,
  Column,
  ColumnDef,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  Header,
  RowData,
  SortingState,
  Table,
  TableFeatures,
} from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '@/types'

import {
  dynamicFilterFn,
  fuzzyFilter,
  getFilterOperators,
} from '@/lib/data-table'
import { departments, makeData, statuses } from '@/lib/make-data'
import './styles/globals.css'

declare module '@tanstack/react-table' {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    label?: string
    variant?: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi-select'
    options?: Array<{ label: string; value: string; count?: number }>
  }
}

const _features = tableFeatures({
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
})

type AppTable = Table<typeof _features, Person>
type AppColumn = Column<typeof _features, Person>

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
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        opacity: isDragging ? 0.6 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
      }}
    >
      {children}
    </Box>
  )
}

function toSentenceCase(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1))
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
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
  const sort = sorting.find((sort) => sort.id === columnId)
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
      ? '-4px 0 4px -4px var(--mantine-color-default-border) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px var(--mantine-color-default-border) inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    borderRight: isLastLeftPinnedColumn
      ? '1px solid var(--mantine-color-default-border)'
      : undefined,
    borderLeft: isFirstRightPinnedColumn
      ? '1px solid var(--mantine-color-default-border)'
      : undefined,
    background: isSelected
      ? 'var(--mantine-color-blue-light)'
      : isPinned
        ? 'var(--mantine-color-body)'
        : undefined,
    zIndex: isPinned ? 2 : 0,
  }
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

function EllipsisText({ children }: { children: React.ReactNode }) {
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
      {children}
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

function RowActions({ person }: { person: Person }) {
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

function SortIcon({ direction }: { direction: 'asc' | 'desc' | undefined }) {
  if (direction === 'asc') return <IconArrowUp size={16} />
  if (direction === 'desc') return <IconArrowDown size={16} />
  return <IconArrowsSort size={16} opacity={0.45} />
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
    return <Text fw={600}>{title}</Text>
  }

  return (
    <Group gap={4} wrap="nowrap">
      {canSort ? (
        <UnstyledButton
          onClick={column.getToggleSortingHandler()}
          style={{ minWidth: 0 }}
        >
          <Group gap={4} wrap="nowrap">
            <Text fw={600} truncate>
              {title}
            </Text>
            <SortIcon direction={direction} />
          </Group>
        </UnstyledButton>
      ) : (
        <Text fw={600}>{title}</Text>
      )}
      <Menu shadow="md" width={180}>
        <Menu.Target>
          <ActionIcon
            variant="subtle"
            size="sm"
            aria-label={`Open ${title} column menu`}
          >
            <IconChevronDown size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {canSort ? (
            <>
              <Menu.Item
                leftSection={<IconArrowUp size={16} />}
                onClick={() => column.toggleSorting(false)}
              >
                Asc
              </Menu.Item>
              <Menu.Item
                leftSection={<IconArrowDown size={16} />}
                onClick={() => column.toggleSorting(true)}
              >
                Desc
              </Menu.Item>
            </>
          ) : null}
          {canGroup ? (
            <Menu.Item
              leftSection={<IconCategory size={16} />}
              onClick={column.getToggleGroupingHandler()}
            >
              {grouped ? 'Ungroup' : 'Group by'}
            </Menu.Item>
          ) : null}
          {canPin ? (
            <>
              <Menu.Divider />
              <Menu.Item
                disabled={pinned === 'left'}
                leftSection={<IconPinned size={16} />}
                onClick={() => column.pin('left')}
              >
                Pin left
              </Menu.Item>
              <Menu.Item
                disabled={pinned === 'right'}
                leftSection={<IconPinned size={16} />}
                onClick={() => column.pin('right')}
              >
                Pin right
              </Menu.Item>
              {pinned ? (
                <Menu.Item
                  leftSection={<IconPinned size={16} opacity={0.45} />}
                  onClick={() => column.pin(false)}
                >
                  Unpin
                </Menu.Item>
              ) : null}
            </>
          ) : null}
          {canHide ? (
            <>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconEyeOff size={16} />}
                onClick={() => column.toggleVisibility(false)}
              >
                Hide
              </Menu.Item>
            </>
          ) : null}
        </Menu.Dropdown>
      </Menu>
    </Group>
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
  const [opened, setOpened] = React.useState(false)
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
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      shadow="md"
    >
      <Popover.Target>
        <Button
          variant="outline"
          size="sm"
          leftSection={<IconSettings size={16} />}
          onClick={() => setOpened((value) => !value)}
        >
          View
        </Button>
      </Popover.Target>
      <Popover.Dropdown w={320}>
        <Stack gap="sm">
          <TextInput
            label="Search columns"
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
              <Stack gap={4}>
                {columns.map((column) => (
                  <SortableFrame key={column.id} id={column.id}>
                    <Group justify="space-between" wrap="nowrap">
                      <Checkbox
                        checked={column.getIsVisible()}
                        label={column.columnDef.meta?.label ?? column.id}
                        onChange={() =>
                          column.toggleVisibility(!column.getIsVisible())
                        }
                      />
                      <IconGripVertical size={16} opacity={0.45} />
                    </Group>
                  </SortableFrame>
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        </Stack>
      </Popover.Dropdown>
    </Popover>
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
  const [opened, setOpened] = React.useState(false)
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
    if (nextColumn)
      onSortingChange((current) => [
        ...current,
        { id: nextColumn.id, desc: false },
      ])
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
    <Popover opened={opened} onChange={setOpened} width={520} shadow="md">
      <Popover.Target>
        <Button
          variant="outline"
          size="sm"
          leftSection={<IconArrowsSort size={16} />}
          rightSection={
            sorting.length ? <Badge size="sm">{sorting.length}</Badge> : null
          }
          onClick={() => setOpened((value) => !value)}
        >
          Sort
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="md">
          <Text fw={600}>
            {sorting.length ? 'Sort by' : 'No sorting applied'}
          </Text>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={sorting.map((sort) => sort.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="xs">
                {sorting.map((sort, index) => (
                  <SortableFrame key={sort.id} id={sort.id}>
                    <Group wrap="nowrap" align="flex-end">
                      <IconGripVertical size={18} opacity={0.45} />
                      <Select
                        label="Column"
                        searchable
                        data={columnOptions}
                        value={sort.id}
                        onChange={(value) => {
                          if (value) updateSort(index, { id: value })
                        }}
                        style={{ flex: 1 }}
                      />
                      <Select
                        label="Direction"
                        data={[
                          { value: 'asc', label: 'Asc' },
                          { value: 'desc', label: 'Desc' },
                        ]}
                        value={sort.desc ? 'desc' : 'asc'}
                        onChange={(value) =>
                          updateSort(index, { desc: value === 'desc' })
                        }
                        w={110}
                      />
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        aria-label="Remove sort"
                        onClick={() =>
                          onSortingChange((current) =>
                            current.filter(
                              (_, sortIndex) => sortIndex !== index,
                            ),
                          )
                        }
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </SortableFrame>
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
          <Group>
            <Button
              size="sm"
              onClick={addSort}
              disabled={sorting.length >= sortableColumns.length}
            >
              Add sort
            </Button>
            <Button
              size="sm"
              variant="subtle"
              onClick={() => table.resetSorting()}
            >
              Reset
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
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

  if (disabled) {
    return <Text c="dimmed">No value required</Text>
  }

  if (variant === 'select') {
    const options = column.columnDef.meta?.options ?? []
    return (
      <Select
        label="Value"
        data={options}
        value={typeof filter.value === 'string' ? filter.value : null}
        onChange={(value) => onFilterUpdate(filter.filterId!, { value })}
      />
    )
  }

  if (variant === 'multi-select') {
    const options = column.columnDef.meta?.options ?? []
    return (
      <MultiSelect
        label="Value"
        data={options}
        value={Array.isArray(filter.value) ? filter.value : []}
        onChange={(value) => onFilterUpdate(filter.filterId!, { value })}
      />
    )
  }

  if (variant === 'date') {
    if (operator === 'inRange') {
      const value = Array.isArray(filter.value) ? filter.value : []
      return (
        <Group grow>
          <TextInput
            label="From"
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
          <TextInput
            label="To"
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
        </Group>
      )
    }

    return (
      <TextInput
        label="Value"
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
      <TextInput
        label="Value"
        type="number"
        value={
          typeof filter.value === 'number' || typeof filter.value === 'string'
            ? filter.value
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
    <TextInput
      label="Value"
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
  const [opened, setOpened] = React.useState(false)
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
    if (filterableColumns.length === 0) return
    const [column] = filterableColumns
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
    <Popover opened={opened} onChange={setOpened} width={760} shadow="md">
      <Popover.Target>
        <Button
          variant="outline"
          size="sm"
          leftSection={<IconFilter size={16} />}
          rightSection={
            columnFilters.length ? (
              <Badge size="sm">{columnFilters.length}</Badge>
            ) : null
          }
          onClick={() => setOpened((value) => !value)}
        >
          Filter
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="md">
          <Text fw={600}>Filters</Text>
          {columnFilters.map((filter, index) => {
            const column = table.getColumn(filter.id)
            if (!column || !filter.filterId) return null
            const variant = column.columnDef.meta?.variant ?? 'text'
            const operators = getFilterOperators(variant)
            return (
              <Group key={filter.filterId} align="flex-end" wrap="nowrap">
                {index === 0 ? (
                  <Text w={70} pb={8}>
                    Where
                  </Text>
                ) : index === 1 ? (
                  <Select
                    data={[
                      { value: 'and', label: 'and' },
                      { value: 'or', label: 'or' },
                    ]}
                    value={filter.joinOperator ?? 'and'}
                    onChange={(joinOperator) => {
                      if (!joinOperator) return
                      onColumnFiltersChange((current) =>
                        current.map((item) => ({ ...item, joinOperator })),
                      )
                    }}
                    w={90}
                  />
                ) : (
                  <Text w={70} pb={8}>
                    {filter.joinOperator ?? 'and'}
                  </Text>
                )}
                <Select
                  label="Field"
                  searchable
                  data={fieldOptions}
                  value={column.id}
                  onChange={(nextColumnId) => {
                    const nextColumn = nextColumnId
                      ? table.getColumn(nextColumnId)
                      : undefined
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
                  w={190}
                />
                <Select
                  label="Operator"
                  data={operators.map((operator) => ({
                    value: operator.value,
                    label: operator.label,
                  }))}
                  value={filter.operator ?? operators[0].value}
                  onChange={(operator) => {
                    if (!operator) return
                    updateFilter(filter.filterId!, {
                      operator,
                      value: '',
                    })
                  }}
                  w={180}
                />
                <Box style={{ flex: 1 }}>
                  <FilterValueInput
                    column={column}
                    filter={filter}
                    onFilterUpdate={updateFilter}
                  />
                </Box>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  aria-label="Remove filter"
                  onClick={() =>
                    onColumnFiltersChange((current) =>
                      current.filter(
                        (item) => item.filterId !== filter.filterId,
                      ),
                    )
                  }
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            )
          })}
          <Group>
            <Button size="sm" onClick={addFilter}>
              Add filter
            </Button>
            <Button
              size="sm"
              variant="subtle"
              onClick={() => onColumnFiltersChange([])}
            >
              Reset
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

function Pagination({ table }: { table: AppTable }) {
  const pageIndex = table.store.state.pagination.pageIndex
  const pageSize = table.store.state.pagination.pageSize

  return (
    <Group justify="space-between" p="sm">
      <Text size="sm" c="dimmed">
        {table.getFilteredSelectedRowModel().rows.length.toLocaleString()} of{' '}
        {table.getFilteredRowModel().rows.length.toLocaleString()} row(s)
        selected.
      </Text>
      <Group gap="xs">
        <Text size="sm">Rows per page:</Text>
        <Select
          aria-label="Rows per page"
          data={['10', '20', '30', '40', '50']}
          value={String(pageSize)}
          onChange={(value) => {
            table.setPageSize(Number(value))
            table.setPageIndex(0)
          }}
          w={90}
        />
        <ActionIcon
          variant="subtle"
          aria-label="First page"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <IconChevronsLeft size={18} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          aria-label="Previous page"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <IconChevronLeft size={18} />
        </ActionIcon>
        <MantinePagination
          value={pageIndex + 1}
          total={table.getPageCount()}
          onChange={(page) => table.setPageIndex(page - 1)}
          withEdges={false}
          siblings={1}
          boundaries={1}
        />
        <ActionIcon
          variant="subtle"
          aria-label="Next page"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <IconChevronRight size={18} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          aria-label="Last page"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <IconChevronsRight size={18} />
        </ActionIcon>
      </Group>
    </Group>
  )
}

function ModeMenu() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')
  const icon =
    computedColorScheme === 'dark' ? (
      <IconMoon size={18} />
    ) : (
      <IconSun size={18} />
    )

  return (
    <Menu shadow="md" width={150}>
      <Menu.Target>
        <Tooltip label="Theme">
          <ActionIcon variant="subtle" aria-label="Theme">
            {icon}
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        {(
          [
            { value: 'light', label: 'Light', icon: <IconSun size={16} /> },
            { value: 'dark', label: 'Dark', icon: <IconMoon size={16} /> },
            {
              value: 'auto',
              label: 'Auto',
              icon: <IconDeviceDesktop size={16} />,
            },
          ] satisfies Array<{
            value: 'light' | 'dark' | 'auto'
            label: string
            icon: React.ReactNode
          }>
        ).map((item) => (
          <Menu.Item
            key={item.value}
            leftSection={item.icon}
            color={colorScheme === item.value ? 'blue' : undefined}
            onClick={() => setColorScheme(item.value)}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
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
} & Omit<React.ComponentProps<typeof TextInput>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return (
    <TextInput
      {...props}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
    />
  )
}

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]
  const [rowSelection, setRowSelection] = React.useState({})
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

  const columns = React.useMemo<Array<ColumnDef<typeof _features, Person>>>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={
              !table.getIsAllPageRowsSelected() &&
              table.getIsSomePageRowsSelected()
            }
            onChange={(event) =>
              table.toggleAllPageRowsSelected(event.currentTarget.checked)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={(event) =>
              row.toggleSelected(event.currentTarget.checked)
            }
            aria-label="Select row"
          />
        ),
        maxSize: 48,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
      {
        id: 'firstName',
        accessorKey: 'firstName',
        header: ({ column }) => (
          <ColumnHeaderMenu column={column} title="First Name" />
        ),
        cell: (info) => <EllipsisText>{String(info.getValue())}</EllipsisText>,
        meta: { label: 'First Name', variant: 'text' },
      },
      {
        id: 'lastName',
        accessorFn: (row) => row.lastName,
        header: ({ column }) => (
          <ColumnHeaderMenu column={column} title="Last Name" />
        ),
        cell: (info) => <EllipsisText>{String(info.getValue())}</EllipsisText>,
        meta: { label: 'Last Name', variant: 'text' },
      },
      {
        id: 'age',
        accessorKey: 'age',
        header: ({ column }) => (
          <ColumnHeaderMenu column={column} title="Age" />
        ),
        cell: (info) => <Text size="sm">{String(info.getValue())}</Text>,
        aggregationFn: 'mean',
        aggregatedCell: ({ getValue }) => (
          <Text size="sm" c="dimmed">
            Avg: {Math.round(Number(getValue()) * 10) / 10}
          </Text>
        ),
        meta: { label: 'Age', variant: 'number' },
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: ({ column }) => (
          <ColumnHeaderMenu column={column} title="Email" />
        ),
        cell: (info) => (
          <EllipsisText>{info.cell.getValue<string>()}</EllipsisText>
        ),
        meta: { label: 'Email', variant: 'text' },
      },
      {
        id: 'status',
        accessorKey: 'status',
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
      },
      {
        id: 'department',
        accessorKey: 'department',
        header: ({ column }) => (
          <ColumnHeaderMenu column={column} title="Department" />
        ),
        cell: (info) => {
          const department = info.getValue<Person['department'] | undefined>()
          return department ? <DepartmentPill department={department} /> : null
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
      },
      {
        id: 'joinDate',
        accessorKey: 'joinDate',
        header: ({ column }) => (
          <ColumnHeaderMenu column={column} title="Join Date" />
        ),
        cell: (info) => formatDate(info.getValue<string>()),
        aggregationFn: 'min',
        aggregatedCell: ({ getValue }) => {
          const earliest = getValue<string>()
          return (
            <Text size="sm" c="dimmed">
              Earliest: {earliest ? formatDate(earliest) : '-'}
            </Text>
          )
        },
        meta: { label: 'Join Date', variant: 'date' },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <RowActions person={row.original} />,
        maxSize: 44,
        enableResizing: false,
      },
    ],
    [],
  )

  const [columnOrder, setColumnOrder] = React.useState<Array<string>>(() =>
    columns.map((column) => column.id ?? ''),
  )

  const table = useTable(
    {
      _features,
      _rowModels: {
        coreRowModel: createCoreRowModel(),
        filteredRowModel: createFilteredRowModel({
          ...filterFns,
          fuzzy: fuzzyFilter,
        }),
        facetedRowModel: createFacetedRowModel(),
        facetedUniqueValues: createFacetedUniqueValues(),
        paginatedRowModel: createPaginatedRowModel(),
        sortedRowModel: createSortedRowModel(sortFns),
        groupedRowModel: createGroupedRowModel(aggregationFns),
        expandedRowModel: createExpandedRowModel(),
      },
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
    (state) => state,
  )

  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: Record<string, number> = {}
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.store.state.columnSizing])

  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(100_000))

  return (
    <SortingContext.Provider value={sorting}>
      <Container fluid py="md">
        <Stack gap="md">
          <Paper withBorder p="sm">
            <Group justify="flex-end" gap="xs">
              <ModeMenu />
              <Button variant="outline" size="sm" onClick={refreshData}>
                Regenerate Data
              </Button>
              <Button variant="outline" size="sm" onClick={stressTest}>
                Stress Test (100k rows)
              </Button>
              <Button variant="outline" size="sm" onClick={() => rerender()}>
                Force Rerender
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  console.info(
                    'table.getSelectedRowModel().flatRows',
                    table.getSelectedRowModel().flatRows,
                  )
                }
              >
                Log Selected Rows
              </Button>
            </Group>
          </Paper>

          <Group align="center" gap="xs">
            <DebouncedTextInput
              value={globalFilter}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
              leftSection={<IconSearch size={16} />}
              w={{ base: '100%', md: 360 }}
            />
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
          </Group>

          <Paper withBorder>
            <MantineTable.ScrollContainer minWidth={1200} maxHeight={680}>
              <MantineTable
                stickyHeader
                highlightOnHover
                withColumnBorders
                withRowBorders
                withTableBorder
                style={{
                  width: `max(100%, ${table.getTotalSize()}px)`,
                  tableLayout: 'fixed',
                  ...columnSizeVars,
                }}
              >
                <colgroup>
                  {table.getVisibleLeafColumns().map((column) => (
                    <col
                      key={column.id}
                      style={{
                        width: `calc(var(--col-${column.id}-size) * 1px)`,
                      }}
                    />
                  ))}
                </colgroup>
                <MantineTable.Thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <MantineTable.Tr key={headerGroup.id}>
                      {headerGroup.headers
                        .filter((header) => header.column.getIsVisible())
                        .map((header) => (
                          <ResizableHeaderCell
                            key={header.id}
                            header={header}
                            table={table}
                          />
                        ))}
                    </MantineTable.Tr>
                  ))}
                </MantineTable.Thead>
                <MantineTable.Tbody>
                  {table.getRowModel().rows.map((row) => {
                    const selected = row.getIsSelected()
                    return (
                      <MantineTable.Tr
                        key={row.id}
                        aria-selected={selected}
                        data-selected={selected || undefined}
                        bg={
                          selected
                            ? 'var(--mantine-color-blue-light)'
                            : undefined
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <MantineTable.Td
                            key={cell.id}
                            align={
                              cell.column.id === 'select' ? 'center' : undefined
                            }
                            style={{
                              width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                              overflow: 'hidden',
                              ...getCommonPinningStyles(cell.column, selected),
                            }}
                          >
                            {cell.getIsGrouped() ? (
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
                                <table.FlexRender cell={cell} />
                                <Text span c="dimmed" ml={4}>
                                  ({row.subRows.length})
                                </Text>
                              </Button>
                            ) : cell.column.id === 'progress' ? (
                              <Stack gap={4}>
                                <Text size="sm">
                                  {String(cell.getValue())}%
                                </Text>
                                <Progress value={Number(cell.getValue())} />
                              </Stack>
                            ) : (
                              <table.FlexRender cell={cell} />
                            )}
                          </MantineTable.Td>
                        ))}
                      </MantineTable.Tr>
                    )
                  })}
                </MantineTable.Tbody>
              </MantineTable>
            </MantineTable.ScrollContainer>
            <Pagination table={table} />
          </Paper>
        </Stack>
      </Container>
    </SortingContext.Provider>
  )
}

function ResizableHeaderCell({
  header,
  table,
}: {
  header: Header<typeof _features, Person>
  table: {
    FlexRender: React.ComponentType<{
      header: Header<typeof _features, Person>
    }>
  }
}) {
  const sorting = React.useContext(SortingContext)
  const sortDirection = getSortDirection(sorting, header.column.id)

  return (
    <MantineTable.Th
      colSpan={header.colSpan}
      align={header.column.id === 'select' ? 'center' : undefined}
      aria-sort={getAriaSort(sortDirection || false)}
      data-sort={sortDirection}
      style={{
        width: `calc(var(--header-${header.id}-size) * 1px)`,
        padding: 8,
        ...getCommonPinningStyles(header.column),
      }}
    >
      <Box
        style={{
          position: 'relative',
          paddingRight: header.column.getCanResize() ? 8 : 0,
        }}
      >
        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
        {header.column.getCanResize() ? (
          <Box
            onDoubleClick={() => header.column.resetSize()}
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            style={{
              position: 'absolute',
              top: 0,
              right: -6,
              width: 6,
              height: '100%',
              cursor: 'col-resize',
              touchAction: 'none',
              background: header.column.getIsResizing()
                ? 'var(--mantine-primary-color-filled)'
                : 'transparent',
            }}
          />
        ) : null}
      </Box>
    </MantineTable.Th>
  )
}

function Root() {
  return (
    <MantineProvider defaultColorScheme="auto">
      <App />
    </MantineProvider>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
