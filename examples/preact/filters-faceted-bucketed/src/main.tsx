import { render } from 'preact'
import { useState } from 'preact/hooks'

import {
  columnFacetingFeature,
  columnFilteringFeature,
  constructFilterFn,
  createColumnHelper,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  metaHelper,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import './index.css'
import { dataReferenceDate, makeData } from './makeData'
import type { Column, PreactTable } from '@tanstack/preact-table'
import type { Account } from './makeData'

type FacetKey = string

type Bucket<TValue> = {
  value: FacetKey
  label: string
  test: (value: TValue) => boolean
}

type FacetOption = Pick<Bucket<unknown>, 'value' | 'label'>

interface MyColumnMeta {
  filterVariant?: 'text' | 'facets'
  facetOptions?: ReadonlyArray<FacetOption>
}

// Relative date buckets need a stable reference time. An application that stays
// open across midnight should update this value and rebuild its data/columns.
const now = dataReferenceDate
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const startOfYesterday = new Date(startOfToday)
startOfYesterday.setDate(startOfYesterday.getDate() - 1)
const startOfWeek = new Date(startOfToday)
const daysSinceMonday = (startOfWeek.getDay() + 6) % 7
startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday)
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

const lastLoginBuckets = [
  {
    value: 'today',
    label: 'Today',
    test: (value: Date) => value >= startOfToday,
  },
  {
    value: 'yesterday',
    label: 'Yesterday',
    test: (value: Date) => value >= startOfYesterday,
  },
  {
    value: 'this-week',
    label: 'This week',
    test: (value: Date) => value >= startOfWeek,
  },
  {
    value: 'this-month',
    label: 'This month',
    test: (value: Date) => value >= startOfMonth,
  },
  {
    value: 'older',
    label: 'Older',
    test: () => true,
  },
] satisfies ReadonlyArray<Bucket<Date>>

const GB = 1024 ** 3
const storageBuckets = [
  {
    value: 'under-1-gb',
    label: '< 1 GB',
    test: (value: number) => value < GB,
  },
  {
    value: '1-to-10-gb',
    label: '1–10 GB',
    test: (value: number) => value < 10 * GB,
  },
  {
    value: '10-to-100-gb',
    label: '10–100 GB',
    test: (value: number) => value < 100 * GB,
  },
  {
    value: '100-gb-plus',
    label: '100+ GB',
    test: () => true,
  },
] satisfies ReadonlyArray<Bucket<number>>

function getBucket<TValue>(
  value: TValue,
  buckets: ReadonlyArray<Bucket<TValue>>,
): FacetKey {
  const bucket = buckets.find((candidate) => candidate.test(value))

  if (!bucket) {
    throw new Error(`No facet bucket matched ${String(value)}`)
  }

  return bucket.value
}

// Faceting and filtering deliberately share the same bucket definitions. The
// column keeps its raw value for rendering, sorting, and all other operations.
function createBucketFilter<TValue>(buckets: ReadonlyArray<Bucket<TValue>>) {
  return constructFilterFn({
    resolveDataValue: (value) => getBucket(value as TValue, buckets),
    filter: (bucketValue, selectedBuckets: ReadonlyArray<FacetKey>) =>
      selectedBuckets.includes(bucketValue),
    autoRemove: (selectedBuckets: ReadonlyArray<FacetKey>) =>
      !selectedBuckets.length,
  })
}

const features = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filterFns: {
    includesString: filterFn_includesString,
  },
  columnMeta: metaHelper<MyColumnMeta>(),
})

const columnHelper = createColumnHelper<typeof features, Account>()

const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: 'Account',
    filterFn: 'includesString',
    meta: { filterVariant: 'text' },
  }),
  columnHelper.accessor('lastLogin', {
    header: 'Last login',
    cell: (info) => info.getValue().toLocaleString(),
    getUniqueValues: (row) => [getBucket(row.lastLogin, lastLoginBuckets)],
    filterFn: createBucketFilter(lastLoginBuckets),
    meta: {
      filterVariant: 'facets',
      facetOptions: lastLoginBuckets,
    },
  }),
  columnHelper.accessor('storageBytes', {
    header: 'Storage',
    cell: (info) => formatBytes(info.getValue()),
    getUniqueValues: (row) => [getBucket(row.storageBytes, storageBuckets)],
    filterFn: createBucketFilter(storageBuckets),
    meta: {
      filterVariant: 'facets',
      facetOptions: storageBuckets,
    },
  }),
  columnHelper.accessor('files', {
    header: 'Files',
    enableColumnFilter: false,
    cell: (info) => info.getValue().toLocaleString(),
  }),
])

