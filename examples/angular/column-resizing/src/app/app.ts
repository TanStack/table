import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  columnResizingFeature,
  columnSizingFeature,
  injectTable,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import type {
  ColumnDef,
  ColumnResizeDirection,
  ColumnResizeMode,
  Header,
} from '@tanstack/angular-table'
import type { Person } from './makeData'

const features = tableFeatures({ columnResizingFeature, columnSizingFeature })

const columns: Array<ColumnDef<typeof features, Person>> = [
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
  readonly data = signal(makeData(10))
  readonly columnResizeMode = signal<ColumnResizeMode>('onChange')
  readonly columnResizeDirection = signal<ColumnResizeDirection>('ltr')
  readonly rerenders = signal(0)

  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns,
    data: this.data(),
    columnResizeMode: this.columnResizeMode(),
    columnResizeDirection: this.columnResizeDirection(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  setResizeMode(event: Event) {
    this.columnResizeMode.set(
      (event.target as HTMLSelectElement).value as ColumnResizeMode,
    )
  }
  setResizeDirection(event: Event) {
    this.columnResizeDirection.set(
      (event.target as HTMLSelectElement).value as ColumnResizeDirection,
    )
  }
  refreshData = () => this.data.set(makeData(10))
  stressTest = () => this.data.set(makeData(100))
  rerender = () => this.rerenders.update((value) => value + 1)

  getResizeTransform(header: Header<typeof features, Person, unknown>) {
    if (this.columnResizeMode() !== 'onEnd' || !header.column.getIsResizing()) {
      return ''
    }

    const direction =
      this.table.options.columnResizeDirection === 'rtl' ? -1 : 1
    return `translateX(${
      direction * (this.table.atoms.columnResizing.get().deltaOffset ?? 0)
    }px)`
  }
}
