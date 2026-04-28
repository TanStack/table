import { createTableHook } from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { Person } from './makeData'

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
  const [data, setData] = createSignal(makeData(20))

  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))

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
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1k rows)</button>
      </div>
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
    </div>
  )
}
