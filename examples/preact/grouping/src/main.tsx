import { useMemo, useReducer, useState } from 'preact/hooks'
import { render } from 'preact'
import './index.css'
import {
  aggregationFns,
  columnFilteringFeature,
  columnGroupingFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
} from '@tanstack/preact-table'
import { makeData } from './makeData'
import type { Person } from './makeData'

// this example happens to use the createTableHook pattern, but it is not required
const { useAppTable, createAppColumnHelper } = createTableHook({
  _features: {
    columnFilteringFeature,
    columnGroupingFeature,
    rowExpandingFeature,
    rowPaginationFeature,
    rowSortingFeature,
  },
  _rowModels: {
    expandedRowModel: createExpandedRowModel(),
    filteredRowModel: createFilteredRowModel(filterFns),
    groupedRowModel: createGroupedRowModel(aggregationFns),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(sortFns),
  },
})

const columnHelper = createAppColumnHelper<Person>()

function App() {
  const rerender = useReducer(() => ({}), {})[1]

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          header: 'First Name',
          cell: (info) => info.getValue(),
          /**
           * override the value used for row grouping
           * (otherwise, defaults to the value derived from accessorKey / accessorFn)
           */
          getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          header: () => <span>Last Name</span>,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
          aggregatedCell: ({ getValue }) =>
            Math.round(getValue<number>() * 100) / 100,
          aggregationFn: 'median',
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
          aggregationFn: 'sum',
          aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
        }),
        columnHelper.accessor('status', {
          header: 'Status',
        }),
        columnHelper.accessor('progress', {
          header: 'Profile Progress',
          cell: ({ getValue }) =>
            Math.round(getValue<number>() * 100) / 100 + '%',
          aggregationFn: 'mean',
          aggregatedCell: ({ getValue }) =>
            Math.round(getValue<number>() * 100) / 100 + '%',
        }),
      ]),
    [],
  )

  const [data, setData] = useState(() => makeData(10_000))
  const refreshData = () => setData(() => makeData(10_000))
  const stressTest = () => setData(() => makeData(100_000))

  const table = useAppTable(
    {
      columns,
      data,
      debugTable: true,
    },
    (state) => state, // subscribe to all state changes
  )

  return (
    <div className="p-2">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (100k rows)</button>
      </div>
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {header.column.getCanGroup() ? (
                          // If the header can be grouped, let's add a toggle
                          <button
                            onClick={header.column.getToggleGroupingHandler()}
                            style={{ cursor: 'pointer' }}
                          >
                            {header.column.getIsGrouped()
                              ? `🛑(${header.column.getGroupedIndex()}) `
                              : `👊 `}
                          </button>
                        ) : null}{' '}
                        <table.FlexRender header={header} />
                      </div>
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
                    <td
                      key={cell.id}
                      style={{
                        background: cell.getIsGrouped()
                          ? '#0aff0082'
                          : cell.getIsAggregated()
                            ? '#ffa50078'
                            : cell.getIsPlaceholder()
                              ? '#ff000042'
                              : 'white',
                      }}
                    >
                      {cell.getIsGrouped() ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <button
                            onClick={row.getToggleExpandedHandler()}
                            style={{
                              cursor: row.getCanExpand() ? 'pointer' : 'normal',
                            }}
                          >
                            {row.getIsExpanded() ? '👇' : '👉'}{' '}
                            <table.FlexRender cell={cell} /> (
                            {row.subRows.length.toLocaleString()})
                          </button>
                        </>
                      ) : cell.getIsAggregated() ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        <table.FlexRender cell={cell} />
                      ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        <table.FlexRender cell={cell} />
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
            {(table.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.state.pagination.pageIndex + 1}
            onChange={(e) => {
              const page = (e.target as HTMLInputElement).value
                ? Number((e.target as HTMLInputElement).value) - 1
                : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.state.pagination.pageSize}
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
      <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
      <div>
        <button onClick={() => rerender(0)}>Force Rerender</button>
      </div>
      <table.Subscribe selector={(state) => state}>
        {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
      </table.Subscribe>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(<App />, rootElement)
