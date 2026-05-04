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
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import CheckIcon from '@mui/icons-material/Check'
import CodeIcon from '@mui/icons-material/Code'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'
import GroupIcon from '@mui/icons-material/Group'
import LightModeIcon from '@mui/icons-material/LightMode'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PushPinIcon from '@mui/icons-material/PushPin'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SortIcon from '@mui/icons-material/Sort'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  CssBaseline,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table as MuiTable,
  Paper,
  Popover,
  Select,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  createTheme,
  useMediaQuery,
} from '@mui/material'
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
      sx={{
        opacity: isDragging ? 0.6 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
        '&:active': {
          cursor: 'grabbing',
        },
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
      ? '-4px 0 4px -4px rgba(0, 0, 0, 0.3) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px rgba(0, 0, 0, 0.3) inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    background: isSelected
      ? 'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-selectedOpacity))'
      : isPinned
        ? 'var(--mui-palette-background-paper)'
        : undefined,
    zIndex: isPinned ? 2 : 0,
  }
}

function DepartmentIcon({ department }: { department: Person['department'] }) {
  const icons: Record<Person['department'], React.ReactElement> = {
    engineering: <CodeIcon fontSize="inherit" />,
    marketing: <SystemUpdateAltIcon fontSize="inherit" />,
    sales: <ShoppingCartIcon fontSize="inherit" />,
    hr: <GroupIcon fontSize="inherit" />,
    finance: <CreditCardIcon fontSize="inherit" />,
  }

  return icons[department]
}

