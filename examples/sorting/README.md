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
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      data,
      columns,
    },
-   useSortBy
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
      <tbody>
        {rows.map(
          (row, i) =>
            prepareRow(row) || (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
        )}
      </tbody>
    </table>
  )
}
```
