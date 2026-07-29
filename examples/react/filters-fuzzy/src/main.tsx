import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  filterFn_includesStringSensitive,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type {
  Column,
  FilterFn,
  SortFn,
  TableFeatures,
} from '@tanstack/react-table'

// A TanStack fork of Kent C. Dodds' match-sorter library that provides ranking information
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// The filter meta that the fuzzy filter attaches to rows, declared per-table
// via the `filterMeta` slot below. No declaration merging needed!
interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

// Broad features type for writing the custom fns below before the `features`
// object exists, with the filter meta type plugged in
type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<FuzzyFeatures, any> = (
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
const fuzzySort: SortFn<FuzzyFeatures, any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank as RankingInfo,
      rowB.columnFiltersMeta[columnId].itemRank as RankingInfo,
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortFn_alphanumeric(rowA, rowB, columnId) : dir
}

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    equalsString: filterFn_equalsString,
    includesString: filterFn_includesString,
    includesStringSensitive: filterFn_includesStringSensitive,
    fuzzy: fuzzyFilter,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    fuzzy: fuzzySort,
  },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

const columnHelper = createColumnHelper<typeof features, Person>()

function App() {
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
          filterFn: 'fuzzy', // using our custom fuzzy filter function registered in `features`
          sortFn: 'fuzzy', // sort by fuzzy rank (falls back to alphanumeric)
        }),
      ]),
    [],
  )

  const [data, setData] = React.useState<Array<Person>>(() => makeData(5_000))
  const refreshData = () => setData(makeData(5_000))
  const stressTest = () => setData(makeData(1_000_000))

  const table = useTable<typeof features, Person>(
    {
      features,
      columns,
      data,
      globalFilterFn: 'fuzzy', // apply fuzzy filter to the global filter (most common use case for fuzzy filter)
      // initialState: { columnFilters: [{ id: 'firstName', value: 'Jane' }], globalFilter: 'Jane' }, // set filters once
      // atoms: { columnFilters: columnFiltersAtom, globalFilter: globalFilterAtom }, // preferred external ownership
      // state: { columnFilters, globalFilter }, // classic controlled state; pair with the callbacks below
      // onColumnFiltersChange: setColumnFilters,
      // onGlobalFilterChange: setGlobalFilter,
      // enableFilters: false, // disable all column and global filtering; default true
      // enableColumnFilters: false, // disable per-column filters; default true
      // filterFromLeafRows: true, // keep parents whose descendants match; default filters from parents down
      // maxLeafRowFilterDepth: 1, // only filter through this nested-row depth; default 100
      // manualFiltering: true, // pass data that is already filtered, for example from a server
      // enableGlobalFilter: false, // disable the global filter input; default true
      // getColumnCanGlobalFilter: column => column.id !== 'status', // opt a column out of global filtering
      debugTable: true,
      debugHeaders: true,
      debugColumns: false,
    },
    (state) => state, // default selector
  )

  // apply the fuzzy sort if the fullName column is being filtered
  React.useEffect(() => {
    if (table.state.columnFilters[0]?.id === 'fullName') {
      if (table.state.sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.state.columnFilters[0]?.id])

  return (
    <div className="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1M rows)</button>
      </div>
      <div>
        <DebouncedInput
          value={table.state.globalFilter ?? ''}
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
                            header.column.getCanSort() ? 'sortable-header' : ''
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
          onClick={() => table.firstPage()}
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
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="inline-controls">
          <div>Page</div>
          <strong>
            {(table.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="inline-controls">
          | Go to page:
          <input
            type="number"
            defaultValue={table.state.pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="page-size-input"
          />
        </span>
        <select
          value={table.state.pagination.pageSize}
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
      <div></div>
      <pre data-testid="table-state">
        {JSON.stringify(table.state, null, 2)}
      </pre>
    </div>
  )
}

function Filter({ column }: { column: Column<typeof features, Person> }) {
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

  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })

  return (
    <input
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
    <App />
  </React.StrictMode>,
)
