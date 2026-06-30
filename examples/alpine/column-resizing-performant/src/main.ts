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
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
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
    ],
  },
  {
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
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
    ],
  },
]

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(200) })

  const table = createTable(
    {
      features,
      columns,
      get data() {
        return local.data
      },
      defaultColumn: { minSize: 60, maxSize: 800 },
      columnResizeMode: 'onChange',
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
    (state) => state, // default selector
  )

  return {
    table,
    FlexRender,
    local,
    // Compute CSS variables for column sizes. Reading columnSizingInfo keeps
    // this reactive so the variables recompute while a column is being resized.
    columnSizeVars(): string {
      // touch the resizing state so Alpine tracks it as a dependency
      void table.state.columnResizing.columnSizingStart
      const headers = table.getFlatHeaders()
      const styles: Array<string> = []
      for (const header of headers) {
        styles.push(`--header-${header.id}-size:${header.getSize()}`)
        styles.push(`--col-${header.column.id}-size:${header.column.getSize()}`)
      }
      styles.push(`width:${table.getTotalSize()}px`)
      return styles.join(';')
    },
    refreshData() {
      local.data = makeData(200)
    },
    stressTest() {
      local.data = makeData(2_000)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
