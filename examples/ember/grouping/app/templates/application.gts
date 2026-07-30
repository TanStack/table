import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  columnGroupingFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  rowSortingFeature,
  createGroupedRowModel,
  createExpandedRowModel,
  createPaginatedRowModel,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  filterFn_inNumberRange,
  sortFn_alphanumeric,
  sortFn_text,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type GroupingState,
  type SortingState,
} from '@tanstack/ember-table'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({
  columnGroupingFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  rowSortingFeature,
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
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
  columnHelper.group({
    header: 'Name',
    columns: columnHelper.columns([
      columnHelper.accessor('firstName', {
        header: () => 'First Name',
        cell: (info) => info.getValue(),
        getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        header: () => 'Last Name',
        cell: (info) => info.getValue(),
      }),
    ]),
  }),
  columnHelper.group({
    header: 'Info',
    columns: columnHelper.columns([
      columnHelper.accessor('age', {
        header: () => 'Age',
      }),
      columnHelper.group({
        header: 'More Info',
        columns: columnHelper.columns([
          columnHelper.accessor('visits', {
            header: () => 'Visits',
          }),
          columnHelper.accessor('status', {
            header: 'Status',
          }),
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            cell: ({ getValue }) =>
              `${Math.round(getValue<number>() * 100) / 100}%`,
          }),
        ]),
      }),
    ]),
  }),
])

const PAGE_SIZES = [10, 20, 30, 40, 50]

// --- Template helpers (v9 methods need explicit `this` binding) ---

const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()
const getCanSort = (column: Column<typeof features, Person>): boolean =>
  column.getCanSort()
const toggleSort =
  (column: Column<typeof features, Person>) => (event: Event) => {
    column.getToggleSortingHandler()?.(event)
  }
const lookup = (obj: Record<string, string>, key: string): string =>
  obj[key] ?? ''
const getCanGroup = (column: Column<typeof features, Person>): boolean =>
  column.getCanGroup()
const getIsGrouped = (column: Column<typeof features, Person>): boolean =>
  column.getIsGrouped()
const getGroupedIndex = (column: Column<typeof features, Person>): number =>
  column.getGroupedIndex()
const cellIsGrouped = (cell: Cell<typeof features, Person>): boolean =>
  cell.getIsGrouped()
const cellIsPlaceholder = (cell: Cell<typeof features, Person>): boolean =>
  cell.getIsPlaceholder()
const rowIsExpanded = (row: Row<typeof features, Person>): boolean =>
  row.getIsExpanded()
const rowIsGrouped = (row: Row<typeof features, Person>): boolean =>
  row.getIsGrouped()
const rowCanExpand = (row: Row<typeof features, Person>): boolean =>
  row.getCanExpand()
const subRowCount = (row: Row<typeof features, Person>): string =>
  row.subRows.length.toLocaleString()

const toggleGrouping = (column: Column<typeof features, Person>) => () =>
  column.toggleGrouping()
const toggleExpanded = (row: Row<typeof features, Person>) => () =>
  row.toggleExpanded()

const not = (value: unknown): boolean => !value
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)

export default class GroupingTable extends Component {
  @tracked data: Array<Person> = makeData(1_000)
  @tracked grouping: GroupingState = []
  @tracked sorting: SortingState = []

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    initialState: { pagination: { pageSize: 20, pageIndex: 0 } },
    state: {
      grouping: this.grouping,
      sorting: this.sorting,
    },
    onGroupingChange: (updater) => {
      this.grouping =
        typeof updater === 'function' ? updater(this.grouping) : updater
    },
    onSortingChange: (updater) => {
      this.sorting =
        typeof updater === 'function' ? updater(this.sorting) : updater
    },
    // atoms: { grouping: groupingAtom }, // preferred: own grouping state with an external atom
    // enableGrouping: false, // disable grouping for every column; default true
    // groupedColumnMode: 'remove', // remove grouped columns instead of moving them to the start; default 'reorder'
    // manualGrouping: true, // pass rows that are already grouped, for example from a server
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
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
    this.data = makeData(1_000)
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
    </div>
    <div class='spacer-sm'></div>
    <table>
      <thead>
        {{#each this.headerGroups as |headerGroup|}}
          <tr>
            {{#each headerGroup.headers as |header|}}
              <th colspan={{header.colSpan}}>
                {{#unless header.isPlaceholder}}
                  <div>
                    {{#if (getCanGroup header.column)}}
                      <button {{on 'click' (toggleGrouping header.column)}}>
                        {{#if (getIsGrouped header.column)}}
                          🛑({{getGroupedIndex header.column}})
                        {{else}}
                          👊
                        {{/if}}
                      </button>
                    {{/if}}
                    <span
                      class='{{if
                          (getCanSort header.column)
                          "sortable-header"
                        }}'
                      {{on 'click' (toggleSort header.column)}}
                    >
                      <FlexRenderHeader @header={{header}} />{{lookup
                        this.sortIndicators
                        header.column.id
                      }}
                    </span>
                  </div>
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
              <td
                class='{{if (cellIsGrouped cell) "cell-grouped"}}
                  {{if (cellIsPlaceholder cell) "cell-placeholder"}}'
              >
                {{#if (cellIsGrouped cell)}}
                  <button
                    style='cursor: {{if (rowCanExpand row) "pointer" "normal"}}'
                    {{on 'click' (toggleExpanded row)}}
                  >
                    {{if (rowIsExpanded row) '👇' '👉'}}
                  </button>
                  <FlexRenderCell @cell={{cell}} />
                  ({{subRowCount row}})
                {{else if (cellIsPlaceholder cell)}}
                  {{! placeholder cell - render nothing }}
                {{else if (not (rowIsGrouped row))}}
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
    <pre data-testid='table-state'>{{this.tableState}}</pre>
  </template>
}
