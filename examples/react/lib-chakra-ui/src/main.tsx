import * as React from 'react'
import ReactDOM from 'react-dom/client'
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  HStack,
  Input,
  NativeSelect,
  Stack,
  Table,
  Text,
  defaultSystem,
} from '@chakra-ui/react'
import {
  IconArrowDown,
  IconArrowUp,
  IconSearch,
  IconSelector,
} from '@tabler/icons-react'
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { makeData } from './makeData'
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
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
  filterFns: {
    includesString: filterFn_includesString,
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()
function getAriaSort(sortDirection: false | 'asc' | 'desc') {
  if (sortDirection === 'asc') return 'ascending'
  if (sortDirection === 'desc') return 'descending'
  return 'none'
}

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: 'Last Name',
    cell: (info) => <Box as="i">{info.getValue<string>()}</Box>,
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

function App() {
  const [data, setData] = React.useState(() => makeData(200))
  const refreshData = () => setData(makeData(200))
  const stressTest = () => setData(makeData(1_000_000))

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

  return (
    <Container maxW="6xl" py="8">
      <Stack gap="6">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          gap="3"
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
        >
          <Box position="relative" maxW={{ base: '100%', md: '360px' }}>
            <Box
              position="absolute"
              left="3"
              top="50%"
              translateY="-50%"
              color="fg.muted"
            >
              <IconSearch size={16} />
            </Box>
            <Input
              value={table.state.globalFilter ?? ''}
              onChange={(event) =>
                table.setGlobalFilter(event.currentTarget.value)
              }
              placeholder="Search all columns..."
              ps="9"
            />
          </Box>
          <HStack gap="2">
            <Button variant="outline" onClick={refreshData}>
              Regenerate Data
            </Button>
            <Button variant="outline" onClick={stressTest}>
              Stress Test (1M rows)
            </Button>
          </HStack>
        </Stack>

        <Box borderWidth="1px" rounded="md" overflow="hidden">
          <Table.ScrollArea minW="760px">
            <Table.Root
              interactive
              showColumnBorder
              size="sm"
              variant="outline"
            >
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const sortDirection = header.column.getIsSorted()
                      const sortIcon =
                        sortDirection === 'asc' ? (
                          <IconArrowUp size={16} />
                        ) : sortDirection === 'desc' ? (
                          <IconArrowDown size={16} />
                        ) : (
                          <IconSelector size={16} opacity={0.45} />
                        )

                      return (
                        <Table.ColumnHeader
                          key={header.id}
                          colSpan={header.colSpan}
                          aria-sort={getAriaSort(sortDirection || false)}
                          data-sort={sortDirection || undefined}
                        >
                          {header.isPlaceholder ? null : header.column.getCanSort() ? (
                            <Button
                              variant="plain"
                              size="xs"
                              justifyContent="flex-start"
                              px="0"
                              w="100%"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <HStack gap="2">
                                <Text fontWeight="semibold">
                                  <table.FlexRender header={header} />
                                </Text>
                                {sortIcon}
                              </HStack>
                            </Button>
                          ) : (
                            <Text fontWeight="semibold">
                              <table.FlexRender header={header} />
                            </Text>
                          )}
                        </Table.ColumnHeader>
                      )
                    })}
                  </Table.Row>
                ))}
              </Table.Header>
              <Table.Body>
                {table.getRowModel().rows.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={columns.length} textAlign="center">
                      No results.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <Table.Row key={row.id}>
                      {row.getAllCells().map((cell) => (
                        <Table.Cell key={cell.id}>
                          <table.FlexRender cell={cell} />
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>

          <HStack justify="space-between" p="3">
            <Text fontSize="sm" color="fg.muted">
              {table.getPrePaginatedRowModel().rows.length.toLocaleString()}{' '}
              rows
            </Text>
            <HStack gap="2">
              <NativeSelect.Root size="sm" width="90px">
                <NativeSelect.Field
                  aria-label="Rows per page"
                  value={String(table.state.pagination.pageSize)}
                  onChange={(event) => {
                    table.setPageSize(Number(event.currentTarget.value))
                    table.setPageIndex(0)
                  }}
                >
                  {['10', '20', '30', '40', '50'].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                  <option value="Infinity">All</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Text fontSize="sm">
                {table.state.pagination.pageIndex + 1} / {table.getPageCount()}
              </Text>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </HStack>
          </HStack>
        </Box>
      </Stack>
    </Container>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
