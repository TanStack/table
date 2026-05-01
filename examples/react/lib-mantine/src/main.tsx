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
import type { Column, ColumnDef, SortingState } from '@tanstack/react-table'
import type { Person } from './makeData'
import './index.css'

const _features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  globalFilteringFeature,
})

function getAriaSort(sortDirection: false | 'asc' | 'desc') {
  if (sortDirection === 'asc') return 'ascending'
  if (sortDirection === 'desc') return 'descending'
  return 'none'
}

const SortingContext = React.createContext<SortingState>([])

function getSortDirection(sorting: SortingState, columnId: string) {
  const sort = sorting.find((sort) => sort.id === columnId)
  return sort ? (sort.desc ? 'desc' : 'asc') : undefined
}

function SortableHeader({
  column,
  label,
}: {
  column: Column<typeof _features, Person>
  label: React.ReactNode
}) {
  if (!column.getCanSort()) {
    return <Text fw={600}>{label}</Text>
  }

  const sorting = React.useContext(SortingContext)
  const direction = getSortDirection(sorting, column.id)
  const icon =
    direction === 'asc' ? (
      <IconArrowUp size={16} />
    ) : direction === 'desc' ? (
      <IconArrowDown size={16} />
    ) : (
      <IconSelector size={16} opacity={0.45} />
    )

  return (
    <UnstyledButton
      onClick={column.getToggleSortingHandler()}
      style={{ width: '100%' }}
    >
      <Group gap="xs" wrap="nowrap">
        <Text fw={600}>{label}</Text>
        {icon}
      </Group>
    </UnstyledButton>
  )
}

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
    cell: (info) => (
      <Text span fs="italic">
        {info.getValue<string>()}
      </Text>
    ),
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
  const [data, setData] = React.useState(() => makeData(200))
  const refreshData = () => setData(makeData(200))
  const stressTest = () => setData(makeData(10_000))

  const table = useTable(
    {
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
    },
    (state) => state,
  )

  return (
    <table.Subscribe
      selector={(state) => ({
        sorting: state.sorting,
        pagination: state.pagination,
        globalFilter: state.globalFilter,
      })}
    >
      {(state) => (
        <SortingContext.Provider value={state.sorting}>
          <Container size="lg" py="xl">
            <Stack gap="lg">
              <Group justify="space-between" align="center">
                <TextInput
                  value={state.globalFilter ?? ''}
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
                            const sortDirection = getSortDirection(
                              state.sorting,
                              header.column.id,
                            )
                            return (
                              <Table.Th
                                key={header.id}
                                colSpan={header.colSpan}
                                aria-sort={getAriaSort(sortDirection || false)}
                                data-sort={sortDirection}
                              >
                                {header.isPlaceholder ? null : (
                                  <table.FlexRender header={header} />
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
                    {table
                      .getPrePaginatedRowModel()
                      .rows.length.toLocaleString()}{' '}
                    rows
                  </Text>
                  <Group gap="xs">
                    <Select
                      aria-label="Rows per page"
                      value={String(state.pagination.pageSize)}
                      data={['10', '20', '30', '40', '50']}
                      w={90}
                      onChange={(value) => {
                        table.setPageSize(Number(value))
                        table.setPageIndex(0)
                      }}
                    />
                    <Pagination
                      value={state.pagination.pageIndex + 1}
                      total={table.getPageCount()}
                      onChange={(page) => table.setPageIndex(page - 1)}
                    />
                  </Group>
                </Group>
              </Paper>
            </Stack>
          </Container>
        </SortingContext.Provider>
      )}
    </table.Subscribe>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="auto">
      <App />
    </MantineProvider>
  </React.StrictMode>,
)
