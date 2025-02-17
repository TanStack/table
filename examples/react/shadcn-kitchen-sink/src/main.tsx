'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import '@/styles/globals.css'

import { AlertCircle, MoreHorizontal, User, Users } from 'lucide-react'
import {
  columnFilteringFeature,
  columnOrderingFeature,
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
  ColumnFiltersState,
  ColumnSizingState,
  RowData,
  SortingState,
  TableFeatures,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

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
})

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState<string | undefined>('')
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
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
        enableSorting: false,
        enableHiding: false,
        size: 60,
      },
      {
        id: 'firstName',
        accessorKey: 'firstName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="First Name" />
        ),
        cell: (info) => (
          <span className="font-medium">{String(info.getValue())}</span>
        ),
        size: 200,
        meta: {
          label: 'First Name',
        },
      },
      {
        id: 'lastName',
        accessorFn: (row) => row.lastName,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Name" />
        ),
        cell: (info) => (
          <span className="font-medium">{String(info.getValue())}</span>
        ),
        size: 200,
        meta: {
          label: 'Last Name',
        },
      },
      {
        id: 'age',
        accessorKey: 'age',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Age" />
        ),
        cell: (info) => (
          <span className="text-muted-foreground">
            {String(info.getValue())}
          </span>
        ),
        size: 200,
        meta: {
          label: 'Age',
        },
      },
      {
        id: 'visits',
        accessorKey: 'visits',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Visits" />
        ),
        cell: (info) => (
          <Badge variant="secondary">
            {info.getValue<number>().toLocaleString()}
          </Badge>
        ),
        size: 200,
        meta: {
          label: 'Visits',
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
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
        size: 200,
        meta: {
          label: 'Status',
        },
      },
      {
        id: 'progress',
        accessorKey: 'progress',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Profile Progress" />
        ),
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
        size: 200,
        meta: {
          label: 'Profile Progress',
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
        size: 60,
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
    state: {
      rowSelection,
      sorting,
      columnVisibility,
      columnOrder,
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    debugTable: true,
  })

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
          placeholder="Search all columns..."
        />
        <div className="flex items-center gap-2">
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
          <Table>
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
                            'px-0': header.id !== 'select',
                            'select-none': true,
                          })}
                          style={{
                            width: header.getSize(),
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                          {/* {header.id !== 'select' &&
                            header.id !== 'actions' && (
                              <div
                                onMouseDown={(event) => {
                                  event.preventDefault()
                                  const startX = event.pageX
                                  const startWidth = header.getSize()

                                  const onMouseMove = (event: MouseEvent) => {
                                    const currentWidth =
                                      startWidth + (event.pageX - startX)
                                    table.setColumnSizing((old) => ({
                                      ...old,
                                      [header.id]: Math.max(currentWidth, 20),
                                    }))
                                  }

                                  const onMouseUp = () => {
                                    document.removeEventListener(
                                      'mousemove',
                                      onMouseMove,
                                    )
                                    document.removeEventListener(
                                      'mouseup',
                                      onMouseUp,
                                    )
                                  }

                                  document.addEventListener(
                                    'mousemove',
                                    onMouseMove,
                                  )
                                  document.addEventListener(
                                    'mouseup',
                                    onMouseUp,
                                  )
                                }}
                                className={cn(
                                  'absolute right-0 top-0 h-full w-1 cursor-e-resize select-none touch-none hover:bg-muted',
                                  'bg-muted/50',
                                )}
                              />
                            )} */}
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
                            width: cell.column.getSize(),
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
