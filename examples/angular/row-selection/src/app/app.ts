import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRender,
  TanStackTable,
  flexRenderComponent,
} from '@tanstack/angular-table'
import { TableFilter } from './table-filter/table-filter'
import { makeData } from './makeData'
import {
  TableHeaderSelection,
  TableRowSelection,
} from './selection-column/selection-column'
import { createAppColumnHelper, injectTable } from './table'
import type { Person } from './makeData'
import type { RowSelectionState } from '@tanstack/angular-table'

const columnHelper = createAppColumnHelper<Person>()

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TableFilter, FlexRender, TanStackTable],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly rowSelection = signal<RowSelectionState>({})
  readonly globalFilter = signal<string>('')
  readonly data = signal(makeData(1_000))
  readonly enableRowSelection = signal(true)

  readonly columns = columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: () => flexRenderComponent(TableHeaderSelection),
      cell: () => flexRenderComponent(TableRowSelection),
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
          header: () => `Age 🥳`,
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

  readonly table = injectTable(() => ({
    debugTable: true,
    data: this.data(),
    columns: this.columns,
    state: {
      rowSelection: this.rowSelection(),
    },

    enableRowSelection: this.enableRowSelection(), // enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: (updaterOrValue) => {
      this.rowSelection.set(
        typeof updaterOrValue === 'function'
          ? updaterOrValue(this.rowSelection())
          : updaterOrValue,
      )
    },
  }))

  readonly paginationState = this.table.computed({
    selector: (state) => state.pagination,
  })

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

  refreshData = () => this.data.set(makeData(1_000))
  stressTest = () => this.data.set(makeData(100_000))

  toggleEnableRowSelection() {
    this.enableRowSelection.update((value) => !value)
  }
}
