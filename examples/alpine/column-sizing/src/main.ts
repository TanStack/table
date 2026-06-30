import Alpine from 'alpinejs'
import {
  FlexRender,
  columnResizingFeature,
  columnSizingFeature,
  createTable,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { ColumnDef } from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})

const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => '<span>Last Name</span>',
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
  },
  {
    accessorKey: 'visits',
    header: () => '<span>Visits</span>',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
  },
  {
    accessorKey: 'rank',
    header: 'Rank',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
]

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(1_000) })

  const table = createTable(
    {
      features,
      columns,
      get data() {
        return local.data
      },
      columnResizeMode: 'onChange',
      columnResizeDirection: 'ltr',
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
    (state) => state, // default selector
  )

  return {
    table,
    FlexRender,
    refreshData() {
      local.data = makeData(1_000)
    },
    stressTest() {
      local.data = makeData(1_000_000)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
