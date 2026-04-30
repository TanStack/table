import * as React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table'
import { makeData } from './makeData'
import type { Column, ColumnDef } from '@tanstack/react-table'
import type { Person } from './makeData'
import './index.css'

// 3. New in V9! Tell the table which features and row models we want to use.
// Adding sorting, pagination, and global filtering opts the table into those
// feature sets.
const _features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  globalFilteringFeature,
})

// Render a sortable column header as a shadcn Button with a directional icon.
// `column.getToggleSortingHandler()` returns the canonical click handler that
// cycles asc → desc → unsorted, so we just hand it straight to the Button.
function SortableHeader({
  column,
  label,
}: {
  column: Column<typeof _features, Person>
  label: React.ReactNode
}) {
  if (!column.getCanSort()) {
    return <span className="text-sm font-medium">{label}</span>
  }
  const sorted = column.getIsSorted()
  const Icon =
    sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={column.getToggleSortingHandler()}
    >
      {label}
      <Icon className="ml-2" />
    </Button>
  )
}

// 4. Define the columns for your table. Headers that should be sortable use
// the SortableHeader component above; non-sortable headers stay as plain text.
const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <SortableHeader column={column} label="First Name" />
    ),
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    header: ({ column }) => (
      <SortableHeader column={column} label="Last Name" />
    ),
    cell: (info) => <i>{info.getValue<string>()}</i>,
  },
  {
    accessorFn: (row) => Number(row.age),
    id: 'age',
    header: ({ column }) => <SortableHeader column={column} label="Age" />,
    cell: (info) => info.renderValue(),
  },
  {
    accessorKey: 'visits',
    header: ({ column }) => <SortableHeader column={column} label="Visits" />,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: ({ column }) => (
      <SortableHeader column={column} label="Profile Progress" />
    ),
  },
]

function App() {
  // 5. Store data with a stable reference
  const [data, setData] = React.useState(() => makeData(200))
  const refreshData = () => setData(makeData(200))
  const stressTest = () => setData(makeData(10_000))

  // 6. Create the table instance with required _features, columns, and data.
  // No `state` / `onSortingChange` / `onPaginationChange` props needed —
  // V9 manages sorting, pagination, and globalFilter state internally, and the
  // `<table.Subscribe>` component below re-renders the subtree whenever
  // those atoms change. `globalFilterFn: 'includesString'` does a plain
  // case-insensitive substring match across all filterable columns.
  const table = useTable({
    debugTable: true,
    _features,
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
      paginatedRowModel: createPaginatedRowModel(),
      filteredRowModel: createFilteredRowModel(filterFns),
    },
    columns,
    data,
    globalFilterFn: 'includesString',
  })

  // 7. Render your table markup from the table instance APIs. We subscribe to
  // the `sorting`, `pagination`, and `globalFilter` slices so the entire
  // table subtree (headers, body, search box, pagination controls) re-renders
  // when any of them change.
  return (
    <table.Subscribe
      selector={(state) => ({
        sorting: state.sorting,
        pagination: state.pagination,
        globalFilter: state.globalFilter,
      })}
    >
      {(state) => (
        <div className="p-4">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <DebouncedInput
                value={state.globalFilter ?? ''}
                onChange={(value) => table.setGlobalFilter(String(value))}
                placeholder="Search all columns..."
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshData}>
                Regenerate Data
              </Button>
              <Button variant="outline" onClick={stressTest}>
                Stress Test (10k rows)
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getAllCells().map((cell) => (
                        <TableCell key={cell.id}>
                          <table.FlexRender cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between gap-4 px-2 py-4">
            <div className="text-sm text-muted-foreground">
              {table.getPrePaginatedRowModel().rows.length.toLocaleString()} of{' '}
              {data.length.toLocaleString()} rows
            </div>
            <div className="flex items-center gap-6 lg:gap-8">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${state.pagination.pageSize}`}
                  onValueChange={(value) => table.setPageSize(Number(value))}
                >
                  <SelectTrigger size="sm" className="w-[70px]">
                    <SelectValue placeholder={`${state.pagination.pageSize}`} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {state.pagination.pageIndex + 1} of{' '}
                {Math.max(1, table.getPageCount())}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden size-8 lg:flex"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden size-8 lg:flex"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </table.Subscribe>
  )
}

// A typical debounced input react component — adapted from
// `examples/react/filters-fuzzy/src/main.tsx` and using the shadcn Input.
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
    <App />
  </React.StrictMode>,
)
