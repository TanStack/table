import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { FlexRender, injectTable, tableFeatures } from '@tanstack/angular-table'
import { injectTanStackTableDevtools } from '@tanstack/angular-table-devtools'
import type { ColumnDef } from '@tanstack/angular-table'

// This example uses the Angular standalone `injectTable` helper to create a table without the `createTableHook` util.

// 1. Define what the shape of your data will be for each row
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

// 2. Create some dummy data with a stable reference
const defaultData: Array<Person> = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'kevin',
    lastName: 'vandy',
    age: 12,
    visits: 100,
    status: 'Single',
    progress: 70,
  },
]

// 3. New in V9! Tell the table which features and row models we want to use.
// In this case, this will be a basic table with no additional features
const features = tableFeatures({})

// 4. Define the columns for your table. This uses the new `ColumnDef` type to define columns.
// Alternatively, check out the createTableHook/createColumnHelper util for an even more type-safe way to define columns.
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue<string>(),
  },
  {
    accessorFn: (row) => Number(row.age),
    id: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
  },
  {
    accessorKey: 'visits',
    header: () => 'Visits',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
  },
]

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    injectTanStackTableDevtools(() => ({
      table: this.table,
    }))
  }
  // 5. Store data with a stable reference
  readonly data = signal<Array<Person>>([...defaultData])
  readonly renderCount = signal(0)

  // 6. Create the table instance with required features, columns, and data
  readonly table = injectTable(() => ({
    key: 'basic-inject-table', // needed for devtools
    debugTable: true,
    features,
    columns,
    data: this.data(),
  }))

  rerender() {
    this.renderCount.update((count) => count + 1)
  }
}
