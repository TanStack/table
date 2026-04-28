import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { FlexRender, injectTable, tableFeatures } from '@tanstack/angular-table'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type { ColumnDef } from '@tanstack/angular-table'

// 3. New in V9! Tell the table which features and row models we want to use.
// In this case, this will be a basic table with no additional features
const _features = tableFeatures({}) // util method to create sharable TFeatures object/type

// 4. Define the columns for your table. This uses the new `ColumnDef` type to define columns.
// Alternatively, check out the createAppTable/createColumnHelper util for an even more type-safe way to define columns.
const defaultColumns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => `<i>${info.getValue<string>()}</i>`,
    header: () => `<span>Last Name</span>`,
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'visits',
    header: () => `<span>Visits</span>`,
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    footer: (info) => info.column.id,
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

  // 5. Create the table instance with required _features, columns, and data
  table = injectTable(() => ({
    debugTable: true,
    _features, // new required option in V9. Tell the table which features you are importing and using (better tree-shaking)
    _rowModels: {}, // `Core` row model is now included by default, but you can still override it here
    data: this.data(),
    columns: defaultColumns,
    // ...other options here
  }))

  refreshData = () => this.data.set(makeData(20))
  stressTest = () => this.data.set(makeData(1_000))
}
