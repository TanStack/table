import {
  FlexRender,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTable,
  filterFn_includesString,
  metaHelper,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import ColumnFilter from './ColumnFilter'
import {
  createBucketFilter,
  formatBytes,
  getBucket,
  lastLoginBuckets,
  storageBuckets,
} from './buckets'
import type { Account } from './makeData'
import type { BucketColumnMeta } from './buckets'
import type { ColumnDef } from '@tanstack/solid-table'

export const features = tableFeatures({
  columnFilteringFeature,
  columnFacetingFeature,
  rowPaginationFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
  },
  columnMeta: metaHelper<BucketColumnMeta>(),
})

const columns: Array<ColumnDef<typeof features, Account>> = [
  {
    accessorKey: 'name',
    header: 'Account',
    filterFn: 'includesString',
    meta: { filterVariant: 'text' },
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last login',
    cell: (info) => (info.getValue() as Date).toLocaleString(),
    getUniqueValues: (row) => [getBucket(row.lastLogin, lastLoginBuckets)],
    filterFn: createBucketFilter(lastLoginBuckets),
    meta: { filterVariant: 'facets', facetOptions: lastLoginBuckets },
  },
  {
    accessorKey: 'storageBytes',
    header: 'Storage',
    cell: (info) => formatBytes(info.getValue() as number),
    getUniqueValues: (row) => [getBucket(row.storageBytes, storageBuckets)],
    filterFn: createBucketFilter(storageBuckets),
    meta: { filterVariant: 'facets', facetOptions: storageBuckets },
  },
  {
    accessorKey: 'files',
    header: 'Files',
    enableColumnFilter: false,
    cell: (info) => (info.getValue() as number).toLocaleString(),
  },
]

function App() {
  const [data, setData] = createSignal(makeData(5_000))
  const refreshData = () => setData(makeData(5_000))
  const stressTest = () => setData(makeData(1_000_000))

  const table = createTable({
    features,
    get data() {
      return data()
    },
    columns,
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
  })

  return (
    <div class="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1M rows)</button>
      </div>
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
            {(table.atoms.pagination.get().pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={table.atoms.pagination.get().pageIndex + 1}
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
          value={table.atoms.pagination.get().pageSize}
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
      <pre data-testid="table-state">
        {JSON.stringify(table.store.get(), null, 2)}
      </pre>
    </div>
  )
}

export default App
