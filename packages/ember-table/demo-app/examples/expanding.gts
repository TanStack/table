import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  createExpandedRowModel,
  createPaginatedRowModel,
  createColumnHelper,
  type Row,
  type Cell,
} from '#src/index.ts'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

const PAGE_SIZES = [10, 20, 30, 40, 50]

// --- Template helpers (v9 methods need explicit `this` binding) ---

const getVisibleCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()
const getCanExpand = (row: Row<typeof features, Person>): boolean =>
  row.getCanExpand()
const getIsExpanded = (row: Row<typeof features, Person>): boolean =>
  row.getIsExpanded()
const getDepth = (row: Row<typeof features, Person>): number => row.depth
const getIsSelected = (row: Row<typeof features, Person>): boolean =>
  row.getIsSelected()
const getIsSomeSelected = (row: Row<typeof features, Person>): boolean =>
  row.getIsSomeSelected()

const toggleExpanded = (row: Row<typeof features, Person>) => () =>
  row.toggleExpanded()
const toggleSelected = (row: Row<typeof features, Person>) => (event: Event) =>
  row.getToggleSelectedHandler()(event)

const depthPadding = (row: Row<typeof features, Person>): string =>
  `padding-left: ${getDepth(row) * 2}rem`

const not = (value: unknown): boolean => !value
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)

export default class ExpandingTable extends Component {
  @tracked data: Array<Person> = makeData(10, 5, 3)

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    getSubRows: (row: Person) => row.subRows,
    getRowCanExpand: () => true,
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  get isAllRowsExpanded() {
    return this.table.getIsAllRowsExpanded()
  }

  get canPreviousPage() {
    return this.table.getCanPreviousPage()
  }

  get canNextPage() {
    return this.table.getCanNextPage()
  }

  get pagination() {
    return this.table.store.state.pagination
  }

  get currentPage() {
    return (this.pagination.pageIndex + 1).toLocaleString()
  }

  get pageCountDisplay() {
    return this.table.getPageCount().toLocaleString()
  }

  get pageSizes() {
    return PAGE_SIZES
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2)
  }

  regenerateData = () => {
    this.data = makeData(10, 5, 3)
  }

  toggleAllExpanded = (event: Event) => {
    this.table.getToggleAllRowsExpandedHandler()(event)
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

  handlePageSizeChange = (event: Event) => {
    const target = event.currentTarget as HTMLSelectElement
    this.table.setPageSize(Number(target.value))
  }

  <template>
    <div class="demo-root">
      <div>
        <button {{on "click" this.regenerateData}}>Regenerate Data</button>
        <button {{on "click" this.toggleAllExpanded}}>
          {{if this.isAllRowsExpanded "Collapse All" "Expand All"}}
        </button>
      </div>
      <div class="spacer-sm"></div>
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
              {{#each (getVisibleCells row) as |cell index|}}
                <td>
                  {{#if (eq index 0)}}
                    <div style={{depthPadding row}}>
                      <input
                        type="checkbox"
                        checked={{getIsSelected row}}
                        indeterminate={{getIsSomeSelected row}}
                        {{on "change" (toggleSelected row)}}
                      />
                      {{#if (getCanExpand row)}}
                        <button {{on "click" (toggleExpanded row)}}>
                          {{if (getIsExpanded row) "👇" "👉"}}
                        </button>
                      {{else}}
                        <span>🔵</span>
                      {{/if}}
                      <FlexRenderCell @cell={{cell}} />
                    </div>
                  {{else}}
                    <FlexRenderCell @cell={{cell}} />
                  {{/if}}
                </td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>
      <div class="spacer-sm"></div>
      <div class="controls">
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canPreviousPage}}
          {{on "click" this.goToFirstPage}}
        >
          &lt;&lt;
        </button>
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canPreviousPage}}
          {{on "click" this.goToPreviousPage}}
        >
          &lt;
        </button>
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canNextPage}}
          {{on "click" this.goToNextPage}}
        >
          &gt;
        </button>
        <button
          class="demo-button demo-button-sm"
          disabled={{not this.canNextPage}}
          {{on "click" this.goToLastPage}}
        >
          &gt;&gt;
        </button>
        <span class="inline-controls">
          <div>Page</div>
          <strong>{{this.currentPage}} of {{this.pageCountDisplay}}</strong>
        </span>
        <select {{on "change" this.handlePageSizeChange}}>
          {{#each this.pageSizes as |pageSize|}}
            <option
              value={{pageSize}}
              selected={{eq pageSize this.pagination.pageSize}}
            >
              Show
              {{pageSize}}
            </option>
          {{/each}}
        </select>
      </div>
      <div class="spacer-md"></div>
      <pre>{{this.tableState}}</pre>
    </div>
  </template>
}
