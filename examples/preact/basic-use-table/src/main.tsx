import { render } from 'preact'
import { TanStackDevtools } from '@tanstack/preact-devtools'
import { useState } from 'preact/hooks'
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/preact-table-devtools'
import './index.css'

// This example uses the classic standalone `useTable` hook to create a table without the new `createTableHelper` util.

// 1. Define what the shape of your data will be for each row
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

// 2. Create some dummy data with a stable reference (this could be an API response stored in useState or similar)
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

// 3. New in V9! Tell the table which features and row models we want to use. In this case, this will be a basic table with no additional features
const features = tableFeatures({}) // util method to create sharable TFeatures object/type

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
    header: () => <span>Last Name</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor((row) => Number(row.age), {
    id: 'age',
    header: () => 'Age',
    cell: (info) => {
      return info.renderValue()
    },
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

function App() {
  // 6. Store data with a stable reference
  const [data, _setData] = useState(() => [...defaultData])

  // 7. Create the table instance with required features, columns, and data
  const table = useTable(
    {
      key: 'basic-use-table', // needed for devtools
      debugTable: true,
      features, // new required option in V9. Tell the table which features you are importing and using (better tree-shaking)
      columns,
      data,
      // add additional table options here
    },
    (state) => state, // default selector
  )

  useTanStackTableDevtools(table)

  // 8. Render your table markup from the table instance APIs
  return (
    <div className="demo-root">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender footer={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="spacer-md" />
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(
  <>
    <App />
    <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
  </>,
  rootElement,
)
