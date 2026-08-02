import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  FlexRenderCell,
  FlexRenderHeader,
  cellSelectionFeature,
  cellSpanningFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  useTable,
  type Cell,
  type Column,
  type Header,
  type Row,
  type Table,
} from '@tanstack/ember-table'

import {
  makeData,
  makeSummaryData,
  type Shift,
  type SummaryRow,
} from '../utils/make-data'

const features = tableFeatures({
  cellSelectionFeature,
  cellSpanningFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
})

const columnHelper = createColumnHelper<typeof features, Shift>()

const columns = columnHelper.columns([
  columnHelper.accessor('region', {
    header: 'Region',
    sortFn: 'alphanumeric',
    // Adjacent rows that share a region merge into one vertically spanning
    // cell. Spans always derive from the rows that are actually rendered, so
    // sorting, filtering, and paging just change which rows are adjacent.
    spanRows: true,
  }),
  columnHelper.accessor('team', {
    header: 'Team',
    sortFn: 'alphanumeric',
    spanRows: true,
  }),
  columnHelper.accessor('shift', {
    header: 'Shift',
    sortFn: 'alphanumeric',
    // The predicate form: shifts only merge while the table is sorted by the
    // shift column, so the predicate itself is visibly reactive.
    spanRows: ({ column, value, anchorValue }) =>
      column.getIsSorted() !== false && value === anchorValue,
  }),
  columnHelper.accessor('employee', {
    header: 'Employee',
    sortFn: 'alphanumeric',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('hours', {
    header: 'Hours',
    sortFn: 'basic',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    sortFn: 'alphanumeric',
    filterFn: 'includesString',
  }),
])

const summaryFeatures = tableFeatures({
  cellSpanningFeature,
  columnVisibilityFeature,
})

const summaryColumnHelper = createColumnHelper<
  typeof summaryFeatures,
  SummaryRow
>()

const summaryColumns = summaryColumnHelper.columns([
  summaryColumnHelper.accessor('label', {
    header: 'Shift',
    // Subtotal rows render one label cell covering every column but the
    // total. `Infinity` clamps to the rest of the cell's pinned region.
    spanColumns: ({ row }) => (row.original.kind === 'subtotal' ? Infinity : 1),
  }),
  summaryColumnHelper.accessor('region', {
    header: 'Region',
  }),
  summaryColumnHelper.accessor('hours', {
    header: 'Hours',
  }),
])

// Ember templates extract function references without binding, so every table
// or cell method used from the template needs a helper that calls it on the
// correct object.
const getVisibleCells = (
  row: Row<typeof features, Shift>,
): Array<Cell<typeof features, Shift>> => row.getVisibleCells()

const getSummaryVisibleCells = (
  row: Row<typeof summaryFeatures, SummaryRow>,
): Array<Cell<typeof summaryFeatures, SummaryRow>> => row.getVisibleCells()

const rowSpanOf = (cell: { getRowSpan: () => number }): number =>
  cell.getRowSpan()

const colSpanOf = (cell: { getColSpan: () => number }): number =>
  cell.getColSpan()

// A span of 0 means this cell is covered by a cell above or to its left. Skip
// it entirely. Do NOT render `rowspan="0"`: in HTML that means "span to the
// end of the row group", so forgetting this check merges the cell down the
// whole tbody instead of rendering nothing.
const isRendered = (cell: {
  getRowSpan: () => number
  getColSpan: () => number
}): boolean => cell.getRowSpan() !== 0 && cell.getColSpan() !== 0

const startHandler = (cell: Cell<typeof features, Shift>) =>
  cell.getSelectionStartHandler()

const extendHandler = (cell: Cell<typeof features, Shift>) =>
  cell.getSelectionExtendHandler()

/**
 * Selection styling for the spanning table. A merged cell is always entirely
 * selected or entirely unselected: the selection bounds expand to enclose any
 * merge they touch, so the tint and the outline land on the rendered anchor.
 */
const getCellClassName = (cell: {
  getRowSpan: () => number
  getIsSelected: () => boolean
  getIsFocused: () => boolean
  getSelectionEdges: () => {
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean
  }
}): string => {
  const base =
    cell.getRowSpan() > 1 ? 'cell-selectable span-cell' : 'cell-selectable'

  if (!cell.getIsSelected()) {
    return cell.getIsFocused() ? `${base} cell-focused` : base
  }

  const edges = cell.getSelectionEdges()

  return [
    base,
    'cell-selected',
    cell.getIsFocused() && 'cell-focused',
    edges.top && 'cell-edge-top',
    edges.right && 'cell-edge-right',
    edges.bottom && 'cell-edge-bottom',
    edges.left && 'cell-edge-left',
  ]
    .filter(Boolean)
    .join(' ')
}

const isVisible = (column: Column<typeof features, Shift>): boolean =>
  column.getIsVisible()

const toggleVisibility = (column: Column<typeof features, Shift>) =>
  column.getToggleVisibilityHandler()

const headerLabel = (column: Column<typeof features, Shift>): string =>
  String(column.columnDef.header)

const toggleSorting = (header: Header<typeof features, Shift, unknown>) =>
  header.column.getToggleSortingHandler() ?? (() => {})

const sortIndicator = (
  header: Header<typeof features, Shift, unknown>,
): string => {
  const sorted = header.column.getIsSorted()
  return sorted === 'asc' ? ' 🔼' : sorted === 'desc' ? ' 🔽' : ''
}

const isSubtotal = (row: Row<typeof summaryFeatures, SummaryRow>): boolean =>
  row.original.kind === 'subtotal'

const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)
const not = (value: unknown): boolean => !value
const inc = (value: number): number => value + 1

export default class CellSpanningTable extends Component {
  @tracked data: Array<Shift> = makeData()
  summaryData: Array<SummaryRow> = makeSummaryData()
  @tracked spanningEnabled = true

  table = useTable(() => ({
    debugTable: true,
    features,
    columns,
    data: this.data,
    enableCellSpanning: this.spanningEnabled,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 12 },
    },
  }))

  summaryTable = useTable(() => ({
    debugTable: true,
    features: summaryFeatures,
    columns: summaryColumns,
    data: this.summaryData,
  }))

  // Typed getters rather than reading this.table.* directly in the template:
  // Glint loses feature-method inference through an inline useTable in a
  // templated class, so hopping through a getter keeps the types.
  private get tableInstance(): Table<typeof features, Shift> {
    return this.table as unknown as Table<typeof features, Shift>
  }

  private get summaryTableInstance(): Table<
    typeof summaryFeatures,
    SummaryRow
  > {
    return this.summaryTable as unknown as Table<
      typeof summaryFeatures,
      SummaryRow
    >
  }

  get headerGroups() {
    return this.tableInstance.getHeaderGroups()
  }

  get rows() {
    return this.tableInstance.getRowModel().rows
  }

  get summaryHeaderGroups() {
    return this.summaryTableInstance.getHeaderGroups()
  }

  get summaryRows() {
    return this.summaryTableInstance.getRowModel().rows
  }

  get visibleLeafCount() {
    return this.tableInstance.getVisibleLeafColumns().length
  }

  get selectedCellCount() {
    return this.tableInstance.getSelectedCellCount()
  }

  get toggleableColumns() {
    return ['team', 'shift'].map((columnId) =>
      this.tableInstance.getColumn(columnId)!,
    )
  }

  get statusFilter() {
    return (
      (this.tableInstance.getColumn('status')!.getFilterValue() as
        string | undefined) ?? ''
    )
  }

  get employeeFilter() {
    return (
      (this.tableInstance.getColumn('employee')!.getFilterValue() as
        string | undefined) ?? ''
    )
  }

  get pageIndex() {
    return this.tableInstance.store.get().pagination.pageIndex
  }

  get pageSize() {
    return this.tableInstance.store.get().pagination.pageSize
  }

  get pageCount() {
    return this.tableInstance.getPageCount()
  }

  get canPreviousPage() {
    return this.tableInstance.getCanPreviousPage()
  }

  get canNextPage() {
    return this.tableInstance.getCanNextPage()
  }

  get pageSizeOptions() {
    return [10, 12, 36]
  }

  get stringifiedState() {
    return JSON.stringify(this.tableInstance.store.get(), null, 2)
  }

  refreshData = () => {
    this.data = makeData()
  }

  toggleSpanning = (event: Event) => {
    this.spanningEnabled = (event.target as HTMLInputElement).checked
  }

  setStatusFilter = (event: Event) => {
    const value = (event.target as HTMLSelectElement).value
    this.tableInstance.getColumn('status')!.setFilterValue(value || undefined)
  }

  setEmployeeFilter = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.tableInstance.getColumn('employee')!.setFilterValue(value || undefined)
  }

  previousPage = () => this.tableInstance.previousPage()
  nextPage = () => this.tableInstance.nextPage()

  setPageSize = (event: Event) => {
    this.tableInstance.setPageSize(
      Number((event.target as HTMLSelectElement).value),
    )
  }

  <template>
    <div class='demo-root'>
      <div class='controls'>
        <button
          type='button'
          class='demo-button'
          {{on 'click' this.refreshData}}
        >
          Regenerate Data
        </button>
        <label>
          <input
            type='checkbox'
            checked={{this.spanningEnabled}}
            {{on 'change' this.toggleSpanning}}
          />
          Row spanning
        </label>
        {{#each this.toggleableColumns as |column|}}
          <label>
            <input
              type='checkbox'
              checked={{isVisible column}}
              {{on 'change' (toggleVisibility column)}}
            />
            {{headerLabel column}}
          </label>
        {{/each}}
        <select
          data-testid='status-filter'
          {{on 'change' this.setStatusFilter}}
        >
          <option value='' selected={{eq this.statusFilter ''}}>
            All statuses
          </option>
          <option value='Approved' selected={{eq this.statusFilter 'Approved'}}>
            Approved
          </option>
          <option value='Pending' selected={{eq this.statusFilter 'Pending'}}>
            Pending
          </option>
          <option value='Rejected' selected={{eq this.statusFilter 'Rejected'}}>
            Rejected
          </option>
        </select>
        <input
          data-testid='employee-filter'
          class='filter-input'
          placeholder='Filter employees...'
          value={{this.employeeFilter}}
          {{on 'input' this.setEmployeeFilter}}
        />
      </div>
      <div class='spacer-sm'></div>
      <div class='controls'>
        <button
          type='button'
          class='demo-button-sm'
          disabled={{not this.canPreviousPage}}
          {{on 'click' this.previousPage}}
        >
          &lt;
        </button>
        <button
          type='button'
          class='demo-button-sm'
          disabled={{not this.canNextPage}}
          {{on 'click' this.nextPage}}
        >
          &gt;
        </button>
        <span>
          Page
          {{inc this.pageIndex}}
          of
          {{this.pageCount}}
        </span>
        <select data-testid='page-size' {{on 'change' this.setPageSize}}>
          {{#each this.pageSizeOptions as |size|}}
            <option value={{size}} selected={{eq size this.pageSize}}>
              Show
              {{size}}
            </option>
          {{/each}}
        </select>
        <span>
          Visible columns:
          <span
            data-testid='visible-leaf-count'
          >{{this.visibleLeafCount}}</span>
        </span>
        <span>
          Selected cells:
          <span data-testid='selected-count'>{{this.selectedCellCount}}</span>
        </span>
      </div>
      <div class='spacer-md'></div>
      {{! The panels wrap into a grid whenever the viewport is wide enough. }}
      <div class='example-grid'>
        <section class='example-panel'>
          <h2 class='section-title'>Row Spanning</h2>
          <table data-testid='span-table'>
            <thead>
              {{#each this.headerGroups as |headerGroup|}}
                <tr>
                  {{#each headerGroup.headers as |header|}}
                    <th colspan={{header.colSpan}}>
                      <button
                        type='button'
                        class='sortable-header header-sort-button'
                        {{on 'click' (toggleSorting header)}}
                      >
                        <FlexRenderHeader @header={{header}} />
                        {{sortIndicator header}}
                      </button>
                    </th>
                  {{/each}}
                </tr>
              {{/each}}
            </thead>
            <tbody>
              {{#each this.rows as |row|}}
                <tr>
                  {{#each (getVisibleCells row) as |cell|}}
                    {{! A span of 0 means this cell is covered by a cell above
                        or to its left. Skip it. Do NOT render rowspan="0": in
                        HTML that means "span to the end of the row group", so
                        forgetting this check merges the cell down the whole
                        tbody instead of rendering nothing. }}
                    {{#if (isRendered cell)}}
                      <td
                        rowspan={{rowSpanOf cell}}
                        colspan={{colSpanOf cell}}
                        class={{getCellClassName cell}}
                        {{on 'mousedown' (startHandler cell)}}
                        {{on 'mouseenter' (extendHandler cell)}}
                      >
                        <FlexRenderCell @cell={{cell}} />
                      </td>
                    {{/if}}
                  {{/each}}
                </tr>
              {{/each}}
            </tbody>
          </table>
        </section>

        <section class='example-panel'>
          <h2 class='section-title'>Reference (no spanning)</h2>
          {{! The same table instance rendered flat. Under every sort, filter,
              and page combination the merged panel must describe exactly this
              grid. }}
          <table data-testid='reference-table'>
            <thead>
              {{#each this.headerGroups as |headerGroup|}}
                <tr>
                  {{#each headerGroup.headers as |header|}}
                    <th colspan={{header.colSpan}}>
                      <button
                        type='button'
                        class='sortable-header header-sort-button'
                        {{on 'click' (toggleSorting header)}}
                      >
                        <FlexRenderHeader @header={{header}} />
                        {{sortIndicator header}}
                      </button>
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
                      <FlexRenderCell @cell={{cell}} />
                    </td>
                  {{/each}}
                </tr>
              {{/each}}
            </tbody>
          </table>
        </section>

        <section class='example-panel'>
          <h2 class='section-title'>Summary Rows (colSpan)</h2>
          <table data-testid='summary-table'>
            <thead>
              {{#each this.summaryHeaderGroups as |headerGroup|}}
                <tr>
                  {{#each headerGroup.headers as |header|}}
                    <th colspan={{header.colSpan}}>
                      <FlexRenderHeader @header={{header}} />
                    </th>
                  {{/each}}
                </tr>
              {{/each}}
            </thead>
            <tbody>
              {{#each this.summaryRows as |row|}}
                <tr class={{if (isSubtotal row) 'subtotal-row'}}>
                  {{#each (getSummaryVisibleCells row) as |cell|}}
                    {{#if (isRendered cell)}}
                      <td rowspan={{rowSpanOf cell}} colspan={{colSpanOf cell}}>
                        <FlexRenderCell @cell={{cell}} />
                      </td>
                    {{/if}}
                  {{/each}}
                </tr>
              {{/each}}
            </tbody>
          </table>
        </section>
      </div>
      <div class='spacer-md'></div>
      <pre data-testid='table-state'>{{this.stringifiedState}}</pre>
    </div>
  </template>
}
