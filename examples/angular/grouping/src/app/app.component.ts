import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, Component, computed, effect, signal} from '@angular/core'
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
import {columns} from './columns'
import {mockData} from './mockdata'

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
  }));

  constructor() {
    effect(() => {
      // run on every state/option change
      this.table().getPageOptions();
    });

    // more granular state, run on every "getPageOptions" change (e.g. only when pagination state change)
    effect(() => {
      this.table.getPageOptions()
    });

    // granular state is still possible using computed manually, but it must be done manually
    const pageOptions = computed(() => this.table().getPageOptions());
    effect(() => {
      pageOptions()
    });

    // these two are lines does the same thing, they access to the same table instance property.
    this.table().setPageSize(...)
    this.table.setPageSize() // this one is evaluated lazily with proxy
  }

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
