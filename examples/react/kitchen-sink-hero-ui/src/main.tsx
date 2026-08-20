'use client'

import * as React from 'react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import * as ReactDOM from 'react-dom/client'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import {
  Button,
  Table as HeroTable,
  Input,
  Surface,
  Switch,
  Tooltip,
  cn,
  useTheme,
} from '@heroui/react'
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
import './styles/globals.css'

function getAriaSort(sortDirection: false | 'asc' | 'desc') {
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
      ? '-4px 0 4px -4px hsl(var(--heroui-border)) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px hsl(var(--heroui-border)) inset'
        : undefined,
    insetInlineStart:
      isPinned === 'start' ? `${column.getStart('start')}px` : undefined,
    insetInlineEnd:
      isPinned === 'end' ? `${column.getAfter('end')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    borderRight: isLastLeftPinnedColumn
      ? '1px solid hsl(var(--heroui-border))'
      : undefined,
    borderLeft: isFirstRightPinnedColumn
      ? '1px solid hsl(var(--heroui-border))'
      : undefined,
    background: isSelected
      ? 'hsl(var(--heroui-primary) / 0.12)'
      : isPinned
        ? 'hsl(var(--heroui-background))'
        : undefined,
    zIndex: isPinned ? 2 : 0,
  }
}

function ModeSwitch() {
  const { theme, setTheme } = useTheme('system')

  return (
    <Tooltip>
      <Switch
        aria-label="Theme"
        size="sm"
        isSelected={theme === 'dark'}
        onChange={(selected) => setTheme(selected ? 'dark' : 'light')}
      >
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      </Switch>
      <Tooltip.Content>Theme</Tooltip.Content>
    </Tooltip>
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
} & Omit<React.ComponentProps<typeof Input>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })

  return (
    <Input
      {...props}
      value={String(value)}
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

  const table = useAppTable(
    {
      key: 'kitchen-sink-hero-ui',
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

  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(1_000_000))

  return (
    <table.AppTable>
      <main className="px-4 py-4">
        <div className="flex flex-col gap-4">
          <Surface className="rounded-lg border border-border p-3">
            <div className="flex flex-wrap justify-end gap-2">
              <ModeSwitch />
              <Button variant="secondary" size="sm" onPress={refreshData}>
                Regenerate Data
              </Button>
              <Button variant="secondary" size="sm" onPress={stressTest}>
                Stress Test (1M rows)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onPress={() =>
                  console.info(
                    'table.getSelectedRowModel().flatRows',
                    table.getSelectedRowModel().flatRows,
                  )
                }
              >
                Log Selected Rows
              </Button>
            </div>
          </Surface>

          <div className="flex flex-wrap items-center gap-2">
            <DebouncedTextInput
              aria-label="Search all columns"
              className="w-full md:w-[360px]"
              value={globalFilter}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
            />
            <table.FilterList />
            <table.SortList />
            <table.ViewOptions />
          </div>

          <HeroTable className="overflow-hidden rounded-lg border border-border">
            <HeroTable.ScrollContainer className="max-h-[680px]">
              <HeroTable.Content
                aria-label="Hero UI TanStack Table kitchen sink"
                style={{
                  width: `max(100%, ${table.getTotalSize()}px)`,
                  tableLayout: 'fixed',
                }}
              >
                <HeroTable.Header>
                  {table
                    .getHeaderGroups()[0]
                    ?.headers.filter((header) => header.column.getIsVisible())
                    .map((header) => (
                      <HeroTable.Column
                        key={header.id}
                        id={header.id}
                        allowsSorting={header.column.getCanSort()}
                        isRowHeader={header.column.id === 'firstName'}
                        aria-sort={getAriaSort(header.column.getIsSorted())}
                        className={cn(
                          header.column.id === 'select' && 'text-center',
                        )}
                        style={{
                          width: header.getSize(),
                          padding: 8,
                          ...getCommonPinningStyles(header.column),
                        }}
                      >
                        <table.AppHeader header={header}>
                          {(h) => (
                            <div className="relative pr-2">
                              {h.isPlaceholder ? null : <h.FlexRender />}
                              <h.ResizeHandle />
                            </div>
                          )}
                        </table.AppHeader>
                      </HeroTable.Column>
                    ))}
                </HeroTable.Header>
                <HeroTable.Body>
                  {table.getRowModel().rows.map((row) => {
                    const selected = row.getIsSelected()
                    return (
                      <HeroTable.Row
                        key={row.id}
                        id={row.id}
                        aria-selected={selected}
                        className={cn(selected && 'bg-primary/10')}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <HeroTable.Cell
                            key={cell.id}
                            className={cn(
                              'overflow-hidden',
                              cell.column.id === 'select' && 'text-center',
                            )}
                            style={{
                              width: cell.column.getSize(),
                              ...getCommonPinningStyles(cell.column, selected),
                            }}
                          >
                            <table.AppCell cell={cell}>
                              {(c) =>
                                c.getIsGrouped() ? (
                                  <c.GroupedCell />
                                ) : (
                                  <c.FlexRender />
                                )
                              }
                            </table.AppCell>
                          </HeroTable.Cell>
                        ))}
                      </HeroTable.Row>
                    )
                  })}
                </HeroTable.Body>
              </HeroTable.Content>
            </HeroTable.ScrollContainer>
            <table.Pagination />
          </HeroTable>
        </div>
      </main>
    </table.AppTable>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
  </React.StrictMode>,
)
