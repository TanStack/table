import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'

import {
  Column,
  Table,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  FilterFn,
  ColumnDef,
  flexRender,
  CellContext,
  FilterMeta,
} from '@tanstack/react-table'

import { makeData, VehicleOwner } from './makeData'

type HighlightRange = [number, number]
const HIGHLIGHT_RANGE_START = 0
const HIGHLIGHT_RANGE_END = 1

declare module '@tanstack/table-core' {
  interface FilterMeta {
    globalFilterRanges?: { [colId: string]: HighlightRange[] }
    columnFilterRanges?: HighlightRange[]
  }
}

interface ColumnFilterWithHighlightingConfig {
  /** Highlight all or first only */
  highlightAll: boolean
  /** Ignore newlines so newline character in cell value will not be treated as space */
  ignoreNewlines: boolean
  /** Search term */
  term: string
}

interface ResolvedColumnFilterWithHighlightingConfig
  extends ColumnFilterWithHighlightingConfig {
  /** Resoled search term */
  resolvedTerm: string
}

interface GlobalFilterWithHighlightingConfig {
  /** Highlight all or first only */
  highlightAll: boolean
  /** Ignore newlines so newline character in cell value will not be treated as space */
  ignoreNewlines: boolean
  /** Column that stores global filter meta */
  columnId: string
  /** Row must include all space-separated search terms or must include whole search term with spaces */
  multiterm: boolean
  /** Search term */
  term: string
}
interface ResolvedGlobalFilterWithHighlightingConfig
  extends GlobalFilterWithHighlightingConfig {
  /** Resoled search terms */
  resolvedTerms: string[]
}

function find(value: string, term: string, all: boolean = false) {
  const ranges: HighlightRange[] = []
  let position = 0
  while (true) {
    const startIndex = value.indexOf(term, position)
    if (startIndex >= 0) {
      ranges.push([startIndex, startIndex + term.length])
      if (all) {
        position = startIndex + term.length
      } else {
        break
      }
    } else {
      break
    }
  }
  return ranges
}

const globalFilterWithHighlighting: FilterFn<any> = function (
  row,
  columnId,
  filterValue,
  addMeta
) {
  const filterConfig = filterValue as ResolvedGlobalFilterWithHighlightingConfig
  // Perform global filtering only when columnId=ResolvedGlobalFilterWithHighlightingConfig.columnId
  if (columnId !== filterConfig.columnId) return false
  const allCols = row
    .getAllCells()
    .filter(cell => cell.column.getCanGlobalFilter())
    .map(cell => cell.column.id)
  const filterTerms = filterConfig.resolvedTerms
  const filterTermsFound = new Array(filterTerms.length).fill(false)
  const globalFilterRanges: FilterMeta['globalFilterRanges'] = {}
  for (const colId of allCols) {
    const value = row.getValue(colId)
    let valueStr: string
    if (typeof value === 'string') {
      valueStr = value.toLowerCase()
      if (!filterConfig.ignoreNewlines)
        // Replace all newlines with spaces
        // IMPORTANT number of characters must not be changed by replace here
        valueStr = valueStr.replace(/\s/g, ' ')
    } else {
      continue
    }
    globalFilterRanges[colId] = filterTerms
      .map((term, index) => {
        const ranges = find(valueStr, term, filterConfig.highlightAll)
        if (ranges.length) filterTermsFound[index] = true
        return ranges
      })
      .flat()
  }
  // Row is passing filter only when all filter terms found in this row
  if (filterTermsFound.every(found => found)) {
    // Store globalFilterRanges in filter meta for GlobalFilterWithHighlighting.columnId column
    addMeta({ ...row.columnFiltersMeta[columnId], globalFilterRanges })
    return true
  }
  return false
}

globalFilterWithHighlighting.resolveFilterValue = function (
  filterValue: GlobalFilterWithHighlightingConfig
): ResolvedGlobalFilterWithHighlightingConfig {
  if (filterValue.multiterm) {
    const filter = filterValue.term
      .split(/\s+/)
      .filter(term => !!term)
      .map(term => term.toLowerCase())
    if (filter.length === 0) throw new Error('Filter cannot be empty')
    return { ...filterValue, resolvedTerms: filter }
  }
  return { ...filterValue, resolvedTerms: [filterValue.term.toLowerCase()] }
}