function DepartmentChip({ department }: { department: Person['department'] }) {
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

function EllipsisText({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="span"
      sx={{
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

function StatusChip({ status }: { status: Person['status'] }) {
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

function RowActions({ person }: { person: Person }) {
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

function ColumnHeaderMenu({
  column,
  title,
}: {
  column: AppColumn
  title: string
}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const canSort = column.getCanSort()
  const canHide = column.getCanHide()
  const canPin = column.getCanPin()
  const canGroup = column.getCanGroup()
  const sorting = React.useContext(SortingContext)
  const direction = canSort ? getSortDirection(sorting, column.id) : undefined
  const isSorted = !!direction
  const pinned = canPin ? column.getIsPinned() : false
  const grouped = canGroup ? column.getIsGrouped() : false

  if (!canSort && !canHide && !canPin && !canGroup) {
    return <Typography variant="subtitle2">{title}</Typography>
  }

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      {canSort ? (
        <TableSortLabel
          active={isSorted}
          direction={direction}
          IconComponent={ArrowDownwardIcon}
          onClick={column.getToggleSortingHandler()}
        >
          {title}
        </TableSortLabel>
      ) : (
        <Typography variant="subtitle2">{title}</Typography>
      )}
      <IconButton
        size="small"
        aria-label={`Open ${title} column menu`}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <ArrowDropDownIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {canSort && (
          <Box>
            <MenuItem onClick={() => column.toggleSorting(false)}>
              <ListItemIcon>
                <ArrowUpwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Asc</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => column.toggleSorting(true)}>
              <ListItemIcon>
                <ArrowDownwardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Desc</ListItemText>
            </MenuItem>
          </Box>
        )}
        {canGroup && (
          <MenuItem onClick={column.getToggleGroupingHandler()}>
            <ListItemIcon>
              <GroupIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{grouped ? 'Ungroup' : 'Group by'}</ListItemText>
          </MenuItem>
        )}
        {canPin && (
          <Box>
            <Divider />
            <MenuItem
              disabled={pinned === 'left'}
              onClick={() => column.pin('left')}
            >
              <ListItemIcon>
                <PushPinIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Pin left</ListItemText>
            </MenuItem>
            <MenuItem
              disabled={pinned === 'right'}
              onClick={() => column.pin('right')}
            >
              <ListItemIcon>
                <PushPinIcon fontSize="small" sx={{ rotate: '180deg' }} />
              </ListItemIcon>
              <ListItemText>Pin right</ListItemText>
            </MenuItem>
            {pinned ? (
              <MenuItem onClick={() => column.pin(false)}>
                <ListItemIcon>
                  <PushPinIcon fontSize="small" color="disabled" />
                </ListItemIcon>
                <ListItemText>Unpin</ListItemText>
              </MenuItem>
            ) : null}
          </Box>
        )}
        {canHide && (
          <Box>
            <Divider />
            <MenuItem onClick={() => column.toggleVisibility(false)}>
              <ListItemIcon>
                <VisibilityOffIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Hide</ListItemText>
            </MenuItem>
          </Box>
        )}
      </Menu>
    </Stack>
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
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
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<SettingsIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        View
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Stack spacing={1.5} sx={{ width: 300, p: 2 }}>
          <TextField
            size="small"
            label="Search columns"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
              <List dense disablePadding>
                {columns.map((column) => (
                  <SortableFrame key={column.id} id={column.id}>
                    <ListItem
                      disablePadding
                      secondaryAction={
                        <DragIndicatorIcon color="disabled" fontSize="small" />
                      }
                    >
                      <ListItemButton
                        dense
                        onClick={() =>
                          column.toggleVisibility(!column.getIsVisible())
                        }
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            size="small"
                            checked={column.getIsVisible()}
                            tabIndex={-1}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={column.columnDef.meta?.label ?? column.id}
                        />
                      </ListItemButton>
                    </ListItem>
                  </SortableFrame>
                ))}
              </List>
            </SortableContext>
          </DndContext>
        </Stack>
      </Popover>
    </>
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )
  const sortableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanSort())

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
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<SortIcon />}
        endIcon={
          sorting.length ? <Chip size="small" label={sorting.length} /> : null
        }
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Sort
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Stack spacing={2} sx={{ width: 480, p: 2 }}>
          <Typography variant="subtitle1">
            {sorting.length ? 'Sort by' : 'No sorting applied'}
          </Typography>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={sorting.map((sort) => sort.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing={1}>
                {sorting.map((sort, index) => (
                  <SortableFrame key={sort.id} id={sort.id}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <DragIndicatorIcon color="disabled" />
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={sortableColumns}
                        value={
                          sortableColumns.find(
                            (column) => column.id === sort.id,
                          ) ?? null
                        }
                        getOptionLabel={(column) =>
                          column.columnDef.meta?.label ?? column.id
                        }
                        onChange={(_, column) => {
                          if (column) updateSort(index, { id: column.id })
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Column" />
                        )}
                      />
                      <FormControl size="small" sx={{ minWidth: 110 }}>
                        <InputLabel>Direction</InputLabel>
                        <Select
                          label="Direction"
                          value={sort.desc ? 'desc' : 'asc'}
                          onChange={(event) =>
                            updateSort(index, {
                              desc: event.target.value === 'desc',
                            })
                          }
                        >
                          <MenuItem value="asc">Asc</MenuItem>
                          <MenuItem value="desc">Desc</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton
                        size="small"
                        aria-label="Remove sort"
                        onClick={() =>
                          onSortingChange((current) =>
                            current.filter(
                              (_, sortIndex) => sortIndex !== index,
                            ),
                          )
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </SortableFrame>
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              onClick={addSort}
              disabled={sorting.length >= sortableColumns.length}
            >
              Add sort
            </Button>
            <Button size="small" onClick={() => table.resetSorting()}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
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
    return <Typography color="text.secondary">No value required</Typography>
  }

  if (variant === 'select' || variant === 'multi-select') {
    const options = column.columnDef.meta?.options ?? []
    const multiple = variant === 'multi-select'
    const value = multiple
      ? options.filter(
          (option) =>
            Array.isArray(filter.value) && filter.value.includes(option.value),
        )
      : (options.find((option) => option.value === filter.value) ?? null)

    return (
      <Autocomplete
        size="small"
        multiple={multiple}
        options={options}
        value={value}
        getOptionLabel={(option) => option.label}
        onChange={(_, nextValue) => {
          onFilterUpdate(filter.filterId!, {
            value: Array.isArray(nextValue)
              ? nextValue.map((option) => option.value)
              : nextValue?.value,
          })
        }}
        renderInput={(params) => <TextField {...params} label="Value" />}
      />
    )
  }

  if (variant === 'date') {
    if (operator === 'inRange') {
      const value = Array.isArray(filter.value) ? filter.value : []
      return (
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            label="From"
            type="date"
            value={toDateInputValue(value[0])}
            onChange={(event) =>
              onFilterUpdate(filter.filterId!, {
                value: [
                  event.target.value
                    ? new Date(event.target.value).toISOString()
                    : undefined,
                  value[1],
                ],
              })
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            size="small"
            label="To"
            type="date"
            value={toDateInputValue(value[1])}
            onChange={(event) =>
              onFilterUpdate(filter.filterId!, {
                value: [
                  value[0],
                  event.target.value
                    ? new Date(event.target.value).toISOString()
                    : undefined,
                ],
              })
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      )
    }

    return (
      <TextField
        size="small"
        label="Value"
        type="date"
        value={toDateInputValue(filter.value)}
        onChange={(event) =>
          onFilterUpdate(filter.filterId!, {
            value: event.target.value
              ? new Date(event.target.value).toISOString()
              : undefined,
          })
        }
        slotProps={{ inputLabel: { shrink: true } }}
      />
    )
  }

  if (variant === 'number') {
    return (
      <TextField
        size="small"
        label="Value"
        type="number"
        value={filter.value ?? ''}
        onChange={(event) =>
          onFilterUpdate(filter.filterId!, {
            value: event.target.value === '' ? '' : Number(event.target.value),
          })
        }
      />
    )
  }

  return (
    <TextField
      size="small"
      label="Value"
      value={filter.value ?? ''}
      onChange={(event) =>
        onFilterUpdate(filter.filterId!, { value: event.target.value })
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const filterableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanFilter())

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
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<FilterListIcon />}
        endIcon={
          columnFilters.length ? (
            <Chip size="small" label={columnFilters.length} />
          ) : null
        }
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Filter
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Stack spacing={2} sx={{ width: 720, p: 2 }}>
          <Typography variant="subtitle1">Filters</Typography>
          {columnFilters.map((filter, index) => {
            const column = table.getColumn(filter.id)
            if (!column || !filter.filterId) return null
            const variant = column.columnDef.meta?.variant ?? 'text'
            const operators = getFilterOperators(variant)
            return (
              <Stack
                key={filter.filterId}
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center' }}
              >
                {index === 0 ? (
                  <Typography sx={{ width: 70 }}>Where</Typography>
                ) : index === 1 ? (
                  <FormControl size="small" sx={{ width: 90 }}>
                    <Select
                      value={filter.joinOperator ?? 'and'}
                      onChange={(event) => {
                        const joinOperator = event.target.value
                        onColumnFiltersChange((current) =>
                          current.map((item) => ({ ...item, joinOperator })),
                        )
                      }}
                    >
                      <MenuItem value="and">and</MenuItem>
                      <MenuItem value="or">or</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Typography sx={{ width: 70 }}>
                    {filter.joinOperator ?? 'and'}
                  </Typography>
                )}
                <Autocomplete
                  size="small"
                  sx={{ width: 190 }}
                  options={filterableColumns}
                  value={column}
                  getOptionLabel={(option) =>
                    option.columnDef.meta?.label ?? option.id
                  }
                  onChange={(_, nextColumn) => {
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
                  renderInput={(params) => (
                    <TextField {...params} label="Field" />
                  )}
                />
                <FormControl size="small" sx={{ width: 180 }}>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    label="Operator"
                    value={filter.operator ?? operators[0].value}
                    onChange={(event) =>
                      updateFilter(filter.filterId!, {
                        operator: event.target.value,
                        value: '',
                      })
                    }
                  >
                    {operators.map((operator) => (
                      <MenuItem key={operator.value} value={operator.value}>
                        {operator.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ flex: 1 }}>
                  <FilterValueInput
                    column={column}
                    filter={filter}
                    onFilterUpdate={updateFilter}
                  />
                </Box>
                <IconButton
                  aria-label="Remove filter"
                  onClick={() =>
                    onColumnFiltersChange((current) =>
                      current.filter(
                        (item) => item.filterId !== filter.filterId,
                      ),
                    )
                  }
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            )
          })}
          <Stack direction="row" spacing={1}>
            <Button variant="contained" size="small" onClick={addFilter}>
              Add filter
            </Button>
            <Button size="small" onClick={() => onColumnFiltersChange([])}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  )
}

function Pagination({ table }: { table: AppTable }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ p: 1, alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Typography variant="body2" color="text.secondary">
        {table.getFilteredSelectedRowModel().rows.length.toLocaleString()} of{' '}
        {table.getFilteredRowModel().rows.length.toLocaleString()} row(s)
        selected.
      </Typography>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <TablePagination
          component="div"
          count={table.getFilteredRowModel().rows.length}
          page={table.store.state.pagination.pageIndex}
          rowsPerPage={table.store.state.pagination.pageSize}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
          showFirstButton
          showLastButton
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={(event) => {
            table.setPageSize(Number(event.target.value))
            table.setPageIndex(0)
          }}
        />
      </Stack>
    </Stack>
  )
}

function ModeMenu({
  mode,
  setMode,
}: {
  mode: 'light' | 'dark' | 'system'
  setMode: React.Dispatch<React.SetStateAction<'light' | 'dark' | 'system'>>
}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  return (
    <>
      <Tooltip title="Theme">
        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
          {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {(['light', 'dark', 'system'] as const).map((themeMode) => (
          <MenuItem
            key={themeMode}
            selected={themeMode === mode}
            onClick={() => {
              setMode(themeMode)
              setAnchorEl(null)
            }}
          >
            {toSentenceCase(themeMode)}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

function DebouncedTextField({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.ComponentProps<typeof TextField>, 'onChange'>) {
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
    <TextField
      {...props}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  )
}

function App({
  mode,
  setMode,
}: {
  mode: 'light' | 'dark' | 'system'
  setMode: React.Dispatch<React.SetStateAction<'light' | 'dark' | 'system'>>
}) {
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
            onChange={(_, checked) => table.toggleAllPageRowsSelected(checked)}
            slotProps={{ input: { 'aria-label': 'Select all' } }}
            size="small"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={(_, checked) => row.toggleSelected(checked)}
            slotProps={{ input: { 'aria-label': 'Select row' } }}
            size="small"
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
        cell: (info) => (
          <Typography variant="body2">{String(info.getValue())}</Typography>
        ),
        aggregationFn: 'mean',
        aggregatedCell: ({ getValue }) => (
          <Typography variant="body2" color="text.secondary">
            Avg: {Math.round(Number(getValue()) * 10) / 10}
          </Typography>
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
          return status ? <StatusChip status={status} /> : null
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
          return department ? <DepartmentChip department={department} /> : null
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
            <Typography variant="body2" color="text.secondary">
              Earliest: {earliest ? formatDate(earliest) : '—'}
            </Typography>
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
  const stressTest = () => setData(makeData(200_000))

  return (
    <SortingContext.Provider value={sorting}>
      <Container maxWidth={false} sx={{ py: 3 }}>
        <Stack spacing={2}>
          <Paper variant="outlined">
            <Toolbar
              sx={{ gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}
            >
              <ModeMenu mode={mode} setMode={setMode} />
              <Button variant="outlined" size="small" onClick={refreshData}>
                Regenerate Data
              </Button>
              <Button variant="outlined" size="small" onClick={stressTest}>
                Stress Test (200k rows)
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => rerender()}
              >
                Force Rerender
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  console.info(
                    'table.getSelectedRowModel().flatRows',
                    table.getSelectedRowModel().flatRows,
                  )
                }
              >
                Log Selected Rows
              </Button>
            </Toolbar>
          </Paper>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            sx={{ alignItems: { md: 'center' } }}
          >
            <DebouncedTextField
              value={globalFilter}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
              size="small"
              sx={{ width: { xs: '100%', md: 360 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
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
          </Stack>

          <Paper variant="outlined">
            <TableContainer sx={{ maxHeight: 680 }}>
              <MuiTable
                stickyHeader
                size="small"
                sx={{
                  width: '100%',
                  tableLayout: 'fixed',
                  ...columnSizeVars,
                }}
              >
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers
                        .filter((header) => header.column.getIsVisible())
                        .map((header) => (
                          <ResizableHeaderCell
                            key={header.id}
                            header={header}
                            table={table}
                          />
                        ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      hover
                      selected={row.getIsSelected()}
                      aria-selected={row.getIsSelected()}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          align={
                            cell.column.id === 'select' ? 'center' : 'left'
                          }
                          sx={{
                            width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                            overflow: 'hidden',
                            borderRight:
                              cell.column.id === 'actions' ? undefined : 1,
                            borderColor: 'divider',
                            ...getCommonPinningStyles(
                              cell.column,
                              row.getIsSelected(),
                            ),
                          }}
                        >
                          {cell.getIsGrouped() ? (
                            <Button
                              size="small"
                              variant="text"
                              startIcon={
                                row.getIsExpanded() ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              }
                              onClick={row.getToggleExpandedHandler()}
                              disabled={!row.getCanExpand()}
                              sx={{ pl: row.depth * 2 + 1 }}
                            >
                              <table.FlexRender cell={cell} />
                              <Typography
                                component="span"
                                color="text.secondary"
                                sx={{ ml: 1 }}
                              >
                                ({row.subRows.length})
                              </Typography>
                            </Button>
                          ) : cell.column.id === 'progress' ? (
                            <Stack spacing={0.5}>
                              <Typography variant="body2">
                                {String(cell.getValue())}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={Number(cell.getValue())}
                              />
                            </Stack>
                          ) : (
                            <table.FlexRender cell={cell} />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </MuiTable>
            </TableContainer>
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
    <TableCell
      colSpan={header.colSpan}
      align={header.column.id === 'select' ? 'center' : 'left'}
      sortDirection={sortDirection || false}
      aria-sort={getAriaSort(sortDirection || false)}
      data-sort={sortDirection}
      sx={{
        width: `calc(var(--header-${header.id}-size) * 1px)`,
        borderRight: header.id === 'actions' ? undefined : 1,
        borderColor: 'divider',
        p: 1,
        ...getCommonPinningStyles(header.column),
      }}
    >
      <Box
        sx={{ position: 'relative', pr: header.column.getCanResize() ? 1 : 0 }}
      >
        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
        {header.column.getCanResize() ? (
          <Box
            onDoubleClick={() => header.column.resetSize()}
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            sx={{
              position: 'absolute',
              top: 0,
              right: -6,
              width: 6,
              height: '100%',
              cursor: 'col-resize',
              touchAction: 'none',
              bgcolor: header.column.getIsResizing()
                ? 'primary.main'
                : 'transparent',
              '&:hover': { bgcolor: 'primary.main' },
            }}
          />
        ) : null}
      </Box>
    </TableCell>
  )
}

function Root() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = React.useState<'light' | 'dark' | 'system'>('system')
  const resolvedMode =
    mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedMode,
        },
      }),
    [resolvedMode],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App mode={mode} setMode={setMode} />
    </ThemeProvider>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
