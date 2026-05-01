import * as React from 'react'
import ReactDOM from 'react-dom/client'
import {
  Box,
  Button,
  CssBaseline,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import {
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from './material-react-table'
import { makeData } from './makeData'
import type { Person } from './makeData'
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
      <Box component="span" sx={{ fontStyle: 'italic' }}>
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
        value === 'active'
          ? 'success.main'
          : value === 'inactive'
            ? 'text.disabled'
            : 'warning.main'
      return (
        <Box component="span" sx={{ color, textTransform: 'capitalize' }}>
          {value}
        </Box>
      )
    },
  }),
])

const theme = createTheme({
  colorSchemes: {
    light: true,
    dark: true,
  },
})

function App() {
  const [data, setData] = React.useState(() => makeData(50))

  const table = useMaterialReactTable({
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
    renderRowActionMenuItems: ({ closeMenu }) => [
      <Box
        key="view"
        onClick={closeMenu}
        sx={{ p: '6px 16px', cursor: 'pointer' }}
      >
        View Profile
      </Box>,
      <Box
        key="edit"
        onClick={closeMenu}
        sx={{ p: '6px 16px', cursor: 'pointer' }}
      >
        Edit
      </Box>,
    ],
    renderTopToolbarCustomActions: () => (
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" onClick={() => setData(makeData(50))}>
          Regenerate Data
        </Button>
        <Button variant="outlined" onClick={() => setData(makeData(1_000))}>
          1k rows
        </Button>
      </Stack>
    ),
  })

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Material React Table
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        TanStack Table v9 + Material UI v9 — full feature set
      </Typography>
      <MaterialReactTable table={table} />
    </Box>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
