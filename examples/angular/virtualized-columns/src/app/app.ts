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
  columnVisibilityFeature,
  createColumnHelper,
  createSortedRowModel,
  injectTable,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'
import { injectVirtualizer } from '@tanstack/angular-virtual'
import { makeColumns, makeData } from './makeData'
import type { ElementRef } from '@angular/core'
import type { Person } from './makeData'

const features = tableFeatures({
  columnSizingFeature,
  columnVisibilityFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const DEFAULT_ROW_COUNT = 1_000
const DEFAULT_COLUMN_COUNT = 1_000
const STRESS_ROW_COUNT = 10_000
const STRESS_COLUMN_COUNT = 10_000

const makeTableColumns = (columnCount: number) =>
  columnHelper.columns(
    makeColumns(columnCount).map((column) =>
      columnHelper.accessor(column.accessorKey, {
        header: column.header,
        size: column.size,
      }),
    ),
  )

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
  readonly columns = signal(makeTableColumns(DEFAULT_COLUMN_COUNT))
  readonly data = signal(makeData(DEFAULT_ROW_COUNT, this.columns()))
  readonly scrollContainer =
    viewChild<ElementRef<HTMLDivElement>>('scrollContainer')

  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns: this.columns(),
    data: this.data(),
    debugTable: true,
  }))

  readonly rows = computed(() => this.table.getRowModel().rows)
  readonly visibleColumns = computed(() => this.table.getVisibleLeafColumns())

  // we are using a slightly different virtualization strategy for columns
  // (compared to virtual rows) in order to support dynamic row heights
  readonly columnVirtualizer = injectVirtualizer<
    HTMLDivElement,
    HTMLTableCellElement
  >(() => ({
    count: this.visibleColumns().length,
    scrollElement: this.scrollContainer()?.nativeElement,
    estimateSize: (index) => this.visibleColumns()[index].getSize(), // estimate width of each column for accurate scrollbar dragging
    horizontal: true,
    overscan: 3, // how many columns to render on each side off screen each way (adjust this for performance)
  }))

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

  readonly virtualColumns = computed(() =>
    this.columnVirtualizer.getVirtualItems(),
  )
  readonly virtualRows = computed(() => this.rowVirtualizer.getVirtualItems())
  readonly totalSize = computed(() => this.rowVirtualizer.getTotalSize())

  readonly virtualPaddingLeft = computed(() => {
    const virtualColumns = this.virtualColumns()
    return virtualColumns.length ? (virtualColumns[0]?.start ?? 0) : undefined
  })

  readonly virtualPaddingRight = computed(() => {
    const virtualColumns = this.virtualColumns()
    return virtualColumns.length
      ? this.columnVirtualizer.getTotalSize() -
          (virtualColumns[virtualColumns.length - 1]?.end ?? 0)
      : undefined
  })

  refreshData = () => {
    const nextColumns = makeTableColumns(DEFAULT_COLUMN_COUNT)
    this.columns.set(nextColumns)
    this.data.set(makeData(DEFAULT_ROW_COUNT, nextColumns))
  }

  stressTestRows = () =>
    this.data.set(makeData(STRESS_ROW_COUNT, this.columns()))

  stressTestColumns = () => {
    const nextColumns = makeTableColumns(STRESS_COLUMN_COUNT)
    this.columns.set(nextColumns)
    this.data.set(makeData(this.data().length, nextColumns))
  }

  sortIndicator(sortDirection: false | 'asc' | 'desc') {
    return sortDirection ? sortIndicators[sortDirection] : null
  }
}
