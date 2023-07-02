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

declare module '@tanstack/table-core' {
  interface FilterMeta {
    globalRanges?: { [colId: string]: HighlightRange[] }
    range?: HighlightRange
  }
}

const globalFilterColumnId = 'globalFilter'

const globalFilterWithHighlighting: FilterFn<any> = (
  row,
  columnId,
  filterValue,
  addMeta
) => {
  // Perform global filtering only when columnId=globalFilterColumnId
  if (columnId !== globalFilterColumnId) return false
  const allCols = row.getVisibleCells().map(cell => cell.column.id)
  const filterTerms = filterValue as string[]
  const filterTermsFound = new Array(filterTerms.length).fill(false)
  const globalRanges: FilterMeta['globalRanges'] = {}
  for (const colId of allCols) {
    const value = row.getValue(colId)
    let valueStr: string
    if (typeof value === 'string') {
      valueStr = value.toLowerCase()
    } else {
      continue
    }
    globalRanges[colId] = filterTerms
      .map((term, index) => {
        const startIndex = valueStr.indexOf(term)
        if (startIndex >= 0) {
          filterTermsFound[index] = true
          return [startIndex, startIndex + term.length]
        }
      })
      .filter(range => !!range) as HighlightRange[]
  }
  // Row is passing filter only when all filter terms found in this row
  if (filterTermsFound.every(found => found)) {
    // Store globalRanges in filter meta for globalFilterColumnId column
    addMeta({ globalRanges })
    return true
  }
  return false
}

const columnFilterWithHighlighting: FilterFn<any> = (
  row,
  columnId,
  filterValue,
  addMeta
) => {
  const term = filterValue.toLowerCase()
  const value = row.getValue(columnId)
  let valueStr: string
  if (typeof value === 'string') {
    valueStr = value.toLowerCase()
  } else {
    return false
  }
  const startIndex = valueStr.indexOf(term)
  if (startIndex >= 0) {
    // Store range in filter meta for current column
    addMeta({ range: [startIndex, startIndex + term.length] })
    return true
  }
  return false
}

function getHighlightRanges(cellContext: CellContext<VehicleOwner, string>) {
  // Highlight ranges stored in columnFiltersMeta
  // Column with id=globalFilterColumnId stores globalRanges from global filter
  // Other columns store a single range from individual column filter
  // Meta may remain even if filter is empty so we have to check if filter is empty
  const globalRanges = cellContext.table.getState().globalFilter
    ? cellContext.row.columnFiltersMeta[globalFilterColumnId]?.globalRanges?.[
        cellContext.column.id
      ]
    : undefined
  const range = cellContext.column.getFilterValue()
    ? cellContext.row.columnFiltersMeta[cellContext.column.id]?.range
    : undefined

  // Concat all ranges in one array
  // Filter out all undefined ranges
  // Sort ranges by start index
  let ranges = (
    [...(globalRanges ?? []), range].filter(
      range => !!range
    ) as HighlightRange[]
  ).sort((rangeA, rangeB) => rangeA[0] - rangeB[0])

  // Merge ranges if they overlap
  let i = 0
  let j = 1
  while (j < ranges.length) {
    if (ranges[i]![1] >= ranges[j]![0]) {
      ranges[j]![0] = ranges[i]![0]
      ranges[j]![1] = Math.max(ranges[i]![1], ranges[j]![1])
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
    ranges.length > 0 ? ranges[ranges.length - 1]![1] : 0
  )
  return [
    ...ranges.map((range, index, array) => {
      const spanRange = value.slice(
        index > 0 ? array[index - 1]![1] : 0,
        range[0]
      )
      const markRange = value.slice(range[0], range[1])
      return [
        <span key={`span-${range[0]}-${range[1]}`}>
          {handleRange(spanRange)}
        </span>,
        <mark key={`mark-${range[0]}-${range[1]}`}>
          {handleRange(markRange)}
        </mark>,
      ]
    }),
    <span key="span-last">{handleRange(lastRange)}</span>,
  ]
}

const createAccessorFn =
  (key: keyof VehicleOwner) => (originalRow: VehicleOwner) =>
    // Replace all newlines with spaces
    // IMPORTANT number of characters must not be changed by replace here
    originalRow[key].replace(/\s/g, ' ')

const createCellRenderer =
  (key: keyof VehicleOwner) => (props: CellContext<VehicleOwner, string>) =>
    // Use original string with newlines instead of cell.getValue() with replaced newlines
    splitHighlights(props.row.original[key], getHighlightRanges(props))

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilterString, setGlobalFilterString] = React.useState('')
  const globalFilter = React.useMemo(() => {
    const filter = globalFilterString
      .split(/\s+/)
      .filter(term => !!term)
      .map(term => term.toLowerCase())
    return filter.length ? filter : undefined
  }, [globalFilterString])

  const columns = React.useMemo<ColumnDef<VehicleOwner, any>[]>(
    () => [
      {
        id: globalFilterColumnId,
        accessorFn: (originalRow, index) => index,
      },
      {
        id: 'vehicle',
        accessorFn: createAccessorFn('vehicle'),
        cell: createCellRenderer('vehicle'),
        filterFn: columnFilterWithHighlighting,
      },
      {
        id: 'vehicleId',
        accessorFn: createAccessorFn('vehicleId'),
        cell: createCellRenderer('vehicleId'),
        filterFn: columnFilterWithHighlighting,
      },
      {
        id: 'vehicleRegMark',
        accessorFn: createAccessorFn('vehicleRegMark'),
        cell: createCellRenderer('vehicleRegMark'),
        filterFn: columnFilterWithHighlighting,
      },
      {
        id: 'buyLocation',
        accessorFn: createAccessorFn('buyLocation'),
        cell: createCellRenderer('buyLocation'),
        filterFn: columnFilterWithHighlighting,
      },
      {
        id: 'ownerName',
        accessorFn: createAccessorFn('ownerName'),
        cell: createCellRenderer('ownerName'),
        filterFn: columnFilterWithHighlighting,
      },
      {
        id: 'ownerContacts',
        accessorFn: createAccessorFn('ownerContacts'),
        cell: createCellRenderer('ownerContacts'),
        filterFn: columnFilterWithHighlighting,
      },

      {
        id: 'comment',
        accessorFn: createAccessorFn('comment'),
        cell: createCellRenderer('comment'),
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
      columnVisibility: { [globalFilterColumnId]: false },
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
        <DebouncedInput
          value={globalFilterString ?? ''}
          onChange={value => setGlobalFilterString(String(value))}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search all columns..."
        />{' '}
        <span className="text-gray-500">Row must include all search terms</span>
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
                            <Filter column={header.column} table={table} />
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
}: {
  column: Column<any, unknown>
  table: Table<any>
}) {
  return (
    <>
      <div>
        <DebouncedInput
          type="text"
          value={(column.getFilterValue() ?? '') as string}
          onChange={value => column.setFilterValue(value)}
          placeholder="Search..."
          className="w-36 border shadow rounded"
        />
        <br />
        <span className="font-normal text-gray-500">
          Cell must include whole search term. Newline in cell value will be
          treated as space
        </span>
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
