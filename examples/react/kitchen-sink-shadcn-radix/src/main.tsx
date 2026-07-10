'use client'

import * as React from 'react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { Search } from 'lucide-react'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/react-table-devtools'
import type { Column } from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '@/types'
import type { Person } from '@/lib/make-data'
import type { features } from '@/hooks/features'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { makeData } from '@/lib/make-data'
import { cn } from '@/lib/utils'
import { useAppTable } from '@/hooks/table'
import { columns } from '@/columns'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { Input } from '@/components/ui/input'

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
      ? '-4px 0 4px -4px var(--border) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px var(--border) inset'
        : undefined,
    insetInlineStart:
      isPinned === 'start' ? `${column.getStart('start')}px` : undefined,
    insetInlineEnd:
      isPinned === 'end' ? `${column.getAfter('end')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    background: isSelected
      ? 'var(--muted)'
      : isPinned
        ? 'var(--background)'
        : undefined,
    zIndex: isPinned ? 1 : 0,
  }
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
      key: 'kitchen-sink-shadcn-radix',
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
    (state) => state, // default state selector
  )

  useTanStackTableDevtools(table)

  return (
    <table.AppTable>
      <div className="container mx-auto p-4 flex flex-col gap-4">
        <div className="flex items-center justify-end gap-2">
          <ModeToggle />
          <Button variant="outline" size="sm" onClick={() => refreshData()}>
            Regenerate Data
          </Button>
          <Button variant="outline" size="sm" onClick={() => stressTest()}>
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
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <DebouncedInput
                value={globalFilter}
                onChange={(value) => setGlobalFilter(String(value))}
                placeholder="Search all columns..."
                className="pl-8"
              />
            </div>
            <table.FilterList />
            <table.SortList />
            <table.ViewOptions />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers
                      .filter((header) => header.column.getIsVisible())
                      .map((header) => (
                        <table.AppHeader header={header} key={header.id}>
                          {(h) => (
                            <TableHead
                              colSpan={h.colSpan}
                              className={cn('relative', {
                                'border-r': h.id !== 'actions',
                                'text-center [&>[role=checkbox]]:mx-auto':
                                  h.column.id === 'select',
                              })}
                              style={{
                                flexGrow: h.getSize(),
                                width: h.getSize(),
                                ...getCommonPinningStyles(h.column),
                              }}
                            >
                              {h.isPlaceholder ? null : <h.FlexRender />}
                              <h.ResizeHandle />
                            </TableHead>
                          )}
                        </table.AppHeader>
                      ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    aria-selected={row.getIsSelected()}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <table.AppCell cell={cell} key={cell.id}>
                        {(c) => (
                          <TableCell
                            className={cn(
                              c.column.id === 'actions' ? '' : 'border-r',
                              c.column.id === 'select' &&
                                'text-center [&>[role=checkbox]]:mx-auto',
                            )}
                            style={{
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
                          </TableCell>
                        )}
                      </table.AppCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <table.Pagination />
        </div>
      </div>
    </table.AppTable>
  )
}

function DebouncedInput({
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
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        debouncedOnChange(e.target.value)
      }}
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <App />
      <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
    </ThemeProvider>
  </React.StrictMode>,
)
