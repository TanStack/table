# Quick Start

As explained in the [Concepts](./concepts.md) document, react-table is a headless tool, meaning you'll have to build your own UI. We recognize this can be potentially daunting, so here's a very basic table to start with.

## Define Row Shape

When thinking about a table, you typically have a number of rows split into a number of columns. While table configurations can get far more complex with nested columns, subrows, etc. for this basic quick start, we need to define some data. Note that this data must be defined using [`React.useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) in order to take advantage of the power of memoization.

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

## Define Columns

The first step to using react-table is to create a set of column definitions to pass into the `useTable` hook. These columns must be defined using `React.useMemo` in order to take advantage of the power of memoization.

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

## Implement `useTable` hook

Now that you have the basic `columns` and `data` defined, you can pass those into `useTable` and retrieve the properties you need.

```js
const {
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
} = useTable({ columns, data })
```

If you're new to JavaScript (especially ES2015+), this syntax may look a little strange. The lefthand side of the assigment is using [object destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to extract the properties we need that are returned from the `useTable` hook (or function). On the right hand side, at a minimum, `useTable` needs to be provided with an object containing the memoized columns and data that we created above.

## Build a basic UI structure

OK, so that's great, we've implemented the hook, but we still don't have a table to show, right? Let's use the properties returned from `useTable` to build a basic table structure.

```js
return (
  <table {...getTableProps()}>
    <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
              return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
            })}
          </tr>
        )
      })}
    </tbody>
  </table>
)
```

Again, if you're relatively new to JavaScript (or ES2015+ syntax), you may wonder, "What is with all the ...s?". This is the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) that _spreads_ all properties of an object (or array) without having to manually extract them all. So, with the first row, `<table {...getRowProps()}>` will return a `table` element with all of the properties returned by `getTableProps()`.

## Final Result

If we put all of this together, we should get a very basic (boring) table. (_Styles added just to make it a little more attractive..._)

```js
import { Playground } from 'docz'
import { useTable } from '../src/hooks/useTable'
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
