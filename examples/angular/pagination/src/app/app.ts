import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  createPaginatedRowModel,
  injectTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/angular-table'
import type { Person } from './makeData'

const _features = tableFeatures({ rowPaginationFeature })

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => 'Last Name',
        footer: (props) => props.column.id,
      },
    ],
  },
  {
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: (props) => props.column.id,
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => 'Visits',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
  },
]

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Person>>(makeData(100_000))

  readonly table = injectTable<typeof _features, Person>(() => ({
    _features,
    _rowModels: {
      paginatedRowModel: createPaginatedRowModel<typeof _features, Person>(),
    },
    columns,
    data: this.data(),
    debugTable: true,
  }))

  stringifiedState() {
    return JSON.stringify(this.table.state, null, 2)
  }

  refreshData = () => this.data.set(makeData(100_000))
  stressTest = () => this.data.set(makeData(200_000))
  rerender = () => this.data.update((data) => [...data])

  onPageInputChange(event: Event): void {
    const page = (event.target as HTMLInputElement).value
      ? Number((event.target as HTMLInputElement).value) - 1
      : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: Event): void {
    this.table.setPageSize(Number((event.target as HTMLSelectElement).value))
  }
}
