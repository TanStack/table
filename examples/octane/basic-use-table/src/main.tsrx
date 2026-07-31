import { createRoot, useState } from 'octane'
import { tableFeatures, useTable } from '@tanstack/octane-table'
import type { ColumnDef } from '@tanstack/octane-table'
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
  { firstName: 'tanner', lastName: 'linsley', age: 24, visits: 100, status: 'In Relationship', progress: 50 },
  { firstName: 'tandy', lastName: 'miller', age: 40, visits: 40, status: 'Single', progress: 80 },
  { firstName: 'joe', lastName: 'dirte', age: 45, visits: 20, status: 'Complicated', progress: 10 },
  { firstName: 'kevin', lastName: 'vandy', age: 12, visits: 100, status: 'Single', progress: 70 },
]

// 3. New in V9! Tell the table which features and row models we want to use. In this case, this will be a basic table with no additional features
const features = tableFeatures({})

// 4. Define the columns for your table. This uses the new `ColumnDef` type to define columns. Alternatively, check out the createTableHelper/createColumnHelper util for an even more type-safe way to define columns.
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    // accessorKey method (most common for simple use-cases)
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => String(info.getValue()),
  },
  {
    // accessorFn used (alternative) along with a custom id
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    header: () => <span>Last Name</span>,
    cell: (info) => <i>{String(info.getValue<string>())}</i>,
  },
  {
    // accessorFn used to transform the data
    accessorFn: (row) => Number(row.age),
    id: 'age',
    header: () => 'Age',
    cell: (info) => String(info.renderValue()),
  },
  {
    accessorKey: 'visits',
    header: () => <span>Visits</span>,
  },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'progress', header: 'Profile Progress' },
]

function App() @{
  // 5. Store data with a stable reference
  const [data] = useState(() => [...defaultData])

  // 6. Create the table instance with required features, columns, and data
  const table = useTable(
    {
      debugTable: true, // optionally, enable console logging debug messages
      features, // new required option in V9. Tell the table which features you are importing and using (better tree-shaking)
      columns,
      data,
      // add additional table options here
    },
    (state) => state, // default selector
  )

  // 7. Render your table markup from the table instance APIs
  <div className="demo-root">
    <table>
      <thead>
        @for (const headerGroup of table.getHeaderGroups(); key headerGroup.id) {
          <tr>
            @for (const header of headerGroup.headers; key header.id) {
              <th>
                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
              </th>
            }
          </tr>
        }
      </thead>
      <tbody>
        @for (const row of table.getRowModel().rows; key row.id) {
          <tr>
            @for (const cell of row.getAllCells(); key cell.id) {
              <td><table.FlexRender cell={cell} /></td>
            }
          </tr>
        }
      </tbody>
      <tfoot>
        @for (const footerGroup of table.getFooterGroups(); key footerGroup.id) {
          <tr>
            @for (const header of footerGroup.headers; key header.id) {
              <th>
                {header.isPlaceholder ? null : <table.FlexRender footer={header} />}
              </th>
            }
          </tr>
        }
      </tfoot>
    </table>
    <div className="spacer-md" />
  </div>
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
createRoot(rootElement).render(App)
