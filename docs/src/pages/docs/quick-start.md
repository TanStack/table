---
id: quick-start
title: Quick Start
---

At the heart of every React Table is the `useTable` hook and the table `instance` object that it returns. This `instance` object contains everything you'll need to build a table and interact with its state. This includes, but is not limited to:

- Columns
- Materialized Data
- Sorting
- Filtering
- Grouping
- Pagination
- Expanded State
- Any functionality provided by custom plugin hooks, too!

In React Table, **you the developer** are responsible for rendering the UI (markup and styles) of your table, but don't let that intimidate you! Table UIs are fun and React Table exists to make the process much easier to wire up your own table UI.

To show you how this works. Let's start with a very basic table example.

## Getting your data

When thinking about a table structure, you typically have **rows** which contain **columns**. While table configurations can get far more complex with nested columns, subrows, etc. for this basic quick start, we need to define some data that resembles this structure.

```js
const data = React.useMemo(
  () => [
    {
      col1: 'Hello',
      col2: 'World',
    },
    {
      col1: 'react-table',
      col2: 'rocks',
    },
    {
      col1: 'whatever',
      col2: 'you want',
    },
  ],
  []
)
```

> It's important that we're using [`React.useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) here to ensure that our data isn't recreated on every render. If we didn't use `React.useMemo`, the table would think it was receiving new data on every render and attempt to recalculate a lot of logic every single time. Not cool!

## Define Columns

Now that we have some data, let's create a set of **column definitions** to pass into the `useTable` hook.

```js
const columns = React.useMemo(
  () => [
    {
      Header: 'Column 1',
      accessor: 'col1', // accessor is the "key" in the data
    },
    {
      Header: 'Column 2',
      accessor: 'col2',
    },
  ],
  []
)
```

> Again, we're using `React.useMemo` so React Table doesn't recalculate the universe on every single render. Only when the memoized value actually changes!

## Using the `useTable` hook

Now that you have some data and columns defined, we can pass those into the `useTable` hook to create a table instance.

```js
const tableInstance = useTable({ columns, data })
```

> `useTable` at the very least needs to be provided with an object containing the memoized `columns` and `data`.

## Building a basic table UI

Nice! We have our table instance and we're almost there! However, we still don't have any table markup or styles to show, right?

Let's build a basic table structure using just HTML for now:

```js
return (
  <table>
    <thead>
      <tr>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td></td>
      </tr>
    </tbody>
  </table>
)
```

## Applying the table instance to markup

Now that we have our table structure, we can use the `tableInstance` to make it come to life!

```js
const tableInstance = useTable({ columns, data })

const {
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
} = tableInstance

return (
  // apply the table props
  <table {...getTableProps()}>
    <thead>
      {// Loop over the header rows
      headerGroups.map(headerGroup => (
        // Apply the header row props
        <tr {...headerGroup.getHeaderGroupProps()}>
          {// Loop over the headers in each row
          headerGroup.headers.map(column => (
            // Apply the header cell props
            <th {...column.getHeaderProps()}>
              {// Render the header
              column.render('Header')}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    {/* Apply the table body props */}
    <tbody {...getTableBodyProps()}>
      {// Loop over the table rows
      rows.map(row => {
        // Prepare the row for display
        prepareRow(row)
        return (
          // Apply the row props
          <tr {...row.getRowProps()}>
            {// Loop over the rows cells
            row.cells.map(cell => {
              // Apply the cell props
              return (
                <td {...cell.getCellProps()}>
                  {// Render the cell contents
                  cell.render('Cell')}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  </table>
)
```

## Final Result

If we put all of this together, we should get a very basic (as well as temporarily ugly) table.

```js
import { useTable } from 'react-table'

function App() {
  const data = React.useMemo(
    () => [
      {
        col1: 'Hello',
        col2: 'World',
      },
      {
        col1: 'react-table',
        col2: 'rocks',
      },
      {
        col1: 'whatever',
        col2: 'you want',
      },
    ],
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Column 1',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Column 2',
        accessor: 'col2',
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: 'solid 3px red',
                  background: 'aliceblue',
                  color: 'black',
                  fontWeight: 'bold',
                }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'papayawhip',
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
```

Clearly this isn't ready to ship, but from a conceptual standpoint, you just learned the basics of using React Table!
