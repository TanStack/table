import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import './index.css'

type Product = {
  id: number
  name: string
  price: number | null | undefined
  stock: number | null
  category: string
  description: string
}

const defaultData: Product[] = [
  {
    id: 1,
    name: 'Laptop',
    price: 999,
    stock: 10,
    category: 'Electronics',
    description: 'High-performance laptop',
  },
  {
    id: 2,
    name: 'Mouse',
    price: 25,
    stock: null,
    category: 'Electronics',
    description: '',
  },
  {
    id: 3,
    name: 'Keyboard',
    price: null,
    stock: 5,
    category: 'Electronics',
    description: 'Mechanical keyboard',
  },
  {
    id: 4,
    name: 'Monitor',
    price: 399,
    stock: undefined,
    category: 'Electronics',
    description: '4K display',
  },
  {
    id: 5,
    name: 'Desk',
    price: undefined,
    stock: 2,
    category: 'Furniture',
    description: 'Standing desk',
  },
  {
    id: 6,
    name: 'Chair',
    price: 199,
    stock: 0,
    category: 'Furniture',
    description: 'Ergonomic chair',
  },
  {
    id: 7,
    name: 'Webcam',
    price: 89,
    stock: 15,
    category: 'Electronics',
    description: '',
  },
  {
    id: 8,
    name: 'Headphones',
    price: 150,
    stock: null,
    category: 'Electronics',
    description: 'Noise-cancelling',
  },
  {
    id: 9,
    name: 'Tablet',
    price: 299,
    stock: 8,
    category: 'Electronics',
    description: '   ',
  },
  {
    id: 10,
    name: 'Bookshelf',
    price: 75,
    stock: undefined,
    category: 'Furniture',
    description: 'Wooden bookshelf',
  },
]

const columnHelper = createColumnHelper<Product>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    size: 60,
  }),
  columnHelper.accessor('name', {
    header: 'Product Name',
    size: 150,
  }),
  columnHelper.accessor('price', {
    header: 'Price ($)',
    sortEmpty: 'last', // NEW: Empty values go to bottom
    cell: info => {
      const value = info.getValue()
      return value != null ? `$${value}` : '-'
    },
    size: 100,
  }),
  columnHelper.accessor('stock', {
    header: 'Stock',
    sortEmpty: 'last',
    cell: info => {
      const value = info.getValue()
      return value != null ? value.toString() : 'N/A'
    },
    size: 80,
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    size: 120,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    sortEmpty: 'last',
    isEmptyValue: value =>
      !value || (typeof value === 'string' && value.trim() === ''),
    cell: info => {
      const value = info.getValue()
      return value && value.trim() ? value : '(No description)'
    },
    size: 200,
  }),
]

function App() {
  const [data] = React.useState(() => [...defaultData])
  const [sorting, setSorting] = React.useState([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="app">
      <div className="header">
        <h1>Excel-like Sorting with sortEmpty</h1>
        <p>
          This example shows the new <code>sortEmpty</code> option. Click column
          headers to sort. null/undefined/empty values always appear at the
          bottom.
        </p>
        <div className="features">
          <h3>Key Features:</h3>
          <ul>
            <li>
              <strong>Price & Stock:</strong> null and undefined values are
              sorted to the bottom
            </li>
            <li>
              <strong>Description:</strong> empty strings and strings with only
              whitespace are sorted to the bottom
            </li>
            <li>
              <strong>Excel-like behavior:</strong> empty values always appear
              at the bottom regardless of sort direction
            </li>
          </ul>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getCanSort() ? 'sortable' : ''}
                  >
                    <div className="header-content">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="sort-indicator">
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="info">
        <h3>Sorting State:</h3>
        <pre>{JSON.stringify(sorting, null, 2)}</pre>

        <div className="comparison">
          <h3>Comparison of sortUndefined vs sortEmpty:</h3>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>sortUndefined</th>
                <th>sortEmpty (new)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Values processed</td>
                <td>undefined only</td>
                <td>null, undefined, empty strings</td>
              </tr>
              <tr>
                <td>Custom empty values</td>
                <td>❌</td>
                <td>✅ isEmptyValue function</td>
              </tr>
              <tr>
                <td>Options</td>
                <td>false, -1, 1, 'first', 'last'</td>
                <td>false, 'first', 'last'</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>⚠️ Deprecated</td>
                <td>✅ Recommended</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
