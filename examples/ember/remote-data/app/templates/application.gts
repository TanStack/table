import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  rowPaginationFeature,
  rowSortingFeature,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type PaginationState,
  type SortingState,
} from '@tanstack/ember-table'
import { makeData, type Person } from '../utils/make-data'
import type Owner from '@ember/owner'

// --- Dep-free simulated async "server" -------------------------------------
// A fixed in-memory dataset stands in for a remote backend. `fetchData`
// resolves after a small delay with a manually sorted + sliced page, mirroring
// what a paginated/sorted API endpoint would return.

const fakeServer: Array<Person> = makeData(1_000)

interface FetchParams {
  pageIndex: number
  pageSize: number
  sorting: SortingState
}

interface FetchResult {
  rows: Array<Person>
  pageCount: number
  total: number
}

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }
  return String(a).localeCompare(String(b))
}

function fetchData({
  pageIndex,
  pageSize,
  sorting,
}: FetchParams): Promise<FetchResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rows = [...fakeServer]

      if (sorting.length) {
        const [sort] = sorting
        if (sort) {
          const key = sort.id as keyof Person
          rows.sort((a, b) => {
            const result = compareValues(a[key], b[key])
            return sort.desc ? -result : result
          })
        }
      }

      const start = pageIndex * pageSize
      const paged = rows.slice(start, start + pageSize)

      resolve({
        rows: paged,
        pageCount: Math.ceil(fakeServer.length / pageSize),
        total: fakeServer.length,
      })
    }, 500)
  })
}

// --- Table setup -----------------------------------------------------------

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
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

// --- Template helpers (v9 methods need explicit `this`) ---

const getCanSort = (column: Column<typeof features, Person>): boolean =>
  column.getCanSort()
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()
const lookup = (obj: Record<string, string>, key: string): string =>
  obj[key] ?? ''
const not = (value: unknown): boolean => !value
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)

const toggleSort = (column: Column<typeof features, Person>) => {
  return (event: Event) => {
    column.getToggleSortingHandler()?.(event)
  }
}

export default class RemoteDataTable extends Component {
  @tracked data: Array<Person> = []
  @tracked isLoading = false
  @tracked rowCount = 0
  @tracked pageCountValue = 0
  @tracked sorting: SortingState = [{ id: 'age', desc: false }]
  @tracked pagination: PaginationState = { pageIndex: 0, pageSize: 10 }

  constructor(owner: Owner, args: object) {
    super(owner, args)
    void this.load()
  }

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    manualPagination: true,
    manualSorting: true,
    rowCount: this.rowCount,
    pageCount: this.pageCountValue,
    state: {
      sorting: this.sorting,
      pagination: this.pagination,
    },
    onSortingChange: (updater) => {
      this.sorting =
        typeof updater === 'function' ? updater(this.sorting) : updater
      // reset to the first page on a sort change, then refetch
      this.pagination = { ...this.pagination, pageIndex: 0 }
      void this.load()
    },
    onPaginationChange: (updater) => {
      this.pagination =
        typeof updater === 'function' ? updater(this.pagination) : updater
      void this.load()
    },
  }))

  load = async () => {
    this.isLoading = true
    const result = await fetchData({
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize,
      sorting: this.sorting,
    })
    this.data = result.rows
    this.rowCount = result.total
    this.pageCountValue = result.pageCount
    this.isLoading = false
  }

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
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

  get pageSizes() {
    return PAGE_SIZES
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
    <div class='scroll-container'>
      <table>
        <thead>
          {{#each this.headerGroups as |headerGroup|}}
            <tr>
              {{#each headerGroup.headers as |header|}}
                <th colspan={{header.colSpan}}>
                  {{#unless header.isPlaceholder}}
                    <div
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
                <td><FlexRenderCell @cell={{cell}} /></td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>
    </div>
    {{#if this.isLoading}}
      <div>Loading...</div>
    {{/if}}
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
        {{#each this.pageSizes as |size|}}
          <option value={{size}} selected={{eq size this.pagination.pageSize}}>
            Show
            {{size}}
          </option>
        {{/each}}
      </select>
    </div>
  </template>
}
