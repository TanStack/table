import Alpine from 'alpinejs'
import { FlexRender, createTable, tableFeatures } from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { ColumnDef } from '@tanstack/alpine-table'
import type { Person } from './makeData'

// This example uses the standalone `createTable` function to create a table without the `createTableHook` util.

// 1. New in V9! Tell the table which features and row models we want to use. In this case, this will be a basic table with no additional features
const features = tableFeatures({}) // util method to create sharable TFeatures object/type

// 4. Define the columns for your table. This uses the new `ColumnDef` type to define columns.
//    Alternatively, check out the createTableHook/createAppColumnHelper util for an even more type-safe way to define columns.
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName', // accessorKey method (most common for simple use-cases)
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName, // accessorFn used (alternative) along with a custom id
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => Number(row.age), // accessorFn used to transform the data
    id: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
  },
  {
    accessorKey: 'visits',
    header: () => 'Visits',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
  },
]

// 5. Register the Alpine component. Store data in Alpine-reactive state so the
//    buttons can swap it out and the table re-renders.
Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(20) })

  // 6. Create the table instance with required features, columns, and data
  const table = createTable({
    debugTable: true, // optionally, enable console logging debug messages
    features, // new required option in V9. Tell the table which features you are importing and using (better tree-shaking)
    columns,
    get data() {
      return local.data
    },
    // add additional table options here
  })

  return {
    table,
    FlexRender, // exposed so the template can call it inside `x-html`
    refreshData() {
      local.data = makeData(20)
    },
    stressTest() {
      local.data = makeData(1_000)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
