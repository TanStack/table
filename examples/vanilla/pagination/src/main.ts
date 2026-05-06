import './index.css'

import {
  constructTable,
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/table-core'
import { FlexRender } from '@tanstack/table-core/flex-render'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type { Table } from '@tanstack/table-core'

let data = makeData(200_000)

const _features = tableFeatures({
  rowPaginationFeature,
  coreReativityFeature: storeReactivityBindings(),
})

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

const renderTable = (table: Table<typeof _features, Person>) => {
  // Create buttons container
  const buttonsDiv = document.createElement('div')

  const regenerateBtn = document.createElement('button')
  regenerateBtn.textContent = 'Regenerate Data'
  regenerateBtn.addEventListener('click', () => {
    data = makeData(1_000)
    table.setOptions((prev) => ({ ...prev, data }))
  })

  const stressTestBtn = document.createElement('button')
  stressTestBtn.textContent = 'Stress Test (200k rows)'
  stressTestBtn.addEventListener('click', () => {
    data = makeData(200_000)
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
      divElement.classList.add('w-36')
      divElement.innerHTML = header.isPlaceholder
        ? ''
        : String(FlexRender({ header }) ?? '')
      thElement.appendChild(divElement)
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

  // Render pagination
  const paginationElement = document.createElement('div')
  paginationElement.classList.add('table-row-group', 'controls', 'controls')

  // Render pagination first page button
  const firstPageButton = document.createElement('button')
  firstPageButton.classList.add('demo-button', 'demo-button', 'cell-padding')
  firstPageButton.disabled = !table.getCanPreviousPage()
  firstPageButton.innerHTML = '<<'
  firstPageButton.onclick = () => table.firstPage()
  paginationElement.appendChild(firstPageButton)

  // Render pagination previous page button
  const prevPageButton = document.createElement('button')
  prevPageButton.classList.add('demo-button', 'demo-button', 'cell-padding')
  prevPageButton.disabled = !table.getCanPreviousPage()
  prevPageButton.innerHTML = '<'
  prevPageButton.onclick = () => table.previousPage()
  paginationElement.appendChild(prevPageButton)

  // Render pagination next page button
  const nextPageButton = document.createElement('button')
  nextPageButton.classList.add('demo-button', 'demo-button', 'cell-padding')
  nextPageButton.disabled = !table.getCanNextPage()
  nextPageButton.innerHTML = '>'
  nextPageButton.onclick = () => table.nextPage()
  paginationElement.appendChild(nextPageButton)

  // Render pagination last page button
  const lastPageButton = document.createElement('button')
  lastPageButton.classList.add('demo-button', 'demo-button', 'cell-padding')
  lastPageButton.disabled = !table.getCanNextPage()
  lastPageButton.innerHTML = '>>'
  lastPageButton.onclick = () => table.lastPage()
  paginationElement.appendChild(lastPageButton)

  // Render pagination info
  const paginationInfoElement = document.createElement('span')
  paginationInfoElement.classList.add(
    'table-row-group',
    'controls',
    'inline-controls',
  )
  paginationInfoElement.innerHTML = `<div>Page</div><strong>${(
    table.store.state.pagination.pageIndex + 1
  ).toLocaleString()} of ${table.getPageCount().toLocaleString()}</strong>`
  paginationElement.appendChild(paginationInfoElement)

  // Render pagination set page
  const paginationPageElement = document.createElement('span')
  paginationPageElement.classList.add(
    'table-row-group',
    'controls',
    'inline-controls',
  )
  paginationPageElement.textContent = '| Go to page:'
  const paginationPageInput = document.createElement('input')
  paginationPageInput.type = 'number'
  paginationPageInput.min = String(1)
  paginationPageInput.max = String(table.getPageCount())
  paginationPageInput.defaultValue = String(
    table.store.state.pagination.pageIndex + 1,
  )
  paginationPageInput.classList.add(
    'demo-button',
    'cell-padding',
    'demo-button',
    'page-size-input',
  )
  paginationPageInput.oninput = (e) => {
    const target = e.target as HTMLInputElement
    const page = target.value ? Number(target.value) - 1 : 0
    table.setPageIndex(page)
  }
  paginationPageElement.appendChild(paginationPageInput)
  paginationElement.appendChild(paginationPageElement)

  // Render pagiantion page size
  const paginationPageSizeSelect = document.createElement('select')
  paginationPageSizeSelect.value = String(table.store.state.pagination.pageSize)
  paginationPageSizeSelect.onchange = (e) => {
    const target = e.target as HTMLSelectElement
    table.setPageSize(Number(target.value))
  }
  ;[10, 20, 30, 40, 50].map((pageSize) => {
    const option = document.createElement('option')
    option.value = String(pageSize)
    option.selected = table.store.state.pagination.pageSize === pageSize
    option.textContent = `Show ${pageSize}`
    paginationPageSizeSelect.appendChild(option)
  })
  paginationElement.appendChild(paginationPageSizeSelect)

  // Render table state info
  const stateInfoElement = document.createElement('pre')
  stateInfoElement.textContent = JSON.stringify(
    {
      pagination: table.store.state.pagination,
    },
    null,
    2,
  )

  // Clear previous content and append new content
  const wrapperElement = document.getElementById('wrapper') as HTMLDivElement
  wrapperElement.innerHTML = ''
  wrapperElement.appendChild(buttonsDiv)
  wrapperElement.appendChild(tableElement)
  wrapperElement.appendChild(paginationElement)
  wrapperElement.appendChild(stateInfoElement)
}

const table = constructTable({
  _features,
  _rowModels: {
    paginatedRowModel: createPaginatedRowModel(),
  },
  data,
  columns,
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  },
  debugTable: true,
})

table.store.subscribe(() => renderTable(table))

renderTable(table)
