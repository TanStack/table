import './index.css'
import {
  aggregationFeature,
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_mean,
  aggregationFn_sum,
  columnFilteringFeature,
  constructTable,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/table-core'
import { FlexRender } from '@tanstack/table-core/flex-render'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'
import { makeData } from './makeData'
import type { Sale } from './makeData'
import type { Table } from '@tanstack/table-core'

type RowSource = 'all' | 'custom' | 'filtered' | 'page' | 'selected'
type AggregationTableMeta = { rowSource: RowSource }
let data = makeData(10_000)
let rowSource: RowSource = 'filtered'
const features = tableFeatures({
  aggregationFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  coreReactivityFeature: storeReactivityBindings(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  aggregationFns: {
    count: aggregationFn_count,
    extent: aggregationFn_extent,
    mean: aggregationFn_mean,
    sum: aggregationFn_sum,
  },
  tableMeta: metaHelper<AggregationTableMeta>(),
})
const columnHelper = createColumnHelper<typeof features, Sale>()
function getAggregationRows(table: Table<typeof features, Sale>) {
  const source = table.options.meta?.rowSource
  if (source === 'all') return table.getCoreRowModel().rows
  if (source === 'page') return table.getRowModel().rows
  if (source === 'selected') return table.getFilteredSelectedRowModel().rows
  if (source === 'custom') return table.getCoreRowModel().rows.slice(0, 3)
  return undefined
}
function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(formatValue).join(' – ')
  if (value && typeof value === 'object')
    return Object.entries(value)
      .map(([key, entry]) => `${key}: ${formatValue(entry)}`)
      .join(', ')
  if (typeof value === 'number')
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return String(value ?? '—')
}
const columns = columnHelper.columns([
  columnHelper.display({ id: 'select' }),
  columnHelper.accessor('category', {
    header: 'Category',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('item', {
    header: 'Item',
    footer: ({ table }) => `${table.options.meta?.rowSource} total`,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    aggregationFn: 'sum',
    cell: ({ getValue }) => getValue<number>().toLocaleString(),
    footer: ({ column, table }) =>
      formatValue(
        column.getAggregationValue({ rows: getAggregationRows(table) }),
      ),
  }),
  columnHelper.accessor('score', {
    header: 'Score',
    aggregationFn: ['count', 'mean', { id: 'range', aggregationFn: 'extent' }],
    footer: ({ column, table }) =>
      formatValue(
        column.getAggregationValue({ rows: getAggregationRows(table) }),
      ),
  }),
])
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string) => {
  const node = document.createElement(tag)
  if (text !== undefined) node.textContent = text
  return node
}
function button(text: string, action: () => void, disabled = false) {
  const node = el('button', text)
  node.className = 'demo-button demo-button-sm'
  node.disabled = disabled
  node.onclick = action
  return node
}
function renderTable(table: Table<typeof features, Sale>) {
  const wrapper = document.getElementById('wrapper') as HTMLDivElement
  wrapper.innerHTML = ''
  wrapper.className = 'demo-root'
  wrapper.append(el('h1', 'Aggregation without grouping'))
  const description = el('p')
  description.innerHTML =
    'Amount uses a scalar <code>sum</code>. Score runs count, mean, and range together and returns a keyed object.'
  wrapper.append(description)
  const actions = el('div')
  actions.append(
    button('Regenerate Data', () => {
      data = makeData(10_000)
      table.setOptions((prev) => ({ ...prev, data }))
      renderTable(table)
    }),
    button('Stress Test (200k rows)', () => {
      data = makeData(200_000)
      table.setOptions((prev) => ({ ...prev, data }))
      renderTable(table)
    }),
  )
  wrapper.append(actions, Object.assign(el('div'), { className: 'spacer-sm' }))
  const controls = el('div')
  controls.className = 'controls'
  const filterLabel = el('label', 'Category filter: ')
  const filter = el('input')
  filter.value = String(table.getColumn('category')?.getFilterValue() ?? '')
  filter.oninput = () =>
    table.getColumn('category')?.setFilterValue(filter.value)
  filterLabel.append(filter)
  const sourceLabel = el('label', 'Total rows: ')
  const source = el('select')
  const sources: Array<[RowSource, string]> = [
    ['filtered', 'Filtered rows'],
    ['all', 'All rows'],
    ['page', 'Visible page'],
    ['selected', 'Filtered selected rows'],
    ['custom', 'First three core rows'],
  ]
  for (const [value, label] of sources) {
    const option = el('option', label)
    option.value = value
    option.selected = rowSource === value
    source.append(option)
  }
  source.onchange = () => {
    rowSource = source.value as RowSource
    table.setOptions((prev) => ({ ...prev, meta: { rowSource } }))
    renderTable(table)
  }
  sourceLabel.append(source)
  controls.append(filterLabel, sourceLabel)
  wrapper.append(controls, Object.assign(el('div'), { className: 'spacer-sm' }))
  const tableElement = el('table'),
    thead = el('thead'),
    tbody = el('tbody'),
    tfoot = el('tfoot')
  tableElement.append(thead, tbody, tfoot)
  for (const group of table.getHeaderGroups()) {
    const tr = el('tr')
    for (const header of group.headers) {
      const th = el('th')
      if (header.column.id === 'select') {
        const input = el('input')
        input.type = 'checkbox'
        input.checked = table.getIsAllPageRowsSelected()
        input.onchange = () => table.toggleAllPageRowsSelected()
        th.append(input)
      } else if (!header.isPlaceholder)
        th.innerHTML = String(FlexRender({ header }) ?? '')
      tr.append(th)
    }
    thead.append(tr)
  }
  for (const row of table.getRowModel().rows) {
    const tr = el('tr')
    for (const cell of row.getAllCells()) {
      const td = el('td')
      if (cell.column.id === 'amount') td.className = 'numeric'
      if (cell.column.id === 'select') {
        const input = el('input')
        input.type = 'checkbox'
        input.checked = row.getIsSelected()
        input.onchange = () => row.toggleSelected()
        td.append(input)
      } else td.innerHTML = String(FlexRender({ cell }) ?? '')
      tr.append(td)
    }
    tbody.append(tr)
  }
  for (const group of table.getFooterGroups()) {
    const tr = el('tr')
    for (const header of group.headers) {
      const th = el('th')
      th.colSpan = header.colSpan
      if (!header.isPlaceholder)
        th.innerHTML = String(FlexRender({ footer: header }) ?? '')
      tr.append(th)
    }
    tfoot.append(tr)
  }
  wrapper.append(
    tableElement,
    Object.assign(el('div'), { className: 'spacer-sm' }),
  )
  const pagination = el('div')
  pagination.className = 'controls'
  pagination.append(
    button('<<', () => table.firstPage(), !table.getCanPreviousPage()),
    button('<', () => table.previousPage(), !table.getCanPreviousPage()),
    button('>', () => table.nextPage(), !table.getCanNextPage()),
    button('>>', () => table.lastPage(), !table.getCanNextPage()),
  )
  const info = el('span')
  info.className = 'inline-controls'
  info.innerHTML = `<div>Page</div><strong>${table.store.state.pagination.pageIndex + 1} of ${table.getPageCount().toLocaleString()}</strong>`
  pagination.append(info)
  const pageLabel = el('span', '| Go to page:')
  pageLabel.className = 'inline-controls'
  const page = el('input')
  page.type = 'number'
  page.min = '1'
  page.max = String(table.getPageCount())
  page.value = String(table.store.state.pagination.pageIndex + 1)
  page.className = 'page-size-input'
  page.oninput = () =>
    table.setPageIndex(page.value ? Number(page.value) - 1 : 0)
  pageLabel.append(page)
  pagination.append(pageLabel)
  const size = el('select')
  for (const value of [10, 20, 30, 40, 50]) {
    const option = el('option', `Show ${value}`)
    option.value = String(value)
    option.selected = table.store.state.pagination.pageSize === value
    size.append(option)
  }
  size.onchange = () => table.setPageSize(Number(size.value))
  pagination.append(size)
  wrapper.append(pagination)
  wrapper.append(
    el(
      'div',
      `Showing ${table.getRowModel().rows.length.toLocaleString()} of ${table.getRowCount().toLocaleString()} Rows`,
    ),
    Object.assign(el('pre'), {
      textContent: JSON.stringify(table.store.state, null, 2),
    }),
  )
}
const table = constructTable({
  features,
  data,
  columns,
  meta: { rowSource },
  initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  debugTable: true,
  debugColumns: true,
})
table.store.subscribe(() => renderTable(table))
renderTable(table)
