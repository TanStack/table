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
  Badge,
  Box,
  Button,
  ChakraProvider,
  Checkbox,
  Container,
  HStack,
  IconButton,
  Input,
  Menu,
  NativeSelect,
  Popover,
  Stack,
  Table,
  Text,
  defaultSystem,
} from '@chakra-ui/react'
import { ThemeProvider, useTheme } from 'next-themes'
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
import { rankItem } from '@tanstack/match-sorter-utils'
import type { Person } from '@/lib/make-data'
import type { DragEndEvent } from '@dnd-kit/core'
import type {
  Column,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  Header,
  ReactTable,
  SortingState,
} from '@tanstack/react-table'
import type {
  ExtendedColumnFilter,
  FilterOperator,
  JoinOperator,
} from '@/types'

import { dynamicFilterFn, getFilterOperators } from '@/lib/data-table'
import { departments, makeData, statuses } from '@/lib/make-data'
import './styles/globals.css'

type Option = {
  value: string
  label: string
}

type TextInputProps = Omit<React.ComponentProps<typeof Input>, 'onChange'> & {
  label?: string
  icon?: React.ReactNode
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

function TextInput({ label, icon, ...props }: TextInputProps) {
  return (
    <Box flex={props.style?.flex}>
      {label ? (
        <Text fontSize="sm" fontWeight="medium" mb="1">
          {label}
        </Text>
      ) : null}
      <Box position="relative">
        {icon ? (
          <Box
            position="absolute"
            left="3"
            top="50%"
            translateY="-50%"
            color="fg.muted"
            pointerEvents="none"
          >
            {icon}
          </Box>
        ) : null}
        <Input ps={icon ? '9' : undefined} {...props} />
      </Box>
    </Box>
  )
}

type SelectFieldProps = {
  'aria-label'?: string
  label?: string
  options: Array<string | Option>
  value?: string | null
  onChange?: (value: string | null) => void
  width?: string | number
  flex?: string | number
}

function SelectField({
  'aria-label': ariaLabel,
  label,
  options,
  value,
  onChange,
  width,
  flex,
}: SelectFieldProps) {
  const normalizedOptions = options.map((item) =>
    typeof item === 'string' ? { value: item, label: item } : item,
  )
  return (
    <Box width={width} flex={flex}>
      {label ? (
        <Text fontSize="sm" fontWeight="medium" mb="1">
          {label}
        </Text>
      ) : null}
      <NativeSelect.Root width="100%">
        <NativeSelect.Field
          aria-label={ariaLabel}
          value={value ?? ''}
          onChange={(event) => onChange?.(event.currentTarget.value || null)}
        >
          {normalizedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Box>
  )
}

type MultiSelectFieldProps = {
  label?: string
  options: Array<string | Option>
  value?: Array<string>
  onChange?: (value: Array<string>) => void
  flex?: string | number
}

function MultiSelectField({
  label,
  options,
  value = [],
  onChange,
  flex,
}: MultiSelectFieldProps) {
  const normalizedOptions = options.map((item) =>
    typeof item === 'string' ? { value: item, label: item } : item,
  )
  return (
    <Box flex={flex}>
      {label ? (
        <Text fontSize="sm" fontWeight="medium" mb="1">
          {label}
        </Text>
      ) : null}
      <select
        multiple
        value={value}
        style={{
          width: '100%',
          minHeight: 40,
          padding: 8,
          border: '1px solid var(--chakra-colors-border)',
          borderRadius: 'var(--chakra-radii-md)',
          background: 'var(--chakra-colors-bg)',
        }}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
          onChange?.(
            Array.from(event.currentTarget.selectedOptions).map(
              (option) => option.value,
            ),
          )
        }
      >
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Box>
  )
}

type CheckboxFieldProps = Omit<
  React.ComponentProps<'input'>,
  'checked' | 'onChange' | 'type'
> & {
  label?: string
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function CheckboxField({
  label,
  checked,
  indeterminate,
  onCheckedChange,
  ...props
}: CheckboxFieldProps) {
  return (
    <Checkbox.Root
      checked={indeterminate ? 'indeterminate' : checked}
      onCheckedChange={(details) => onCheckedChange?.(details.checked === true)}
    >
      <Checkbox.HiddenInput {...props} />
      <Checkbox.Control />
      {label ? <Checkbox.Label>{label}</Checkbox.Label> : null}
    </Checkbox.Root>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <Box bg="bg.muted" rounded="full" height="2" overflow="hidden">
      <Box bg="colorPalette.solid" height="100%" width={`${value}%`} />
    </Box>
  )
}

function useCloseOnOutsidePointerDown(
  open: boolean,
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  React.useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    return () =>
      document.removeEventListener('pointerdown', onPointerDown, true)
  }, [open, onClose, ref])
}

