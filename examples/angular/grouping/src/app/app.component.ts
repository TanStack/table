import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRenderDirective,
  columnFilteringFeature,
  columnGroupingFeature,
  createCoreRowModel,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  injectTable,
  rowExpandingFeature,
  rowPaginationFeature,
  tableOptions,
} from '@tanstack/angular-table'
import { columns } from './columns'
import { makeData } from './makeData'
import type { GroupingState, Updater } from '@tanstack/angular-table'

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

  readonly table = injectTable(() => ({
    data: this.data(),
    columns: columns,
    enableExperimentalReactivity: true,
    initialState: {
      pagination: { pageSize: 20, pageIndex: 0 },
    },
    state: {
      grouping: this.grouping(),
    },
    _features: {
      columnGroupingFeature,
      rowPaginationFeature,
      columnFilteringFeature,
      rowExpandingFeature,
    },
    _rowModels: {
      // @ts-expect-error Fix type
      groupedRowModel: createGroupedRowModel(),
      // @ts-expect-error Fix type
      expandedRowModel: createExpandedRowModel(),
      // @ts-expect-error Fix type
      paginatedRowModel: createPaginatedRowModel(),
      // @ts-expect-error Fix type
      filteredRowModel: createFilteredRowModel(),
    },
    onGroupingChange: (updaterOrValue: Updater<GroupingState>) => {
      const groupingState =
        typeof updaterOrValue === 'function'
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
