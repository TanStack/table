'use client'

import * as React from 'react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import * as ReactDOM from 'react-dom/client'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  HStack,
  IconButton,
  Stack,
  Table,
  defaultSystem,
} from '@chakra-ui/react'
import { ThemeProvider, useTheme } from 'next-themes'
import {
  IconDeviceDesktop,
  IconMoon,
  IconSearch,
  IconSun,
} from '@tabler/icons-react'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/react-table-devtools'
import type { Column } from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '@/types'
import type { Person } from '@/lib/make-data'
import type { features } from '@/hooks/features'

import { makeData } from '@/lib/make-data'
import { useAppTable } from '@/hooks/table'
import { columns } from '@/columns'
import {
  DropdownMenu,
  DropdownMenuItem,
  TextInput,
} from '@/components/data-table/shared'
import './styles/globals.css'

// ---------------------------------------------------------------------------
// Pinning styles (local to main - uses Chakra CSS vars)
// ---------------------------------------------------------------------------

function getCommonPinningStyles(
  column: Column<typeof features, Person>,
  isSelected = false,
): React.CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px var(--chakra-colors-border) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px var(--chakra-colors-border) inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    borderRight: isLastLeftPinnedColumn
      ? '1px solid var(--chakra-colors-border)'
      : undefined,
    borderLeft: isFirstRightPinnedColumn
      ? '1px solid var(--chakra-colors-border)'
      : undefined,
    background: isSelected
      ? 'var(--chakra-colors-blue-subtle)'
      : isPinned
        ? 'var(--chakra-colors-bg)'
        : undefined,
    zIndex: isPinned ? 2 : 0,
  }
}

// ---------------------------------------------------------------------------
// Debounced Text Input
// ---------------------------------------------------------------------------

function DebouncedTextInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.ComponentProps<typeof TextInput>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })

  return (
    <TextInput
      {...props}
      value={value}
      onChange={(event) => {
        setValue(event.currentTarget.value)
        debouncedOnChange(event.currentTarget.value)
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Mode Menu
// ---------------------------------------------------------------------------

function ModeMenu() {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const icon =
    resolvedTheme === 'dark' ? <IconMoon size={18} /> : <IconSun size={18} />

  return (
    <DropdownMenu
      width="150px"
      trigger={
        <IconButton variant="subtle" aria-label="Theme" title="Theme">
          {icon}
        </IconButton>
      }
    >
      {(
        [
          { value: 'light', label: 'Light', icon: <IconSun size={16} /> },
          { value: 'dark', label: 'Dark', icon: <IconMoon size={16} /> },
          {
            value: 'system',
            label: 'System',
            icon: <IconDeviceDesktop size={16} />,
          },
        ] satisfies Array<{
          value: 'light' | 'dark' | 'system'
          label: string
          icon: React.ReactNode
        }>
      ).map((item) => (
        <DropdownMenuItem
          key={item.value}
          value={`theme-${item.value}`}
          icon={item.icon}
          colorPalette={theme === item.value ? 'blue' : undefined}
          onSelect={() => setTheme(item.value)}
        >
          {item.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  )
}

// ---------------------------------------------------------------------------
// Chakra Example Provider
// ---------------------------------------------------------------------------

function ChakraExampleProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

function App() {
  const [columnFilters, setColumnFilters] = React.useState<
    Array<ExtendedColumnFilter>
  >([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [data, setData] = React.useState(() => makeData(1_000))

  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(1_000_000))

  const table = useAppTable(
    {
      key: 'kitchen-sink-chakra-ui',
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
        columnPinning: { left: ['select'], right: ['actions'] },
        columnOrder: columns.map((c) => c.id ?? ''),
      },
    },
    (state) => state,
  )

  useTanStackTableDevtools(table)

  return (
    <table.AppTable>
      <Container maxW="none" py="4">
        <Stack gap="4">
          <Box borderWidth="1px" rounded="md" p="3">
            <HStack justify="flex-end" gap="2">
              <ModeMenu />
              <Button variant="outline" size="sm" onClick={refreshData}>
                Regenerate Data
              </Button>
              <Button variant="outline" size="sm" onClick={stressTest}>
                Stress Test (1M rows)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  console.info(
                    'table.getSelectedRowModel().flatRows',
                    table.getSelectedRowModel().flatRows,
                  )
                }
              >
                Log Selected Rows
              </Button>
            </HStack>
          </Box>

          <HStack align="center" gap="2">
            <DebouncedTextInput
              value={globalFilter}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
              icon={<IconSearch size={16} />}
              width={{ base: '100%', md: '360px' }}
            />
            <table.FilterList />
            <table.SortList />
            <table.ViewOptions />
          </HStack>

          <Box borderWidth="1px" rounded="md">
            <Box overflow="auto" maxH="680px">
              <Table.Root
                stickyHeader
                interactive
                showColumnBorder
                variant="outline"
                style={{
                  tableLayout: 'fixed',
                }}
              >
                <Table.Header>
                  {table.getHeaderGroups().map((headerGroup) => (
                    // Chakra's `stickyHeader` recipe pins this row with
                    // zIndex 1; lift it above the body's pinned cells
                    // (zIndex 2) so rows don't paint over the header.
                    <Table.Row key={headerGroup.id} style={{ zIndex: 3 }}>
                      {headerGroup.headers
                        .filter((header) => header.column.getIsVisible())
                        .map((header) => (
                          <table.AppHeader header={header} key={header.id}>
                            {(h) => (
                              <Table.ColumnHeader
                                colSpan={h.colSpan}
                                align={
                                  h.column.id === 'select'
                                    ? 'center'
                                    : undefined
                                }
                                style={{
                                  width: h.getSize(),
                                  padding: 8,
                                  position: 'relative',
                                  // Clip keeps the header content (title + menu
                                  // chevron) inside the cell so it can't spill
                                  // over the resize handle. Kept as a normal
                                  // table cell (no display override) so the
                                  // fixed table layout still works.
                                  overflow: 'hidden',
                                  ...getCommonPinningStyles(h.column),
                                  // Opaque in every header cell (not just
                                  // pinned ones) so body content doesn't
                                  // show through the sticky header.
                                  background: 'var(--chakra-colors-bg)',
                                }}
                              >
                                <Box
                                  style={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    // Leave room for the resize handle.
                                    paddingRight: h.column.getCanResize()
                                      ? 8
                                      : 0,
                                  }}
                                >
                                  {h.isPlaceholder ? null : <h.FlexRender />}
                                </Box>
                                <h.ResizeHandle />
                              </Table.ColumnHeader>
                            )}
                          </table.AppHeader>
                        ))}
                    </Table.Row>
                  ))}
                </Table.Header>
                <Table.Body>
                  {table.getRowModel().rows.map((row) => {
                    const selected = row.getIsSelected()
                    return (
                      <Table.Row
                        key={row.id}
                        aria-selected={selected}
                        data-selected={selected || undefined}
                        bg={
                          selected
                            ? 'var(--chakra-colors-blue-subtle)'
                            : undefined
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <table.AppCell cell={cell} key={cell.id}>
                            {(c) => (
                              <Table.Cell
                                align={
                                  c.column.id === 'select'
                                    ? 'center'
                                    : undefined
                                }
                                style={{
                                  width: c.column.getSize(),
                                  overflow: 'hidden',
                                  ...getCommonPinningStyles(c.column, selected),
                                }}
                              >
                                {c.getIsGrouped() ? (
                                  <c.GroupedCell />
                                ) : (
                                  <c.FlexRender />
                                )}
                              </Table.Cell>
                            )}
                          </table.AppCell>
                        ))}
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
            <table.Pagination />
          </Box>
        </Stack>
      </Container>
    </table.AppTable>
  )
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root() {
  return (
    <ChakraExampleProvider>
      <App />
      <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
    </ChakraExampleProvider>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