function App() {
  const [data, setData] = useState<Array<Account>>(() => makeData(5_000))
  const refreshData = () => setData(makeData(5_000))
  const stressTest = () => setData(makeData(1_000_000))

  const table = useTable(
    {
      features,
      columns,
      data,
      debugTable: true,
      debugHeaders: true,
      debugColumns: false,
    },
    (state) => state, // default selector
  )

  return (
    <div className="demo-root">
      <h1>Bucketed faceted filters</h1>
      <p>
        Bucket continuous values without a hidden derived column. Select more
        than one bucket to match either value; counts react to filters on the
        other columns.
      </p>

      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1M rows)</button>
        <button onClick={() => table.resetColumnFilters()}>
          Clear all filters
        </button>
      </div>
      <div className="spacer-sm" />

      <div className="table-container">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div className="header-label">
                          <table.FlexRender header={header} />
                        </div>
                        {header.column.getCanFilter() ? (
                          <Filter column={header.column} table={table} />
                        ) : null}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getAllCells().map((cell) => (
                  <td key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
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
            min="1"
            max={table.getPageCount()}
            value={table.state.pagination.pageIndex + 1}
            onInput={(event) => {
              const page = event.currentTarget.value
                ? Number(event.currentTarget.value) - 1
                : 0
              table.setPageIndex(page)
            }}
            className="page-size-input"
          />
        </span>
        <select
          value={table.state.pagination.pageSize}
          onChange={(event) =>
            table.setPageSize(Number(event.currentTarget.value))
          }
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

function Filter({
  column,
  table,
}: {
  column: Column<typeof features, Account>
  table: PreactTable<typeof features, Account>
}) {
  const { filterVariant, facetOptions } = column.columnDef.meta ?? {}

  return (
    // These builder-pattern reads happen on a stable `column`. Subscribe keeps
    // this nested component reactive and React Compiler-compatible.
    <table.Subscribe selector={(state) => state.columnFilters}>
      {() =>
        filterVariant === 'facets' && facetOptions ? (
          <FacetFilter
            column={column}
            options={facetOptions}
            selected={(column.getFilterValue() ?? []) as Array<FacetKey>}
            counts={column.getFacetedUniqueValues()}
          />
        ) : (
          <input
            aria-label={`Filter ${column.id}`}
            className="text-filter"
            value={(column.getFilterValue() ?? '') as string}
            onChange={(event) =>
              column.setFilterValue(event.currentTarget.value)
            }
            placeholder="Search…"
          />
        )
      }
    </table.Subscribe>
  )
}

function FacetFilter({
  column,
  options,
  selected,
  counts,
}: {
  column: Column<typeof features, Account>
  options: ReadonlyArray<FacetOption>
  selected: Array<FacetKey>
  counts: Map<unknown, number>
}) {
  const toggleBucket = (value: FacetKey) => {
    column.setFilterValue(
      selected.includes(value)
        ? selected.filter((selectedValue) => selectedValue !== value)
        : [...selected, value],
    )
  }

  return (
    <fieldset className="facet-options">
      <legend className="sr-only">Filter {column.id}</legend>
      {options.map((option) => (
        <label key={option.value}>
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => toggleBucket(option.value)}
          />
          <span>{option.label}</span>
          <span className="count">
            {(counts.get(option.value) ?? 0).toLocaleString()}
          </span>
        </label>
      ))}
    </fieldset>
  )
}

function formatBytes(value: number) {
  if (value < GB) return `${(value / 1024 ** 2).toFixed(0)} MB`
  return `${(value / GB).toFixed(1)} GB`
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(<App />, rootElement)
