# Sorting

Automatic sorting can be accomplished by using the `useSortBy` plugin hook.

- [Open this example in a new CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/sorting)
- Or, `yarn` and `yarn start` to run and edit the example

## Guide

Start by importing the hook from `react-table`:

```diff
-import { useTable } from 'react-table'
+import { useTable, useSortBy } from 'react-table'
```

Next, add the `useSortBy` hook to your `useTable` hook and add the necessary UI pieces we need to make sorting work:

```diff
function MyTable() {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      data,
      columns,
    },
+   useSortBy
  )

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
-             <th {...column.getHeaderProps()}>
+             <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
+               <span>
+                 {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
+               </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(
          (row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )}
        )}
      </tbody>
    </table>
  )
}
```

By default, the sorting will be `alphanumeric`. This can be changed in your `column` object.
Other options include `basic` and `datetime`.
Note that if you're planning on sorting numbers between 0 and 1, `basic` sorting will be more accurate.

More information can be found in the [API Docs](https://react-table.tanstack.com/docs/api/useSortBy)

```diff
const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
+           sortType: 'basic'
          },
          {
            Header: 'Visits',
            accessor: 'visits',
+           sortType: 'basic'
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
+           sortType: 'basic'
          },
        ],
      },
    ],
    []
  )
```
