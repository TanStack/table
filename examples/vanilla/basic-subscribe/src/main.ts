import './index.css'
import { createVanillaTable, createCoreRowModel, createPaginatedRowModel } from '@tanstack/vanilla-table'
import { makeData } from './makeData'

let data = makeData(20)

const columns = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: 'age',
    header: 'Age',
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: 'visits',
    header: 'Visits',
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    cell: (info: any) => info.getValue(),
  },
]

const table = createVanillaTable({
  data,
  columns,
  getCoreRowModel: createCoreRowModel(),
  getPaginationRowModel: createPaginatedRowModel(),
  initialState: {
    pagination: { pageIndex: 0, pageSize: 10 },
  },
})

const renderTable = () => {
  const wrapperElement = document.getElementById('wrapper') as HTMLDivElement
  wrapperElement.innerHTML = ''

  // Create controls
  const controlsDiv = document.createElement('div')
  controlsDiv.style.marginBottom = '10px'

  const regenerateBtn = document.createElement('button')
  regenerateBtn.textContent = 'Regenerate Data'
  regenerateBtn.onclick = () => {
    data = makeData(20)
    table.setOptions((prev) => ({ ...prev, data }))
  }

  controlsDiv.appendChild(regenerateBtn)
  wrapperElement.appendChild(controlsDiv)

  // Create table
  const tableEl = document.createElement('table')
  tableEl.border = '1'

  // Header
  const thead = document.createElement('thead')
  table.getHeaderGroups().forEach((headerGroup) => {
    const tr = document.createElement('tr')
    headerGroup.headers.forEach((header) => {
      const th = document.createElement('th')
      th.textContent = header.isPlaceholder ? '' : String(header.column.columnDef.header || '')
      tr.appendChild(th)
    })
    thead.appendChild(tr)
  })
  tableEl.appendChild(thead)

  // Body
  const tbody = document.createElement('tbody')
  table.getRowModel().rows.forEach((row) => {
    const tr = document.createElement('tr')
    row.getAllCells().forEach((cell) => {
      const td = document.createElement('td')
      td.textContent = String(cell.getValue() ?? '')
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })
  tableEl.appendChild(tbody)
  wrapperElement.appendChild(tableEl)

  // Pagination info
  const paginationDiv = document.createElement('div')
  paginationDiv.style.marginTop = '10px'

  const prevBtn = document.createElement('button')
  prevBtn.textContent = 'Previous'
  prevBtn.disabled = !table.getCanPreviousPage()
  prevBtn.onclick = () => table.previousPage()

  const nextBtn = document.createElement('button')
  nextBtn.textContent = 'Next'
  nextBtn.disabled = !table.getCanNextPage()
  nextBtn.onclick = () => table.nextPage()

  const pageInfo = document.createElement('span')
  pageInfo.textContent = ` Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()} `

  paginationDiv.appendChild(prevBtn)
  paginationDiv.appendChild(pageInfo)
  paginationDiv.appendChild(nextBtn)
  wrapperElement.appendChild(paginationDiv)
}

table.subscribe(() => {
  renderTable()
})
