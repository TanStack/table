import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRender,
  columnVisibilityFeature,
  injectTable,
  isFunction,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type { ColumnDef, ColumnVisibilityState } from '@tanstack/angular-table'

const _features = tableFeatures({
  columnVisibilityFeature,
})

const defaultColumns: Array<ColumnDef<typeof _features, Person>> = [
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
  readonly data = signal<Array<Person>>(makeData(20))
  readonly columnVisibility = signal<ColumnVisibilityState>({})

  readonly table = injectTable(() => ({
    _features,
    columns: defaultColumns,
    data: this.data(),
    state: {
      columnVisibility: this.columnVisibility(),
    },
    onColumnVisibilityChange: (updaterOrValue) => {
      const visibilityState = isFunction(updaterOrValue)
        ? updaterOrValue(this.columnVisibility())
        : updaterOrValue
      this.columnVisibility.set(visibilityState)
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  }))

  readonly stringifiedColumnVisibility = computed(() => {
    return JSON.stringify(this.table.state().columnVisibility)
  })

  refreshData = () => this.data.set(makeData(20))
  stressTest = () => this.data.set(makeData(1_000))
}
