import { NgTemplateOutlet } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRender,
  columnPinningFeature,
  injectTable,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import type { ColumnDef, ColumnPinningState } from '@tanstack/angular-table'
import type { Person } from './makeData'

const features = tableFeatures({ columnPinningFeature })
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    header: 'Last Name',
    cell: (info) => info.getValue(),
  },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'visits', header: 'Visits' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'progress', header: 'Profile Progress' },
]
@Component({
  selector: 'app-root',
  imports: [FlexRender, NgTemplateOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal(makeData(20))
  readonly columnPinning = signal<ColumnPinningState>({
    left: ['firstName'],
    right: ['progress'],
  })
  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns,
    data: this.data(),
    state: {
      columnPinning: this.columnPinning(),
    },
    onColumnPinningChange: (updaterOrValue) => {
      typeof updaterOrValue === 'function'
        ? this.columnPinning.update(updaterOrValue)
        : this.columnPinning.set(updaterOrValue)
    },
    debugTable: true,
  }))

  readonly leftHeaderGroups = computed(() => this.table.getLeftHeaderGroups())
  readonly centerHeaderGroups = computed(() =>
    this.table.getCenterHeaderGroups(),
  )
  readonly rightHeaderGroups = computed(() => this.table.getRightHeaderGroups())
  readonly visibleRows = computed(() =>
    this.table.getRowModel().rows.slice(0, 20),
  )
  readonly stringifiedState = computed(() =>
    JSON.stringify(this.table.store.get(), null, 2),
  )

  refreshData = () => this.data.set(makeData(20))
  stressTest = () => this.data.set(makeData(1_000))
}
