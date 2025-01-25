import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRenderDirective,
  aggregationFns,
  columnFilteringFeature,
  columnGroupingFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createTableHelper,
  filterFns,
  isFunction,
  rowExpandingFeature,
  rowPaginationFeature,
} from '@tanstack/angular-table'
import { columns } from './columns'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type { GroupingState, Updater } from '@tanstack/angular-table'

export const tableHelper = createTableHelper({
  _features: {
    columnGroupingFeature,
    rowPaginationFeature,
    columnFilteringFeature,
    rowExpandingFeature,
  },
  _rowModels: {
    groupedRowModel: createGroupedRowModel(aggregationFns),
    expandedRowModel: createExpandedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filteredRowModel: createFilteredRowModel(filterFns),
  },
  TData: {} as Person,
})

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FlexRenderDirective, CommonModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'grouping'
  readonly data = signal(makeData(10000))
  readonly grouping = signal<GroupingState>([])

  readonly stringifiedGrouping = computed(() =>
    JSON.stringify(this.grouping(), null, 2),
  )

  readonly table = tableHelper.injectTable(() => ({
    enableExperimentalReactivity: true,
    data: this.data(),
    columns: columns,
    initialState: {
      pagination: { pageSize: 20, pageIndex: 0 },
    },
    state: {
      grouping: this.grouping(),
    },
    onGroupingChange: (updaterOrValue: Updater<GroupingState>) => {
      const groupingState = isFunction(updaterOrValue)
        ? updaterOrValue([...this.grouping()])
        : updaterOrValue
      this.grouping.set(groupingState)
    },
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
  }
}
