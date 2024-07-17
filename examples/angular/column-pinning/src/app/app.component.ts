import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRenderDirective,
  createCoreRowModel,
  injectTable,
} from '@tanstack/angular-table'
import { faker } from '@faker-js/faker'
import { NgTemplateOutlet, SlicePipe } from '@angular/common'
import { makeData } from './makeData'
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  ColumnVisibilityState,
} from '@tanstack/angular-table'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultColumns: Array<ColumnDef<any, Person>> = [
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
  standalone: true,
  imports: [FlexRenderDirective, SlicePipe, NgTemplateOutlet],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly data = signal<Array<Person>>(makeData(5000))
  readonly columnVisibility = signal<ColumnVisibilityState>({})
  readonly columnOrder = signal<ColumnOrderState>([])
  readonly columnPinning = signal<ColumnPinningState>({})
  readonly split = signal(false)

  table = injectTable(() => ({
    data: this.data(),
    columns: defaultColumns,
    state: {
      columnVisibility: this.columnVisibility(),
      columnOrder: this.columnOrder(),
      columnPinning: this.columnPinning(),
    },
    onColumnVisibilityChange: (updaterOrValue) => {
      typeof updaterOrValue === 'function'
        ? this.columnVisibility.update(updaterOrValue)
        : this.columnVisibility.set(updaterOrValue)
    },
    onColumnOrderChange: (updaterOrValue) => {
      typeof updaterOrValue === 'function'
        ? this.columnOrder.update(updaterOrValue)
        : this.columnOrder.set(updaterOrValue)
    },
    onColumnPinningChange: (updaterOrValue) => {
      typeof updaterOrValue === 'function'
        ? this.columnPinning.update(updaterOrValue)
        : this.columnPinning.set(updaterOrValue)
    },
    getCoreRowModel: createCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  }))

  stringifiedColumnPinning = computed(() => {
    return JSON.stringify(this.table.getState().columnPinning)
  })

  randomizeColumns() {
    this.table.setColumnOrder(
      faker.helpers.shuffle(this.table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  rerender() {
    this.data.set(makeData(5000))
  }
}
