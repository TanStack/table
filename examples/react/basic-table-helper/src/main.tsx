import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { useTable } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import './index.css'

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

// 3. Define the features for your table. In this case, this will be a basic table with no additional features
const _features = {}

function App() {
  // 4. Define the columns for your table with a stable reference
  const columns = React.useMemo<Array<ColumnDef<typeof _features, Person>>>(
    () => [
      // accessorKey method (most common for simple use-cases)
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      // accessorFn used (alternative) along with a custom id
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => <i>{info.getValue<string>()}</i>,
        header: () => <span>Last Name</span>,
        footer: (info) => info.column.id,
      },
      // accessorFn used to transform the data
      {
        accessorFn: (row) => Number(row.age),
        id: 'age',
        header: () => 'Age',
        cell: (info) => info.getValue<number>(),
        footer: (info) => info.column.id,
      },
      {
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
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
    ],
    [],
  )

  // 5. Store data with a stable reference
  const [data, _setData] = React.useState(() => [...defaultData])
  const rerender = React.useReducer(() => ({}), {})[1]

  // 6. Create the table instance with the required columns and data.
  // Features and row models are defined in the useTable options
  const table = useTable({
    _features,
    columns,
    data,
    _rowModels: {}, // client-side row models. `Core` row model is now included by default, but you can still override it here
    debugTable: true,
  })

  // 7. Render your table markup from the table instance APIs
  return (
    <div className="p-2">
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
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
