import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  effect,
  inject,
  signal,
} from '@angular/core'
import { createAtom } from '@tanstack/angular-store'
import {
  FlexRender,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  injectTable,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/angular-table'
import { injectTanStackTableDevtools } from '@tanstack/angular-table-devtools'
import { makeData } from './makeData'
import type { PaginationState, SortingState } from '@tanstack/angular-table'
import type { Person } from './makeData'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
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

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly injector = inject(Injector)

  readonly data = signal(makeData(1_000))
  readonly sortingAtom = createAtom<SortingState>([])
  readonly paginationAtom = createAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  readonly table = injectTable(() => ({
    key: 'basic-external-atoms', // needed for devtools
    debugTable: true,
    features,
    columns,
    data: this.data(),
    atoms: {
      sorting: this.sortingAtom,
      pagination: this.paginationAtom,
    },
  }))

  ngOnInit() {
    this.registerTableDevtools()
  }

  private registerTableDevtools() {
    injectTanStackTableDevtools(() => ({
      table: this.table,
      injector: this.injector,
    }))
  }

  refreshData() {
    this.data.set(makeData(1_000))
  }

  stressTest() {
    this.data.set(makeData(1_000_000))
  }
  onPageInputChange(event: Event) {
    const input = event.target as HTMLInputElement
    const page = input.value ? Number(input.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement
    this.table.setPageSize(Number(select.value))
  }

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }
}
