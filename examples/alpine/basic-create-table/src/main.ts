import Alpine from 'alpinejs'
import {
  FlexRender,
  createColumnHelper,
  createTable,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { Person } from './makeData'

// This example uses the standalone `createTable` function to create a table without the `createTableHook` util.

// 1. New in V9! Tell the table which features and row models we want to use. In this case, this will be a basic table with no additional features
const features = tableFeatures({}) // util method to create sharable TFeatures object/type

// 2. Create a column helper with the table features and row type
const columnHelper = createColumnHelper<typeof features, Person>()

// 3. Define the columns for your table with the column helper
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => Number(row.age), {
    id: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

// 4. Register the Alpine component. Store data in Alpine-reactive state so the
//    buttons can swap it out and the table re-renders.
Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(20) })

  // 5. Create the table instance with required features, columns, and data
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
