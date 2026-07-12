import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  FlexRenderFooter,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
  createColumnHelper,
  type Row,
  type Cell,
} from '@tanstack/ember-table'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'rowNumber',
    header: '#',
    cell: ({ row }) => row.getDisplayIndex() + 1,
  }),
  columnHelper.group({
    id: 'name',
    header: 'Name',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('firstName', {
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => 'Last Name',
        footer: (props) => props.column.id,
      }),
    ]),
  }),
  columnHelper.group({
    id: 'info',
    header: 'Info',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: (props) => props.column.id,
      }),
      columnHelper.group({
        id: 'moreInfo',
        header: 'More Info',
        columns: columnHelper.columns([
          columnHelper.accessor('visits', {
            header: () => 'Visits',
            footer: (props) => props.column.id,
          }),
          columnHelper.accessor('status', {
            header: 'Status',
            footer: (props) => props.column.id,
          }),
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: (props) => props.column.id,
          }),
        ]),
      }),
    ]),
  }),
])

const PAGE_SIZES = [10, 20, 30, 40, 50]

// TanStack Table v9 uses prototype-based methods that require `this` binding.
// Ember templates extract function references without binding, so we provide
// helpers that call methods on the correct object.
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()
const not = (value: unknown): boolean => !value
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)

export default class PaginationTable extends Component {
  @tracked data: Array<Person> = makeData(100_000)

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
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

  refreshData = () => {
    this.data = makeData(100_000)
  }

  stressTest = () => {
    this.data = makeData(1_000_000)
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

  <template>
    <div>
      <button class='demo-button' {{on 'click' this.refreshData}}>
        Regenerate Data
      </button>
      <button class='demo-button' {{on 'click' this.stressTest}}>
        Stress Test (1M rows)
      </button>
    </div>
    <div class='spacer-md'></div>
    <table>
      <thead>
        {{#each this.headerGroups as |headerGroup|}}
          <tr>
            {{#each headerGroup.headers as |header|}}
              <th colspan={{header.colSpan}}>
                {{#unless header.isPlaceholder}}
                  <FlexRenderHeader @header={{header}} />
                {{/unless}}
              </th>
            {{/each}}
          </tr>
        {{/each}}
      </thead>
      <tbody>
        {{#each this.rows as |row|}}
          <tr>
            {{#each (getAllCells row) as |cell|}}
              <td><FlexRenderCell @cell={{cell}} /></td>
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
