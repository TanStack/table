import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  viewChild,
} from '@angular/core'
import {
  FlexRender,
  columnSizingFeature,
  createColumnHelper,
  createSortedRowModel,
  injectTable,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'
import { injectVirtualizer } from '@tanstack/angular-virtual'
import { makeData } from './makeData'
import type { ElementRef } from '@angular/core'
import type { Person } from './makeData'

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
    size: 250,
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
  readonly data = signal(makeData(200_000))
  readonly scrollContainer =
    viewChild<ElementRef<HTMLDivElement>>('scrollContainer')

  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns,
    data: this.data(),
    debugTable: true,
  }))

  // Important: Keep the virtualizer and the scroll container ref in the same component.
  readonly rows = computed(() => this.table.getRowModel().rows)

  // Important: Keep the row virtualizer as close to the rows as possible to avoid unnecessary work.
  readonly rowVirtualizer = injectVirtualizer(() => ({
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

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  refreshData = () => this.data.set(makeData(200_000))
  stressTest = () => this.data.set(makeData(1_000_000))

  sortIndicator(sortDirection: false | 'asc' | 'desc') {
    return sortDirection ? sortIndicators[sortDirection] : null
  }
}
