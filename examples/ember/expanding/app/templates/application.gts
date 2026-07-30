import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  columnFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_between,
  filterFn_includesString,
  filterFn_inNumberRange,
  sortFn_alphanumeric,
  sortFn_text,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type Table,
} from '@tanstack/ember-table'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({
  columnFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    between: filterFn_between,
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'rowNumber',
    header: '#',
    cell: ({ row }) => row.getDisplayIndex() + 1,
  }),
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
    filterFn: 'between',
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
const getCanSort = (column: Column<typeof features, Person>): boolean =>
  column.getCanSort()
const getCanFilter = (column: Column<typeof features, Person>): boolean =>
  column.getCanFilter()

const toggleExpanded = (row: Row<typeof features, Person>) => () =>
  row.toggleExpanded()
const toggleSelected = (row: Row<typeof features, Person>) => (event: Event) =>
  row.getToggleSelectedHandler({
    // selectChildren: false
  })(event)
const toggleSort =
  (column: Column<typeof features, Person>) => (event: Event) =>
    column.getToggleSortingHandler()?.(event)

const depthPadding = (row: Row<typeof features, Person>): string =>
  `padding-left: ${getDepth(row) * 2}rem`

const lookup = (obj: Record<string, string>, key: string): string =>
  obj[key] ?? ''

const not = (value: unknown): boolean => !value
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)

// A column filters as a numeric range when its first pre-filtered value is a
// number; otherwise it filters as free text.
const isNumberColumn = (
  table: Table<typeof features, Person>,
  column: Column<typeof features, Person>,
): boolean => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)
  return typeof firstValue === 'number'
}

const rangeValue = (
  column: Column<typeof features, Person>,
  index: 0 | 1,
): string => {
  const value = column.getFilterValue() as
    | [string | number, string | number]
    | undefined
  return value?.[index] != null ? String(value[index]) : ''
}

const textValue = (column: Column<typeof features, Person>): string => {
  const value = column.getFilterValue() as string | number | undefined
  return value == null ? '' : String(value)
}

// --- Per-column filter sub-component ---

interface ColumnFilterSignature {
  Args: {
    column: Column<typeof features, Person>
    table: Table<typeof features, Person>
  }
}

class ColumnFilter extends Component<ColumnFilterSignature> {
  get isNumber(): boolean {
    return isNumberColumn(this.args.table, this.args.column)
  }

  get minValue(): string {
    return rangeValue(this.args.column, 0)
  }

  get maxValue(): string {
    return rangeValue(this.args.column, 1)
  }

  get text(): string {
    return textValue(this.args.column)
  }

  changeMin = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.args.column.setFilterValue((old?: [unknown, unknown]) => [
      value,
      old?.[1],
    ])
  }

  changeMax = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.args.column.setFilterValue((old?: [unknown, unknown]) => [
      old?.[0],
      value,
    ])
  }

  changeText = (event: Event) => {
    this.args.column.setFilterValue((event.target as HTMLInputElement).value)
  }

  <template>
    {{#if this.isNumber}}
      <div class='filter-row'>
        <input
          type='number'
          class='filter-input'
          placeholder='Min'
          value={{this.minValue}}
          {{on 'input' this.changeMin}}
        />
        <input
          type='number'
          class='filter-input'
          placeholder='Max'
          value={{this.maxValue}}
          {{on 'input' this.changeMax}}
        />
      </div>
    {{else}}
      <input
        type='text'
        class='filter-select'
        placeholder='Search...'
        value={{this.text}}
        {{on 'input' this.changeText}}
      />
    {{/if}}
  </template>
}

export default class ExpandingTable extends Component {
  @tracked data: Array<Person> = makeData(100, 5, 3)

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    getSubRows: (row: Person) => row.subRows,
    getRowCanExpand: () => true,
    // initialState: { expanded: { '0': true } }, // expand rows on first render
    // atoms: { expanded: expandedAtom }, // preferred: own expanded state with an external atom
    // state: { expanded }, // classic controlled state; pair with onExpandedChange
    // onExpandedChange: setExpanded,
    // enableExpanding: false, // disable expanding for every row; default true
    // getIsRowExpanded: row => row.id === '0', // override whether a row is expanded
    // manualExpanding: true, // pass data that is already expanded, for example from a server
    // paginateExpandedRows: false, // keep expanded children on their parent page; default true
    // autoResetExpanded: false, // keep expanded rows after page-altering changes; default true
    // autoResetAll: false, // turn off every feature's automatic reset, including expansion
    // filterFromLeafRows: true, // with filtering, keep parents whose descendants match
    // maxLeafRowFilterDepth: 0, // with filtering, only filter root rows
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  get rowCount() {
    return this.table.getRowModel().rows.length.toLocaleString()
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

  get sortIndicators(): Record<string, string> {
    const indicators: Record<string, string> = {}
    for (const hg of this.table.getHeaderGroups()) {
      for (const h of hg.headers) {
        const sorted = h.column.getIsSorted()
        indicators[h.column.id] =
          sorted === 'asc' ? ' 🔼' : sorted === 'desc' ? ' 🔽' : ''
      }
    }
    return indicators
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2)
  }

  regenerateData = () => {
    this.data = makeData(100, 5, 3)
  }

  stressTest = () => {
    this.data = makeData(10_000, 5, 3)
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
    <div>
      <button {{on 'click' this.regenerateData}}>Regenerate Data</button>
      <button {{on 'click' this.stressTest}}>Stress Test (10k rows)</button>
      <button {{on 'click' this.toggleAllExpanded}}>
        {{if this.isAllRowsExpanded 'Collapse All' 'Expand All'}}
      </button>
    </div>
    <div class='spacer-sm'></div>
    <table>
      <thead>
        {{#each this.headerGroups as |headerGroup|}}
          <tr>
            {{#each headerGroup.headers as |header|}}
              <th colspan={{header.colSpan}}>
                {{#unless header.isPlaceholder}}
                  <div
                    class='{{if (getCanSort header.column) "sortable-header"}}'
                    {{on 'click' (toggleSort header.column)}}
                  >
                    <FlexRenderHeader @header={{header}} />{{lookup
                      this.sortIndicators
                      header.column.id
                    }}
                  </div>
                  {{#if (getCanFilter header.column)}}
                    <div>
                      <ColumnFilter
                        @column={{header.column}}
                        @table={{this.table}}
                      />
                    </div>
                  {{/if}}
                {{/unless}}
              </th>
            {{/each}}
          </tr>
        {{/each}}
      </thead>
      <tbody>
        {{#each this.rows as |row|}}
          <tr>
            {{#each (getVisibleCells row) as |cell|}}
              <td>
                {{#if (eq cell.column.id 'firstName')}}
                  <div style={{depthPadding row}}>
                    <input
                      type='checkbox'
                      checked={{getIsSelected row}}
                      indeterminate={{getIsSomeSelected row}}
                      {{on 'click' (toggleSelected row)}}
                    />
                    {{#if (getCanExpand row)}}
                      <button {{on 'click' (toggleExpanded row)}}>
                        {{if (getIsExpanded row) '👇' '👉'}}
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
        <strong>{{this.currentPage}} of {{this.pageCountDisplay}}</strong>
      </span>
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
    <div>{{this.rowCount}} Rows</div>
    <div class='spacer-md'></div>
    <pre data-testid='table-state'>{{this.tableState}}</pre>
  </template>
}
