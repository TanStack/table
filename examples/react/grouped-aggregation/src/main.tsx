import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  rowAggregationFeature,
  aggregationFn_mean,
  aggregationFn_median,
  aggregationFn_sum,
  columnFilteringFeature,
  columnGroupingFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFn_inNumberRange,
  filterFn_includesString,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
} from '@tanstack/react-table'
import { makeData } from './makeData'
import type { Person } from './makeData'

// this example happens to use the createTableHook pattern, but it is not required
const { useAppTable, createAppColumnHelper } = createTableHook({
  features: {
    rowAggregationFeature,
    columnFilteringFeature,
    columnGroupingFeature,
    rowExpandingFeature,
    rowPaginationFeature,
    rowSortingFeature,
    expandedRowModel: createExpandedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    groupedRowModel: createGroupedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns: {
      includesString: filterFn_includesString,
      inNumberRange: filterFn_inNumberRange,
    },
    sortFns: {
      alphanumeric: sortFn_alphanumeric,
      text: sortFn_text,
    },
    aggregationFns: {
      mean: aggregationFn_mean,
      median: aggregationFn_median,
      sum: aggregationFn_sum,
    },
  },
})

const columnHelper = createAppColumnHelper<Person>()

function App() {
  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          header: 'First Name',
          footer: 'Grand Total',
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
          footer: ({ column }) => {
            const value = column.getAggregationValue<number | undefined>()
            return value === undefined ? null : Math.round(value * 100) / 100
          },
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
          aggregationFn: 'sum',
          aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
          footer: ({ column }) =>
            column.getAggregationValue<number>().toLocaleString(),
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
          footer: ({ column }) => {
            const value = column.getAggregationValue<number | undefined>()
            return value === undefined
              ? null
              : `${Math.round(value * 100) / 100}%`
          },
        }),
      ]),
    [],
  )

  const [data, setData] = React.useState(() => makeData(10_000))
  const refreshData = () => setData(makeData(10_000))
  const stressTest = () => setData(makeData(1_000_000))

  const table = useAppTable(
    {
      columns,
      data,
      // initialState: { grouping: ['status'] }, // group by a column on first render
      // atoms: { grouping: groupingAtom }, // preferred: own grouping state with an external atom
      // state: { grouping }, // classic controlled state; pair with onGroupingChange
      // onGroupingChange: setGrouping,
      // enableGrouping: false, // disable grouping for every column; default true
      // groupedColumnMode: 'remove', // remove grouped columns instead of moving them to the start; default 'reorder'
      // manualGrouping: true, // pass rows that are already grouped and aggregated, for example from a server
      debugTable: true,
      debugColumns: true,
    },
    (state) => state, // default selector
  )

  return (
    <div className="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1M rows)</button>
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
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender footer={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
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
            min="1"
            max={table.getPageCount()}
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
      <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
      <div></div>
      <pre>{JSON.stringify(table.state, null, 2)}</pre>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
