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
import { injectTanStackTableDevtools } from '@tanstack/angular-table-devtools'
import { makeData } from './makeData'
import type { ColumnDef, ColumnPinningState } from '@tanstack/angular-table'
import type { Person } from './makeData'

const _features = tableFeatures({ columnPinningFeature })
const columns: Array<ColumnDef<typeof _features, Person>> = [
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
  readonly table = injectTable<typeof _features, Person>(() => ({
    _features,
    _rowModels: {},
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

  readonly stringifiedColumnPinning = computed(() => {
    return JSON.stringify(this.table.state.columnPinning)
  })

  refreshData = () => this.data.set(makeData(20))
  stressTest = () => this.data.set(makeData(1_000))
  constructor() {
    injectTanStackTableDevtools(() => ({
      table: this.table,
      name: 'column-pinning-split',
    }))
  }
}
