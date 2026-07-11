import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  FlexRenderFooter,
  tableFeatures,
  createColumnHelper,
  type Row,
  type Cell,
} from '@tanstack/ember-table'

// This example uses the standalone `useTable` hook to create a basic table
// with no additional features.

// 1. Define what the shape of your data will be for each row.
interface Person {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

// 2. Create some dummy data with a stable reference.
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

// 3. Tell the table which features to use. This is a basic table with none.
const features = tableFeatures({})

// 4. Define the columns for your table.
const columnHelper = createColumnHelper<typeof features, Person>()

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

// TanStack Table v9 uses prototype-based methods that require `this` binding.
// Ember templates extract function references without binding, so we provide a
// helper that calls the method on the correct object.
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()

export default class BasicTable extends Component {
  @tracked data: Array<Person> = [...defaultData]

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  get footerGroups() {
    return this.table.getFooterGroups()
  }

  <template>
    <div class='demo-root'>
      <table>
        <thead>
          {{#each this.headerGroups as |headerGroup|}}
            <tr>
              {{#each headerGroup.headers as |header|}}
                <th>
                  {{#unless header.isPlaceholder}}
                    <FlexRenderHeader @header={{header}} />
                  {{/unless}}
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </thead>
        <tbody>
          {{#each this.rows as |row|}}
            <tr>
              {{#each (getAllCells row) as |cell|}}
                <td><FlexRenderCell @cell={{cell}} /></td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
        <tfoot>
          {{#each this.footerGroups as |footerGroup|}}
            <tr>
              {{#each footerGroup.headers as |header|}}
                <th>
                  {{#unless header.isPlaceholder}}
                    <FlexRenderFooter @footer={{header}} />
                  {{/unless}}
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </tfoot>
      </table>
      <div class='spacer-md'></div>
    </div>
  </template>
}
