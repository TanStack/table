import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  createAngularTable,
  ExpandedState,
  FlexRenderDirective,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  GroupingState,
  PaginationState,
  Updater,
} from '@tanstack/angular-table'
import { columns } from './columns'
import { mockData } from './mockdata'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FlexRenderDirective, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'grouping'
  data = signal(mockData(10000))
  groupingState = signal<GroupingState>([])
  expandedState = signal<ExpandedState>({})
  paginationState = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  } as PaginationState)
  expanded = signal<ExpandedState>({})

  table = createAngularTable(() => ({
    data: this.data(),
    columns: columns,
    state: {
      grouping: this.groupingState(),
      expanded: this.expandedState(),
      pagination: this.paginationState(),
    },
    onGroupingChange: (updaterOrValue: Updater<GroupingState>) => {
      const group =
        typeof updaterOrValue === 'function'
          ? updaterOrValue([...this.groupingState()])
          : updaterOrValue
      this.groupingState.set(group)
    },
    onExpandedChange: updater => {
      const expand =
        typeof updater === 'function' ? updater(this.expandedState()) : updater
      this.expandedState.set(expand)
    },
    onPaginationChange: val => {
      const page = typeof val === 'function' ? val(this.paginationState()) : val
      this.paginationState.set(page)
    },
    debugTable: true,
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  }))

  onPageInputChange(event: any): void {
    const page = event.target.value ? Number(event.target.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any) {
    this.table.setPageSize(Number(event.target.value))
  }

  refreshData() {
    this.data.set(mockData(1000))
  }
}
