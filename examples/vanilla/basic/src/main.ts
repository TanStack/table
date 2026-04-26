import './index.css'
import {
  constructTable,
  createColumnHelper,
  tableFeatures,
} from '@tanstack/table-core'
import { FlexRender } from '@tanstack/table-core/flex-render'
import { makeData } from './makeData'
import type { Person } from './makeData'

let data = makeData(1_000)

const _features = tableFeatures({})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => `<i>${info.getValue()}</i>`,
    header: () => '<span>Last Name</span>',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => '<span>Visits</span>',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (info) => info.column.id,
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
  stressTestBtn.textContent = 'Stress Test (100k rows)'
  stressTestBtn.addEventListener('click', () => {
    data = makeData(100_000)
    table.setOptions((prev) => ({ ...prev, data }))
  })

  buttonsDiv.appendChild(regenerateBtn)
  buttonsDiv.appendChild(stressTestBtn)

  // Create table elements
  const tableElement = document.createElement('table')
  const theadElement = document.createElement('thead')
  const tbodyElement = document.createElement('tbody')
  const tfootElement = document.createElement('tfoot')

  tableElement.appendChild(theadElement)
  tableElement.appendChild(tbodyElement)
  tableElement.appendChild(tfootElement)

  // Render table headers
  table.getHeaderGroups().forEach((headerGroup) => {
    const trElement = document.createElement('tr')
    headerGroup.headers.forEach((header) => {
      const thElement = document.createElement('th')
      thElement.innerHTML = header.isPlaceholder
        ? ''
        : String(FlexRender({ header }) ?? '')
      trElement.appendChild(thElement)
    })
    theadElement.appendChild(trElement)
  })

  // Render table rows
  table.getRowModel().rows.forEach((row) => {
    const trElement = document.createElement('tr')
    row.getAllCells().forEach((cell) => {
      const tdElement = document.createElement('td')
      tdElement.innerHTML = String(FlexRender({ cell }) ?? '')
      trElement.appendChild(tdElement)
    })
    tbodyElement.appendChild(trElement)
  })

  // Render table footers
  table.getFooterGroups().forEach((footerGroup) => {
    const trElement = document.createElement('tr')
    footerGroup.headers.forEach((header) => {
      const thElement = document.createElement('th')
      thElement.innerHTML = header.isPlaceholder
        ? ''
        : String(FlexRender({ footer: header }) ?? '')
      trElement.appendChild(thElement)
    })
    tfootElement.appendChild(trElement)
  })

  // Clear previous content and append new content
  const wrapperElement = document.getElementById('wrapper') as HTMLDivElement
  wrapperElement.innerHTML = ''
  wrapperElement.appendChild(buttonsDiv)
  wrapperElement.appendChild(tableElement)
}

const table = constructTable({
  debugTable: true,
  _features,
  _rowModels: {},
  columns,
  data,
  debugAll: true,
})

table.store.subscribe(() => renderTable())

renderTable()
