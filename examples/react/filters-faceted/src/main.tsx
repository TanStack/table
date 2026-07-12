import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  columnFacetingFeature,
  columnFilteringFeature,
  createColumnHelper,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
  metaHelper,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { makeData } from './makeData'
import type { Column } from '@tanstack/react-table'
import type { Person } from './makeData'

// allows us to define custom properties for our columns
interface MyColumnMeta {
  filterVariant?: 'text' | 'range' | 'select'
}

const features = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filterFns,
  columnMeta: metaHelper<MyColumnMeta>(),
})

const columnHelper = createColumnHelper<typeof features, Person>()

function App() {
  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => <span>Last Name</span>,
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
          meta: {
            filterVariant: 'range',
          },
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
          meta: {
            filterVariant: 'range',
          },
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          meta: {
            filterVariant: 'select',
          },
        }),
        columnHelper.accessor('progress', {
          header: 'Profile Progress',
          meta: {
            filterVariant: 'range',
          },
        }),
      ]),
    [],
  )

  const [data, setData] = React.useState<Array<Person>>(() => makeData(5_000))
  const refreshData = () => setData(makeData(5_000))
  const stressTest = () => setData(makeData(1_000_000))

  const table = useTable(
    {
      features,
      columns,
      data,
      // Column faceting has no table-level options; configure its row-model factories in `features`.
      // initialState: { columnFilters: [{ id: 'firstName', value: 'Jane' }] }, // set filters once
      // atoms: { columnFilters: columnFiltersAtom }, // preferred: own column filters with an external atom
      // state: { columnFilters }, // classic controlled state; pair with onColumnFiltersChange
      // onColumnFiltersChange: setColumnFilters,
      // enableFilters: false, // disable all column and global filtering; default true
      // enableColumnFilters: false, // disable per-column filters; default true
      // filterFromLeafRows: true, // keep parents whose descendants match; default filters from parents down
      // maxLeafRowFilterDepth: 1, // only filter through this nested-row depth; default 100
      // manualFiltering: true, // pass data that is already filtered, for example from a server
      debugTable: true,
      debugHeaders: true,
      debugColumns: false,
    },
    (state) => state, // default selector
  )

  return (
    <div className="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1M rows)</button>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div>
                          <table.FlexRender header={header} />
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
      <pre>{JSON.stringify(table.state, null, 2)}</pre>
    </div>
  )
}

function Filter({ column }: { column: Column<typeof features, Person> }) {
  const { filterVariant } = column.columnDef.meta ?? {}

  const columnFilterValue = column.getFilterValue()

  const minMaxValues = column.getFacetedMinMaxValues()

  const sortedUniqueValues = React.useMemo(
    () =>
      filterVariant === 'range'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column.getFacetedUniqueValues(), filterVariant],
  )

  return filterVariant === 'range' ? (
    <div>
      <div className="filter-row">
        <DebouncedInput
          type="number"
          min={Number(minMaxValues?.[0] ?? '')}
          max={Number(minMaxValues?.[1] ?? '')}
          value={(columnFilterValue as [number, number] | undefined)?.[0] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number] | undefined) => [
              value,
              old?.[1],
            ])
          }
          placeholder={`Min ${
            minMaxValues?.[0] !== undefined ? `(${minMaxValues[0]})` : ''
          }`}
          className="filter-input"
        />
        <DebouncedInput
          type="number"
          min={Number(minMaxValues?.[0] ?? '')}
          max={Number(minMaxValues?.[1] ?? '')}
          value={(columnFilterValue as [number, number] | undefined)?.[1] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number] | undefined) => [
              old?.[0],
              value,
            ])
          }
          placeholder={`Max ${minMaxValues?.[1] ? `(${minMaxValues[1]})` : ''}`}
          className="filter-input"
        />
      </div>
      <div className="spacer-xs" />
    </div>
  ) : filterVariant === 'select' ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">All</option>
      {sortedUniqueValues.map((value) => (
        // dynamically generated select options from faceted values feature
        <option value={value} key={value}>
          {value}
        </option>
      ))}
    </select>
  ) : (
    <>
      {/* Autocomplete suggestions from faceted values feature */}
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="filter-select"
        list={column.id + 'list'}
      />
      <div className="spacer-xs" />
    </>
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
