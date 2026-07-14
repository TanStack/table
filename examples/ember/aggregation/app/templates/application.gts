import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  aggregationFeature,
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_mean,
  aggregationFn_sum,
  columnFilteringFeature,
  FlexRenderCell,
  FlexRenderHeader,
  FlexRenderFooter,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
  createFilteredRowModel,
  filterFn_includesString,
  metaHelper,
  rowSelectionFeature,
  createColumnHelper,
  type Row,
  type Cell,
  type Table,
} from '@tanstack/ember-table'
import { makeData, type Sale } from '../utils/make-data'

type RowSource = 'all' | 'custom' | 'filtered' | 'page' | 'selected'
type AggregationTableMeta = { rowSource: RowSource }

const features = tableFeatures({
  aggregationFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
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

const formatAggregationValue = (value: unknown): string => {
  if (Array.isArray(value)) return value.map(formatAggregationValue).join(' – ')
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([key, entry]) => `${key}: ${formatAggregationValue(entry)}`)
      .join(', ')
  }
  return typeof value === 'number'
    ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : String(value ?? '—')
}

function getAggregationRows(table: Table<typeof features, Sale>) {
  const source = table.options.meta?.rowSource
  if (source === 'all') return table.getCoreRowModel().rows
  if (source === 'page') return table.getRowModel().rows
  if (source === 'selected') return table.getFilteredSelectedRowModel().rows
  if (source === 'custom') return table.getCoreRowModel().rows.slice(0, 3)
  return undefined
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
      formatAggregationValue(
        column.getAggregationValue(getAggregationRows(table)),
      ),
  }),
  columnHelper.accessor('score', {
    header: 'Score',
    aggregationFn: ['count', 'mean', { id: 'range', aggregationFn: 'extent' }],
    footer: ({ column, table }) =>
      formatAggregationValue(
        column.getAggregationValue(getAggregationRows(table)),
      ),
  }),
])

const PAGE_SIZES = [10, 20, 30, 40, 50]

// TanStack Table v9 uses prototype-based methods that require `this` binding.
// Ember templates extract function references without binding, so we provide
// helpers that call methods on the correct object.
const getAllCells = (
  row: Row<typeof features, Sale>,
): Array<Cell<typeof features, Sale>> => row.getAllCells()
const not = (value: unknown): boolean => !value
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)
const isSelected = (row: Row<typeof features, Sale>): boolean =>
  row.getIsSelected()

export default class PaginationTable extends Component {
  @tracked data: Array<Sale> = makeData(10_000)
  @tracked rowSource: RowSource = 'filtered'

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    meta: { rowSource: this.rowSource },
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    // initialState: { pagination: { pageIndex: 1, pageSize: 20 } }, // set the initial page once
    // atoms: { pagination: paginationAtom }, // preferred: own pagination state with an external atom
    // state: { pagination }, // classic controlled state; pair with onPaginationChange
    // onPaginationChange: setPagination,
    // autoResetPageIndex: false, // keep the current page after page-altering changes; default true
    // autoResetAll: false, // turn off every feature's automatic reset, including page index
    // manualPagination: true, // pass data that is already paginated, for example from a server
    // pageCount: 10, // total pages for manual pagination; use -1 when unknown
    // rowCount: 1_000, // total rows for manual pagination; pageCount is calculated from this and pageSize
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  get footerGroups() {
    return this.table.getFooterGroups()
  }

  get pagination() {
    return this.table.store.state.pagination
  }

  get tableState() {
    return JSON.stringify(this.pagination, null, 2)
  }

  get canPreviousPage() {
    return this.table.getCanPreviousPage()
  }

  get canNextPage() {
    return this.table.getCanNextPage()
  }

  get allPageSelected() {
    return this.table.getIsAllPageRowsSelected()
  }

  get pageCount() {
    return this.table.getPageCount()
  }

  get currentPage() {
    return (this.pagination.pageIndex + 1).toLocaleString()
  }

  get pageCountDisplay() {
    return this.table.getPageCount().toLocaleString()
  }

  get currentPageInputValue() {
    return String(this.pagination.pageIndex + 1)
  }

  get pageSize() {
    return this.pagination.pageSize
  }

  get pageSizes() {
    return PAGE_SIZES
  }

  get categoryFilter() {
    return String(this.table.getColumn('category')?.getFilterValue() ?? '')
  }

  refreshData = () => {
    this.data = makeData(10_000)
  }

  stressTest = () => {
    this.data = makeData(200_000)
  }

  goToFirstPage = () => {
    this.table.setPageIndex(0)
  }

  goToPreviousPage = () => {
    this.table.previousPage()
  }

  goToNextPage = () => {
    this.table.nextPage()
  }

  goToLastPage = () => {
    this.table.setPageIndex(this.table.getPageCount() - 1)
  }

