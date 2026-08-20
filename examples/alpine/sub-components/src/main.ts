import Alpine from 'alpinejs'
import {
  FlexRender,
  createExpandedRowModel,
  createTable,
  rowExpandingFeature,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { ColumnDef, Row } from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
})

// The `expander` column renders an interactive expand button, and the
// `firstName` cell renders a depth-indented value. Because Alpine cannot process
// directives inside `x-html`, those are rendered directly in `index.html`
// (special-cased by column id), so here those columns expose plain values.
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    id: 'expander',
    header: () => '',
    cell: () => '',
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => '<span>Last Name</span>',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'visits',
    header: () => '<span>Visits</span>',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    footer: (props) => props.column.id,
  },
]

// Renders the expanded detail panel for a row (mirrors the Lit sub-component).
function renderSubComponent(row: Row<typeof features, Person>) {
  return `<pre style="font-size:10px"><code>${JSON.stringify(
    row.original,
    null,
    2,
  )}</code></pre>`
}

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(10, 5) })

  const table = createTable({
    debugTable: true,
    features,
    columns,
    get data() {
      return local.data
    },
    getRowCanExpand: () => true,
  })

  return {
    table,
    FlexRender,
    renderSubComponent,
    refreshData() {
      local.data = makeData(10, 5)
    },
    stressTest() {
      local.data = makeData(100, 5)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
