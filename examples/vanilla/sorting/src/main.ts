import './index.css'
import {
  constructTable,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/table-core'
import { FlexRender } from '@tanstack/table-core/flex-render'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'
import { makeData } from './makeData'
import type { SortFn } from '@tanstack/table-core'
import type { Person } from './makeData'

let data = makeData(1_000)

const _features = tableFeatures({
  rowSortingFeature,
  coreReativityFeature: storeReactivityBindings(),
})

// Custom sorting logic for one of our enum columns
const sortStatusFn: SortFn<any, any> = (rowA, rowB, _columnId) => {
  const statusA = rowA.original.status
  const statusB = rowB.original.status
  const statusOrder = ['single', 'complicated', 'relationship']
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
}

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    // This column will sort in ascending order by default since it is a string column
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => `<i>${info.getValue()}</i>`,
    header: () => '<span>Last Name</span>',
    sortUndefined: 'last', // Force undefined values to the end
    sortDescFirst: false, // First sort order will be ascending (nullable values can mess up auto detection of sort order)
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    // This column will sort in descending order by default since it is a number column
  }),
  columnHelper.accessor('visits', {
    header: () => '<span>Visits</span>',
    sortUndefined: 'last', // Force undefined values to the end
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    sortFn: sortStatusFn, // Use our custom sorting function for this enum column
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    enableSorting: false, // Disable sorting for this column
  }),
  columnHelper.accessor('rank', {
    header: 'Rank',
    invertSorting: true, // Invert the sorting order (golf score-like where smaller is better)
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
  }),
])

const renderTable = () => {
  // Create buttons container
  const buttonsDiv = document.createElement('div')

  const regenerateBtn = document.createElement('button')
  regenerateBtn.textContent = 'Regenerate Data'
  regenerateBtn.addEventListener('click', () => {
    data = makeData(1_000)
    table.setOptions((prev) => ({ ...prev, data }))
  })

  const stressTestBtn = document.createElement('button')
  stressTestBtn.textContent = 'Stress Test (500k rows)'
  stressTestBtn.addEventListener('click', () => {
    data = makeData(500_000)
    table.setOptions((prev) => ({ ...prev, data }))
  })

  buttonsDiv.appendChild(regenerateBtn)
  buttonsDiv.appendChild(stressTestBtn)

  // Create table elements
  const tableElement = document.createElement('table')
  const theadElement = document.createElement('thead')
  const tbodyElement = document.createElement('tbody')

  tableElement.classList.add('table-spacer')

  tableElement.appendChild(theadElement)
  tableElement.appendChild(tbodyElement)

  // Render table headers
  table.getHeaderGroups().forEach((headerGroup) => {
    const trElement = document.createElement('tr')
    headerGroup.headers.forEach((header) => {
      const thElement = document.createElement('th')
      thElement.colSpan = header.colSpan
      const divElement = document.createElement('div')
      divElement.classList.add(
        'w-36',
        ...(header.column.getCanSort()
          ? ['sortable-header', 'sortable-header']
          : []),
      )
      ;((divElement.onclick = (e) =>
        header.column.getToggleSortingHandler()?.(e)),
        (divElement.innerHTML = header.isPlaceholder
          ? ''
          : String(FlexRender({ header }) ?? '')))
      divElement.innerHTML +=
        {
          asc: ' 🔼',
          desc: ' 🔽',
        }[header.column.getIsSorted() as string] ?? ''
      thElement.appendChild(divElement)
      trElement.appendChild(thElement)
    })
    theadElement.appendChild(trElement)
  })

  // Render table rows
  table
    .getRowModel()
    .rows.slice(0, 10)
    .forEach((row) => {
      const trElement = document.createElement('tr')
      row.getAllCells().forEach((cell) => {
        const tdElement = document.createElement('td')
        tdElement.innerHTML = String(FlexRender({ cell }) ?? '')
        trElement.appendChild(tdElement)
      })
      tbodyElement.appendChild(trElement)
    })

  // Render table state info
  const stateInfoElement = document.createElement('pre')
  stateInfoElement.textContent = JSON.stringify(
    {
      sorting: table.store.state.sorting,
    },
    null,
    2,
  )

  // Clear previous content and append new content
  const wrapperElement = document.getElementById('wrapper') as HTMLDivElement
  wrapperElement.innerHTML = ''
  wrapperElement.appendChild(buttonsDiv)
  wrapperElement.appendChild(tableElement)
  wrapperElement.appendChild(stateInfoElement)
}

const table = constructTable({
  _features,
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
  },
  data,
  columns,
  debugTable: true,
})

table.store.subscribe(() => renderTable())

renderTable()
