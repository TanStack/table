import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTableHook,
  filterFn_equalsString,
  filterFn_inDateRange,
  filterFn_inNumberRange,
  filterFn_includesString,
  isFunction,
  metaHelper,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import { TableFilter } from './table-filter/table-filter'
import type { ColumnFiltersState, Updater } from '@tanstack/angular-table'
import type { Person } from './makeData'

// allows us to define custom properties for our columns
interface MyColumnMeta {
  filterVariant?: 'text' | 'range' | 'select' | 'dateRange'
}

export const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  columnMeta: metaHelper<MyColumnMeta>(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
    inDateRange: filterFn_inDateRange,
    equalsString: filterFn_equalsString,
  },
})

const { injectAppTable, createAppColumnHelper } = createTableHook({
  features,
  debugTable: true,
  debugHeaders: true,
  debugColumns: false,
})

const columnHelper = createAppColumnHelper<Person>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'rowNumber',
    header: '#',
    cell: ({ row }) => row.getDisplayIndex() + 1,
  }),
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    meta: {
      filterVariant: 'range',
    },
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    meta: {
      filterVariant: 'range',
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    filterFn: 'equalsString', // filterFn string to pick from filterFns
    meta: {
      filterVariant: 'select',
    },
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    meta: {
      filterVariant: 'range',
    },
    filterFn: filterFn_inNumberRange, // or just reference static filterFn from import
    // you could also write your own custom filter function here
  }),
  columnHelper.accessor('birthDate', {
    header: 'Birth Date',
    // A locale-independent date format keeps the demo (and its tests) stable
    cell: (info) => info.getValue().toISOString().slice(0, 10),
    filterFn: 'inDateRange', // accepts Date objects, timestamps, or parseable date strings
    meta: {
      filterVariant: 'dateRange',
    },
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
  readonly data = signal(makeData(1_000))

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

  refreshData = () => this.data.set(makeData(1_000))
  stressTest = () => this.data.set(makeData(1_000_000))
}
