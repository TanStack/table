import * as React from 'react'
import ReactDOM from 'react-dom/client'
import {
  Button,
  Input,
  ListBox,
  ListBoxItem,
  Pagination,
  Select,
  Table,
  cn,
} from '@heroui/react'
import {
  columnFilteringFeature,
  createColumnHelper,
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
import { makeData } from './makeData'
import type { Key, SortDescriptor } from '@heroui/react'
import type { SortingState } from '@tanstack/react-table'
import type { Person } from './makeData'
import './index.css'

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns,
  filterFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()
function toSortDescriptor(sorting: SortingState): SortDescriptor | undefined {
  const sort = sorting[0]
  if (!sort) return undefined
  return {
    column: sort.id,
    direction: sort.desc ? 'descending' : 'ascending',
  }
}

function toSortingState(descriptor: SortDescriptor): SortingState {
  return [
    {
      id: String(descriptor.column),
      desc: descriptor.direction === 'descending',
    },
  ]
}

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: 'Last Name',
    cell: (info) => <span className="italic">{info.getValue<string>()}</span>,
  }),
  columnHelper.accessor((row) => Number(row.age), {
    id: 'age',
    header: 'Age',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

const pageSizeOptions = ['10', '20', '30', '40', '50']

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

function App() {
  const [data, setData] = React.useState(() => makeData(200))
  const refreshData = () => setData(makeData(200))
  const stressTest = () => setData(makeData(10_000))

  const table = useTable(
    {
      debugTable: true,
      features,
      columns,
      data,
      globalFilterFn: 'includesString',
    },
    (state) => state, // default selector
  )

  const pageIndex = table.state.pagination.pageIndex
  const pageSize = table.state.pagination.pageSize
  const pageCount = table.getPageCount()
  const pageItems = getPageItems(pageIndex, pageCount)
  const rowCount = table.getPrePaginatedRowModel().rows.length
  const start = rowCount === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, rowCount)

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            aria-label="Search all columns"
            className="w-full sm:w-[360px]"
            placeholder="Search all columns..."
            value={table.state.globalFilter ?? ''}
            onChange={(event) =>
              table.setGlobalFilter(event.currentTarget.value)
            }
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onPress={refreshData}>
              Regenerate Data
            </Button>
            <Button variant="secondary" onPress={stressTest}>
              Stress Test (10k rows)
            </Button>
          </div>
        </div>

        <Table className="overflow-hidden rounded-lg border border-border">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Hero UI TanStack Table example"
              className="min-w-[760px]"
              sortDescriptor={toSortDescriptor(table.state.sorting)}
              onSortChange={(descriptor) =>
                table.setSorting(toSortingState(descriptor))
              }
            >
              <Table.Header>
                {table.getHeaderGroups()[0]?.headers.map((header) => (
                  <Table.Column
                    key={header.id}
                    id={header.column.id}
                    allowsSorting={header.column.getCanSort()}
                    isRowHeader={header.id === 'firstName'}
                  >
                    {({ sortDirection }) => (
                      <span className="flex items-center justify-between gap-2 font-semibold">
                        <table.FlexRender header={header} />
                        <span
                          aria-hidden="true"
                          className={cn(
                            'text-xs text-muted transition-transform',
                            sortDirection === 'descending' && 'rotate-180',
                            !sortDirection && 'opacity-40',
                          )}
                        >
                          {sortDirection ? '▲' : '↕'}
                        </span>
                      </span>
                    )}
                  </Table.Column>
                ))}
              </Table.Header>
              <Table.Body
                renderEmptyState={() => (
                  <div className="py-10 text-center text-sm text-muted">
                    No results.
                  </div>
                )}
              >
                {table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id} id={row.id}>
                    {row.getAllCells().map((cell) => (
                      <Table.Cell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>

          <Table.Footer className="flex flex-col gap-3 border-t border-border p-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm text-muted">
              {start.toLocaleString()} to {end.toLocaleString()} of{' '}
              {rowCount.toLocaleString()} rows
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Select
                aria-label="Rows per page"
                className="w-24"
                selectedKey={String(pageSize)}
                onSelectionChange={(key: Key | null) => {
                  if (key == null) return
                  table.setPageSize(Number(key))
                  table.setPageIndex(0)
                }}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {pageSizeOptions.map((option) => (
                      <ListBoxItem key={option} id={option} textValue={option}>
                        {option}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
              <Pagination size="sm">
                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={!table.getCanPreviousPage()}
                      onPress={() => table.previousPage()}
                    >
                      <Pagination.PreviousIcon />
                      Prev
                    </Pagination.Previous>
                  </Pagination.Item>
                  {pageItems.map((page, index) =>
                    page === 'ellipsis' ? (
                      <Pagination.Item key={`ellipsis-${index}`}>
                        <Pagination.Ellipsis />
                      </Pagination.Item>
                    ) : (
                      <Pagination.Item key={page}>
                        <Pagination.Link
                          isActive={page === pageIndex + 1}
                          onPress={() => table.setPageIndex(page - 1)}
                        >
                          {page}
                        </Pagination.Link>
                      </Pagination.Item>
                    ),
                  )}
                  <Pagination.Item>
                    <Pagination.Next
                      isDisabled={!table.getCanNextPage()}
                      onPress={() => table.nextPage()}
                    >
                      Next
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          </Table.Footer>
        </Table>
      </div>
    </main>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
