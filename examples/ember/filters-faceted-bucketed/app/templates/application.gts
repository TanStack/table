import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  columnFilteringFeature,
  columnFacetingFeature,
  createFilteredRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  filterFn_includesString,
  rowPaginationFeature,
  createPaginatedRowModel,
  metaHelper,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type ColumnFiltersState,
} from '@tanstack/ember-table'
import { makeData, type Account } from '../utils/make-data'
import {
  createBucketFilter,
  formatBytes,
  getBucket,
  lastLoginBuckets,
  storageBuckets,
  type BucketColumnMeta,
  type FacetKey,
} from '../utils/buckets'

// Custom column meta so columns can declare a `filterVariant`.
// --- Table setup ---

const features = tableFeatures({
  columnFilteringFeature,
  columnFacetingFeature,
  rowPaginationFeature,
  columnMeta: metaHelper<BucketColumnMeta>(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
  },
})

const columnHelper = createColumnHelper<typeof features, Account>()

const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: 'Account',
    filterFn: 'includesString',
    meta: { filterVariant: 'text' },
  }),
  columnHelper.accessor('lastLogin', {
    header: 'Last login',
    cell: (info) => info.getValue().toLocaleString(),
    getUniqueValues: (row) => [getBucket(row.lastLogin, lastLoginBuckets)],
    filterFn: createBucketFilter(lastLoginBuckets),
    meta: { filterVariant: 'facets', facetOptions: lastLoginBuckets },
  }),
  columnHelper.accessor('storageBytes', {
    header: 'Storage',
    cell: (info) => formatBytes(info.getValue()),
    getUniqueValues: (row) => [getBucket(row.storageBytes, storageBuckets)],
    filterFn: createBucketFilter(storageBuckets),
    meta: { filterVariant: 'facets', facetOptions: storageBuckets },
  }),
  columnHelper.accessor('files', {
    header: 'Files',
    enableColumnFilter: false,
    cell: (info) => info.getValue().toLocaleString(),
  }),
])

const PAGE_SIZES = [10, 20, 30, 40, 50]

// --- Template helpers ---

const getCanFilter = (column: Column<typeof features, Account>): boolean =>
  column.getCanFilter()
const getAllCells = (
  row: Row<typeof features, Account>,
): Array<Cell<typeof features, Account>> => row.getAllCells()
const not = (value: unknown): boolean => !value
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)

const textValue = (column: Column<typeof features, Account>): string => {
  const value = column.getFilterValue() as string | number | undefined
  return value == null ? '' : String(value)
}

// --- Per-column filter sub-component ---

interface ColumnFilterSignature {
  Args: {
    column: Column<typeof features, Account>
  }
}

class ColumnFilter extends Component<ColumnFilterSignature> {
  get text(): string {
    return textValue(this.args.column)
  }

  get isFacets(): boolean {
    return this.args.column.columnDef.meta?.filterVariant === 'facets'
  }

  get options() {
    const selected = (this.args.column.getFilterValue() ??
      []) as Array<FacetKey>
    const counts = this.args.column.getFacetedUniqueValues()
    return (this.args.column.columnDef.meta?.facetOptions ?? []).map(
      (option) => ({
        ...option,
        checked: selected.includes(option.value),
        count: (counts.get(option.value) ?? 0).toLocaleString(),
      }),
    )
  }

  changeText = (event: Event) => {
    this.args.column.setFilterValue((event.target as HTMLInputElement).value)
  }

  toggleFacet = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    const selected = (this.args.column.getFilterValue() ??
      []) as Array<FacetKey>
    this.args.column.setFilterValue(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )
  }

  <template>
    {{#if this.isFacets}}
      <fieldset class='facet-options'>
        {{#each this.options as |option|}}
          <label>
            <input
              type='checkbox'
              value={{option.value}}
              checked={{option.checked}}
              {{on 'change' this.toggleFacet}}
            />
            <span>{{option.label}}</span>
            <span class='count'>{{option.count}}</span>
          </label>
        {{/each}}
      </fieldset>
    {{else}}
      <input
        type='text'
        class='filter-select'
        placeholder='Search…'
        value={{this.text}}
        {{on 'input' this.changeText}}
      />
    {{/if}}
  </template>
}

// --- Component ---

export default class FilteringByFacetsTable extends Component {
  @tracked data: Array<Account> = makeData(5_000)
  @tracked columnFilters: ColumnFiltersState = []

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    state: {
      columnFilters: this.columnFilters,
    },
    onColumnFiltersChange: (updater) => {
      this.columnFilters =
        typeof updater === 'function' ? updater(this.columnFilters) : updater
    },
    // Column faceting has no table-level options; configure its row-model factories in `features`.
    // initialState: { columnFilters: [{ id: 'firstName', value: 'Jane' }] }, // set filters once
    // atoms: { columnFilters: columnFiltersAtom }, // preferred: own column filters with an external atom
    // enableFilters: false, // disable all column and global filtering; default true
    // enableColumnFilters: false, // disable per-column filters; default true
    // filterFromLeafRows: true, // keep parents whose descendants match; default filters from parents down
    // maxLeafRowFilterDepth: 1, // only filter through this nested-row depth; default 100
    // manualFiltering: true, // pass data that is already filtered, for example from a server
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  get preFilteredRowCount() {
    return this.table.getPreFilteredRowModel().rows.length.toLocaleString()
  }

  get filterState() {
    return JSON.stringify(this.table.store.state, null, 2)
  }

  get canPreviousPage() {
    return this.table.getCanPreviousPage()
  }

  get canNextPage() {
    return this.table.getCanNextPage()
  }

  get canLastPage() {
    return this.table.getCanLastPage()
  }

  get pageCount() {
    return this.table.getPageCount()
  }

  get pagination() {
    return this.table.store.state.pagination ?? { pageIndex: 0, pageSize: 10 }
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

  get currentPageSize() {
    return this.pagination.pageSize
  }

  get pageSizes() {
    return PAGE_SIZES
  }

  regenerateData = () => {
    this.data = makeData(5_000)
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
    this.table.lastPage()
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
      <button
        class='demo-button demo-button-spaced'
        {{on 'click' this.regenerateData}}
      >
        Regenerate Data
      </button>
      <button
        class='demo-button demo-button-spaced'
        {{on 'click' this.stressTest}}
      >
        Stress Test (1M rows)
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
                  <div>
                    <FlexRenderHeader @header={{header}} />
                  </div>
                  {{#if (getCanFilter header.column)}}
                    <div>
                      <ColumnFilter @column={{header.column}} />
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
            {{#each (getAllCells row) as |cell|}}
              <td><FlexRenderCell @cell={{cell}} /></td>
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
        disabled={{not this.canLastPage}}
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
          <option
            value={{pageSize}}
            selected={{eq pageSize this.currentPageSize}}
          >
            Show
            {{pageSize}}
          </option>
        {{/each}}
      </select>
    </div>
    <div>{{this.preFilteredRowCount}} Rows</div>
    <div class='spacer-md'></div>
    <pre>{{this.filterState}}</pre>
  </template>
}
