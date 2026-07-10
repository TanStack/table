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
  createFacetedMinMaxValues,
  createFacetedUniqueValues,
  filterFns,
  rowPaginationFeature,
  createPaginatedRowModel,
  metaHelper,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type ColumnFiltersState,
} from '@tanstack/ember-table'
import { makeData, type Person } from '../utils/make-data'

// Custom column meta so columns can declare a `filterVariant`.
interface MyColumnMeta {
  filterVariant?: 'text' | 'range' | 'select'
}

// --- Table setup ---

const features = tableFeatures({
  columnFilteringFeature,
  columnFacetingFeature,
  rowPaginationFeature,
  columnMeta: metaHelper<MyColumnMeta>(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
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
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    meta: { filterVariant: 'range' },
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    meta: { filterVariant: 'range' },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    meta: { filterVariant: 'select' },
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    meta: { filterVariant: 'range' },
  }),
])

const PAGE_SIZES = [10, 20, 30, 40, 50]

// --- Template helpers ---

const getCanFilter = (column: Column<typeof features, Person>): boolean =>
  column.getCanFilter()
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()
const not = (value: unknown): boolean => !value
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)

const filterVariant = (
  column: Column<typeof features, Person>,
): 'text' | 'range' | 'select' | undefined =>
  column.columnDef.meta?.filterVariant

const rangeMin = (column: Column<typeof features, Person>): string => {
  const value = column.getFilterValue() as
    | [string | number, string | number]
    | undefined
  return value?.[0] != null ? String(value[0]) : ''
}

const rangeMax = (column: Column<typeof features, Person>): string => {
  const value = column.getFilterValue() as
    | [string | number, string | number]
    | undefined
  return value?.[1] != null ? String(value[1]) : ''
}

const selectValue = (column: Column<typeof features, Person>): string => {
  const value = column.getFilterValue() as string | number | undefined
  return value == null ? '' : String(value)
}

const textValue = (column: Column<typeof features, Person>): string => {
  const value = column.getFilterValue() as string | number | undefined
  return value == null ? '' : String(value)
}

// Faceted helper fns: bind `this` correctly when calling faceting methods.
const facetedMinMax = (
  column: Column<typeof features, Person>,
): [number, number] | undefined => column.getFacetedMinMaxValues()

const facetedUniqueValues = (
  column: Column<typeof features, Person>,
): Map<unknown, number> => column.getFacetedUniqueValues()

// Sorted unique values sourced from the column's faceted unique values.
const sortedFacetedValues = (
  column: Column<typeof features, Person>,
): Array<string> => {
  if (filterVariant(column) === 'range') return []
  return Array.from(facetedUniqueValues(column).keys() as Iterable<string>)
    .sort()
    .slice(0, 5000)
}

// --- Per-column filter sub-component ---

interface ColumnFilterSignature {
  Args: {
    column: Column<typeof features, Person>
  }
}

class ColumnFilter extends Component<ColumnFilterSignature> {
  get variant(): 'text' | 'range' | 'select' | undefined {
    return filterVariant(this.args.column)
  }

  get minValue(): string {
    return rangeMin(this.args.column)
  }

  get maxValue(): string {
    return rangeMax(this.args.column)
  }

  get selected(): string {
    return selectValue(this.args.column)
  }

  get text(): string {
    return textValue(this.args.column)
  }

  get uniqueValues(): Array<string> {
    return sortedFacetedValues(this.args.column)
  }

  get minMax(): [number, number] | undefined {
    return facetedMinMax(this.args.column)
  }

  get minPlaceholder(): string {
    const min = this.minMax?.[0]
    return `Min ${min !== undefined ? `(${min})` : ''}`
  }

  get maxPlaceholder(): string {
    const max = this.minMax?.[1]
    return `Max ${max !== undefined ? `(${max})` : ''}`
  }

  get uniqueCount(): number {
    return facetedUniqueValues(this.args.column).size
  }

  get textPlaceholder(): string {
    return `Search... (${this.uniqueCount})`
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

  changeSelect = (event: Event) => {
    this.args.column.setFilterValue((event.target as HTMLSelectElement).value)
  }

  changeText = (event: Event) => {
    this.args.column.setFilterValue((event.target as HTMLInputElement).value)
  }

  <template>
    {{#if (eq this.variant "range")}}
      <div class="filter-row">
        <input
          type="number"
          class="filter-input"
          placeholder={{this.minPlaceholder}}
          value={{this.minValue}}
          {{on "input" this.changeMin}}
        />
        <input
          type="number"
          class="filter-input"
          placeholder={{this.maxPlaceholder}}
          value={{this.maxValue}}
          {{on "input" this.changeMax}}
        />
      </div>
    {{else if (eq this.variant "select")}}
      <select {{on "change" this.changeSelect}}>
        <option value="" selected={{eq this.selected ""}}>All</option>
        {{#each this.uniqueValues as |value|}}
          <option value={{value}} selected={{eq this.selected value}}>
            {{value}}
          </option>
        {{/each}}
      </select>
    {{else}}
      <input
        type="text"
        class="filter-select"
        placeholder={{this.textPlaceholder}}
        value={{this.text}}
        {{on "input" this.changeText}}
      />
    {{/if}}
  </template>
}

// --- Component ---

export default class FiltersFacetedTable extends Component {
  @tracked data: Array<Person> = makeData(1_000)
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
    return JSON.stringify(this.columnFilters, null, 2)
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
    this.data = makeData(1_000)
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
      <button
        class="demo-button demo-button-spaced"
        {{on "click" this.regenerateData}}
      >
        Regenerate Data
      </button>
      <button
        class="demo-button demo-button-spaced"
        {{on "click" this.stressTest}}
      >
        Stress Test (1M rows)
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
        <strong>
          {{this.currentPage}}
          of
          {{this.pageCountDisplay}}
        </strong>
      </span>
      <span class="inline-controls">
        | Go to page:
        <input
          type="number"
          min="1"
          max={{this.pageCount}}
          value={{this.currentPageInputValue}}
          class="page-size-input"
          {{on "input" this.handleGoToPage}}
        />
      </span>
      <select {{on "change" this.handlePageSizeChange}}>
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
    <div class="spacer-md"></div>
    <pre>{{this.filterState}}</pre>
  </template>
}
