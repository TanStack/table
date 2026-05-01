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
    return <Typography variant="subtitle2">{label}</Typography>
  }

  const sorting = React.useContext(SortingContext)
  const direction = getSortDirection(sorting, column.id)
  const isSorted = !!direction

  return (
    <TableSortLabel
      active={isSorted}
      direction={direction}
      onClick={column.getToggleSortingHandler()}
      IconComponent={ArrowDownwardIcon}
    >
      {label}
    </TableSortLabel>
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
    cell: (info) => <Box component="i">{info.getValue<string>()}</Box>,
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

const theme = createTheme({
  colorSchemes: {
    light: true,
    dark: true,
  },
})

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
                  value={state.globalFilter ?? ''}
                  onChange={(event) =>
                    table.setGlobalFilter(event.target.value)
                  }
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
                          {headerGroup.headers.map((header) => (
                            <TableCell
                              key={header.id}
                              colSpan={header.colSpan}
                              sortDirection={
                                getSortDirection(
                                  state.sorting,
                                  header.column.id,
                                ) || false
                              }
                              aria-sort={getAriaSort(
                                getSortDirection(
                                  state.sorting,
                                  header.column.id,
                                ) || false,
                              )}
                              data-sort={getSortDirection(
                                state.sorting,
                                header.column.id,
                              )}
                            >
                              {header.isPlaceholder ? null : (
                                <table.FlexRender header={header} />
                              )}
                            </TableCell>
                          ))}
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
                  page={state.pagination.pageIndex}
                  rowsPerPage={state.pagination.pageSize}
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
        </SortingContext.Provider>
      )}
    </table.Subscribe>
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