const columnFilterWithHighlighting: FilterFn<any> = function (
  row,
  columnId,
  filterValue,
  addMeta
) {
  const filterConfig = filterValue as ResolvedColumnFilterWithHighlightingConfig
  const term = filterConfig.resolvedTerm
  const value = row.getValue(columnId)
  let valueStr: string
  if (typeof value === 'string') {
    valueStr = value.toLowerCase()
    if (!filterConfig.ignoreNewlines)
      // Replace all newlines with spaces
      // IMPORTANT number of characters must not be changed by replace here
      valueStr = valueStr.replace(/\s/g, ' ')
  } else {
    return false
  }
  const ranges = find(valueStr, term, filterConfig.highlightAll)
  if (ranges.length) {
    // Store ranges in filter meta for current column
    addMeta({
      ...row.columnFiltersMeta[columnId],
      columnFilterRanges: ranges,
    })
    return true
  }
  return false
}

columnFilterWithHighlighting.resolveFilterValue = function (
  filterValue: ColumnFilterWithHighlightingConfig
): ResolvedColumnFilterWithHighlightingConfig {
  return { ...filterValue, resolvedTerm: filterValue.term.toLowerCase() }
}

function getHighlightRanges(cellContext: CellContext<any, string>) {
  // Highlight ranges stored in columnFiltersMeta
  // Column with id=GlobalFilterWithHighlightingConfig.columnId stores globalFilterRanges from global filter
  // Other columns store ranges from individual column filter
  // Meta may remain even if filter is empty so we have to check if filter is empty
  const globalFilter = cellContext.table.getState().globalFilter as
    | GlobalFilterWithHighlightingConfig
    | undefined
  const globalFilterRanges = globalFilter?.term
    ? cellContext.row.columnFiltersMeta[globalFilter.columnId]
        ?.globalFilterRanges?.[cellContext.column.id]
    : undefined
  const columnFilter = cellContext.column.getFilterValue() as
    | ColumnFilterWithHighlightingConfig
    | undefined
  const columnFilterRanges = columnFilter?.term
    ? cellContext.row.columnFiltersMeta[cellContext.column.id]
        ?.columnFilterRanges
    : undefined

  // Concat all ranges in one array
  // Filter out all undefined ranges
  // Sort ranges by start index
  let ranges = (
    [...(globalFilterRanges ?? []), ...(columnFilterRanges ?? [])].filter(
      range => !!range
    ) as HighlightRange[]
  ).sort(
    (rangeA, rangeB) =>
      rangeA[HIGHLIGHT_RANGE_START] - rangeB[HIGHLIGHT_RANGE_START]
  )

  // Merge ranges if they overlap
  let i = 0
  let j = 1
  while (j < ranges.length) {
    if (ranges[i]![HIGHLIGHT_RANGE_END] >= ranges[j]![HIGHLIGHT_RANGE_START]) {
      ranges[j]![HIGHLIGHT_RANGE_START] = ranges[i]![HIGHLIGHT_RANGE_START]
      ranges[j]![HIGHLIGHT_RANGE_END] = Math.max(
        ranges[i]![HIGHLIGHT_RANGE_END],
        ranges[j]![HIGHLIGHT_RANGE_END]
      )
      ranges.splice(i, 1)
    } else {
      i++
      j++
    }
  }
  return ranges
}

function splitNewlines(value: string) {
  return value
    .split('\n')
    .map((line, lineIndex) => [lineIndex > 0 ? <br /> : undefined, line])
}

function splitHighlights(
  value: string,
  ranges: HighlightRange[],
  ignoreNewlines: boolean = false
) {
  const handleRange = ignoreNewlines ? (range: string) => range : splitNewlines
  const lastRange = value.slice(
    ranges.length > 0 ? ranges[ranges.length - 1]![HIGHLIGHT_RANGE_END] : 0
  )
  return [
    ...ranges.map((range, index, array) => {
      const spanRange = value.slice(
        index > 0 ? array[index - 1]![HIGHLIGHT_RANGE_END] : 0,
        range[HIGHLIGHT_RANGE_START]
      )
      const markRange = value.slice(
        range[HIGHLIGHT_RANGE_START],
        range[HIGHLIGHT_RANGE_END]
      )
      return [
        <span
          key={`span-${range[HIGHLIGHT_RANGE_START]}-${range[HIGHLIGHT_RANGE_END]}`}
        >
          {handleRange(spanRange)}
        </span>,
        <mark
          key={`mark-${range[HIGHLIGHT_RANGE_START]}-${range[HIGHLIGHT_RANGE_END]}`}
        >
          {handleRange(markRange)}
        </mark>,
      ]
    }),
    <span key="span-last">{handleRange(lastRange)}</span>,
  ]
}

