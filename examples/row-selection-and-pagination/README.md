# Row Selection and Pagination

- [Open this example in a new CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/row-selection-and-pagination)
- `yarn` and `yarn start` to run and edit the example

## Guide

To use `useRowSelect` and `usePagination` together (NOTE that `usePagination` goes first!):

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
+  useRowSelect,
} from 'react-table'

+ const IndeterminateCheckbox = React.forwardRef(
+   ({ indeterminate, ...rest }, ref) => {
+     const defaultRef = React.useRef()
+     const resolvedRef = ref || defaultRef
+
+     React.useEffect(() => {
+       resolvedRef.current.indeterminate = indeterminate
+     }, [resolvedRef, indeterminate])
+
+     return (
+       <>
+         <input type="checkbox" ref={resolvedRef} {...rest} />
+       </>
+     )
+   }
+ )

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
+   useRowSelect
+   hooks => {
+     hooks.visibleColumns.push(columns => [
+       {
+         id: 'selection',
+         Header: ({ getToggleAllPageRowsSelectedProps }) => (
+           <div>
+             <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
+           </div>
+         ),
+         Cell: ({ row }) => (
+           <div>
+             <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
+           </div>
+         ),
+       },
+       ...columns,
+     ])
+   }
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
