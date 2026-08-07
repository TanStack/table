import { JsonPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  injectInfiniteQuery,
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
import { injectTanStackTableDevtools } from '@tanstack/angular-table-devtools'
import { fetchData, fetchInfiniteData } from './fetchData'
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
  // Server-side filtering, sorting, and pagination do not need client row models.
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('firstName', { header: 'First Name' }),
  columnHelper.accessor('lastName', { header: 'Last Name' }),
  columnHelper.accessor('age', { header: 'Age' }),
  columnHelper.accessor('visits', { header: 'Visits' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('progress', { header: 'Profile Progress' }),
])

const defaultData: Array<Person> = []

@Component({
  selector: 'app-root',
  imports: [FlexRender, JsonPipe],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly allRows = Infinity

  readonly offsetSorting = signal<SortingState>([])
  readonly offsetGlobalFilter = signal('')
  readonly offsetPagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  readonly offsetDataQuery = injectQuery(() => ({
    queryKey: [
      'people',
      'offset',
      this.offsetPagination().pageIndex,
      this.offsetPagination().pageSize === Infinity
        ? 'all'
        : this.offsetPagination().pageSize,
      this.offsetSorting(),
      this.offsetGlobalFilter(),
    ],
    queryFn: () =>
      fetchData({
        pagination: this.offsetPagination(),
        sorting: this.offsetSorting(),
        globalFilter: this.offsetGlobalFilter(),
      }),
    placeholderData: keepPreviousData,
  }))
  readonly offsetTable = injectTable<typeof features, Person>(() => ({
    key: 'with-tanstack-query-offset',
    features,
    columns,
    data: this.offsetDataQuery.data()?.rows ?? defaultData,
    rowCount: this.offsetDataQuery.data()?.rowCount,
    getRowId: (row) => String(row.id),
    state: {
      sorting: this.offsetSorting(),
      globalFilter: this.offsetGlobalFilter(),
      pagination: this.offsetPagination(),
    },
    onSortingChange: (updater: Updater<SortingState>) => {
      isFunction(updater)
        ? this.offsetSorting.update(updater)
        : this.offsetSorting.set(updater)
      this.offsetPagination.update((value) => ({
        ...value,
        pageIndex: 0,
      }))
    },
    onGlobalFilterChange: (updater: Updater<string>) => {
      isFunction(updater)
        ? this.offsetGlobalFilter.update(updater)
        : this.offsetGlobalFilter.set(updater)
      this.offsetPagination.update((value) => ({
        ...value,
        pageIndex: 0,
      }))
    },
    onPaginationChange: (updater: Updater<PaginationState>) =>
      isFunction(updater)
        ? this.offsetPagination.update(updater)
        : this.offsetPagination.set(updater),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
  }))

  readonly cursorSorting = signal<SortingState>([])
  readonly cursorGlobalFilter = signal('')
  readonly cursorPagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  readonly cursorDataQuery = injectInfiniteQuery(() => ({
    queryKey: [
      'people',
      'cursor',
      this.cursorPagination().pageSize === Infinity
        ? 'all'
        : this.cursorPagination().pageSize,
      this.cursorSorting(),
      this.cursorGlobalFilter(),
    ],
    queryFn: ({ pageParam }) =>
      fetchInfiniteData({
        cursor: pageParam,
        pageSize: this.cursorPagination().pageSize,
        sorting: this.cursorSorting(),
        globalFilter: this.cursorGlobalFilter(),
      }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }))
  readonly currentCursorPage = computed(
    () => this.cursorDataQuery.data()?.pages[this.cursorPagination().pageIndex],
  )
  readonly canNextCursorPage = computed(
    () =>
      Boolean(
        this.cursorDataQuery.data()?.pages[
          this.cursorPagination().pageIndex + 1
        ],
      ) || Boolean(this.currentCursorPage()?.hasNextPage),
  )
  readonly cursorTable = injectTable<typeof features, Person>(() => ({
    key: 'with-tanstack-query-cursor',
    features,
    columns,
    data: this.currentCursorPage()?.rows ?? defaultData,
    pageCount: -1,
    getRowId: (row) => String(row.id),
    state: {
      sorting: this.cursorSorting(),
      globalFilter: this.cursorGlobalFilter(),
      pagination: this.cursorPagination(),
    },
    onSortingChange: (updater: Updater<SortingState>) => {
      isFunction(updater)
        ? this.cursorSorting.update(updater)
        : this.cursorSorting.set(updater)
      this.cursorPagination.update((value) => ({
        ...value,
        pageIndex: 0,
      }))
    },
    onGlobalFilterChange: (updater: Updater<string>) => {
      isFunction(updater)
        ? this.cursorGlobalFilter.update(updater)
        : this.cursorGlobalFilter.set(updater)
      this.cursorPagination.update((value) => ({
        ...value,
        pageIndex: 0,
      }))
    },
    onPaginationChange: (updater: Updater<PaginationState>) =>
      isFunction(updater)
        ? this.cursorPagination.update(updater)
        : this.cursorPagination.set(updater),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
  }))

  constructor() {
    injectTanStackTableDevtools(() => ({ table: this.offsetTable }))
    injectTanStackTableDevtools(() => ({ table: this.cursorTable }))
  }

  onOffsetPageInputChange(event: Event) {
    const value = (event.currentTarget as HTMLInputElement).value
    this.offsetTable.setPageIndex(value ? Number(value) - 1 : 0)
  }

  onOffsetPageSizeChange(event: Event) {
    this.offsetTable.setPageSize(
      Number((event.currentTarget as HTMLSelectElement).value),
    )
  }

  async goToNextCursorPage() {
    const nextPageIndex = this.cursorPagination().pageIndex + 1
    if (this.cursorDataQuery.data()?.pages[nextPageIndex])
      return this.cursorTable.nextPage()
    if (
      !this.currentCursorPage()?.hasNextPage ||
      this.cursorDataQuery.isFetchingNextPage()
    )
      return
    const result = await this.cursorDataQuery.fetchNextPage()
    if (result.data?.pages[nextPageIndex]) this.cursorTable.nextPage()
  }

  onCursorPageSizeChange(event: Event) {
    this.cursorPagination.set({
      pageIndex: 0,
      pageSize: Number((event.currentTarget as HTMLSelectElement).value),
    })
  }
}