const DropdownCloseContext = React.createContext<() => void>(() => undefined)

function DropdownMenu({
  trigger,
  children,
  width = '180px',
}: {
  trigger: React.ReactNode
  children: React.ReactNode
  width?: string | number
}) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const close = React.useCallback(() => setOpen(false), [])

  useCloseOnOutsidePointerDown(open, rootRef, close)

  return (
    <Box ref={rootRef} display="inline-block">
      <DropdownCloseContext.Provider value={close}>
        <Menu.Root
          open={open}
          onOpenChange={(details) => setOpen(details.open)}
          positioning={{ placement: 'bottom-end', offset: { mainAxis: 6 } }}
        >
          <Menu.Trigger asChild>{trigger}</Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content minW={width}>{children}</Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </DropdownCloseContext.Provider>
    </Box>
  )
}

function DropdownMenuItem({
  value,
  icon,
  children,
  onSelect,
  disabled,
  colorPalette,
}: {
  value: string
  icon?: React.ReactNode
  children: React.ReactNode
  onSelect?: () => void
  disabled?: boolean
  colorPalette?: string
}) {
  const close = React.useContext(DropdownCloseContext)
  const hasHandledSelectionRef = React.useRef(false)
  const handleSelection = React.useCallback(() => {
    if (hasHandledSelectionRef.current) return

    hasHandledSelectionRef.current = true
    onSelect?.()
    close()
    queueMicrotask(() => {
      hasHandledSelectionRef.current = false
    })
  }, [close, onSelect])

  return (
    <Menu.Item
      value={value}
      disabled={disabled}
      colorPalette={colorPalette}
      onClick={handleSelection}
      onSelect={handleSelection}
    >
      {icon}
      {children}
    </Menu.Item>
  )
}

function FloatingPanel({
  open,
  onOpenChange,
  width = '320px',
  trigger,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  width?: string | number
  trigger: React.ReactNode
  children: React.ReactNode
}) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const close = React.useCallback(() => onOpenChange(false), [onOpenChange])

  useCloseOnOutsidePointerDown(open, rootRef, close)

  return (
    <Box ref={rootRef} display="inline-block">
      <Popover.Root
        open={open}
        onOpenChange={(details) => onOpenChange(details.open)}
        positioning={{ placement: 'bottom-end', offset: { mainAxis: 6 } }}
      >
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content width={width} maxW="calc(100vw - 32px)">
            <Popover.Body>{children}</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
    </Box>
  )
}

function ChakraExampleProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}

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
      ? '-4px 0 4px -4px var(--chakra-colors-border) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px var(--chakra-colors-border) inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    borderRight: isLastLeftPinnedColumn
      ? '1px solid var(--chakra-colors-border)'
      : undefined,
    borderLeft: isFirstRightPinnedColumn
      ? '1px solid var(--chakra-colors-border)'
      : undefined,
    background: isSelected
      ? 'var(--chakra-colors-blue-subtle)'
      : isPinned
        ? 'var(--chakra-colors-bg)'
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

