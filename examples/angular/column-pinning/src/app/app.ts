import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRenderDirective,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  injectTable,
  tableFeatures,
} from '@tanstack/angular-table'
import { faker } from '@faker-js/faker'
import { NgTemplateOutlet, SlicePipe } from '@angular/common'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  ColumnVisibilityState,
} from '@tanstack/angular-table'

const _features = tableFeatures({
  columnPinningFeature,
  columnOrderingFeature,
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
  imports: [FlexRenderDirective, SlicePipe, NgTemplateOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Person>>(makeData(1_000))
  readonly columnVisibility = signal<ColumnVisibilityState>({})
  readonly columnOrder = signal<ColumnOrderState>([])
  readonly columnPinning = signal<ColumnPinningState>({
    left: [],
    right: [],
  })
  readonly split = signal(false)

  table = injectTable(() => ({
    _features,
    columns: defaultColumns,
    data: this.data(),
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
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  }))

  stringifiedColumnPinning = computed(() => {
    return JSON.stringify(this.table.state().columnPinning)
  })

  randomizeColumns() {
    this.table.setColumnOrder(
      faker.helpers.shuffle(this.table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  refreshData = () => this.data.set(makeData(1_000))
  stressTest = () => this.data.set(makeData(100_000))
}
