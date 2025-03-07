'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import '@/styles/globals.css'

import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  User,
  Users,
} from 'lucide-react'
import {
  columnFilteringFeature,
  columnOrderingFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
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
import type { Person } from '@/makeData'
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

import { makeData } from '@/makeData'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options'
import { Progress } from '@/components/ui/progress'

import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { DataTableFilterList } from '@/components/data-table/data-table-filter-list'
import { dynamicFilterFn } from '@/components/data-table/data-table-filter-utils'

declare module '@tanstack/react-table' {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    label?: string
    type?: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi-select'
  }
}

const _features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnFilteringFeature,
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
        cell: (info) => (
          <span className="font-medium">{String(info.getValue())}</span>
        ),
        meta: {
          label: 'First Name',
          type: 'text',
        },
      },
      {
        id: 'lastName',
        accessorFn: (row) => row.lastName,
        header: 'Last Name',
        cell: (info) => (
          <span className="font-medium">{String(info.getValue())}</span>
        ),
        meta: {
          label: 'Last Name',
          type: 'text',
        },
      },
      {
        id: 'age',
        accessorKey: 'age',
        header: 'Age',
        cell: (info) => (
          <span className="text-muted-foreground">
            {String(info.getValue())}
          </span>
        ),
        meta: {
          label: 'Age',
          type: 'number',
        },
      },
      {
        id: 'visits',
        accessorKey: 'visits',
        header: 'Visits',
        cell: (info) => (
          <Badge variant="secondary">
            {info.getValue<number>().toLocaleString()}
          </Badge>
        ),
        meta: {
          label: 'Visits',
          type: 'number',
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue<Person['status']>()
          const icons: Record<Person['status'], React.ReactNode> = {
            relationship: <Users />,
            complicated: <AlertCircle />,
            single: <User />,
          }

          return (
            <Badge
              variant="outline"
              className="gap-1 w-32 [&>svg]:size-3.5 px-3 py-1 [&>svg]:shrink-0"
            >
              {icons[status]}
              <span className="truncate">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </Badge>
          )
        },
        meta: {
          label: 'Status',
          type: 'select',
        },
      },
      {
        id: 'progress',
        accessorKey: 'progress',
        header: 'Progress',
        cell: ({ getValue }) => {
          const progress = getValue<number>()
          return (
            <div className="flex items-center gap-2">
              <Progress value={progress} />
              <span className="text-sm text-muted-foreground w-9">
                {progress}%
              </span>
            </div>
          )
        },
        meta: {
          label: 'Profile Progress',
          type: 'number',
        },
      },
      // add a boolean column
      {
        id: 'boolean',
        accessorKey: 'boolean',
        header: 'Boolean',
        cell: (info) => <Badge>{String(info.getValue())}</Badge>,
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
      filteredRowModel: createFilteredRowModel(filterFns),
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
    debugTable: true,
  })

  console.log({
    columnFilters,
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