  handleGoToPage = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement
    const page = target.value ? Number(target.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  handlePageSizeChange = (event: Event) => {
    const target = event.currentTarget as HTMLSelectElement
    this.table.setPageSize(Number(target.value))
  }

  handleCategoryFilter = (event: Event) => {
    this.table
      .getColumn('category')
      ?.setFilterValue((event.currentTarget as HTMLInputElement).value)
  }

  handleRowSource = (event: Event) => {
    this.rowSource = (event.currentTarget as HTMLSelectElement)
      .value as RowSource
  }

  toggleAllPageRows = () => this.table.toggleAllPageRowsSelected()

  toggleRow = (event: Event) => {
    const id = (event.currentTarget as HTMLInputElement).dataset.rowId
    if (id) this.table.getRow(id).toggleSelected()
  }

  <template>
    <h1>Aggregation without grouping</h1>
    <p>Amount uses a scalar
      <code>sum</code>. Score runs count, mean, and range together and returns a
      keyed object.</p>
    <div>
      <button class='demo-button' {{on 'click' this.refreshData}}>
        Regenerate Data
      </button>
      <button class='demo-button' {{on 'click' this.stressTest}}>
        Stress Test (200k rows)
      </button>
    </div>
    <div class='spacer-sm'></div>
    <div class='controls'>
      <label>Category filter:
        <input
          value={{this.categoryFilter}}
          {{on 'input' this.handleCategoryFilter}}
        /></label>
      <label>Total rows:
        <select {{on 'change' this.handleRowSource}}><option
            value='filtered'
            selected={{eq this.rowSource 'filtered'}}
          >Filtered rows</option><option
            value='all'
            selected={{eq this.rowSource 'all'}}
          >All rows</option><option
            value='page'
            selected={{eq this.rowSource 'page'}}
          >Visible page</option><option
            value='selected'
            selected={{eq this.rowSource 'selected'}}
          >Filtered selected rows</option><option
            value='custom'
            selected={{eq this.rowSource 'custom'}}
          >First three core rows</option></select></label>
    </div>
    <div class='spacer-md'></div>
    <table>
      <thead>
        {{#each this.headerGroups as |headerGroup|}}
          <tr>
            {{#each headerGroup.headers as |header|}}
              <th colspan={{header.colSpan}}>
                {{#if (eq header.column.id 'select')}}
                  <input
                    type='checkbox'
                    checked={{this.allPageSelected}}
                    {{on 'change' this.toggleAllPageRows}}
                  />
                {{else}}{{#unless header.isPlaceholder}}
                    <FlexRenderHeader @header={{header}} />
                  {{/unless}}{{/if}}
              </th>
            {{/each}}
          </tr>
        {{/each}}
      </thead>
      <tbody>
        {{#each this.rows as |row|}}
          <tr>
            {{#each (getAllCells row) as |cell|}}
              <td class={{if (eq cell.column.id 'amount') 'numeric'}}>
                {{#if (eq cell.column.id 'select')}}
                  <input
                    type='checkbox'
                    checked={{isSelected row}}
                    data-row-id={{row.id}}
                    {{on 'change' this.toggleRow}}
                  />
                {{else}}
                  <FlexRenderCell @cell={{cell}} />
                {{/if}}
              </td>
            {{/each}}
          </tr>
        {{/each}}
      </tbody>
      <tfoot>
        {{#each this.footerGroups as |footerGroup|}}
          <tr>
            {{#each footerGroup.headers as |header|}}
              <th colspan={{header.colSpan}}>
                {{#unless header.isPlaceholder}}
                  <FlexRenderFooter @footer={{header}} />
                {{/unless}}
              </th>
            {{/each}}
          </tr>
        {{/each}}
      </tfoot>
    </table>
    <div class='spacer-sm'></div>
    <div class='controls'>
      <button
        class='demo-button demo-button-sm'
        disabled={{not this.canPreviousPage}}
        {{on 'click' this.goToFirstPage}}
      >
        &lt;&lt;
      </button>
      <button
        class='demo-button demo-button-sm'
        disabled={{not this.canPreviousPage}}
        {{on 'click' this.goToPreviousPage}}
      >
        &lt;
      </button>
      <button
        class='demo-button demo-button-sm'
        disabled={{not this.canNextPage}}
        {{on 'click' this.goToNextPage}}
      >
        &gt;
      </button>
      <button
        class='demo-button demo-button-sm'
        disabled={{not this.canNextPage}}
        {{on 'click' this.goToLastPage}}
      >
        &gt;&gt;
      </button>
      <span class='inline-controls'>
        <div>Page</div>
        <strong>
          {{this.currentPage}}
          of
          {{this.pageCountDisplay}}
        </strong>
      </span>
      <span class='inline-controls'>
        | Go to page:
        <input
          type='number'
          min='1'
          max={{this.pageCount}}
          value={{this.currentPageInputValue}}
          class='page-size-input'
          {{on 'input' this.handleGoToPage}}
        />
      </span>
      <select {{on 'change' this.handlePageSizeChange}}>
        {{#each this.pageSizes as |pageSize|}}
          <option value={{pageSize}} selected={{eq pageSize this.pageSize}}>
            Show
            {{pageSize}}
          </option>
        {{/each}}
      </select>
    </div>
    <div class='spacer-md'></div>
    <pre>{{this.tableState}}</pre>
  </template>
}
