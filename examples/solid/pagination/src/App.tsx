import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { Column, Table } from '@tanstack/solid-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
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
])

function App() {
  const [data, setData] = createSignal(makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(100_000))

  return (
    <>
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (100k rows)</button>
      </div>
      <MyTable data={data()} columns={columns} />
    </>
  )
}

function MyTable(props: {
  data: Array<Person>
  columns: ReturnType<typeof columnHelper.columns>
}) {
  const table = createTable({
    _features,
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
      filteredRowModel: createFilteredRowModel(filterFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns: props.columns,
    get data() {
      return props.data
    },
    debugTable: true,
  })

  return (
    <div class="demo-root">
      <div class="spacer-sm" />
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th colSpan={header.colSpan}>
                      <div
                        class={
                          header.column.getCanSort() ? 'sortable-header' : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <table.FlexRender header={header} />
                        {(
                          {
                            asc: ' 🔼',
                            desc: ' 🔽',
                          } as Record<string, string>
                        )[header.column.getIsSorted() as string] ?? null}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
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
                    <td>
                      <table.FlexRender cell={cell} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <div class="spacer-sm" />
      <div class="controls">
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span class="inline-controls">
          <div>Page</div>
          <strong>
            {(table.store.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="inline-controls">
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
            class="page-size-input"
          />
        </span>
        <select
          value={table.store.state.pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.currentTarget.value))
          }}
        >
          <For each={[10, 20, 30, 40, 50]}>
            {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
          </For>
        </select>
      </div>
      <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
        {table.getRowCount().toLocaleString()} Rows
      </div>
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<typeof _features, Person>
  table: Table<typeof _features, Person>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = () => column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div class="filter-row" onClick={(e) => e.stopPropagation()}>
      <input
        type="number"
        value={(columnFilterValue() as [number, number] | undefined)?.[0] ?? ''}
        onInput={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.currentTarget.value,
            old[1],
          ])
        }
        placeholder="Min"
        class="filter-input"
      />
      <input
        type="number"
        value={(columnFilterValue() as [number, number] | undefined)?.[1] ?? ''}
        onInput={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old[0],
            e.currentTarget.value,
          ])
        }
        placeholder="Max"
        class="filter-input"
      />
    </div>
  ) : (
    <input
      class="filter-select"
      onInput={(e) => column.setFilterValue(e.currentTarget.value)}
      onClick={(e) => e.stopPropagation()}
      placeholder="Search..."
      type="text"
      value={(columnFilterValue() ?? '') as string}
    />
  )
}

export default App
