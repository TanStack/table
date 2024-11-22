// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import './index.css'
// import {
//   createSortedRowModel,
//   flexRender,
//   rowSortingFeature,
//   sortFns,
//   tableFeatures,
//   useTable,
// } from '@tanstack/react-table'
// import { makeData } from './makeData'
// import type { ColumnDef, SortingFn, SortingState } from '@tanstack/react-table'
// import type { Person } from './makeData'

// const _features = tableFeatures({
//   rowSortingFeature,
// })

// // custom sorting logic for one of our enum columns
// const sortStatusFn: SortingFn<typeof _features, Person> = (
//   rowA,
//   rowB,
//   _columnId,
// ) => {
//   const statusA = rowA.original.status
//   const statusB = rowB.original.status
//   const statusOrder = ['single', 'complicated', 'relationship']
//   return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
// }

// function App() {
//   const rerender = React.useReducer(() => ({}), {})[1]

//   // optionally, manage sorting state in your own state management
//   const [sorting, setSorting] = React.useState<SortingState>([])

//   const columns = React.useMemo<Array<ColumnDef<typeof _features, Person>>>(
//     () => [
//       {
//         accessorKey: 'firstName',
//         cell: (info) => info.getValue(),
//         // this column will sort in ascending order by default since it is a string column
//       },
//       {
//         accessorFn: (row) => row.lastName,
//         id: 'lastName',
//         cell: (info) => info.getValue(),
//         header: () => <span>Last Name</span>,
//         sortUndefined: 'last', // force undefined values to the end
//         sortDescFirst: false, // first sort order will be ascending (nullable values can mess up auto detection of sort order)
//       },
//       {
//         accessorKey: 'age',
//         header: () => 'Age',
//         // this column will sort in descending order by default since it is a number column
//       },
//       {
//         accessorKey: 'visits',
//         header: () => <span>Visits</span>,
//         sortUndefined: 'last', // force undefined values to the end
//       },
//       {
//         accessorKey: 'status',
//         header: 'Status',
//         sortingFn: sortStatusFn, // use our custom sorting function for this enum column
//       },
//       {
//         accessorKey: 'progress',
//         header: 'Profile Progress',
//         // enableSorting: false, //disable sorting for this column
//       },
//       {
//         accessorKey: 'rank',
//         header: 'Rank',
//         invertSorting: true, // invert the sorting order (golf score-like where smaller is better)
//       },
//       {
//         accessorKey: 'createdAt',
//         header: 'Created At',
//         // sortingFn: 'datetime' //make sure table knows this is a datetime column (usually can detect if no null values)
//       },
//     ],
//     [],
//   )

//   const [data, setData] = React.useState(() => makeData(1_000))
//   const refreshData = () => setData(() => makeData(100_000)) // stress test with 100k rows

//   const table = useTable({
//     _features,
//     _rowModelFns: {
//       sortFns,
//     },
//     _rowModels: {
//       sortedRowModel: createSortedRowModel(), // client-side sorting
//     },
//     columns,
//     data,
//     debugTable: true,
//     onSortingChange: setSorting, // optionally control sorting state in your own scope for easy access
//     // sortFns: {
//     //   sortStatusFn, //or provide our custom sorting function globally for all columns to be able to use
//     // },
//     // no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
//     state: {
//       sorting,
//     },
//     // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
//     // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
//     // enableSorting: false, // - default on/true
//     // enableSortingRemoval: false, //Don't allow - default on/true
//     // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
//     // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
//   })

//   return (
//     <div className="p-2">
//       <div className="h-2" />
//       <table>
//         <thead>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => {
//                 return (
//                   <th key={header.id} colSpan={header.colSpan}>
//                     {header.isPlaceholder ? null : (
//                       <div
//                         className={
//                           header.column.getCanSort()
//                             ? 'cursor-pointer select-none'
//                             : ''
//                         }
//                         onClick={header.column.getToggleSortingHandler()}
//                         title={
//                           header.column.getCanSort()
//                             ? header.column.getNextSortingOrder() === 'asc'
//                               ? 'Sort ascending'
//                               : header.column.getNextSortingOrder() === 'desc'
//                                 ? 'Sort descending'
//                                 : 'Clear sort'
//                             : undefined
//                         }
//                       >
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext(),
//                         )}
//                         {{
//                           asc: ' 🔼',
//                           desc: ' 🔽',
//                         }[header.column.getIsSorted() as string] ?? null}
//                       </div>
//                     )}
//                   </th>
//                 )
//               })}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {table
//             .getRowModel()
//             .rows.slice(0, 10)
//             .map((row) => {
//               return (
//                 <tr key={row.id}>
//                   {row.getAllCells().map((cell) => {
//                     return (
//                       <td key={cell.id}>
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext(),
//                         )}
//                       </td>
//                     )
//                   })}
//                 </tr>
//               )
//             })}
//         </tbody>
//       </table>
//       <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
//       <div>
//         <button onClick={() => rerender()}>Force Rerender</button>
//       </div>
//       <div>
//         <button onClick={() => refreshData()}>Refresh Data</button>
//       </div>
//       <pre>{JSON.stringify(sorting, null, 2)}</pre>
//     </div>
//   )
// }

// const rootElement = document.getElementById('root')

// if (!rootElement) throw new Error('Failed to find the root element')

// ReactDOM.createRoot(rootElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

import {
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHelper,
  filterFns,
  sortFns,
  aggregationFns,
  stockFeatures, // Import all TanStack Table Features (Just like V8 used to)
} from '@tanstack/react-table'

export const useReactTable = createTableHelper({
  _features: stockFeatures, // all features
  _rowModels: {
    sortedRowModel: createSortedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    groupedRowModel: createGroupedRowModel(),
    expandedRowModel: createExpandedRowModel(),
  },
  _rowModelFns: {
    sortFns,
    filterFns,
    aggregationFns,
  },
}).useTable

// test

const table = useReactTable({
  data: makeData(100_000),
})
