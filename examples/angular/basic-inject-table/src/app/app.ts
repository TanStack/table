import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  inject,
  signal,
} from '@angular/core'
import {
  FlexRender,
  createColumnHelper,
  injectTable,
  tableFeatures,
} from '@tanstack/angular-table'
import { injectTanStackTableDevtools } from '@tanstack/angular-table-devtools'

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

// 4. Create a column helper with the table features and row type
const columnHelper = createColumnHelper<typeof features, Person>()

// 5. Define the columns for your table with the column helper
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => Number(row.age), {
    id: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly injector = inject(Injector)

  // 6. Store data with a stable reference
  readonly data = signal<Array<Person>>([...defaultData])

  // 7. Create the table instance with required features, columns, and data
  readonly table = injectTable(() => ({
    key: 'basic-inject-table', // needed for devtools
    debugTable: true,
    features,
    columns,
    data: this.data(),
  }))

  ngOnInit() {
    this.registerTableDevtools()
  }

  private registerTableDevtools() {
    injectTanStackTableDevtools(() => ({
      table: this.table,
      injector: this.injector,
    }))
  }
}
