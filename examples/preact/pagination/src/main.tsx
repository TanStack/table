import { render } from 'preact'
import { useMemo, useReducer, useState } from 'preact/hooks'
import './index.css'
import {
  columnFilteringFeature,
  createColumnHelper,
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
import type { Column, PreactTable } from '@tanstack/preact-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

function App() {
  const rerender = useReducer(() => ({}), {})[1]

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => <span>Last Name</span>,
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor('progress', {
          header: 'Profile Progress',
          footer: (props) => props.column.id,
        }),
      ]),
    [],
  )

  const [data, setData] = useState(() => makeData(1_000))
  const refreshData = () => setData(() => makeData(1_000))
  const stressTest = () => setData(() => makeData(100_000))

  return (
    <>
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (100k rows)</button>
      </div>
      <MyTable data={data} columns={columns} />
      <hr />
      <div>
        <button onClick={() => rerender(0)}>Force Rerender</button>
      </div>
    </>
  )
}

function MyTable({
  data,
  columns,
}: {
  data: Array<Person>
  columns: ReturnType<typeof columnHelper.columns>
}) {
  const table = useTable({
    _features,
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
      filteredRowModel: createFilteredRowModel(filterFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns,
    data,
    debugTable: true,
    // no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  })

  return (
    <table.Subscribe
      selector={(state) => ({
        pagination: state.pagination,
        sorting: state.sorting,
        columnFilters: state.columnFilters,
      })}
    >
      {(state) => (
        <div className="demo-root">
          <div className="spacer-sm" />
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
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
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </div>
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
                {(state.pagination.pageIndex + 1).toLocaleString()} of{' '}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span>
            <span className="inline-controls">
              | Go to page:
              <input
                type="number"
                min="1"
                max={table.getPageCount()}
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
                table.setPageSize(Number((e.target as HTMLInputElement).value))
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
            Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
            {table.getRowCount().toLocaleString()} Rows
          </div>
          <table.Subscribe selector={(state) => state}>
            {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
          </table.Subscribe>
        </div>
      )}
    </table.Subscribe>
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<typeof _features, Person>
  table: PreactTable<typeof _features, Person>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className="filter-row" onClick={(e) => e.stopPropagation()}>
      <input
        type="number"
        value={(columnFilterValue as [number, number] | undefined)?.[0] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            (e.target as HTMLInputElement).value,
            old[1],
          ])
        }
        placeholder={`Min`}
        className="filter-input"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number] | undefined)?.[1] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old[0],
            (e.target as HTMLInputElement).value,
          ])
        }
        placeholder={`Max`}
        className="filter-input"
      />
    </div>
  ) : (
    <input
      className="filter-select"
      onChange={(e) =>
        column.setFilterValue((e.target as HTMLInputElement).value)
      }
      onClick={(e) => e.stopPropagation()}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(<App />, rootElement)
