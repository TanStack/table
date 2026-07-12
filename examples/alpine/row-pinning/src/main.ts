import Alpine from 'alpinejs'
import {
  FlexRender,
  columnFilteringFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTable,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { Column, ColumnDef, Row } from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  rowPinningFeature,
  rowExpandingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
})

// The `pin` column (pin buttons) and the `firstName` cell (expander + value)
// render interactive controls directly in `index.html`, because Alpine cannot
// process directives inside `x-html`. Those columns expose plain values here.
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    id: 'pin',
    header: () => 'Pin',
    cell: () => '',
  },
  {
    accessorKey: 'firstName',
    header: () => 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
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
]

type PersonColumn = Column<typeof features, Person>

// Sticky offset styling for a pinned row (mirrors the Lit renderPinnedRow).
function pinnedRowStyle(
  row: Row<typeof features, Person>,
  bottomCount: number,
) {
  const isPinnedTop = row.getIsPinned() === 'top'
  let style = 'background-color:lightblue;position:sticky;'
  if (isPinnedTop) {
    style += `top:${row.getPinnedIndex() * 26 + 48}px`
  } else {
    style += `bottom:${(bottomCount - 1 - row.getPinnedIndex()) * 26}px`
  }
  return style
}

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(1_000, 2, 2) })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    initialState: {
      pagination: { pageSize: 20, pageIndex: 0 },
    },
    getSubRows: (row) => row.subRows,
    keepPinnedRows: true,
    // atoms: { rowPinning: rowPinningAtom }, // preferred: own pinning state with an external atom
    // state: { rowPinning }, // classic controlled state; pair with onRowPinningChange
    // onRowPinningChange: setRowPinning,
    // enableRowPinning: row => row.original.age > 18, // allow pinning only for matching rows; default true
    debugTable: true,
    debugAll: true,
  })

  return {
    table,
    FlexRender,
    pinnedRowStyle,
    isNumberColumn(column: PersonColumn) {
      const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)
      return typeof firstValue === 'number'
    },
    setTextFilter(column: PersonColumn, value: string) {
      column.setFilterValue(value)
    },
    rangeValue(column: PersonColumn, index: 0 | 1) {
      return (
        (column.getFilterValue() as [unknown, unknown] | undefined)?.[index] ??
        ''
      )
    },
    setRangeMin(column: PersonColumn, value: string) {
      column.setFilterValue((old: [unknown, unknown] | undefined) => [
        value,
        old?.[1],
      ])
    },
    setRangeMax(column: PersonColumn, value: string) {
      column.setFilterValue((old: [unknown, unknown] | undefined) => [
        old?.[0],
        value,
      ])
    },
    goToPage(value: string) {
      table.setPageIndex(value ? Number(value) - 1 : 0)
    },
    refreshData() {
      local.data = makeData(1_000, 2, 2)
    },
    stressTest() {
      local.data = makeData(200_000, 2, 2)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
