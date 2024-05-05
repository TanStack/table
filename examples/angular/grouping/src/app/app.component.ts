import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRenderDirective,
  GroupingState,
  PaginationState,
  Updater,
  createAngularTable,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
} from '@tanstack/angular-table'
import { columns } from './columns'
import { makeData } from './makeData'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FlexRenderDirective, CommonModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'grouping'
  data = signal(makeData(10000))
  grouping = signal<GroupingState>([])
  pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 })

  stringifiedGrouping = computed(() => JSON.stringify(this.grouping(), null, 2))

  table = createAngularTable(() => ({
    data: this.data(),
    columns: columns,
    state: {
      grouping: this.grouping(),
      pagination: this.pagination(),
    },
    onGroupingChange: (updaterOrValue: Updater<GroupingState>) => {
      const groupingState =
        typeof updaterOrValue === 'function'
          ? updaterOrValue([...this.grouping()])
          : updaterOrValue
      this.grouping.set(groupingState)
    },
    onPaginationChange: (updaterOrValue: Updater<PaginationState>) => {
      const paginationState =
        typeof updaterOrValue === 'function'
          ? updaterOrValue({ ...this.pagination() })
          : updaterOrValue
      this.pagination.set(paginationState)
    },
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  }))

  onPageInputChange(event: any): void {
    const page = event.target.value ? Number(event.target.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any) {
    this.table.setPageSize(Number(event.target.value))
  }

  refreshData() {
    this.data.set(makeData(10000))
    this.pagination.set({ pageIndex: 0, pageSize: 10 })
  }
}
