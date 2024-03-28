import { Component, computed, signal } from '@angular/core'
import {
  ColumnFiltersState,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/angular-table'
import { columns, Person } from './columns'
import { FilterComponent } from './filter'
import { mockData } from './mockdata'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FilterComponent, FlexRenderDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private rowSelectionState = signal<RowSelectionState>({})
  private paginationState = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  private columnFilterState = signal<ColumnFiltersState>([])
  sortingState = signal<SortingState>([])
  data: Person[] = mockData(10000)

  table = createAngularTable(() => ({
    data: this.data,
    columns: columns,
    state: {
      rowSelection: this.rowSelectionState(),
      pagination: this.paginationState(),
      columnFilters: this.columnFilterState(),
      sorting: this.sortingState(),
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    onRowSelectionChange: updaterOrValue => {
      this.rowSelectionState.set(
        typeof updaterOrValue === 'function'
          ? updaterOrValue(this.rowSelectionState())
          : updaterOrValue
      )
    },
    onPaginationChange: updaterOrValue => {
      this.paginationState.set(
        typeof updaterOrValue === 'function'
          ? updaterOrValue(this.paginationState())
          : updaterOrValue
      )
    },
    onColumnFiltersChange: updaterOrValue => {
      this.columnFilterState.set(
        typeof updaterOrValue === 'function'
          ? updaterOrValue(this.columnFilterState())
          : updaterOrValue
      )
    },
    onSortingChange: updaterOrValue => {
      this.sortingState.set(
        typeof updaterOrValue === 'function'
          ? updaterOrValue(this.sortingState())
          : updaterOrValue
      )
    },
  }))

  rowSelectionLength = computed(
    () => Object.keys(this.rowSelectionState()).length
  )

  onPageInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement
    const page = inputElement.value ? Number(inputElement.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any) {
    this.table.setPageSize(Number(event.target.value))
  }
}
