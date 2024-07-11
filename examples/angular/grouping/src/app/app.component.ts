import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRenderDirective,
  createCoreRowModel,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  injectTable,
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
  data = signal(makeData(10000))
  grouping = signal<GroupingState>([])

  stringifiedGrouping = computed(() => JSON.stringify(this.grouping(), null, 2))

  tableOptions = computed(() =>
    tableOptions({
      data: this.data(),
      columns: columns,
      state: {
        grouping: this.grouping(),
      },
      onGroupingChange: (updaterOrValue: Updater<GroupingState>) => {
        const groupingState =
          typeof updaterOrValue === 'function'
            ? updaterOrValue([...this.grouping()])
            : updaterOrValue
        this.grouping.set(groupingState)
      },
      getExpandedRowModel: createExpandedRowModel(),
      getGroupedRowModel: createGroupedRowModel(),
      getCoreRowModel: createCoreRowModel(),
      getPaginatedRowModel: createPaginatedRowModel(),
      getFilteredRowModel: createFilteredRowModel(),
      debugTable: true,
    }),
  )

  table = injectTable(this.tableOptions)

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
