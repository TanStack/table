'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import '@/styles/globals.css'

import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  CreditCard,
  Megaphone,
  MoreHorizontal,
  Search,
  ShoppingCart,
  Users,
  XCircle,
} from 'lucide-react'
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
import type {
  CellData,
  Column,
  ColumnDef,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  RowData,
  SortingState,
  TableFeatures,
} from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '@/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { departments, makeData, statuses } from '@/lib/make-data'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, formatDate, toSentenceCase } from '@/lib/utils'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { DataTableFilterList } from '@/components/data-table/data-table-filter-list'
import { dynamicFilterFn, fuzzyFilter } from '@/lib/data-table'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { Input } from '@/components/ui/input'

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

/**
 * CSS for left/right pinned columns. Verbatim port of the helper from
 * `examples/react/column-pinning-sticky/src/main.tsx` so a pinned column gets
 * `position: sticky` plus the appropriate offset and edge shadow.
 */
function getCommonPinningStyles(
  column: Column<typeof _features, Person>,
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
    background: isSelected
      ? 'var(--muted)'
      : isPinned
        ? 'var(--background)'
        : undefined,
    zIndex: isPinned ? 1 : 0,
  }
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

  const columns = React.useMemo<Array<ColumnDef<typeof _features, Person>>>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-0.5"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-0.5"
          />
        ),
        maxSize: 40,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
      {
        id: 'firstName',
        accessorKey: 'firstName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="First Name" />
        ),
        cell: (info) => String(info.getValue()),
        meta: {
          label: 'First Name',
          variant: 'text',
        },
      },
      {
        id: 'lastName',
        accessorFn: (row) => row.lastName,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Name" />
        ),
        cell: (info) => String(info.getValue()),
        meta: {
          label: 'Last Name',
          variant: 'text',
        },
      },
      {
        id: 'age',
        accessorKey: 'age',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Age" />
        ),
        cell: (info) => <span>{String(info.getValue())}</span>,
        aggregationFn: 'mean',
        aggregatedCell: ({ getValue }) => (
          <span className="text-muted-foreground">
            Avg: {Math.round(Number(getValue()) * 10) / 10}
          </span>
        ),
        meta: {
          label: 'Age',
          variant: 'number',
        },
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: (info) => info.cell.getValue<string>(),
        meta: {
          label: 'Email',
          variant: 'text',
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: (info) => {
          const status = info.getValue<Person['status'] | undefined>()
          // Group/aggregated rows can pass undefined here — bail out cleanly.
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
        },
        // Enum column has no useful aggregation; render nothing on group rows.
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
          <DataTableColumnHeader column={column} title="Department" />
        ),
        cell: (info) => {
          const department = info.getValue<Person['department'] | undefined>()
          // Group/aggregated rows can pass undefined here — bail out cleanly.
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
        },
        // Enum column has no useful aggregation; render nothing on group rows.
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
          <DataTableColumnHeader column={column} title="Join Date" />
        ),
        cell: (info) => formatDate(info.getValue<string>()),
        aggregationFn: 'min',
        aggregatedCell: ({ getValue }) => {
          const earliest = getValue<string>()
          return (
            <span className="text-muted-foreground">
              Earliest: {earliest ? formatDate(earliest) : '—'}
            </span>
          )
        },
        meta: {
          label: 'Join Date',
          variant: 'date',
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const person = row.original
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
        },
        maxSize: 30,
        enableResizing: false,
      },
    ],
    [],
  )

  const [data, setData] = React.useState(() => makeData(1_000))
  const [columnOrder, setColumnOrder] = React.useState<Array<string>>(() =>
    columns.map((c) => c.id ?? ''),
  )

  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(100_000))

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
    (state) => state, // subscribe to all re-renders
  )

  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.store.state.columnSizing])

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center justify-end gap-2">
        <ModeToggle />
        <Button variant="outline" size="sm" onClick={() => refreshData()}>
          Regenerate Data
        </Button>
        <Button variant="outline" size="sm" onClick={() => stressTest()}>
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
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <DebouncedInput
              value={globalFilter}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
              className="pl-8"
            />
          </div>
          <DataTableFilterList
            table={table}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
          />
          <DataTableSortList
            table={table}
            sorting={sorting}
            onSortingChange={setSorting}
          />
          <DataTableViewOptions
            table={table}
            columnOrder={columnOrder}
            onColumnOrderChange={setColumnOrder}
          />
        </div>
        <div className="rounded-md border">
          <Table style={{ ...columnSizeVars }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers
                    .filter((header) => header.column.getIsVisible())
                    .map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className={cn('relative', {
                            'border-r': header.id !== 'actions',
                          })}
                          style={{
                            width: `calc(var(--header-${header.id}-size) * 1px)`,
                            ...getCommonPinningStyles(header.column),
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                          )}
                          {header.column.getCanResize() && (
                            <div
                              onDoubleClick={() => header.column.resetSize()}
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              className={cn(
                                'absolute right-[-2px] z-10 top-1/2 h-6 w-[3px] -translate-y-1/2 cursor-e-resize select-none touch-none rounded-md transition-colors hover:bg-blue-600 before:absolute before:left-[-4px] before:right-[-4px] before:top-0 before:h-full before:content-[""]',
                                header.column.getIsResizing() && 'bg-blue-600',
                              )}
                            />
                          )}
                        </TableHead>
                      )
                    })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    aria-selected={row.getIsSelected()}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            cell.column.id === 'actions' ? '' : 'border-r'
                          }
                          style={{
                            width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                            ...getCommonPinningStyles(
                              cell.column,
                              row.getIsSelected(),
                            ),
                          }}
                        >
                          {cell.getIsGrouped() ? (
                            // Group header cell: chevron toggles row expansion,
                            // count shows number of rows in the group.
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
                              <table.FlexRender cell={cell} />
                              <span className="text-muted-foreground">
                                ({row.subRows.length})
                              </span>
                            </Button>
                          ) : (
                            // FlexRender now dispatches based on cell mode:
                            // aggregated → columnDef.aggregatedCell (or
                            // columnDef.cell), placeholder → null, otherwise
                            // columnDef.cell. So we don't need to branch here.
                            <table.FlexRender cell={cell} />
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}

// Small debounced wrapper around the shadcn Input — adapted from
// `examples/react/filters-fuzzy/src/main.tsx` so the global filter doesn't
// run on every keystroke at 100k rows.
function DebouncedInput({
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

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
