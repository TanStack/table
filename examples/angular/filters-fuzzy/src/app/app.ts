import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import {
  FlexRender,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  injectTable,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'
import { DebouncedInput } from './debounced-input/debounced-input'
import { makeData } from './makeData'
import type { FilterFn, SortFn, TableFeatures } from '@tanstack/angular-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { Person } from './makeData'

interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

const fuzzyFilter: FilterFn<FuzzyFeatures, any> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

const fuzzySort: SortFn<FuzzyFeatures, any> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})
const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    filterFn: 'fuzzy',
    sortFn: 'fuzzy',
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    filterFn: 'fuzzy',
    sortFn: 'fuzzy',
  }),
  columnHelper.accessor('age', { header: () => 'Age' }),
  columnHelper.accessor('visits', { header: () => 'Visits' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('progress', { header: 'Profile Progress' }),
])

@Component({
  selector: 'app-root',
  imports: [FlexRender, DebouncedInput],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal(makeData(1_000))
  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns,
    data: this.data(),
    globalFilterFn: 'fuzzy',
    // initialState: { columnFilters: [{ id: 'firstName', value: 'Jane' }], globalFilter: 'Jane' }, // set filters once
    // atoms: { columnFilters: columnFiltersAtom, globalFilter: globalFilterAtom }, // preferred external ownership
    // state: { columnFilters, globalFilter }, // classic controlled state; pair with the callbacks below
    // onColumnFiltersChange: setColumnFilters,
    // onGlobalFilterChange: setGlobalFilter,
    // enableFilters: false, // disable all column and global filtering; default true
    // enableColumnFilters: false, // disable per-column filters; default true
    // filterFromLeafRows: true, // keep parents whose descendants match; default filters from parents down
    // maxLeafRowFilterDepth: 1, // only filter through this nested-row depth; default 100
    // manualFiltering: true, // pass data that is already filtered, for example from a server
    // enableGlobalFilter: false, // disable the global filter input; default true
    // getColumnCanGlobalFilter: column => column.id !== 'status', // opt a column out of global filtering
    debugTable: true,
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }
  refreshData = () => this.data.set(makeData(1_000))
  stressTest = () => this.data.set(makeData(1_000_000))
  onGlobalFilter(event: Event) {
    this.table.setGlobalFilter((event.target as HTMLInputElement).value)
  }
  onPageSizeChange(event: Event) {
    this.table.setPageSize(Number((event.target as HTMLSelectElement).value))
  }
}
