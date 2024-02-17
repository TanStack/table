import { CommonModule, NgFor, NgIf } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core'
import {
  ExpandedState,
  FlexRenderDirective,
  GroupingState,
  PaginationState,
  Table,
  Updater,
  createAngularTable,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
} from '@tanstack/angular-table'
import { BehaviorSubject, Subject, combineLatest, takeUntil } from 'rxjs'
import { Person, columns } from './columns'
import { mockData } from './mockdata'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, NgFor, FlexRenderDirective, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'grouping'

  private destroy$ = new Subject<void>()
  data = mockData(10000)
  groupingState = new BehaviorSubject<GroupingState>([])
  expandedState = new BehaviorSubject<ExpandedState>({})
  paginationState = new BehaviorSubject<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  } as PaginationState)
  table!: Table<Person>
  expanded: ExpandedState = {}
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.createTable()
    combineLatest([
      this.expandedState,
      this.groupingState,
      this.paginationState,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([expandedState, groupingState, paginationState]) => {
        this.table.options.state.grouping = groupingState
        this.table.options.state.expanded = expandedState
        this.table.options.state.pagination = paginationState
        this.cdr.detectChanges()
      })
  }

  createTable() {
    this.table = createAngularTable({
      data: this.data,
      columns: columns,
      state: {
        grouping: this.groupingState.getValue(),
        expanded: this.expandedState.getValue(),
        pagination: this.paginationState.getValue(),
      },
      onGroupingChange: (updaterOrValue: Updater<GroupingState>) => {
        const group =
          typeof updaterOrValue === 'function'
            ? updaterOrValue([...this.groupingState.getValue()])
            : updaterOrValue
        this.groupingState.next(group)
      },
      onExpandedChange: updater => {
        const expand =
          typeof updater === 'function'
            ? updater(this.expandedState.getValue())
            : updater
        this.expandedState.next(expand)
      },
      debugTable: true,
      onPaginationChange: val => {
        const page =
          typeof val === 'function' ? val(this.paginationState.getValue()) : val
        this.paginationState.next(page)
      },
      getExpandedRowModel: getExpandedRowModel(),
      getGroupedRowModel: getGroupedRowModel(),
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
    })
  }

  onPageInputChange(event: any): void {
    const page = event.target.value ? Number(event.target.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any) {
    this.table.setPageSize(Number(event.target.value))
  }

  refreshData() {
    this.table.options.data = mockData(1000)
  }
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
