# Pagination

- [Open this example in a new CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/pagination)
- `yarn` and `yarn start` to run and edit the example

## Guide

To add automatic client side pagination, use the `usePagination` hook:

```diff
// Import React
import React from 'react'

// Import React Table
import {
  useTable,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
+  usePagination,
} from 'react-table'

// Create a component to render your table
function MyTable(props) {
  // Use the useTable hook to create your table configuration
  const instance = useTable(
    props,
    useGroupBy,
    useFilters,
    useSortBy,
    useExpanded,
+   usePagination,
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    headerGroups,
    rows,
    getRowProps,
    prepareRow,
+   pageOptions,
+   page,
+   state: { pageIndex, pageSize },
+   gotoPage,
+   previousPage,
+   nextPage,
+   setPageSize,
+   canPreviousPage,
+   canNextPage,
  } = instance

  // Render the UI for your table
  return (
    <div>
      <table {...getTableProps()}>
        ...
      </table>
+     <div>
+       <button onClick={() => previousPage()} disabled={!canPreviousPage}>
+         Previous Page
+       </button>
+       <button onClick={() => nextPage()} disabled={!canNextPage}>
+         Next Page
+       </button>
+       <div>
+         Page{' '}
+         <em>
+           {pageIndex + 1} of {pageOptions.length}
+         </em>
+       </div>
+       <div>Go to page:</div>
+       <input
+         type="number"
+         defaultValue={pageIndex + 1 || 1}
+         onChange={e => {
+           const page = e.target.value ? Number(e.target.value) - 1 : 0
+           gotoPage(page)
+         }}
+       />
+       <select
+         value={pageSize}
+         onChange={e => {
+           setPageSize(Number(e.target.value))
+         }}
+       >
+         {pageSizeOptions.map(pageSize => (
+           <option key={pageSize} value={pageSize}>
+             Show {pageSize}
+           </option>
+         ))}
+       </select>
+     </div>
    </div>
  )
}
```
