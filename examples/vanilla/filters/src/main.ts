import './index.css'
import { createVanillaTable, fuzzyFilterFn, createCoreRowModel, createFilteredRowModel } from '@tanstack/vanilla-table'
import { makeData } from './makeData'

let data = makeData(50)

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
  filterFns: {
    fuzzy: fuzzyFilterFn,
  },
  globalFilterFn: 'fuzzy',
  getCoreRowModel: createCoreRowModel(),
  getFilteredRowModel: createFilteredRowModel(),
  initialState: {
    columnFilters: [],
    globalFilter: '',
  },
})

const renderTable = () => {
  const wrapperElement = document.getElementById('wrapper') as HTMLDivElement
  wrapperElement.innerHTML = ''

  // Global Search Input
  const searchHeader = document.createElement('div')
  searchHeader.style.marginBottom = '15px'
  
  const searchLabel = document.createElement('span')
  searchLabel.textContent = 'Global Fuzzy Search: '
  
  const searchInput = document.createElement('input')
  searchInput.placeholder = 'Search first & last name...'
  searchInput.value = (table.getState().globalFilter as string) || ''
  searchInput.oninput = (e) => {
    table.setGlobalFilter((e.target as HTMLInputElement).value)
  }
  
  searchHeader.appendChild(searchLabel)
  searchHeader.appendChild(searchInput)
  wrapperElement.appendChild(searchHeader)

  // Create table element
  const tableEl = document.createElement('table')
  tableEl.border = '1'

  // Thead
  const thead = document.createElement('thead')
  
  // Column headers row
  const trHeaders = document.createElement('tr')
  table.getHeaderGroups().forEach((headerGroup) => {
    headerGroup.headers.forEach((header) => {
      const th = document.createElement('th')
      th.textContent = header.isPlaceholder ? '' : String(header.column.columnDef.header || '')
      trHeaders.appendChild(th)
    })
  })
  thead.appendChild(trHeaders)

  // Column filters row (rendered immediately below headers)
  const trFilters = document.createElement('tr')
  table.getHeaderGroups().forEach((headerGroup) => {
    headerGroup.headers.forEach((header) => {
      const th = document.createElement('th')
      if (header.isPlaceholder || !header.column.getCanFilter()) {
        th.textContent = ''
      } else {
        const filterInput = document.createElement('input')
        filterInput.placeholder = `Filter ${header.column.id}...`
        filterInput.style.width = '80%'
        filterInput.value = (header.column.getFilterValue() as string) || ''
        filterInput.oninput = (e) => {
          header.column.setFilterValue((e.target as HTMLInputElement).value)
        }
        th.appendChild(filterInput)
      }
      trFilters.appendChild(th)
    })
  })
  thead.appendChild(trFilters)
  tableEl.appendChild(thead)

  // Tbody
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

  // Record count
  const countDiv = document.createElement('div')
  countDiv.style.marginTop = '10px'
  countDiv.textContent = `Showing ${table.getRowModel().rows.length} of ${data.length} records`
  wrapperElement.appendChild(countDiv)
}

table.subscribe(() => {
  renderTable()
})

// Initial draw
renderTable()
