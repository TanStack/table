import Alpine from 'alpinejs'
import { faker } from '@faker-js/faker'
import {
  FlexRender,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createTable,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { Column, ColumnDef } from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
})

const getCommonPinningStyles = (
  column: Column<typeof features, Person>,
): string => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  const boxShadow = isLastLeftPinnedColumn
    ? '-4px 0 4px -4px gray inset'
    : isFirstRightPinnedColumn
      ? '4px 0 4px -4px gray inset'
      : undefined

  const styles: Array<string> = []
  if (boxShadow) styles.push(`box-shadow: ${boxShadow}`)
  if (isPinned === 'left') styles.push(`left: ${column.getStart('left')}px`)
  if (isPinned === 'right') styles.push(`right: ${column.getAfter('right')}px`)
  styles.push(`opacity: ${isPinned ? '0.95' : '1'}`)
  styles.push(`position: ${isPinned ? 'sticky' : 'relative'}`)
  styles.push(`width: ${column.getSize()}px`)
  styles.push(`z-index: ${isPinned ? '1' : '0'}`)
  return styles.join('; ')
}

const defaultColumns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    id: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => '<span>Last Name</span>',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'age',
    id: 'age',
    header: 'Age',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'visits',
    id: 'visits',
    header: 'Visits',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'Status',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'progress',
    id: 'progress',
    header: 'Profile Progress',
    footer: (props) => props.column.id,
    size: 180,
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
    getCommonPinningStyles,
    refreshData() {
      local.data = makeData(20)
    },
    stressTest() {
      local.data = makeData(1_000)
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
