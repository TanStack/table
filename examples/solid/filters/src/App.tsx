import {
  FlexRender,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTable,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/solid-table'
import { debounce } from '@solid-primitives/scheduled'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import ColumnFilter from './ColumnFilter'
import type { Person } from './makeData'
import type { ColumnDef } from '@tanstack/solid-table'

export const _features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  columnFacetingFeature,
  rowPaginationFeature,
})

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      },
    ],
  },
  {
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: (props) => props.column.id,
        filterFn: 'inNumberRange',
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
            filterFn: 'inNumberRange',
          },
          {
            accessorKey: 'status',
            header: 'Status',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            footer: (props) => props.column.id,
            filterFn: 'inNumberRange',
          },
        ],
      },
    ],
  },
]

function App() {
  const [data, setData] = createSignal(makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(200_000))

  const table = createTable({
    _features,
    _rowModels: {
      facetedRowModel: createFacetedRowModel(),
      facetedMinMaxValues: createFacetedMinMaxValues(),
      facetedUniqueValues: createFacetedUniqueValues(),
      filteredRowModel: createFilteredRowModel(filterFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    get data() {
      return data()
    },
    columns,
    globalFilterFn: 'includesString',
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  const debounceSetGlobalFilter = debounce((value: string) => {
    table.setGlobalFilter(value)
  }, 500)

  return (
    <div class="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (200k rows)</button>
      </div>
      <input
        class="summary-panel"
        value={table.store.state.globalFilter ?? ''}
        onInput={(e) => debounceSetGlobalFilter(e.currentTarget.value)}
        placeholder="Search all columns..."
      />
      <div class="spacer-sm" />
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <FlexRender header={header} />
                          {header.column.getCanFilter() ? (
                            <div>
                              <ColumnFilter
                                column={header.column}
                                table={table}
                              />
                            </div>
                          ) : null}
                        </>
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
        {table.getPrePaginatedRowModel().rows.length.toLocaleString()} Rows
      </div>
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

export default App
