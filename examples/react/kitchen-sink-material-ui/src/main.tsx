'use client'

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import {
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Table as MuiTable,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Toolbar,
  Tooltip,
  createTheme,
  useMediaQuery,
} from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import SearchIcon from '@mui/icons-material/Search'
import { useTanStackTableDevtools } from '@tanstack/react-table-devtools'
import type { Column } from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '@/types'
import type { Person } from '@/lib/make-data'
import type { features } from '@/hooks/features'
import { makeData } from '@/lib/make-data'
import { useAppTable } from '@/hooks/table'
import { columns } from '@/columns'
import { toSentenceCase } from '@/components/data-table/shared'
import './styles/globals.css'

function getAriaSort(
  sortDirection: false | 'asc' | 'desc',
): 'ascending' | 'descending' | 'none' {
  if (sortDirection === 'asc') return 'ascending'
  if (sortDirection === 'desc') return 'descending'
  return 'none'
}

function getCommonPinningStyles(
  column: Column<typeof features, Person>,
  isSelected = false,
): React.CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'start' && column.getIsLastColumn('start')
  const isFirstRightPinnedColumn =
    isPinned === 'end' && column.getIsFirstColumn('end')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px rgba(0, 0, 0, 0.3) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px rgba(0, 0, 0, 0.3) inset'
        : undefined,
    insetInlineStart:
      isPinned === 'start' ? `${column.getStart('start')}px` : undefined,
    insetInlineEnd:
      isPinned === 'end' ? `${column.getAfter('end')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    background: isSelected
      ? 'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-selectedOpacity))'
      : 'var(--mui-palette-background-paper)',
    zIndex: isPinned ? 2 : 0,
  }
}

function App({
  mode,
  setMode,
}: {
  mode: 'light' | 'dark' | 'system'
  setMode: React.Dispatch<React.SetStateAction<'light' | 'dark' | 'system'>>
}) {
  const [columnFilters, setColumnFilters] = React.useState<
    Array<ExtendedColumnFilter>
  >([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [data, setData] = React.useState(() => makeData(1_000))

  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(1_000_000))

  const table = useAppTable(
    {
      key: 'kitchen-sink-material-ui',
      columns,
      data,
      debugTable: true,
      state: {
        columnFilters,
        globalFilter,
      },
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      initialState: {
        columnPinning: { start: ['select'], end: ['actions'] },
        columnOrder: columns.map((c) => c.id ?? ''),
      },
    },
    (state) => state, // default selector
  )

  useTanStackTableDevtools(table)

  return (
    <table.AppTable>
      <Container maxWidth={false} sx={{ py: 3 }}>
        <Stack spacing={2}>
          <Paper variant="outlined">
            <Toolbar
              sx={{ gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}
            >
              <ModeMenu mode={mode} setMode={setMode} />
              <Button variant="outlined" size="small" onClick={refreshData}>
                Regenerate Data
              </Button>
              <Button variant="outlined" size="small" onClick={stressTest}>
                Stress Test (1M rows)
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  console.info(
                    'table.getSelectedRowModel().flatRows',
                    table.getSelectedRowModel().flatRows,
                  )
                }
              >
                Log Selected Rows
              </Button>
            </Toolbar>
          </Paper>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            sx={{ alignItems: { md: 'center' } }}
          >
            <DebouncedTextField
              value={globalFilter}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
              size="small"
              sx={{ width: { xs: '100%', md: 360 } }}
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
            <table.FilterList />
            <table.SortList />
            <table.ViewOptions />
          </Stack>

          <Paper variant="outlined">
            <TableContainer sx={{ maxHeight: 680 }}>
              <MuiTable
                stickyHeader
                size="small"
                sx={{
                  width: '100%',
                  display: 'grid',
                }}
              >
                <TableHead sx={{ display: 'grid' }}>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      sx={{ display: 'flex', width: '100%' }}
                    >
                      {headerGroup.headers
                        .filter((header) => header.column.getIsVisible())
                        .map((header) => (
                          <table.AppHeader header={header} key={header.id}>
                            {(h) => {
                              const sortDirection = h.column.getCanSort()
                                ? h.column.getIsSorted()
                                : false

                              return (
                                <TableCell
                                  component="th"
                                  colSpan={h.colSpan}
                                  sortDirection={sortDirection || false}
                                  aria-sort={getAriaSort(
                                    sortDirection || false,
                                  )}
                                  sx={{
                                    display: 'flex',
                                    flexShrink: 0,
                                    alignItems: 'center',
                                    justifyContent:
                                      h.column.id === 'select'
                                        ? 'center'
                                        : undefined,
                                    overflow: 'clip',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    flexGrow: h.getSize(),
                                    width: h.getSize(),
                                    borderRight:
                                      h.id === 'actions' ? undefined : 1,
                                    borderColor: 'divider',
                                    p: 1,
                                    ...getCommonPinningStyles(h.column),
                                  }}
                                >
                                  <Box
                                    sx={{
                                      position: 'relative',
                                      pr: h.column.getCanResize() ? 1 : 0,
                                      width: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent:
                                        h.column.id === 'select'
                                          ? 'center'
                                          : 'flex-start',
                                    }}
                                  >
                                    {h.isPlaceholder ? null : <h.FlexRender />}
                                    <h.ResizeHandle />
                                  </Box>
                                </TableCell>
                              )
                            }}
                          </table.AppHeader>
                        ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody sx={{ display: 'grid' }}>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      hover
                      selected={row.getIsSelected()}
                      aria-selected={row.getIsSelected()}
                      sx={{ display: 'flex', width: '100%' }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <table.AppCell cell={cell} key={cell.id}>
                          {(c) => (
                            <TableCell
                              sx={{
                                display: 'flex',
                                flexShrink: 0,
                                alignItems: 'center',
                                justifyContent:
                                  c.column.id === 'select'
                                    ? 'center'
                                    : undefined,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                flexGrow: c.column.getSize(),
                                width: c.column.getSize(),
                                borderRight:
                                  c.column.id === 'actions' ? undefined : 1,
                                borderColor: 'divider',
                                ...getCommonPinningStyles(
                                  c.column,
                                  row.getIsSelected(),
                                ),
                              }}
                            >
                              {c.getIsGrouped() ? (
                                <c.GroupedCell />
                              ) : (
                                <c.FlexRender />
                              )}
                            </TableCell>
                          )}
                        </table.AppCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </MuiTable>
            </TableContainer>
            <table.Pagination />
          </Paper>
        </Stack>
      </Container>
    </table.AppTable>
  )
}

function DebouncedTextField({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.ComponentProps<typeof TextField>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })

  return (
    <TextField
      {...props}
      value={value}
      onChange={(event) => {
        setValue(event.target.value)
        debouncedOnChange(event.target.value)
      }}
    />
  )
}

function ModeMenu({
  mode,
  setMode,
}: {
  mode: 'light' | 'dark' | 'system'
  setMode: React.Dispatch<React.SetStateAction<'light' | 'dark' | 'system'>>
}): React.ReactNode {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  return (
    <>
      <Tooltip title="Theme">
        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
          {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {(['light', 'dark', 'system'] as const).map((themeMode) => (
          <MenuItem
            key={themeMode}
            selected={themeMode === mode}
            onClick={() => {
              setMode(themeMode)
              setAnchorEl(null)
            }}
          >
            {toSentenceCase(themeMode)}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

function Root() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = React.useState<'light' | 'dark' | 'system'>('system')
  const resolvedMode =
    mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode
  const theme = React.useMemo(
    () =>
      createTheme({
        // Generate the `--mui-*` CSS variables that the sticky-pinning styles
        // reference; without this they resolve to nothing (transparent cells).
        cssVariables: true,
        palette: {
          mode: resolvedMode,
        },
      }),
    [resolvedMode],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App mode={mode} setMode={setMode} />
    </ThemeProvider>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
