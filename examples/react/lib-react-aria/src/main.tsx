import * as React from 'react'
import ReactDOM from 'react-dom/client'
import {
  Button,
  Cell,
  Column,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
  Row,
  Select,
  SelectValue,
  Table,
  TableBody,
  TableHeader,
  TextField,
} from 'react-aria-components'
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
import type { Key, SortDescriptor } from 'react-aria-components'
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
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

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
          <TextField
            aria-label="Search all columns"
            className="react-aria-field w-full sm:w-[360px]"
            value={table.state.globalFilter ?? ''}
            onChange={(value) => table.setGlobalFilter(value)}
          >
            <Input placeholder="Search all columns..." />
          </TextField>
          <div className="flex flex-wrap gap-2">
            <Button onPress={refreshData}>Regenerate Data</Button>
            <Button onPress={stressTest}>Stress Test (10k rows)</Button>
          </div>
        </div>

        <div className="table-shell">
          <div className="table-scroll">
            <Table
              aria-label="React Aria TanStack Table example"
              className="react-aria-Table min-w-full"
              sortDescriptor={toSortDescriptor(table.state.sorting)}
              onSortChange={(descriptor) =>
                table.setSorting(toSortingState(descriptor))
              }
            >
              <TableHeader>
                {table.getHeaderGroups()[0]?.headers.map((header) => (
                  <Column
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
                          className={[
                            'sort-icon',
                            sortDirection ? 'is-sorted' : '',
                            sortDirection === 'descending' ? 'is-desc' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {sortDirection ? '▲' : '↕'}
                        </span>
                      </span>
                    )}
                  </Column>
                ))}
              </TableHeader>
              <TableBody
                renderEmptyState={() => (
                  <div className="py-10 text-center text-sm text-muted">
                    No results.
                  </div>
                )}
              >
                {table.getRowModel().rows.map((row) => (
                  <Row key={row.id} id={row.id}>
                    {row.getAllCells().map((cell) => (
                      <Cell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </Cell>
                    ))}
                  </Row>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="table-footer">
            <div className="text-sm text-muted">
              {start.toLocaleString()} to {end.toLocaleString()} of{' '}
              {rowCount.toLocaleString()} rows
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Select
                aria-label="Rows per page"
                className="react-aria-select w-24"
                selectedKey={String(pageSize)}
                onSelectionChange={(key: Key | null) => {
                  if (key == null) return
                  table.setPageSize(Number(key))
                  table.setPageIndex(0)
                }}
              >
                <Button>
                  <SelectValue />
                  <span aria-hidden="true">⌄</span>
                </Button>
                <Popover>
                  <ListBox>
                    {pageSizeOptions.map((option) => (
                      <ListBoxItem key={option} id={option} textValue={option}>
                        {option}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                </Popover>
              </Select>
              <nav aria-label="Pagination" className="pagination">
                <Button
                  isDisabled={!table.getCanPreviousPage()}
                  onPress={() => table.previousPage()}
                >
                  ‹ Prev
                </Button>
                {pageItems.map((page, index) =>
                  page === 'ellipsis' ? (
                    <span key={`ellipsis-${index}`} className="page-ellipsis">
                      …
                    </span>
                  ) : (
                    <Button
                      key={page}
                      className={cx(
                        'react-aria-Button',
                        page === pageIndex + 1 && 'is-active',
                      )}
                      onPress={() => table.setPageIndex(page - 1)}
                    >
                      {page}
                    </Button>
                  ),
                )}
                <Button
                  isDisabled={!table.getCanNextPage()}
                  onPress={() => table.nextPage()}
                >
                  Next ›
                </Button>
              </nav>
            </div>
          </div>
        </div>
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
