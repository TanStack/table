import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import { htmlSafe } from '@ember/template'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  rowPinningFeature,
  rowExpandingFeature,
  columnFilteringFeature,
  columnSizingFeature,
  rowPaginationFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
  createColumnHelper,
  type Row,
  type Cell,
  type Header,
  type RowPinningState,
} from '@tanstack/ember-table'
import type { SafeString } from '@ember/template'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({
  rowPinningFeature,
  rowExpandingFeature,
  columnFilteringFeature,
  columnSizingFeature,
  rowPaginationFeature,
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    size: 50,
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
    size: 50,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    size: 80,
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
const getIsPinned = (
  row: Row<typeof features, Person>,
): false | 'top' | 'bottom' => row.getIsPinned()
const isFirstNameCell = (cell: Cell<typeof features, Person>): boolean =>
  cell.column.id === 'firstName'
const headerWidth = (header: Header<typeof features, Person>): SafeString =>
  htmlSafe(`width: ${header.getSize()}px`)
const cellWidth = (cell: Cell<typeof features, Person>): SafeString =>
  htmlSafe(`width: ${cell.column.getSize()}px`)
const depthPadding = (row: Row<typeof features, Person>): string =>
  `padding-left: ${row.depth * 2}rem`

const toggleExpanded = (row: Row<typeof features, Person>) => () =>
  row.toggleExpanded()
const pinTop = (row: Row<typeof features, Person>) => () => row.pin('top')
const pinBottom = (row: Row<typeof features, Person>) => () => row.pin('bottom')
const unpin = (row: Row<typeof features, Person>) => () => row.pin(false)

const not = (value: unknown): boolean => !value
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)

export default class RowPinningTable extends Component {
  @tracked data: Array<Person> = makeData(1_000, 2, 2)
  @tracked rowPinning: RowPinningState = { top: [], bottom: [] }
  @tracked keepPinnedRows = true

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    getRowId: (row: Person, index: number) =>
      `${row.firstName}-${row.lastName}-${index}`,
    getSubRows: (row: Person) => row.subRows,
    initialState: { pagination: { pageSize: 20, pageIndex: 0 } },
    state: {
      rowPinning: this.rowPinning,
    },
    onRowPinningChange: (updater) => {
      this.rowPinning =
        typeof updater === 'function' ? updater(this.rowPinning) : updater
    },
    keepPinnedRows: this.keepPinnedRows,
    // atoms: { rowPinning: rowPinningAtom }, // preferred: own pinning state with an external atom
    // enableRowPinning: row => row.original.age > 18, // allow pinning only for matching rows; default true
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get topRows() {
    return this.table.getTopRows()
  }

  get centerRows() {
    return this.table.getCenterRows()
  }

  get bottomRows() {
    return this.table.getBottomRows()
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

  get pageSizes() {
    return PAGE_SIZES
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2)
  }

  regenerateData = () => {
    this.data = makeData(1_000, 2, 2)
  }

  toggleKeepPinnedRows = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement
    this.keepPinnedRows = target.checked
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
    <div>
      <button {{on 'click' this.regenerateData}}>Regenerate Data</button>
      <label>
        <input
          type='checkbox'
          checked={{this.keepPinnedRows}}
          {{on 'change' this.toggleKeepPinnedRows}}
        />
        Keep pinned rows
      </label>
    </div>
    <div class='spacer-sm'></div>
    <table>
      <thead>
        {{#each this.headerGroups as |headerGroup|}}
          <tr>
            <th>Pin</th>
            {{#each headerGroup.headers as |header|}}
              <th colspan={{header.colSpan}} style={{headerWidth header}}>
                {{#unless header.isPlaceholder}}
                  <FlexRenderHeader @header={{header}} />
                {{/unless}}
              </th>
            {{/each}}
          </tr>
        {{/each}}
      </thead>

      {{#if this.topRows.length}}
        <tbody class='pinned-rows-top'>
          {{#each this.topRows as |row|}}
            <tr>
              <td>
                <button {{on 'click' (unpin row)}}>Unpin</button>
              </td>
              {{#each (getVisibleCells row) as |cell|}}
                <td style={{cellWidth cell}}>
                  {{#if (isFirstNameCell cell)}}
                    <div style={{depthPadding row}}>
                      {{#if (getCanExpand row)}}
                        <button {{on 'click' (toggleExpanded row)}}>
                          {{if (getIsExpanded row) '👇' '👉'}}
                        </button>
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
      {{/if}}

      <tbody>
        {{#each this.centerRows as |row|}}
          <tr>
            <td>
              {{#if (getIsPinned row)}}
                <button {{on 'click' (unpin row)}}>Unpin</button>
              {{else}}
                <button {{on 'click' (pinTop row)}}>Pin Top</button>
                <button {{on 'click' (pinBottom row)}}>Pin Bottom</button>
              {{/if}}
            </td>
            {{#each (getVisibleCells row) as |cell|}}
              <td style={{cellWidth cell}}>
                {{#if (isFirstNameCell cell)}}
                  <div style={{depthPadding row}}>
                    {{#if (getCanExpand row)}}
                      <button {{on 'click' (toggleExpanded row)}}>
                        {{if (getIsExpanded row) '👇' '👉'}}
                      </button>
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

      {{#if this.bottomRows.length}}
        <tbody class='pinned-rows-bottom'>
          {{#each this.bottomRows as |row|}}
            <tr>
              <td>
                <button {{on 'click' (unpin row)}}>Unpin</button>
              </td>
              {{#each (getVisibleCells row) as |cell|}}
                <td style={{cellWidth cell}}>
                  {{#if (isFirstNameCell cell)}}
                    <div style={{depthPadding row}}>
                      {{#if (getCanExpand row)}}
                        <button {{on 'click' (toggleExpanded row)}}>
                          {{if (getIsExpanded row) '👇' '👉'}}
                        </button>
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
      {{/if}}
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
      <select {{on 'change' this.handlePageSizeChange}}>
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
    <div class='spacer-md'></div>
    <pre>{{this.tableState}}</pre>
  </template>
}
