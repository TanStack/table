import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTableHook,
  filterFn_includesString,
  isFunction,
  metaHelper,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import {
  createBucketFilter,
  formatBytes,
  getBucket,
  lastLoginBuckets,
  storageBuckets,
} from './buckets'
import { TableFilter } from './table-filter/table-filter'
import type { ColumnFiltersState, Updater } from '@tanstack/angular-table'
import type { Account } from './makeData'
import type { BucketColumnMeta } from './buckets'

// allows us to define custom properties for our columns
export const features = tableFeatures({
  columnFilteringFeature,
  columnFacetingFeature,
  rowPaginationFeature,
  columnMeta: metaHelper<BucketColumnMeta>(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
  },
})

const { injectAppTable, createAppColumnHelper } = createTableHook({
  features,
  debugTable: true,
  debugHeaders: true,
  debugColumns: false,
})

const columnHelper = createAppColumnHelper<Account>()

const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: 'Account',
    filterFn: 'includesString',
    meta: { filterVariant: 'text' },
  }),
  columnHelper.accessor('lastLogin', {
    header: 'Last login',
    cell: (info) => info.getValue().toLocaleString(),
    getUniqueValues: (row) => [getBucket(row.lastLogin, lastLoginBuckets)],
    filterFn: createBucketFilter(lastLoginBuckets),
    meta: { filterVariant: 'facets', facetOptions: lastLoginBuckets },
  }),
  columnHelper.accessor('storageBytes', {
    header: 'Storage',
    cell: (info) => formatBytes(info.getValue()),
    getUniqueValues: (row) => [getBucket(row.storageBytes, storageBuckets)],
    filterFn: createBucketFilter(storageBuckets),
    meta: { filterVariant: 'facets', facetOptions: storageBuckets },
  }),
  columnHelper.accessor('files', {
    header: 'Files',
    enableColumnFilter: false,
    cell: (info) => info.getValue().toLocaleString(),
  }),
])

@Component({
  selector: 'app-root',
  imports: [TableFilter, FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly columnFilters = signal<ColumnFiltersState>([])
  readonly data = signal(makeData(5_000))

  table = injectAppTable(() => ({
    columns,
    data: this.data(),
    state: {
      columnFilters: this.columnFilters(),
    },
    onColumnFiltersChange: (updater: Updater<ColumnFiltersState>) => {
      isFunction(updater)
        ? this.columnFilters.update(updater)
        : this.columnFilters.set(updater)
    },
    // Column faceting has no table-level options; configure its row-model factories in `features`.
    // initialState: { columnFilters: [{ id: 'firstName', value: 'Jane' }] }, // set filters once
    // atoms: { columnFilters: columnFiltersAtom }, // preferred: own column filters with an external atom
    // enableFilters: false, // disable all column and global filtering; default true
    // enableColumnFilters: false, // disable per-column filters; default true
    // filterFromLeafRows: true, // keep parents whose descendants match; default filters from parents down
    // maxLeafRowFilterDepth: 1, // only filter through this nested-row depth; default 100
    // manualFiltering: true, // pass data that is already filtered, for example from a server
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  onPageInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    const page = inputElement.value ? Number(inputElement.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any): void {
    this.table.setPageSize(Number(event.target.value))
  }

  refreshData = () => this.data.set(makeData(5_000))
  stressTest = () => this.data.set(makeData(1_000_000))
}
