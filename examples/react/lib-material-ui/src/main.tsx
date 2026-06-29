import * as React from 'react'
import ReactDOM from 'react-dom/client'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Container,
  CssBaseline,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
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
    cell: (info) => <Box component="i">{info.getValue<string>()}</Box>,
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

const theme = createTheme({
  palette: {
    mode: 'light',
  },
})

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            alignItems: { sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <TextField
            value={table.state.globalFilter ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search all columns..."
            size="small"
            sx={{ maxWidth: 360 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={refreshData}>
              Regenerate Data
            </Button>
            <Button variant="outlined" onClick={stressTest}>
              Stress Test (10k rows)
            </Button>
          </Stack>
        </Stack>

        <Paper variant="outlined">
          <TableContainer>
            <Table size="small">
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const sortDirection = header.column.getIsSorted()

                      return (
                        <TableCell
                          key={header.id}
                          colSpan={header.colSpan}
                          sortDirection={sortDirection || false}
                          aria-sort={getAriaSort(sortDirection || false)}
                          data-sort={sortDirection || undefined}
                        >
                          {header.isPlaceholder ? null : header.column.getCanSort() ? (
                            <TableSortLabel
                              active={!!sortDirection}
                              direction={sortDirection || undefined}
                              onClick={header.column.getToggleSortingHandler()}
                              IconComponent={ArrowDownwardIcon}
                            >
                              <table.FlexRender header={header} />
                            </TableSortLabel>
                          ) : (
                            <Typography variant="subtitle2">
                              <table.FlexRender header={header} />
                            </Typography>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No results.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} hover>
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
          </TableContainer>
          <TablePagination
            component="div"
            count={table.getPrePaginatedRowModel().rows.length}
            page={table.state.pagination.pageIndex}
            rowsPerPage={table.state.pagination.pageSize}
            rowsPerPageOptions={[10, 20, 30, 40, 50]}
            onPageChange={(_, page) => table.setPageIndex(page)}
            onRowsPerPageChange={(event) => {
              table.setPageSize(Number(event.target.value))
              table.setPageIndex(0)
            }}
          />
        </Paper>
      </Stack>
    </Container>
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
