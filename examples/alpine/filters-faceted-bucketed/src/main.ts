import Alpine from 'alpinejs'
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
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import {
  createBucketFilter,
  formatBytes,
  getBucket,
  lastLoginBuckets,
  storageBuckets,
} from './buckets'
import './index.css'
import type { Column, ColumnDef } from '@tanstack/alpine-table'
import type { Account } from './makeData'
import type { BucketColumnMeta, FacetKey } from './buckets'

const features = tableFeatures({
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

type AccountColumn = Column<typeof features, Account>

// small debounce helper, mirroring the Lit example's 500ms debounce
function debounce<TArgs extends Array<unknown>>(
  fn: (...args: TArgs) => void,
  wait: number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: TArgs) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(5_000) })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
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
  })

  const setColumnFilter = debounce(
    (column: AccountColumn, value: unknown) => column.setFilterValue(value),
    500,
  )

  return {
    table,
    FlexRender,
    isFacetColumn(column: AccountColumn) {
      return column.columnDef.meta?.filterVariant === 'facets'
    },
    facetOptions(column: AccountColumn) {
      return column.columnDef.meta?.facetOptions ?? []
    },
    facetCount(column: AccountColumn, value: FacetKey) {
      return column.getFacetedUniqueValues().get(value) ?? 0
    },
    facetSelected(column: AccountColumn, value: FacetKey) {
      return ((column.getFilterValue() ?? []) as Array<FacetKey>).includes(
        value,
      )
    },
    toggleFacet(column: AccountColumn, value: FacetKey) {
      const selected = (column.getFilterValue() ?? []) as Array<FacetKey>
      column.setFilterValue(
        selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      )
    },
    onTextFilter(column: AccountColumn, value: string) {
      setColumnFilter(column, value)
    },
    goToPage(value: string) {
      table.setPageIndex(value ? Number(value) - 1 : 0)
    },
    pageSizes: [10, 20, 30, 40, 50],
    refreshData() {
      local.data = makeData(5_000)
    },
    stressTest() {
      local.data = makeData(1_000_000)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
