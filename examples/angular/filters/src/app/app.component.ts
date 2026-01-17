import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRenderDirective,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFns,
  isFunction,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'
import { FormsModule } from '@angular/forms'
import { NgClass } from '@angular/common'
import { FilterComponent } from './table-filter.component'
import { makeData } from './makeData'
import type { ColumnFiltersState, Updater } from '@tanstack/angular-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnFilteringFeature,
  columnFacetingFeature,
  rowPaginationFeature,
  rowSortingFeature,
})

const { injectAppTable, createAppColumnHelper } = createTableHook({
  _features,
  _rowModels: {
    facetedMinMaxValues: createFacetedMinMaxValues(),
    facetedRowModel: createFacetedRowModel(),
    facetedUniqueValues: createFacetedUniqueValues(),
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(sortFns),
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

export { _features }

@Component({
  selector: 'app-root',
  imports: [FilterComponent, FlexRenderDirective, FormsModule, NgClass],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly columnFilters = signal<ColumnFiltersState>([])
  readonly data = signal(makeData(5000))

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

  refreshData(): void {
    this.data.set(makeData(100_000)) // stress test
  }
}
