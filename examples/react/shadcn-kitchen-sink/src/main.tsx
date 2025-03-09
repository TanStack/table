'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import '@/styles/globals.css'

import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  CreditCard,
  Megaphone,
  MoreHorizontal,
  ShoppingCart,
  Users,
  XCircle,
} from 'lucide-react'
import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnOrderingFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createCoreRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  flexRender,
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
  ColumnDef,
  ColumnSizingState,
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

import { makeData } from '@/lib/make-data'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options'

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
import { dynamicFilterFn } from '@/lib/data-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    label?: string
    variant?: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi-select'
  }
}

const _features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnFilteringFeature,
  columnFacetingFeature,
  columnOrderingFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnResizingFeature,
})

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [rowSelection, setRowSelection] = React.useState({})
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<
    Array<ExtendedColumnFilter>
  >([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({})

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
        maxSize: 30,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
      {
        id: 'firstName',
        accessorKey: 'firstName',
        header: 'First Name',
        cell: (info) => String(info.getValue()),
        meta: {
          label: 'First Name',
          variant: 'text',
        },
      },
      {
        id: 'lastName',
        accessorFn: (row) => row.lastName,
        header: 'Last Name',
        cell: (info) => String(info.getValue()),
        meta: {
          label: 'Last Name',
          variant: 'text',
        },
      },
      {
        id: 'age',
        accessorKey: 'age',
        header: 'Age',
        cell: (info) => <span>{String(info.getValue())}</span>,
        meta: {
          label: 'Age',
          variant: 'number',
        },
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => info.cell.getValue<string>(),
        meta: {
          label: 'Email',
          variant: 'text',
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue<Person['status']>()
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
        meta: {
          label: 'Status',
          variant: 'select',
        },
      },
      {
        id: 'department',
        accessorKey: 'department',
        header: 'Department',
        cell: (info) => {
          const department = info.getValue<Person['department']>()
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
        meta: {
          label: 'Department',
          variant: 'multi-select',
        },
      },
      {
        id: 'joinDate',
        accessorKey: 'joinDate',
        header: 'Join Date',
        cell: (info) => formatDate(info.getValue<string>()),
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

  const refreshData = () => setData(() => makeData(100_000)) // stress test

  const table = useTable({
    _features,
    _rowModels: {
      coreRowModel: createCoreRowModel(),
      filteredRowModel: createFilteredRowModel(filterFns),
      facetedRowModel: createFacetedRowModel(),
      facetedUniqueValues: createFacetedUniqueValues(),
      paginatedRowModel: createPaginatedRowModel(),
      sortedRowModel: createSortedRowModel(sortFns),
    },
    columns,
    data,
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
      filterFn: dynamicFilterFn,
    },
    state: {
      rowSelection,
      sorting,
      columnVisibility,
      columnOrder,
      columnSizing,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onColumnFiltersChange: setColumnFilters,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    columnResizeMode: 'onChange',
    // debugTable: true,
  })

  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.getState().columnSizing])

  console.log({
    columnFilters,
    joinDates: table.getRowModel().flatRows.map((row) => row.original.joinDate),
  })

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => refreshData()}>
          Refresh Data
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
                          colSpan={header.colSpan}
                          className={cn('relative', {
                            'border-r': header.id !== 'actions',
                          })}
                          style={{
                            width: `calc(var(--header-${header.id}-size) * 1px)`,
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={cn(
                                'flex items-center justify-between gap-2 cursor-pointer select-none',
                                header.column.getCanSort() && 'cursor-pointer',
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {header.column.getIsSorted() && (
                                <>
                                  {header.column.getIsSorted() === 'asc' ? (
                                    <ChevronUp className="size-4" />
                                  ) : (
                                    <ChevronDown className="size-4" />
                                  )}
                                </>
                              )}
                            </div>
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
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            cell.column.id === 'actions' ? '' : 'border-r'
                          }
                          style={{
                            width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
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

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
