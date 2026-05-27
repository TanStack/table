import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRender,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTableHook,
  filterFns,
  isFunction,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import { TableFilter } from './table-filter/table-filter'
import type { ColumnFiltersState, Updater } from '@tanstack/angular-table'
import type { Person } from './makeData'

export const _features = tableFeatures({
  columnFilteringFeature,
  columnFacetingFeature,
  rowPaginationFeature,
})

const { injectAppTable, createAppColumnHelper } = createTableHook({
  _features,
  _rowModels: {
    facetedMinMaxValues: createFacetedMinMaxValues(),
    facetedRowModel: createFacetedRowModel(),
    facetedUniqueValues: createFacetedUniqueValues(),
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  debugTable: true,
  debugHeaders: true,
  debugColumns: false,
})

const columnHelper = createAppColumnHelper<Person>()

const columns = columnHelper.columns([
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
    meta: {
      filterVariant: 'select',
    },
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    meta: {
      filterVariant: 'range',
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
  }))

  readonly stringifiedFilters = computed(() =>
    JSON.stringify(this.columnFilters(), null, 2),
  )

  onPageInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    const page = inputElement.value ? Number(inputElement.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any): void {
    this.table.setPageSize(Number(event.target.value))
  }

  refreshData = () => this.data.set(makeData(1_000))
  stressTest = () => this.data.set(makeData(200_000))
}
