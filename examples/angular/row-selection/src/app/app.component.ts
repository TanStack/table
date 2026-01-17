import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  viewChild,
} from '@angular/core'
import {
  FlexRender,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTableHook,
  filterFns,
  flexRenderComponent,
  rowPaginationFeature,
  rowSelectionFeature,
} from '@tanstack/angular-table'
import { FormsModule } from '@angular/forms'
import { FilterComponent } from './filter'
import { makeData } from './makeData'
import {
  TableHeadSelectionComponent,
  TableRowSelectionComponent,
} from './selection-column.component'
import type { TemplateRef } from '@angular/core'
import type { Person } from './makeData'
import type { RowSelectionState } from '@tanstack/angular-table'

const { injectAppTable: injectTable, createAppColumnHelper } = createTableHook({
  _features: {
    columnFilteringFeature,
    rowPaginationFeature,
    rowSelectionFeature,
  },
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  debugTable: true,
})

const columnHelper = createAppColumnHelper<Person>()

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FilterComponent, FlexRender, FormsModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly rowSelection = signal<RowSelectionState>({})
  readonly globalFilter = signal<string>('')
  readonly data = signal(makeData(10_000))

  readonly ageHeaderCell =
    viewChild.required<TemplateRef<unknown>>('ageHeaderCell')

  readonly columns = columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: () => flexRenderComponent(TableHeadSelectionComponent),
      cell: () => flexRenderComponent(TableRowSelectionComponent),
    }),
    columnHelper.group({
      header: 'Name',
      footer: (props) => props.column.id,
      columns: columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
          header: () => 'First name',
        }),
        columnHelper.accessor('lastName', {
          cell: (info) => info.getValue(),
          header: () => 'Last Name',
          footer: (props) => props.column.id,
        }),
      ]),
    }),
    columnHelper.group({
      header: 'Info',
      footer: (props) => props.column.id,
      columns: columnHelper.columns([
        columnHelper.accessor('age', {
          header: () => this.ageHeaderCell(),
          footer: (props) => props.column.id,
        }),
        columnHelper.group({
          header: 'More Info',
          columns: columnHelper.columns([
            columnHelper.accessor((row) => row.visits, {
              id: 'visits',
              header: () => 'Visits',
              footer: (props) => props.column.id,
            }),
            columnHelper.accessor((row) => row.status, {
              id: 'status',
              header: () => 'Status',
              footer: (props) => props.column.id,
            }),
            columnHelper.accessor((row) => row.progress, {
              id: 'progress',
              header: 'Profile Progress',
              footer: (props) => props.column.id,
            }),
          ]),
        }),
      ]),
    }),
  ])

  table = injectTable(() => ({
    data: this.data(),
    columns: this.columns,
    state: {
      rowSelection: this.rowSelection(),
    },
    enableRowSelection: true, // enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: (updaterOrValue) => {
      this.rowSelection.set(
        typeof updaterOrValue === 'function'
          ? updaterOrValue(this.rowSelection())
          : updaterOrValue,
      )
    },
  }))

  readonly stringifiedRowSelection = computed(() =>
    JSON.stringify(this.rowSelection(), null, 2),
  )

  readonly rowSelectionLength = computed(
    () => Object.keys(this.rowSelection()).length,
  )

  onPageInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    const page = inputElement.value ? Number(inputElement.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any): void {
    this.table.setPageSize(Number(event.target.value))
  }

  logSelectedFlatRows(): void {
    console.info(
      'table.getSelectedRowModel().flatRows',
      this.table.getSelectedRowModel().flatRows,
    )
  }

  refreshData(): void {
    this.data.set(makeData(10_000))
  }
}
