import * as React from 'react'
import ReactDOM from 'react-dom/client'

import '@mantine/core/styles.css'

import {
  Badge,
  Box,
  Button,
  Group,
  MantineProvider,
  Stack,
  Text,
  Title,
} from '@mantine/core'

import {
  MantineReactTable,
  createMRTColumnHelper,
  useMantineReactTable,
} from './mantine-react-table'
import {  makeData } from './makeData'
import type {Person} from './makeData';
import './index.css'

const columnHelper = createMRTColumnHelper<Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    size: 140,
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    size: 140,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    size: 220,
    Cell: ({ cell }) => (
      <a href={`mailto:${cell.getValue<string>()}`}>
        {cell.getValue<string>()}
      </a>
    ),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    size: 80,
    filterVariant: 'range',
  }),
  columnHelper.accessor('jobTitle', {
    header: 'Job Title',
    size: 200,
  }),
  columnHelper.accessor('city', {
    header: 'City',
    size: 140,
  }),
  columnHelper.accessor('state', {
    header: 'State',
    size: 80,
    filterVariant: 'select',
  }),
  columnHelper.accessor('salary', {
    header: 'Salary',
    size: 130,
    filterVariant: 'range',
    Cell: ({ cell }) =>
      cell.getValue<number>().toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }),
    aggregationFn: 'mean',
    AggregatedCell: ({ cell }) => (
      <Box component="span" fs="italic">
        Avg:{' '}
        {cell.getValue<number>().toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        })}
      </Box>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    size: 110,
    filterVariant: 'select',
    Cell: ({ cell }) => {
      const value = cell.getValue<Person['status']>()
      const color =
        value === 'active' ? 'green' : value === 'inactive' ? 'gray' : 'yellow'
      return (
        <Badge color={color} variant="light" tt="capitalize">
          {value}
        </Badge>
      )
    },
  }),
])

function App() {
  const [data, setData] = React.useState(() => makeData(50))

  const table = useMantineReactTable({
    columns,
    data,
    enableColumnFilters: true,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    enableColumnResizing: true,
    enableExpanding: false,
    enableFacetedValues: true,
    enableGlobalFilter: true,
    enableGrouping: true,
    enablePagination: true,
    enableRowActions: true,
    enableRowSelection: true,
    enableEditing: true,
    editDisplayMode: 'modal',
    createDisplayMode: 'modal',
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    positionToolbarAlertBanner: 'bottom',
    renderRowActionMenuItems: () => (
      <>
        <Box style={{ padding: '6px 16px', cursor: 'pointer' }}>
          View Profile
        </Box>
        <Box style={{ padding: '6px 16px', cursor: 'pointer' }}>Edit</Box>
      </>
    ),
    renderTopToolbarCustomActions: () => (
      <Group gap="xs">
        <Button variant="default" onClick={() => setData(makeData(50))}>
          Regenerate Data
        </Button>
        <Button variant="default" onClick={() => setData(makeData(1_000))}>
          1k rows
        </Button>
      </Group>
    ),
  })

  return (
    <Box p="xl">
      <Stack gap="xs" mb="lg">
        <Title order={3}>Mantine React Table</Title>
        <Text c="dimmed" size="sm">
          TanStack Table v9 + Mantine v9 — full feature set
        </Text>
      </Stack>
      <MantineReactTable table={table} />
    </Box>
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
