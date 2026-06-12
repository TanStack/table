import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  columnFilteringFeature,
  columnSizingFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
  injectTable,
  isFunction,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import type {
  ColumnDef,
  ExpandedState,
  RowPinningState,
  Updater,
} from '@tanstack/angular-table'
import type { Person } from './makeData'

const features = tableFeatures({
  rowPinningFeature,
  rowExpandingFeature,
  columnFilteringFeature,
  columnSizingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
})
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    id: 'pin',
    header: 'Pin',
    cell: ({ row }) => (row.getIsPinned() ? 'Unpin' : 'Pin'),
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    header: 'Last Name',
    cell: (info) => info.getValue(),
  },
  { accessorKey: 'age', header: 'Age', size: 50 },
  { accessorKey: 'visits', header: 'Visits', size: 50 },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'progress', header: 'Profile Progress', size: 80 },
]

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal(makeData(1_000, 2, 2))
  readonly rowPinning = signal<RowPinningState>({ top: [], bottom: [] })
  readonly expanded = signal<ExpandedState>({})
  readonly keepPinnedRows = signal(true)
  readonly includeLeafRows = signal(true)
  readonly includeParentRows = signal(false)

  readonly table = injectTable<typeof features, Person>(() => ({
    debugTable: true,
    features,
    columns,
    data: this.data(),
    initialState: { pagination: { pageSize: 20, pageIndex: 0 } },
    state: { expanded: this.expanded(), rowPinning: this.rowPinning() },
    onExpandedChange: (updater: Updater<ExpandedState>) =>
      isFunction(updater)
        ? this.expanded.update(updater)
        : this.expanded.set(updater),
    onRowPinningChange: (updater: Updater<RowPinningState>) =>
      isFunction(updater)
        ? this.rowPinning.update(updater)
        : this.rowPinning.set(updater),
    getSubRows: (row) => row.subRows,
    keepPinnedRows: this.keepPinnedRows(),
    debugAll: true,
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }
  refreshData = () => this.data.set(makeData(1_000, 2, 2))
  stressTest = () => this.data.set(makeData(200_000, 2, 2))
  onPageSizeChange(event: Event): void {
    this.table.setPageSize(Number((event.target as HTMLSelectElement).value))
  }
}
