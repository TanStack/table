import { AsyncPipe, NgFor, NgIf } from '@angular/common'
import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import {
  ColumnFiltersState,
  FlexRenderDirective,
  PaginationState,
  RowSelectionState,
  SortingState,
  Table,
  createAngularTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/angular-table'
import { BehaviorSubject, Subject, combineLatest, map, takeUntil } from 'rxjs'
import { Person, columns } from './columns'
import { FilterComponent } from './filter'
import { mockData } from './mockdata'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, FilterComponent, FlexRenderDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  table!: Table<Person>
  private destroy$ = new Subject<void>()
  private rowSelectionState = new BehaviorSubject<RowSelectionState>({})
  private paginationState = new BehaviorSubject<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  } as PaginationState)
  private columnFilterState = new BehaviorSubject<ColumnFiltersState>([])
  sortingState = new BehaviorSubject<SortingState>([])
  data: Person[] = mockData(10000)

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.createTable()
    combineLatest([
      this.rowSelectionState,
      this.paginationState,
      this.sortingState,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([rowSelectionState, paginationState, sortingState]) => {
        this.table.options.state.rowSelection = rowSelectionState
        this.table.options.state.pagination = paginationState
        this.table.options.state.sorting = sortingState
        this.cdr.detectChanges()
      })
  }
  createTable() {
    this.table = createAngularTable({
      data: this.data,
      columns: columns,
      state: {
        rowSelection: this.rowSelectionState.getValue(),
        pagination: this.paginationState.getValue(),
        columnFilters: this.columnFilterState.getValue(),
        sorting: this.sortingState.getValue(),
      },
      enableRowSelection: true,
      onRowSelectionChange: updaterOrValue => {
        this.rowSelectionState.next(
          typeof updaterOrValue === 'function'
            ? updaterOrValue(this.rowSelectionState.getValue())
            : updaterOrValue
        )
      },
      onPaginationChange: Updater => {
        const newvalue =
          typeof Updater === 'function'
            ? Updater(this.paginationState.getValue())
            : Updater
        this.table.options.state.pagination = newvalue
        this.paginationState.next(newvalue)
      },
      onColumnFiltersChange: updater => {
        const filter =
          typeof updater === 'function'
            ? updater(this.columnFilterState.getValue())
            : updater
        this.table.options.state.columnFilters = filter
        this.columnFilterState.next(filter)
      },
      onSortingChange: updaterOrValue => {
        const sorting =
          typeof updaterOrValue == 'function'
            ? updaterOrValue([...this.sortingState.getValue()])
            : updaterOrValue
        this.sortingState.next(sorting)
      },
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      debugTable: true,
    })
  }

  onPageInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement
    const page = inputElement.value ? Number(inputElement.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any) {
    this.table.setPageSize(Number(event.target.value))
  }

  getRowSelectionLength() {
    return this.rowSelectionState.pipe(map(val => Object.keys(val).length))
  }
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
