import Alpine from 'alpinejs'
import { faker } from '@faker-js/faker'
import {
  FlexRender,
  columnOrderingFeature,
  columnVisibilityFeature,
  createTable,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { ColumnDef } from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  columnOrderingFeature,
  columnVisibilityFeature,
})

const defaultColumns: Array<ColumnDef<typeof features, Person>> = [
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
        header: 'More Info',
        columns: [
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
    ],
  },
]

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(20) })

  const table = createTable(
    {
      features,
      columns: defaultColumns,
      get data() {
        return local.data
      },
      debugTable: true,
    },
    (state) => state, // default selector
  )

  return {
    table,
    FlexRender,
    refreshData() {
      local.data = makeData(20)
    },
    stressTest() {
      local.data = makeData(1_000)
    },
    reset() {
      table.setColumnOrder([])
      table.setColumnVisibility({})
    },
    randomizeColumns() {
      table.setColumnOrder(
        faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
      )
    },
  }
})

window.Alpine = Alpine
Alpine.start()
