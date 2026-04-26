import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { FlexRender, createTableHook } from '@tanstack/angular-table'
import { makeData } from './makeData'
import type { Person } from './makeData'

// 3. New in V9! Tell the table which features and row models we want to use.
// In this case, this will be a basic table with no additional features
const { injectAppTable, createAppColumnHelper } = createTableHook({
  _features: {},
  _rowModels: {}, // client-side row models. `Core` row model is now included by default, but you can still override it here
  debugTable: true,
})

// 4. Create a helper object to help define our columns
const columnHelper = createAppColumnHelper<Person>()

// 5. Define the columns for your table with a stable reference (in this case, defined statically outside of a react component)
const columns = columnHelper.columns([
  // accessorKey method (most common for simple use-cases)
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  // accessorFn used (alternative) along with a custom id
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => `<i>${info.getValue()}</i>`,
    header: () => `<span>Last Name</span>`,
    footer: (info) => info.column.id,
  }),
  // accessorFn used to transform the data
  columnHelper.accessor((row) => Number(row.age), {
    id: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => `<span>Visits</span>`,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (info) => info.column.id,
  }),
])

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Person>>(makeData(1_000))

  // 6. Create the table instance with the required columns and data.
  // Features and row models are already defined in the createTableHook call above
  readonly table = injectAppTable(() => ({
    columns,
    data: this.data(),
    // add additional table options here or in the createTableHook call above
  }))

  refreshData = () => this.data.set(makeData(1_000))
  stressTest = () => this.data.set(makeData(100_000))
}