function EllipsisText({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="span"
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

function SortIcon({ direction }: { direction: 'asc' | 'desc' | undefined }) {
  if (direction === 'asc') return <IconArrowUp size={16} />
  if (direction === 'desc') return <IconArrowDown size={16} />
  return <IconArrowsSort className="sort-icon-unsorted" size={16} />
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
    return <Text fontWeight="semibold">{title}</Text>
  }

  return (
    <HStack gap={4} wrap="nowrap">
      {canSort ? (
        <Button
          variant="plain"
          height="auto"
          minW="0"
          p="0"
          onClick={column.getToggleSortingHandler()}
          className="sort-trigger"
          style={{ minWidth: 0 }}
        >
          <HStack gap={4} wrap="nowrap">
            <Text fontWeight="semibold" truncate>
              {title}
            </Text>
            <SortIcon direction={direction} />
          </HStack>
        </Button>
      ) : (
        <Text fontWeight="semibold">{title}</Text>
      )}
      <DropdownMenu
        trigger={
          <IconButton
            variant="subtle"
            size="sm"
            aria-label={`Open ${title} column menu`}
          >
            <IconChevronDown size={16} />
          </IconButton>
        }
      >
        {canSort ? (
          <>
            <DropdownMenuItem
              value={`${column.id}-sort-asc`}
              icon={<IconArrowUp size={16} />}
              onSelect={() => column.toggleSorting(false)}
            >
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem
              value={`${column.id}-sort-desc`}
              icon={<IconArrowDown size={16} />}
              onSelect={() => column.toggleSorting(true)}
            >
              Desc
            </DropdownMenuItem>
          </>
        ) : null}
        {canGroup ? (
          <DropdownMenuItem
            value={`${column.id}-group`}
            icon={<IconCategory size={16} />}
            onSelect={column.getToggleGroupingHandler()}
          >
            {grouped ? 'Ungroup' : 'Group by'}
          </DropdownMenuItem>
        ) : null}
        {canPin ? (
          <>
            <Menu.Separator />
            <DropdownMenuItem
              value={`${column.id}-pin-left`}
              disabled={pinned === 'left'}
              icon={<IconPinned size={16} />}
              onSelect={() => column.pin('left')}
            >
              Pin left
            </DropdownMenuItem>
            <DropdownMenuItem
              value={`${column.id}-pin-right`}
              disabled={pinned === 'right'}
              icon={<IconPinned size={16} />}
              onSelect={() => column.pin('right')}
            >
              Pin right
            </DropdownMenuItem>
            {pinned ? (
              <DropdownMenuItem
                value={`${column.id}-unpin`}
                icon={<IconPinned size={16} opacity={0.45} />}
                onSelect={() => column.pin(false)}
              >
                Unpin
              </DropdownMenuItem>
            ) : null}
          </>
        ) : null}
        {canHide ? (
          <>
            <Menu.Separator />
            <DropdownMenuItem
              value={`${column.id}-hide`}
              icon={<IconEyeOff size={16} />}
              onSelect={() => column.toggleVisibility(false)}
            >
              Hide
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenu>
    </HStack>
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
    <FloatingPanel
      open={opened}
      onOpenChange={setOpened}
      width="320px"
      trigger={
        <Button variant="outline" size="sm">
          <IconSettings size={16} />
          View
        </Button>
      }
    >
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
                  <HStack justify="space-between" wrap="nowrap">
                    <CheckboxField
                      checked={column.getIsVisible()}
                      label={column.columnDef.meta?.label ?? column.id}
                      onCheckedChange={(checked) =>
                        column.toggleVisibility(checked)
                      }
                    />
                    <IconGripVertical size={16} opacity={0.45} />
                  </HStack>
                </SortableFrame>
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      </Stack>
    </FloatingPanel>
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
    <FloatingPanel
      open={opened}
      onOpenChange={setOpened}
      width="520px"
      trigger={
        <Button variant="outline" size="sm">
          <IconArrowsSort size={16} />
          Sort
          {sorting.length ? (
            <Badge fontSize="sm">{sorting.length}</Badge>
          ) : null}
        </Button>
      }
    >
      <Stack gap="md">
        <Text fontWeight="semibold">
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
                  <HStack wrap="nowrap" align="flex-end">
                    <IconGripVertical size={18} opacity={0.45} />
                    <SelectField
                      label="Column"
                      options={columnOptions}
                      value={sort.id}
                      onChange={(value) => {
                        if (value) updateSort(index, { id: value })
                      }}
                      flex={1}
                    />
                    <SelectField
                      label="Direction"
                      options={[
                        { value: 'asc', label: 'Asc' },
                        { value: 'desc', label: 'Desc' },
                      ]}
                      value={sort.desc ? 'desc' : 'asc'}
                      onChange={(value) =>
                        updateSort(index, { desc: value === 'desc' })
                      }
                      width="110px"
                    />
                    <IconButton
                      variant="subtle"
                      color="red"
                      aria-label="Remove sort"
                      onClick={() =>
                        onSortingChange((current) =>
                          current.filter((_, sortIndex) => sortIndex !== index),
                        )
                      }
                    >
                      <IconTrash size={16} />
                    </IconButton>
                  </HStack>
                </SortableFrame>
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
        <HStack>
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
        </HStack>
      </Stack>
    </FloatingPanel>
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
    return <Text color="fg.muted">No value required</Text>
  }

  if (variant === 'select') {
    const options = column.columnDef.meta?.options ?? []
    return (
      <SelectField
        label="Value"
        options={options}
        value={typeof filter.value === 'string' ? filter.value : null}
        onChange={(value) => onFilterUpdate(filter.filterId!, { value })}
      />
    )
  }

  if (variant === 'multi-select') {
    const options = column.columnDef.meta?.options ?? []
    return (
      <MultiSelectField
        label="Value"
        options={options}
        value={Array.isArray(filter.value) ? filter.value : []}
        onChange={(value) => onFilterUpdate(filter.filterId!, { value })}
      />
    )
  }

  if (variant === 'date') {
    if (operator === 'inRange') {
      const value = Array.isArray(filter.value) ? filter.value : []
      return (
        <HStack align="flex-end" width="100%">
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
        </HStack>
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
    <FloatingPanel
      open={opened}
      onOpenChange={setOpened}
      width="760px"
      trigger={
        <Button variant="outline" size="sm">
          <IconFilter size={16} />
          Filter
          {columnFilters.length ? (
            <Badge fontSize="sm">{columnFilters.length}</Badge>
          ) : null}
        </Button>
      }
    >
      <Stack gap="md">
        <Text fontWeight="semibold">Filters</Text>
        {columnFilters.map((filter, index) => {
          const column = table.getColumn(filter.id)
          if (!column || !filter.filterId) return null
          const variant = column.columnDef.meta?.variant ?? 'text'
          const operators = getFilterOperators(variant)
          return (
            <HStack key={filter.filterId} align="flex-end" wrap="nowrap">
              {index === 0 ? (
                <Text width="70px" pb="8">
                  Where
                </Text>
              ) : index === 1 ? (
                <SelectField
                  options={[
                    { value: 'and', label: 'and' },
                    { value: 'or', label: 'or' },
                  ]}
                  value={filter.joinOperator ?? 'and'}
                  onChange={(joinOperator) => {
                    if (!joinOperator) return
                    onColumnFiltersChange((current) =>
                      current.map((item) => ({
                        ...item,
                        joinOperator: joinOperator as JoinOperator,
                      })),
                    )
                  }}
                  width="90px"
                />
              ) : (
                <Text width="70px" pb="8">
                  {filter.joinOperator ?? 'and'}
                </Text>
              )}
              <SelectField
                label="Field"
                options={fieldOptions}
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
                width="190px"
              />
              <SelectField
                label="Operator"
                options={operators.map((operator) => ({
                  value: operator.value,
                  label: operator.label,
                }))}
                value={filter.operator ?? operators[0].value}
                onChange={(operator) => {
                  if (!operator) return
                  updateFilter(filter.filterId!, {
                    operator: operator as FilterOperator,
                    value: '',
                  })
                }}
                width="180px"
              />
              <Box style={{ flex: 1 }}>
                <FilterValueInput
                  column={column}
                  filter={filter}
                  onFilterUpdate={updateFilter}
                />
              </Box>
              <IconButton
                variant="subtle"
                color="red"
                aria-label="Remove filter"
                onClick={() =>
                  onColumnFiltersChange((current) =>
                    current.filter((item) => item.filterId !== filter.filterId),
                  )
                }
              >
                <IconTrash size={16} />
              </IconButton>
            </HStack>
          )
        })}
        <HStack>
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
        </HStack>
      </Stack>
    </FloatingPanel>
  )
}

function Pagination({ table }: { table: AppTable }) {
  const pageIndex = table.state.pagination.pageIndex
  const pageSize = table.state.pagination.pageSize

  return (
    <HStack justify="space-between" p="sm">
      <Text fontSize="sm" color="fg.muted">
        {table.getFilteredSelectedRowModel().rows.length.toLocaleString()} of{' '}
        {table.getFilteredRowModel().rows.length.toLocaleString()} row(s)
        selected.
      </Text>
      <HStack gap="xs">
        <Text fontSize="sm">Rows per page:</Text>
        <SelectField
          aria-label="Rows per page"
          options={['10', '20', '30', '40', '50']}
          value={String(pageSize)}
          onChange={(value) => {
            table.setPageSize(Number(value))
            table.setPageIndex(0)
          }}
          width="90px"
        />
        <IconButton
          variant="subtle"
          aria-label="First page"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <IconChevronsLeft size={18} />
        </IconButton>
        <IconButton
          variant="subtle"
          aria-label="Previous page"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <IconChevronLeft size={18} />
        </IconButton>
        <Text fontSize="sm">
          {pageIndex + 1} / {table.getPageCount()}
        </Text>
        <IconButton
          variant="subtle"
          aria-label="Next page"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <IconChevronRight size={18} />
        </IconButton>
        <IconButton
          variant="subtle"
          aria-label="Last page"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <IconChevronsRight size={18} />
        </IconButton>
      </HStack>
    </HStack>
  )
}

function ModeMenu() {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const icon =
    resolvedTheme === 'dark' ? <IconMoon size={18} /> : <IconSun size={18} />

  return (
    <DropdownMenu
      width="150px"
      trigger={
        <IconButton variant="subtle" aria-label="Theme" title="Theme">
          {icon}
        </IconButton>
      }
    >
      {(
        [
          { value: 'light', label: 'Light', icon: <IconSun size={16} /> },
          { value: 'dark', label: 'Dark', icon: <IconMoon size={16} /> },
          {
            value: 'system',
            label: 'System',
            icon: <IconDeviceDesktop size={16} />,
          },
        ] satisfies Array<{
          value: 'light' | 'dark' | 'system'
          label: string
          icon: React.ReactNode
        }>
      ).map((item) => (
        <DropdownMenuItem
          key={item.value}
          value={`theme-${item.value}`}
          icon={item.icon}
          colorPalette={theme === item.value ? 'blue' : undefined}
          onSelect={() => setTheme(item.value)}
        >
          {item.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
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

  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })

  return (
    <TextInput
      {...props}
      value={value}
      onChange={(event) => {
        setValue(event.currentTarget.value)
        debouncedOnChange(event.currentTarget.value)
      }}
    />
  )
}

function App() {
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

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: 'select',
          header: ({ table }) => (
            <CheckboxField
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={
                !table.getIsAllPageRowsSelected() &&
                table.getIsSomePageRowsSelected()
              }
              onCheckedChange={(checked) =>
                table.toggleAllPageRowsSelected(checked)
              }
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <CheckboxField
              checked={row.getIsSelected()}
              onCheckedChange={(checked) => row.toggleSelected(checked)}
              aria-label="Select row"
            />
          ),
          maxSize: 48,
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
          cell: (info) => <Text fontSize="sm">{String(info.getValue())}</Text>,
          aggregationFn: 'mean',
          aggregatedCell: ({ getValue }) => (
            <Text fontSize="sm" color="fg.muted">
              Avg: {Math.round(Number(getValue()) * 10) / 10}
            </Text>
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
          cell: (info) => formatDate(info.getValue<string>()),
          aggregationFn: 'min',
          aggregatedCell: ({ getValue }) => {
            const earliest = getValue<string>()
            return (
              <Text fontSize="sm" color="fg.muted">
                Earliest: {earliest ? formatDate(earliest) : '-'}
              </Text>
            )
          },
          meta: { label: 'Join Date', variant: 'date' },
        }),
        columnHelper.display({
          id: 'actions',
          enableHiding: false,
          cell: ({ row }) => <RowActions person={row.original} />,
          maxSize: 44,
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
      key: 'kitchen-sink-chakra-ui', // needed for devtools
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
  const stressTest = () => setData(makeData(1_000_000))

  return (
    <SortingContext.Provider value={sorting}>
      <Container maxW="none" py="md">
        <Stack gap="md">
          <Box borderWidth="1px" rounded="md" p="sm">
            <HStack justify="flex-end" gap="xs">
              <ModeMenu />
              <Button variant="outline" size="sm" onClick={refreshData}>
                Regenerate Data
              </Button>
              <Button variant="outline" size="sm" onClick={stressTest}>
                Stress Test (1M rows)
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
            </HStack>
          </Box>

          <HStack align="center" gap="xs">
            <DebouncedTextInput
              value={globalFilter}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
              icon={<IconSearch size={16} />}
              width={{ base: '100%', md: '360px' }}
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
          </HStack>

          <Box borderWidth="1px" rounded="md">
            <Box overflow="auto" maxH="680px">
              <Table.Root
                stickyHeader
                interactive
                showColumnBorder
                variant="outline"
                style={{
                  minWidth: 1200,
                  width: `max(1200px, ${table.getTotalSize()}px)`,
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
                <Table.Header>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Table.Row key={headerGroup.id}>
                      {headerGroup.headers
                        .filter((header) => header.column.getIsVisible())
                        .map((header) => (
                          <ResizableHeaderCell
                            key={header.id}
                            header={header}
                            table={table}
                          />
                        ))}
                    </Table.Row>
                  ))}
                </Table.Header>
                <Table.Body>
                  {table.getRowModel().rows.map((row) => {
                    const selected = row.getIsSelected()
                    return (
                      <Table.Row
                        key={row.id}
                        aria-selected={selected}
                        data-selected={selected || undefined}
                        bg={
                          selected
                            ? 'var(--chakra-colors-blue-subtle)'
                            : undefined
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Table.Cell
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
                                <table.FlexRender cell={cell} />
                                <Text as="span" color="fg.muted" ml="4">
                                  ({row.subRows.length})
                                </Text>
                              </Button>
                            ) : cell.column.id === 'progress' ? (
                              <Stack gap={4}>
                                <Text fontSize="sm">
                                  {String(cell.getValue())}%
                                </Text>
                                <ProgressBar value={Number(cell.getValue())} />
                              </Stack>
                            ) : (
                              <table.FlexRender cell={cell} />
                            )}
                          </Table.Cell>
                        ))}
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
            <Pagination table={table} />
          </Box>
        </Stack>
      </Container>
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
    <Table.ColumnHeader
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
                ? 'var(--chakra-colors-blue-solid)'
                : 'transparent',
            }}
          />
        ) : null}
      </Box>
    </Table.ColumnHeader>
  )
}

function Root() {
  return (
    <ChakraExampleProvider>
      <App />
      <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
    </ChakraExampleProvider>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
