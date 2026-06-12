import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  columnSizingFeature,
  createColumnHelper,
  injectTable,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/angular-table'
import type { Person } from './makeData'

const features = tableFeatures({ columnSizingFeature })

const columnHelper = createColumnHelper<typeof features, Person>()

// This is not the Column Resizing Example, this is a simplified version that just sets static column sizes
const columns: Array<ColumnDef<typeof features, Person>> = columnHelper.columns(
  [
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id,
      size: 120, // initial size
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      cell: (info) => info.getValue(),
      header: () => 'Last Name',
      footer: (props) => props.column.id,
      size: 120,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      footer: (props) => props.column.id,
      size: 100,
    }),
    columnHelper.accessor('visits', {
      header: () => 'Visits',
      footer: (props) => props.column.id,
      size: 80,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      footer: (props) => props.column.id,
      size: 200,
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: (props) => props.column.id,
      size: 200,
    }),
  ],
)

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Person>>(makeData(20))
  readonly rerenders = signal(0)

  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns,
    data: this.data(),
    debugTable: true,
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  refreshData = () => this.data.set(makeData(20))
  stressTest = () => this.data.set(makeData(1_000))
  rerender = () => this.rerenders.update((value) => value + 1)

  setColumnSize(columnId: string, event: Event) {
    // Don't actually do this to resize columns. This is just for demonstration purposes.
    // See the Column Resizing Example for how to do this with dedicated resizing APIs efficiently.
    this.table.setColumnSizing({
      ...this.table.atoms.columnSizing.get(),
      [columnId]: Number((event.target as HTMLInputElement).value),
    })
  }
}
