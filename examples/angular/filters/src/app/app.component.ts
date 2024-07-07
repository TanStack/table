import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  type ColumnDef,
  type ColumnFiltersState,
  FlexRenderDirective,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  injectTable,
} from '@tanstack/angular-table'
import { FormsModule } from '@angular/forms'
import { NgClass } from '@angular/common'
import { FilterComponent } from './table-filter.component'
import { type Person, makeData } from './makeData'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FilterComponent, FlexRenderDirective, FormsModule, NgClass],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly columnFilters = signal<ColumnFiltersState>([])
  readonly data = signal(makeData(5000))

  readonly columns: Array<ColumnDef<Person>> = [
    {
      accessorKey: 'firstName',
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row.lastName,
      id: 'lastName',
      cell: (info) => info.getValue(),
      header: () => 'Last Name',
    },
    {
      accessorKey: 'age',
      header: () => 'Age',
      meta: {
        filterVariant: 'range',
      },
    },
    {
      accessorKey: 'visits',
      header: () => 'Visits',
      meta: {
        filterVariant: 'range',
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: {
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'progress',
      header: 'Profile Progress',
      meta: {
        filterVariant: 'range',
      },
    },
  ]

  table = injectTable<Person>(() => ({
    columns: this.columns,
    data: this.data(),
    state: {
      columnFilters: this.columnFilters(),
    },
    onColumnFiltersChange: (updater) => {
      updater instanceof Function
        ? this.columnFilters.update(updater)
        : this.columnFilters.set(updater)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client-side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(), // client-side faceting
    getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
    getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  }))

  readonly stringifiedFilters = computed(() =>
    JSON.stringify(this.columnFilters(), null, 2),
  )

  onPageInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    const page = inputElement.value ? Number(inputElement.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any): void {
    this.table.setPageSize(Number(event.target.value))
  }

  refreshData(): void {
    this.data.set(makeData(100_000)) // stress test
  }
}
