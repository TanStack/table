import { createTableHook } from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'

// This example uses the new `createTableHook` method to create a re-usable table hook factory instead of independently using the standalone `useTable` hook and `createColumnHelper` method. You can choose to use either way.

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
    age: 28,
    visits: 100,
    status: 'Single',
    progress: 70,
  },
]

// 3. New in V9! Tell the table which features and row models we want to use. In this case, this will be a basic table with no additional features
const { createAppTable, createAppColumnHelper } = createTableHook({
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
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
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
    header: () => <span>Visits</span>,
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

export function App() {
  // 6. Store data with a stable reference
  const [data, setData] = createSignal([...defaultData])

  // Helper to rerender with sorted data (by age ascending)
  function rerender() {
    setData((prev) =>
      prev.slice().sort((a: Person, b: Person) => a.age - b.age),
    )
  }

  // 7. Create the table instance with the required columns and data.
  // Features and row models are already defined in the createTableHook call above
  const table = createAppTable({
    debugTable: true,
    columns,
    get data() {
      return data()
    },
    // add additional table options here or in the createTableHook call above
  })

  // 8. Render your table markup from the table instance APIs
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
                      <table.FlexRender header={header} />
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
                      <table.FlexRender cell={cell} />
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
                      <table.FlexRender footer={header} />
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
        Rerender (sort by age)
      </button>
    </div>
  )
}
