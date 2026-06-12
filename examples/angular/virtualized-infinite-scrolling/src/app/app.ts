import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  viewChild,
} from '@angular/core'
import {
  FlexRender,
  columnSizingFeature,
  createColumnHelper,
  createSortedRowModel,
  functionalUpdate,
  injectTable,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'
import { injectVirtualizer } from '@tanstack/angular-virtual'
import { fetchData } from './makeData'
import type { ElementRef } from '@angular/core'
import type { Person, PersonApiResponse } from './makeData'
import type { SortingState, Updater } from '@tanstack/angular-table'

const fetchSize = 50

const features = tableFeatures({
  columnSizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: 'ID',
    size: 60,
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
    size: 50,
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    size: 50,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    size: 80,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => info.getValue<Date>().toLocaleString(),
    size: 200,
  }),
])

const sortIndicators: Record<string, string> = {
  asc: ' 🔼',
  desc: ' 🔽',
}

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly scrollContainer =
    viewChild<ElementRef<HTMLDivElement>>('scrollContainer')
  readonly sorting = signal<SortingState>([])
  readonly pages = signal<Array<PersonApiResponse>>([])
  readonly isFetching = signal(false)
  readonly isLoading = signal(true)
  private requestId = 0

  readonly flatData = computed(() => this.pages().flatMap((page) => page.data))
  readonly totalDBRowCount = computed(
    () => this.pages()[0]?.meta?.totalRowCount ?? 0,
  )
  readonly totalFetched = computed(() => this.flatData().length)

  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    data: this.flatData(),
    columns,
    state: {
      sorting: this.sorting(),
    },
    onSortingChange: (updater) => this.handleSortingChange(updater),
    manualSorting: true,
    debugTable: true,
  }))

  readonly rows = computed(() => this.table.getRowModel().rows)

  readonly rowVirtualizer = injectVirtualizer<
    HTMLDivElement,
    HTMLTableRowElement
  >(() => ({
    count: this.rows().length,
    scrollElement: this.scrollContainer()?.nativeElement,
    estimateSize: () => 33, // estimate row height for accurate scrollbar dragging
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  }))

  readonly virtualRows = computed(() => this.rowVirtualizer.getVirtualItems())
  readonly totalSize = computed(() => this.rowVirtualizer.getTotalSize())

  constructor() {
    effect(() => {
      this.loadFirstPage(this.sorting())
    })

    effect(() => {
      this.fetchMoreOnBottomReached(this.scrollContainer()?.nativeElement)
    })
  }

  async loadFirstPage(sorting: SortingState) {
    const requestId = ++this.requestId
    this.isLoading.set(true)
    this.isFetching.set(true)
    const page = await fetchData(0, fetchSize, sorting)
    if (requestId !== this.requestId) return
    this.pages.set([page])
    this.isLoading.set(false)
    this.isFetching.set(false)
  }

  async fetchNextPage() {
    if (this.isFetching() || this.totalFetched() >= this.totalDBRowCount()) {
      return
    }

    const requestId = this.requestId
    this.isFetching.set(true)
    const page = await fetchData(
      this.pages().length * fetchSize,
      fetchSize,
      this.sorting(),
    )
    if (requestId !== this.requestId) return
    this.pages.update((pages) => [...pages, page])
    this.isFetching.set(false)
  }

  // called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  fetchMoreOnBottomReached(containerRefElement?: HTMLDivElement) {
    if (containerRefElement) {
      const { scrollHeight, scrollTop, clientHeight } = containerRefElement
      // once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
      if (scrollHeight - scrollTop - clientHeight < 500) {
        void this.fetchNextPage()
      }
    }
  }

  // scroll to top of table when sorting changes
  handleSortingChange(updater: Updater<SortingState>) {
    this.sorting.set(functionalUpdate(updater, this.sorting()))
    if (this.table.getRowModel().rows.length) {
      this.rowVirtualizer.scrollToIndex(0)
    }
  }

  sortIndicator(sortDirection: false | 'asc' | 'desc') {
    return sortDirection ? sortIndicators[sortDirection] : null
  }
}
