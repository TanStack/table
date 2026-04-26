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
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { Person } from './makeData'

const { createAppTable, createAppColumnHelper } = createTableHook({
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

const columns = columnHelper.columns([
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
    cell: ({ getValue }) => Math.round(getValue<number>() * 100) / 100 + '%',
    aggregationFn: 'mean',
    aggregatedCell: ({ getValue }) =>
      Math.round(getValue<number>() * 100) / 100 + '%',
  }),
])

function App() {
  const [data, setData] = createSignal(makeData(10_000))
  const refreshData = () => setData(makeData(10_000))
  const stressTest = () => setData(makeData(100_000))

  const table = createAppTable(
    {
      columns,
      get data() {
        return data()
      },
      debugTable: true,
    },
    (state) => state,
  )

  return (
    <div class="p-2">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (100k rows)</button>
      </div>
      <div class="h-2" />
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div>
                          {header.column.getCanGroup() ? (
                            <button
                              onClick={header.column.getToggleGroupingHandler()}
                              style={{ cursor: 'pointer' }}
                            >
                              {header.column.getIsGrouped()
                                ? `🛑(${header.column.getGroupedIndex()}) `
                                : '👊 '}
                            </button>
                          ) : null}{' '}
                          <table.FlexRender header={header} />
                        </div>
                      )}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr>
                <For each={row.getAllCells()}>
                  {(cell) => (
                    <td
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
                        <table.FlexRender cell={cell} />
                      ) : cell.getIsPlaceholder() ? null : (
                        <table.FlexRender cell={cell} />
                      )}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <div class="h-2" />
      <div class="flex items-center gap-2">
        <button
          class="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          class="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          class="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          class="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span class="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {(table.store.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={table.store.state.pagination.pageIndex + 1}
            onInput={(e) => {
              const page = e.currentTarget.value
                ? Number(e.currentTarget.value) - 1
                : 0
              table.setPageIndex(page)
            }}
            class="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.store.state.pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.currentTarget.value))}
        >
          <For each={[10, 20, 30, 40, 50]}>
            {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
          </For>
        </select>
      </div>
      <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

export default App