const cellRenderer = (props: CellContext<VehicleOwner, string>) =>
  splitHighlights(props.cell.getValue(), getHighlightRanges(props))

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState<
    GlobalFilterWithHighlightingConfig | undefined
  >(undefined)

  const [highlightAll, setHighlightAll] = React.useState<boolean>(true)
  const [ignoreNewlines, setIgnoreNewlines] = React.useState<boolean>(false)
  const [multiterm, setGlobalFilterMultiterm] = React.useState<boolean>(true)

  React.useEffect(() => {
    setColumnFilters(prev =>
      prev.map(filter => ({
        ...filter,
        value: filter.value
          ? { ...filter.value, highlightAll, ignoreNewlines }
          : undefined,
      }))
    )
    setGlobalFilter(prev =>
      prev ? { ...prev, highlightAll, ignoreNewlines, multiterm } : undefined
    )
  }, [highlightAll, ignoreNewlines, multiterm])

  const columns = React.useMemo<ColumnDef<VehicleOwner, any>[]>(
    () => [
      {
        accessorKey: 'vehicle',
        cell: cellRenderer,
        filterFn: columnFilterWithHighlighting,
      },
      {
        accessorKey: 'vehicleId',
        cell: cellRenderer,
        filterFn: columnFilterWithHighlighting,
      },
      {
        accessorKey: 'vehicleRegMark',
        cell: cellRenderer,
        filterFn: columnFilterWithHighlighting,
      },
      {
        accessorKey: 'buyLocation',
        cell: cellRenderer,
        filterFn: columnFilterWithHighlighting,
      },
      {
        accessorKey: 'ownerName',
        cell: cellRenderer,
        filterFn: columnFilterWithHighlighting,
      },
      {
        accessorKey: 'ownerContacts',
        cell: cellRenderer,
        filterFn: columnFilterWithHighlighting,
      },

      {
        accessorKey: 'comment',
        cell: cellRenderer,
        filterFn: columnFilterWithHighlighting,
      },
    ],
    []
  )

  const [data, setData] = React.useState<VehicleOwner[]>(() => makeData(50000))
  const refreshData = () => setData(old => makeData(50000))

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: globalFilterWithHighlighting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  return (
    <div className="p-2">
      <div>
        <div>
          <input
            type="checkbox"
            id="highlightAllCheckbox"
            checked={highlightAll}
            onChange={() => {
              setHighlightAll(prev => !prev)
            }}
          />{' '}
          <label htmlFor="highlightAllCheckbox">Highlight All</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="ignoreNewlinesCheckbox"
            checked={ignoreNewlines}
            onChange={() => {
              setIgnoreNewlines(prev => !prev)
            }}
          />{' '}
          <label htmlFor="ignoreNewlinesCheckbox">Ignore Newlines</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="globalFilterMultitermCheckbox"
            checked={multiterm}
            onChange={() => {
              setGlobalFilterMultiterm(prev => !prev)
            }}
          />{' '}
          <label htmlFor="globalFilterMultitermCheckbox">
            Global Filter Multiterm
          </label>
        </div>
      </div>
      <div>
        <DebouncedInput
          value={globalFilter?.term ?? ''}
          onChange={value => {
            const valueStr = String(value)
            const good = multiterm
              ? !!valueStr && !/^\s+$/.test(valueStr)
              : !!valueStr
            setGlobalFilter(
              good
                ? {
                    columnId: 'vehicle',
                    highlightAll,
                    ignoreNewlines,
                    multiterm,
                    term: valueStr,
                  }
                : undefined
            )
          }}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search all columns..."
        />
      </div>
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter
                              column={header.column}
                              table={table}
                              highlightAll={highlightAll}
                              ignoreNewlines={ignoreNewlines}
                            />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id} className="border">
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
    </div>
  )
}

function Filter({
  column,
  table,
  highlightAll,
  ignoreNewlines,
}: {
  column: Column<any, unknown>
  table: Table<any>
  highlightAll: boolean
  ignoreNewlines: boolean
}) {
  const filterValue = column.getFilterValue() as
    | ColumnFilterWithHighlightingConfig
    | undefined
  return (
    <>
      <div>
        <DebouncedInput
          type="text"
          value={filterValue?.term ?? ''}
          onChange={value =>
            column.setFilterValue(
              value
                ? ({
                    highlightAll,
                    ignoreNewlines,
                    term: value,
                  } as ColumnFilterWithHighlightingConfig)
                : undefined
            )
          }
          placeholder="Search..."
          className="w-36 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </>
  )
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
