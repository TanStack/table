# Export Data

Automatic export can be accomplished by using the `useExportData` plugin hook.

- [Open this example in a new CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/export-data)
- Or, `yarn` and `yarn start` to run and edit the example

## Guide

Start by importing the hook from `react-table`:

```diff
-import { useTable } from 'react-table'
+import { useTable, useExportData } from 'react-table'
```

Next, add the `useExportData` hook to your `useTable` hook and add the necessary UI pieces to make exporting data work:

```diff
function MyTable() {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      data,
      columns,
    },
+   useExportData
  )

}
```
