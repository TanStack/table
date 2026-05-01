import { render } from 'preact'
import { useEffect, useMemo, useReducer, useState } from 'preact/hooks'
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
  createSortedRowModel,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import { makeData } from './makeData'
import type { JSX } from 'preact'
import type {
  CellData,
  Column,
  RowData,
  TableFeatures,
} from '@tanstack/preact-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

declare module '@tanstack/preact-table' {
  // allows us to define custom properties for our columns
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterVariant?: 'text' | 'range' | 'select'
  }
}

function App() {
  const columns = useMemo(
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

  const [data, setData] = useState<Array<Person>>(() => makeData(5_000))
  const refreshData = () => setData((_old) => makeData(5_000))
  const stressTest = () => setData((_old) => makeData(100_000))
  const rerender = useReducer(() => ({}), {})[1]

  const table = useTable({
    _features,
    _rowModels: {
      filteredRowModel: createFilteredRowModel(filterFns), // client-side filtering
      paginatedRowModel: createPaginatedRowModel(),
      sortedRowModel: createSortedRowModel(sortFns),
      facetedRowModel: createFacetedRowModel(), // client-side faceting
      facetedMinMaxValues: createFacetedMinMaxValues(), // generate min/max values for range filter
      facetedUniqueValues: createFacetedUniqueValues(), // generate unique values for select filter/autocomplete
    },
    columns,
    data,
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  return (
    <table.Subscribe
      selector={(state) => ({
        columnFilters: state.columnFilters,
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
                  const page = (e.target as HTMLInputElement).value
                    ? Number((e.target as HTMLInputElement).value) - 1
                    : 0
                  table.setPageIndex(page)
                }}
                className="page-size-input"
              />
            </span>
            <select
              value={state.pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number((e.target as HTMLSelectElement).value))
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
            <button onClick={rerender}>Force Rerender</button>
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
  const { filterVariant } = column.columnDef.meta ?? {}

  const columnFilterValue = column.getFilterValue()

  const minMaxValues = column.getFacetedMinMaxValues()

  const sortedUniqueValues = useMemo(
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
      onChange={(e) =>
        column.setFilterValue((e.target as HTMLSelectElement).value)
      }
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

// A typical debounced input preact component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Record<string, any>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue((e.target as HTMLInputElement).value)}
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(<App />, rootElement)
