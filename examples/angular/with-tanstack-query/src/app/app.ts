import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental'
import {
  FlexRender,
  columnFilteringFeature,
  createColumnHelper,
  globalFilteringFeature,
  injectTable,
  isFunction,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { fetchData } from './fetchData'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/angular-table'
import type { Person } from './fetchData'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  // Client-side filtering, sorting, and pagination row models are not
  // required because those operations are handled manually on the server.
  // Omitting the filtered and sorted row models also omits their page-reset
  // hooks, so pagination is reset in the change handlers below.
})
const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', { header: 'Age' }),
  columnHelper.accessor('visits', { header: 'Visits' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('progress', { header: 'Profile Progress' }),
])
const defaultData: Array<Person> = []

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Create stable external signals for the server-owned state slices.
  readonly sorting = signal<SortingState>([])
  readonly globalFilter = signal('')
  readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 })

  readonly dataQuery = injectQuery(() => ({
    queryKey: ['data', this.pagination(), this.sorting(), this.globalFilter()],
    queryFn: () =>
      fetchData({
        pagination: this.pagination(),
        sorting: this.sorting(),
        globalFilter: this.globalFilter(),
      }),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  }))

  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns,
    data: this.dataQuery.data()?.rows ?? defaultData,
    rowCount: this.dataQuery.data()?.rowCount,
    state: {
      sorting: this.sorting(),
      globalFilter: this.globalFilter(),
      pagination: this.pagination(),
    },
    onSortingChange: (updater: Updater<SortingState>) => {
      isFunction(updater)
        ? this.sorting.update(updater)
        : this.sorting.set(updater)
      this.pagination.update((pagination) => ({
        ...pagination,
        pageIndex: 0,
      }))
    },
    onGlobalFilterChange: (updater: Updater<string>) => {
      isFunction(updater)
        ? this.globalFilter.update(updater)
        : this.globalFilter.set(updater)
      this.pagination.update((pagination) => ({
        ...pagination,
        pageIndex: 0,
      }))
    },
    onPaginationChange: (updater: Updater<PaginationState>) =>
      isFunction(updater)
        ? this.pagination.update(updater)
        : this.pagination.set(updater),
    manualFiltering: true, // we're doing manual "server-side" filtering
    manualPagination: true, // we're doing manual "server-side" pagination
    manualSorting: true, // we're doing manual "server-side" sorting
    debugTable: true,
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  onPageInputChange(event: Event): void {
    const page = (event.target as HTMLInputElement).value
      ? Number((event.target as HTMLInputElement).value) - 1
      : 0
    this.table.setPageIndex(page)
  }
  onPageSizeChange(event: Event): void {
    this.table.setPageSize(Number((event.target as HTMLSelectElement).value))
  }
}
