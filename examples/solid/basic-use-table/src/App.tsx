import { createTable, FlexRender, tableFeatures } from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import type { ColumnDef } from '@tanstack/solid-table'

// This example uses the standalone `createTable` function to create a table without the `createTableHook` util.

// 1. Define what the shape of your data will be for each row
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

// 2. Create some dummy data with a stable reference (this could be an API response stored in createSignal or similar)
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
const _features = tableFeatures({}) // util method to create sharable TFeatures object/type

// 4. Define the columns for your table. This uses the new `ColumnDef` type to define columns. Alternatively, check out the createTableHook/createAppColumnHelper util for an even more type-safe way to define columns.
const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName', // accessorKey method (most common for simple use-cases)
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName, // accessorFn used (alternative) along with a custom id
    id: 'lastName',
    header: () => <span>Last Name</span>,
    cell: (info) => <i>{info.getValue<string>()}</i>,
  },
  {
    accessorFn: (row) => Number(row.age), // accessorFn used to transform the data
    id: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
  },
  {
    accessorKey: 'visits',
    header: () => <span>Visits</span>,
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

function App() {
  // 5. Store data with a reactive reference
  const [data, setData] = createSignal([...defaultData])
  const rerender = () => setData([...defaultData])

  // 6. Create the table instance with required _features, columns, and data
  const table = createTable({
    debugTable: true,
    _features, // new required option in V9. Tell the table which features you are importing and using (better tree-shaking)
    _rowModels: {}, // `Core` row model is now included by default, but you can still override it here
    columns,
    get data() {
      return data()
    },
  })

  // 7. Render your table markup from the table instance APIs
  return (
    <div class="p-2">
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th>
                      {header.isPlaceholder ? null : (
                        <FlexRender header={header} />
                      )}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr>
                <For each={row.getAllCells()}>
                  {(cell) => (
                    <td>
                      <FlexRender cell={cell} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
        <tfoot>
          <For each={table.getFooterGroups()}>
            {(footerGroup) => (
              <tr>
                <For each={footerGroup.headers}>
                  {(header) => (
                    <th>
                      {header.isPlaceholder ? null : (
                        <FlexRender footer={header} />
                      )}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tfoot>
      </table>
      <div class="h-4" />
      <button onClick={rerender} class="border p-2">
        Rerender
      </button>
    </div>
  )
}

export default App
