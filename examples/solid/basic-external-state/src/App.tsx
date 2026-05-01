import {
  FlexRender,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { PaginationState, SortingState } from '@tanstack/solid-table'
import type { Person } from './makeData'

// This example demonstrates managing table state externally via Solid's createSignal instead of letting the table manage its own state internally.

const _features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

function App() {
  const [data, setData] = createSignal(makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(100_000))

  // Manage sorting state with createSignal
  const [sorting, setSorting] = createSignal<SortingState>([])

  // Manage pagination state with createSignal
  const [pagination, setPagination] = createSignal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Create the table and pass state + onChange handlers
  const table = createTable({
    debugTable: true,
    _features,
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns,
    get data() {
      return data()
    },
    state: {
      get sorting() {
        return sorting() // connect our sorting state back down to the table
      },
      get pagination() {
        return pagination() // connect our pagination state back down to the table
      },
    },
    onSortingChange: setSorting, // raise sorting state changes to our own state management
    onPaginationChange: setPagination, // raise pagination state changes to our own state management
  })

  return (
    <div class="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (100k rows)</button>
      </div>
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          class={
                            header.column.getCanSort() ? 'sortable-header' : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <FlexRender header={header} />
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
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
                    <td>
                      <FlexRender cell={cell} />
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
          onClick={() => table.setPageIndex(0)}
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
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span class="inline-controls">
          <div>Page</div>
          <strong>
            {(pagination().pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={pagination().pageIndex + 1}
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
          value={pagination().pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.currentTarget.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option value={pageSize}>Show {pageSize}</option>
          ))}
        </select>
      </div>
      <div class="spacer-md" />
      <pre>
        {JSON.stringify(
          { sorting: sorting(), pagination: pagination() },
          null,
          2,
        )}
      </pre>
    </div>
  )
}

export default App
