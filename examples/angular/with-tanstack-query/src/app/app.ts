import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental'
import {
  FlexRender,
  createColumnHelper,
  injectTable,
  isFunction,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { fetchData } from './fetchData'
import type { PaginationState, Updater } from '@tanstack/angular-table'
import type { Person } from './fetchData'

const features = tableFeatures({ rowPaginationFeature })
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
  // Create a stable external signal for the pagination slice.
  readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 })

  readonly dataQuery = injectQuery(() => ({
    queryKey: ['data', this.pagination()],
    queryFn: () => fetchData(this.pagination()),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  }))

  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns,
    data: this.dataQuery.data()?.rows ?? defaultData,
    rowCount: this.dataQuery.data()?.rowCount,
    state: { pagination: this.pagination() },
    onPaginationChange: (updater: Updater<PaginationState>) =>
      isFunction(updater)
        ? this.pagination.update(updater)
        : this.pagination.set(updater),
    manualPagination: true, // we're doing manual "server-side" pagination
    debugTable: true,
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  rerender = () => this.pagination.update((pagination) => ({ ...pagination }))

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
