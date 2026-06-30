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
import type {
  ColumnDef,
  ColumnResizeDirection,
  ColumnResizeMode,
} from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  columnResizingFeature,
  columnSizingFeature,
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
  const local = Alpine.reactive({
    data: makeData(10),
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
  }) as {
    data: Array<Person>
    columnResizeMode: ColumnResizeMode
    columnResizeDirection: ColumnResizeDirection
  }

  const table = createTable(
    {
      features,
      columns,
      get data() {
        return local.data
      },
      get columnResizeMode() {
        return local.columnResizeMode
      },
      get columnResizeDirection() {
        return local.columnResizeDirection
      },
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
    // Translate the resizer while dragging when using the "onEnd" resize mode.
    resizerTransform(header: any) {
      if (local.columnResizeMode === 'onEnd' && header.column.getIsResizing()) {
        const delta = table.state.columnResizing.deltaOffset ?? 0
        const dir = local.columnResizeDirection === 'rtl' ? -1 : 1
        return `transform: translateX(${dir * delta}px)`
      }
      return ''
    },
    refreshData() {
      local.data = makeData(10)
    },
    stressTest() {
      local.data = makeData(100)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
