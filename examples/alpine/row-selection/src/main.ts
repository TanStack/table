import Alpine from 'alpinejs'
import {
  FlexRender,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTable,
  filterFns,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { ColumnDef } from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  rowSelectionFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
})

// The `select` column renders interactive checkboxes in its header (select-all)
// and cells (per-row). Because Alpine cannot process directives inside `x-html`,
// those checkboxes are rendered directly in `index.html` (special-cased by
// column id), so here the column just exposes a plain value.
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    id: 'select',
    header: () => '',
    cell: () => '',
  },
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
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: 'Full Name',
    cell: (info) => info.getValue(),
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
]

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(50_000) })

  const table = createTable(
    {
      features,
      columns,
      get data() {
        return local.data
      },
      enableRowSelection: true,
      debugTable: true,
    },
    (state) => state, // default selector
  )

  return {
    table,
    FlexRender,
    refreshData() {
      local.data = makeData(50_000)
    },
    stressTest() {
      local.data = makeData(1_000_000)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
