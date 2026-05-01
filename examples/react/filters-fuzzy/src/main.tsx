import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
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
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type { Column, FilterFn, SortFn } from '@tanstack/react-table'

// A TanStack fork of Kent C. Dodds' match-sorter library that provides ranking information
import type { RankingInfo } from '@tanstack/match-sorter-utils'

const _features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<typeof _features, Person> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta?.({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort: SortFn<typeof _features, Person> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

declare module '@tanstack/react-table' {
  // add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<typeof _features, Person>
  }
  interface FilterMeta {
    itemRank?: RankingInfo
  }
}

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('id', {
          filterFn: 'equalsString', // note: normal non-fuzzy filter column - exact match required
        }),
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          filterFn: 'includesStringSensitive', // note: normal non-fuzzy filter column - case sensitive
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => <span>Last Name</span>,
          filterFn: 'includesString', // note: normal non-fuzzy filter column - case insensitive
        }),
        columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
          id: 'fullName',
          header: 'Full Name',
          cell: (info) => info.getValue(),
          filterFn: 'fuzzy', // using our custom fuzzy filter function
          // filterFn: fuzzyFilter, //or just define with the function
          sortFn: fuzzySort, // sort by fuzzy rank (falls back to alphanumeric)
        }),
      ]),
    [],
  )

  const [data, setData] = React.useState<Array<Person>>(() => makeData(5_000))
  const refreshData = () => setData(makeData(5_000))
  const stressTest = () => setData(makeData(100_000))

  const table = useTable<typeof _features, Person>({
    _features,
    _rowModels: {
      filteredRowModel: createFilteredRowModel({
        ...filterFns,
        fuzzy: fuzzyFilter,
      }),
      paginatedRowModel: createPaginatedRowModel(),
      sortedRowModel: createSortedRowModel(sortFns),
    },
    columns,
    data,
    globalFilterFn: 'fuzzy', // apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  // apply the fuzzy sort if the fullName column is being filtered
  React.useEffect(() => {
    if (table.store.state.columnFilters[0]?.id === 'fullName') {
      if (table.store.state.sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.store.state.columnFilters[0]?.id])

  return (
    <table.Subscribe
      selector={(state) => ({
        columnFilters: state.columnFilters,
        globalFilter: state.globalFilter,
        pagination: state.pagination,
        sorting: state.sorting,
      })}
    >
      {(state) => (
        <div className="demo-root">
          <div>
            <button onClick={() => refreshData()}>Regenerate Data</button>
            <button onClick={() => stressTest()}>
              Stress Test (100k rows)
            </button>
          </div>
          <div>
            <DebouncedInput
              value={state.globalFilter ?? ''}
              onChange={(value) => table.setGlobalFilter(String(value))}
              className="summary-panel"
              placeholder="Search all columns..."
            />
          </div>
          <div className="spacer-sm" />
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              className={
                                header.column.getCanSort()
                                  ? 'sortable-header'
                                  : ''
                              }
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <table.FlexRender header={header} />
                              {{
                                asc: ' 🔼',
                                desc: ' 🔽',
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                            {header.column.getCanFilter() ? (
                              <div>
                                <Filter column={header.column} />
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
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getAllCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          <table.FlexRender cell={cell} />
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="spacer-sm" />
          <div className="controls">
            <button
              className="demo-button demo-button-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="demo-button demo-button-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              className="demo-button demo-button-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="demo-button demo-button-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
            <span className="inline-controls">
              <div>Page</div>
              <strong>
                {(state.pagination.pageIndex + 1).toLocaleString()} of{' '}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span>
            <span className="inline-controls">
              | Go to page:
              <input
                type="number"
                defaultValue={state.pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="page-size-input"
              />
            </span>
            <select
              value={state.pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div>
            {table.getPrePaginatedRowModel().rows.length.toLocaleString()} Rows
          </div>
          <div>
            <button onClick={() => rerender()}>Force Rerender</button>
          </div>
          <table.Subscribe selector={(state) => state}>
            {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
          </table.Subscribe>
        </div>
      )}
    </table.Subscribe>
  )
}

function Filter({ column }: { column: Column<typeof _features, Person> }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      className="filter-select"
    />
  )
}

// A typical debounced input react component
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
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
