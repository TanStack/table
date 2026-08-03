'use client'

import * as React from 'react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import * as ReactDOM from 'react-dom/client'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import {
  Column as AriaColumn,
  Table as AriaTable,
  Button,
  Cell,
  Input,
  Row,
  Switch,
  TableBody,
  TableHeader,
  Tooltip,
  TooltipTrigger,
} from 'react-aria-components'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/react-table-devtools'
import { getAriaSort } from '@tanstack/react-table'
import type { Column } from '@tanstack/react-table'
import type { ExtendedColumnFilter } from '@/types'
import type { Person } from '@/lib/make-data'
import type { features } from '@/hooks/features'
import { makeData } from '@/lib/make-data'
import { useAppTable } from '@/hooks/table'
import { columns } from '@/columns'
import { cx } from '@/components/data-table/shared'
import './styles/globals.css'

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
    borderRight: isLastLeftPinnedColumn ? '1px solid var(--border)' : undefined,
    borderLeft: isFirstRightPinnedColumn
      ? '1px solid var(--border)'
      : undefined,
    background: isSelected
      ? 'color-mix(in srgb, var(--primary) 12%, var(--surface))'
      : isPinned
        ? 'var(--surface)'
        : undefined,
    zIndex: isPinned ? 2 : 0,
  }
}

function ModeSwitch() {
  const [isDark, setIsDark] = React.useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <TooltipTrigger>
      <Switch aria-label="Theme" isSelected={isDark} onChange={setIsDark}>
        <span className="switch-track">
          <span className="switch-thumb" />
        </span>
      </Switch>
      <Tooltip>Theme</Tooltip>
    </TooltipTrigger>
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
      className={cx(
        'react-aria-Input',
        typeof props.className === 'string' ? props.className : undefined,
      )}
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

  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(1_000_000))

  const table = useAppTable(
    {
      key: 'kitchen-sink-react-aria',
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

  // Keep tableLayout: 'fixed' + CSS-variable column widths because
  // React Aria Components render real <table>/<th>/<td> elements.
  // Setting display: grid/flex on semantic table elements breaks
  // native table layout and accessibility semantics.
  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: Record<string, number> = {}
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.state.columnSizing])

  return (
    <table.AppTable>
      <main className="app-shell">
        <div className="flex flex-col gap-4">
          <div className="control-panel">
            <div className="control-panel-actions">
              <ModeSwitch />
              <Button onPress={refreshData}>Regenerate Data</Button>
              <Button onPress={stressTest}>Stress Test (1M rows)</Button>
              <Button
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
          </div>

          <div className="table-toolbar">
            <div className="table-toolbar-search">
              <DebouncedTextInput
                aria-label="Search all columns"
                value={globalFilter}
                onChange={(value) => setGlobalFilter(String(value))}
                placeholder="Search all columns..."
              />
            </div>
            <div className="table-toolbar-actions">
              <table.FilterList />
              <table.SortList />
              <table.ViewOptions />
            </div>
          </div>

          <div className="table-shell">
            <div className="table-scroll max-h-[680px]">
              <AriaTable
                aria-label="React Aria TanStack Table kitchen sink"
                className="data-table min-w-[1200px]"
                style={{
                  width: `max(100%, ${table.getTotalSize()}px)`,
                  tableLayout: 'fixed',
                  ...columnSizeVars,
                }}
              >
                <TableHeader>
                  {table
                    .getHeaderGroups()[0]
                    ?.headers.filter((header) => header.column.getIsVisible())
                    .map((header) => (
                      <AriaColumn
                        key={header.id}
                        id={header.id}
                        allowsSorting={header.column.getCanSort()}
                        isRowHeader={header.column.id === 'firstName'}
                        aria-sort={getAriaSort(header.column.getIsSorted())}
                        className={cx(
                          'header-cell',
                          header.column.id === 'select' && 'select-cell',
                          header.column.id === 'actions' && 'action-cell',
                        )}
                        style={{
                          width: `calc(var(--header-${header.id}-size) * 1px)`,
                          ...getCommonPinningStyles(header.column),
                        }}
                      >
                        <table.AppHeader header={header}>
                          {(h) => (
                            <div className="header-cell-content">
                              {h.isPlaceholder ? null : <h.FlexRender />}
                              <h.ResizeHandle />
                            </div>
                          )}
                        </table.AppHeader>
                      </AriaColumn>
                    ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => {
                    const selected = row.getIsSelected()
                    return (
                      <Row
                        key={row.id}
                        id={row.id}
                        aria-selected={selected}
                        className={cx(selected && 'bg-primary/10')}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <Cell
                            key={cell.id}
                            className={cx(
                              'overflow-hidden',
                              cell.column.id === 'select' && 'select-cell',
                              cell.column.id === 'actions' && 'action-cell',
                            )}
                            style={{
                              width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
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
                          </Cell>
                        ))}
                      </Row>
                    )
                  })}
                </TableBody>
              </AriaTable>
            </div>
            <table.Pagination />
          </div>
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
