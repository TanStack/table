import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { AlertCircle, MoreHorizontal, User, Users } from 'lucide-react'
import {
  columnFilteringFeature,
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
  Column,
  ColumnDef,
  SortingState,
  Table,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { makeData } from '@/makeData'
import '@/index.css'
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

const _features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  columnFilteringFeature,
})

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState<string | undefined>('')
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState({})

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
      },
      {
        accessorKey: 'firstName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="First Name" />
        ),
        cell: (info) => (
          <span className="font-medium">{String(info.getValue())}</span>
        ),
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Name" />
        ),
        cell: (info) => (
          <span className="font-medium">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'age',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Age" />
        ),
        cell: (info) => (
          <span className="text-muted-foreground">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'visits',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Visits" />
        ),
        cell: (info) => (
          <Badge variant="secondary">
            {info.getValue<number>().toLocaleString()}
          </Badge>
        ),
      },
      {
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
      },
      {
        accessorKey: 'progress',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Profile Progress" />
        ),
        cell: ({ getValue }) => {
          const progress = getValue<number>()
          return (
            <div className="flex items-center gap-2">
              <Progress value={progress} className="w-[60px]" />
              <span className="text-sm text-muted-foreground w-9">
                {progress}%
              </span>
            </div>
          )
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
      },
    ],
    [],
  )

  const [data, setData] = React.useState(() => makeData(1_000))
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
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    debugTable: true,
  })

  return (
    <div className="p-4 max-w-7xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
          placeholder="Search all columns..."
        />
        <Button variant="outline" onClick={() => refreshData()}>
          Refresh Data
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <DataTableViewOptions table={table} />
        <div className="rounded-md border">
          <ShadcnTable>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getCanFilter() ? (
                              <div className="mt-2">
                                <Filter column={header.column} table={table} />
                              </div>
                            ) : null}
                          </div>
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
                        <TableCell key={cell.id}>
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
          </ShadcnTable>
        </div>
        <DataTablePagination table={table} />
        <div className="rounded-md border p-4 flex flex-col gap-4">
          <div>
            {Object.keys(rowSelection).length} of{' '}
            {table.getPreFilteredRowModel().rows.length} Total Rows Selected
          </div>
          <div className="flex space-x-2">
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
      </div>
    </div>
  )
}
interface FilterProps {
  column: Column<typeof _features, Person>
  table: Table<typeof _features, Person>
}

function Filter({ column, table }: FilterProps) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <Input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? '') as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className="h-8 w-20"
      />
      <Input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? '') as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className="h-8 w-20"
      />
    </div>
  ) : (
    <Input
      type="text"
      value={(column.getFilterValue() ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="h-8 max-w-sm"
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
