'use client'

import * as React from 'react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import * as ReactDOM from 'react-dom/client'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  MantineProvider,
  Table as MantineTable,
  Menu,
  Paper,
  Stack,
  TextInput,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import '@mantine/core/styles.css'
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
import type {
  Cell,
  Column,
  Header,
  HeaderGroup,
  Row,
} from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '@/types'
import type { Person } from '@/lib/make-data'
import type { features } from '@/hooks/features'
import { makeData } from '@/lib/make-data'
import { useAppTable } from '@/hooks/table'
import { columns } from '@/columns'
import './styles/globals.css'

type AppColumn = Column<typeof features, Person, any>
type AppHeader = Header<typeof features, Person, any>
type AppRow = Row<typeof features, Person>
type AppCell = Cell<typeof features, Person, any>
type AppHeaderGroup = HeaderGroup<typeof features, Person>

function getCommonPinningStyles(
  column: AppColumn,
  isSelected = false,
): React.CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px var(--mantine-color-default-border) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px var(--mantine-color-default-border) inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    borderRight: isLastLeftPinnedColumn
      ? '1px solid var(--mantine-color-default-border)'
      : undefined,
    borderLeft: isFirstRightPinnedColumn
      ? '1px solid var(--mantine-color-default-border)'
      : undefined,
    background: isSelected
      ? 'var(--mantine-color-blue-light)'
      : isPinned
        ? 'var(--mantine-color-body)'
        : undefined,
    zIndex: isPinned ? 2 : 0,
  }
}

function ModeMenu() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')
  const icon =
    computedColorScheme === 'dark' ? (
      <IconMoon size={18} />
    ) : (
      <IconSun size={18} />
    )

  return (
    <Menu shadow="md" width={150}>
      <Menu.Target>
        <Tooltip label="Theme">
          <ActionIcon variant="subtle" aria-label="Theme">
            {icon}
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        {(
          [
            { value: 'light', label: 'Light', icon: <IconSun size={16} /> },
            { value: 'dark', label: 'Dark', icon: <IconMoon size={16} /> },
            {
              value: 'auto',
              label: 'Auto',
              icon: <IconDeviceDesktop size={16} />,
            },
          ] satisfies Array<{
            value: 'light' | 'dark' | 'auto'
            label: string
            icon: React.ReactNode
          }>
        ).map((item) => (
          <Menu.Item
            key={item.value}
            leftSection={item.icon}
            color={colorScheme === item.value ? 'blue' : undefined}
            onClick={() => setColorScheme(item.value)}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}

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
      key: 'kitchen-sink-mantine',
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
      <Container fluid py="md">
        <Stack gap="md">
          <Paper withBorder p="sm">
            <Group justify="flex-end" gap="xs">
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
            </Group>
          </Paper>

          <Group align="center" gap="xs">
            <DebouncedTextInput
              value={globalFilter}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
              leftSection={<IconSearch size={16} />}
              w={{ base: '100%', md: 360 }}
            />
            <table.FilterList />
            <table.SortList />
            <table.ViewOptions />
          </Group>

          <Paper withBorder>
            <MantineTable.ScrollContainer minWidth={0} maxHeight={680}>
              <MantineTable
                stickyHeader
                highlightOnHover
                withColumnBorders
                withRowBorders
                withTableBorder
                style={{
                  display: 'grid',
                }}
              >
                <MantineTable.Thead
                  style={{
                    display: 'grid',
                    position: 'sticky',
                    top: 0,
                    zIndex: 3,
                  }}
                >
                  {table
                    .getHeaderGroups()
                    .map((headerGroup: AppHeaderGroup) => (
                      <MantineTable.Tr
                        key={headerGroup.id}
                        style={{ display: 'flex', width: '100%' }}
                      >
                        {headerGroup.headers
                          .filter((header: AppHeader) =>
                            header.column.getIsVisible(),
                          )
                          .map((header: AppHeader) => (
                            <table.AppHeader header={header} key={header.id}>
                              {(h) => (
                                <MantineTable.Th
                                  colSpan={h.colSpan}
                                  style={{
                                    display: 'flex',
                                    flexShrink: 0,
                                    alignItems: 'center',
                                    overflow: 'clip',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    flexGrow: h.getSize(),
                                    width: h.getSize(),
                                    padding: 8,
                                    position: 'relative',
                                    ...getCommonPinningStyles(h.column),
                                  }}
                                >
                                  <Box
                                    style={{
                                      position: 'relative',
                                      flex: 1,
                                      minWidth: 0,
                                      paddingRight: h.column.getCanResize()
                                        ? 8
                                        : 0,
                                    }}
                                  >
                                    {h.isPlaceholder ? null : <h.FlexRender />}
                                  </Box>
                                  <h.ResizeHandle />
                                </MantineTable.Th>
                              )}
                            </table.AppHeader>
                          ))}
                      </MantineTable.Tr>
                    ))}
                </MantineTable.Thead>
                <MantineTable.Tbody style={{ display: 'grid' }}>
                  {table.getRowModel().rows.map((row: AppRow) => (
                    <MantineTable.Tr
                      key={row.id}
                      data-selected={row.getIsSelected() || undefined}
                      aria-selected={row.getIsSelected()}
                      style={{
                        display: 'flex',
                        width: '100%',
                        background: row.getIsSelected()
                          ? 'var(--mantine-color-blue-light)'
                          : undefined,
                      }}
                    >
                      {row.getVisibleCells().map((cell: AppCell) => (
                        <table.AppCell cell={cell} key={cell.id}>
                          {(c) => (
                            <MantineTable.Td
                              style={{
                                display: 'flex',
                                flexShrink: 0,
                                alignItems: 'center',
                                overflow: 'hidden',
                                flexGrow: c.column.getSize(),
                                width: c.column.getSize(),
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
                            </MantineTable.Td>
                          )}
                        </table.AppCell>
                      ))}
                    </MantineTable.Tr>
                  ))}
                </MantineTable.Tbody>
              </MantineTable>
            </MantineTable.ScrollContainer>
            <table.Pagination />
          </Paper>
        </Stack>
      </Container>
    </table.AppTable>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="auto">
      <App />
      <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
    </MantineProvider>
  </React.StrictMode>,
)
