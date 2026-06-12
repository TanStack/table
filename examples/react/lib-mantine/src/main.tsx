import * as React from 'react'
import ReactDOM from 'react-dom/client'
import {
  Button,
  Center,
  Container,
  Group,
  MantineProvider,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import '@mantine/core/styles.css'
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
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
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
  sortFns,
  filterFns,
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
    cell: (info) => (
      <Text span fs="italic">
        {info.getValue<string>()}
      </Text>
    ),
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
  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <TextInput
            value={table.state.globalFilter ?? ''}
            onChange={(event) =>
              table.setGlobalFilter(event.currentTarget.value)
            }
            placeholder="Search all columns..."
            leftSection={<IconSearch size={16} />}
            w={{ base: '100%', sm: 360 }}
          />
          <Group gap="xs">
            <Button variant="outline" onClick={refreshData}>
              Regenerate Data
            </Button>
            <Button variant="outline" onClick={stressTest}>
              Stress Test (10k rows)
            </Button>
          </Group>
        </Group>

        <Paper withBorder>
          <Table.ScrollContainer minWidth={760}>
            <Table
              highlightOnHover
              withColumnBorders
              withRowBorders
              withTableBorder
            >
              <Table.Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Tr key={headerGroup.id}>
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
                        <Table.Th
                          key={header.id}
                          colSpan={header.colSpan}
                          aria-sort={getAriaSort(sortDirection || false)}
                          data-sort={sortDirection || undefined}
                        >
                          {header.isPlaceholder ? null : header.column.getCanSort() ? (
                            <UnstyledButton
                              onClick={header.column.getToggleSortingHandler()}
                              style={{ width: '100%' }}
                            >
                              <Group gap="xs" wrap="nowrap">
                                <Text fw={600}>
                                  <table.FlexRender header={header} />
                                </Text>
                                {sortIcon}
                              </Group>
                            </UnstyledButton>
                          ) : (
                            <Text fw={600}>
                              <table.FlexRender header={header} />
                            </Text>
                          )}
                        </Table.Th>
                      )
                    })}
                  </Table.Tr>
                ))}
              </Table.Thead>
              <Table.Tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={columns.length}>
                      <Center py="xl">No results.</Center>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <Table.Tr key={row.id}>
                      {row.getAllCells().map((cell) => (
                        <Table.Td key={cell.id}>
                          <table.FlexRender cell={cell} />
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          <Group justify="space-between" p="sm">
            <Text size="sm" c="dimmed">
              {table.getPrePaginatedRowModel().rows.length.toLocaleString()}{' '}
              rows
            </Text>
            <Group gap="xs">
              <Select
                aria-label="Rows per page"
                value={String(table.state.pagination.pageSize)}
                data={['10', '20', '30', '40', '50']}
                w={90}
                onChange={(value) => {
                  table.setPageSize(Number(value))
                  table.setPageIndex(0)
                }}
              />
              <Pagination
                value={table.state.pagination.pageIndex + 1}
                total={table.getPageCount()}
                onChange={(page) => table.setPageIndex(page - 1)}
              />
            </Group>
          </Group>
        </Paper>
      </Stack>
    </Container>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <MantineProvider forceColorScheme="light">
      <App />
    </MantineProvider>
  </React.StrictMode>,
)
