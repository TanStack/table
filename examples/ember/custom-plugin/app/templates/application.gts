import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  FlexRenderFooter,
  tableFeatures,
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
  filterFn_inNumberRange,
  rowSortingFeature,
  createSortedRowModel,
  sortFn_alphanumeric,
  sortFn_text,
  rowPaginationFeature,
  createPaginatedRowModel,
  createColumnHelper,
  assignTableAPIs,
  functionalUpdate,
  makeStateUpdater,
  type Column,
  type Row,
  type Cell,
  type Table,
  type ColumnFiltersState,
  type OnChangeFn,
  type RowData,
  type SortingState,
  type TableFeature,
  type TableFeatures,
  type Updater,
} from '@tanstack/ember-table'
import { makeData, type Person } from '../utils/make-data'

// --- Custom "density" feature plugin (translated from the Angular example) ---

// State contributed by the feature.
export type DensityState = 'sm' | 'md' | 'lg'
export interface TableState_Density {
  density: DensityState
}

// Options contributed by the feature.
export interface TableOptions_Density {
  enableDensity?: boolean
  onDensityChange?: OnChangeFn<DensityState>
}

// Table instance APIs contributed by the feature.
export interface Table_Density {
  setDensity: (updater: Updater<DensityState>) => void
  toggleDensity: (value?: DensityState) => void
}

// Register the plugin's types via declaration merging so the table types
// (state / options / instance) all resolve cleanly.
declare module '@tanstack/table-core' {
  interface Plugins {
    densityPlugin: TableFeature
  }

  interface TableState_FeatureMap {
    densityPlugin: TableState_Density
  }

  interface TableOptions_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TFeatures extends TableFeatures,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TData extends RowData,
  > {
    densityPlugin: TableOptions_Density
  }

  interface Table_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TFeatures extends TableFeatures,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TData extends RowData,
  > {
    densityPlugin: Table_Density
  }
}

export const densityPlugin: TableFeature = {
  getInitialState: (initialState) => {
    return {
      density: 'md',
      ...initialState, // must come last so user state wins
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater('density', table),
    }
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('densityPlugin', table, {
      table_setDensity: {
        fn: (updater: Updater<DensityState>) => {
          const safeUpdater: Updater<DensityState> = (old) => {
            return functionalUpdate(updater, old)
          }
          return (table.options as TableOptions_Density).onDensityChange?.(
            safeUpdater,
          )
        },
      },
      table_toggleDensity: {
        fn: (value?: DensityState) => {
          const safeUpdater: Updater<DensityState> = (old) => {
            if (value) return value
            // cycle through the 3 options
            return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg'
          }
          return (table.options as TableOptions_Density).onDensityChange?.(
            safeUpdater,
          )
        },
      },
    })
  },
}

// --- Table setup ---

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  densityPlugin, // pass in our plugin just like any other stock feature
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
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
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
  }),
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
])

const PAGE_SIZES = [10, 20, 30, 40, 50]

// --- Template helpers ---

const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()
const getCanSort = (column: Column<typeof features, Person>): boolean =>
  column.getCanSort()
const getCanFilter = (column: Column<typeof features, Person>): boolean =>
  column.getCanFilter()
const lookup = (obj: Record<string, string>, key: string): string =>
  obj[key] ?? ''
const not = (value: unknown): boolean => !value
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)
const isFunction = (value: unknown): value is (...args: never[]) => unknown =>
  typeof value === 'function'

const toggleSort = (column: Column<typeof features, Person>) => {
  return (event: Event) => {
    column.getToggleSortingHandler()?.(event)
  }
}

// --- Per-column filter sub-component ---
// Numeric columns render a min/max range; everything else renders a text
// search input, mirroring the React example's `Filter` component.

interface ColumnFilterSignature {
  Args: {
    column: Column<typeof features, Person>
    table: Table<typeof features, Person>
  }
}

class ColumnFilter extends Component<ColumnFilterSignature> {
  get isRange(): boolean {
    const firstValue = this.args.table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(this.args.column.id)
    return typeof firstValue === 'number'
  }

  get minValue(): string {
    const value = this.args.column.getFilterValue() as
      | [number, number]
      | undefined
    return value?.[0] != null ? String(value[0]) : ''
  }

  get maxValue(): string {
    const value = this.args.column.getFilterValue() as
      | [number, number]
      | undefined
    return value?.[1] != null ? String(value[1]) : ''
  }

  get text(): string {
    const value = this.args.column.getFilterValue() as string | undefined
    return value ?? ''
  }

  changeMin = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.args.column.setFilterValue((old?: [number, number]) => [
      value,
      old?.[1],
    ])
  }

  changeMax = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    this.args.column.setFilterValue((old?: [number, number]) => [
      old?.[0],
      value,
    ])
  }

  changeText = (event: Event) => {
    this.args.column.setFilterValue((event.target as HTMLInputElement).value)
  }

  <template>
    {{#if this.isRange}}
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

export default class CustomPluginTable extends Component {
  @tracked data: Array<Person> = makeData(20)
  @tracked density: DensityState = 'md'
  @tracked sorting: SortingState = []
  @tracked columnFilters: ColumnFiltersState = []
  @tracked pageIndex = 0
  @tracked pageSize = 10

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    state: {
      density: this.density,
      sorting: this.sorting,
      columnFilters: this.columnFilters,
      pagination: { pageIndex: this.pageIndex, pageSize: this.pageSize },
    },
    onDensityChange: (updater) => {
      this.density = isFunction(updater) ? updater(this.density) : updater
    },
    onSortingChange: (updater) => {
      this.sorting = isFunction(updater) ? updater(this.sorting) : updater
    },
    onColumnFiltersChange: (updater) => {
      this.columnFilters = isFunction(updater)
        ? updater(this.columnFilters)
        : updater
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex: this.pageIndex, pageSize: this.pageSize })
          : updater
      this.pageIndex = next.pageIndex
      this.pageSize = next.pageSize
    },
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

  // Padding is driven by the current density, read reactively via a getter.
  get cellPadding() {
    switch (this.density) {
      case 'sm':
        return '4px'
      case 'lg':
        return '16px'
      default:
        return '8px'
    }
  }

  get cellStyle() {
    return `padding: ${this.cellPadding};`
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
    return (this.pageIndex + 1).toLocaleString()
  }

  get pageCountDisplay() {
    return this.table.getPageCount().toLocaleString()
  }

  get pageSizes() {
    return PAGE_SIZES
  }

  toggleDensity = () => {
    this.table.toggleDensity()
  }

  regenerateData = () => {
    this.data = makeData(20)
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
    <div class='controls'>
      <button class='demo-button' {{on 'click' this.toggleDensity}}>
        Toggle Density (current:
        {{this.density}})
      </button>
      <button class='demo-button' {{on 'click' this.regenerateData}}>
        Regenerate Data
      </button>
    </div>
    <div class='spacer-sm'></div>
    <table>
      <thead>
        {{#each this.headerGroups as |headerGroup|}}
          <tr>
            {{#each headerGroup.headers as |header|}}
              <th colspan={{header.colSpan}} style={{this.cellStyle}}>
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
            {{#each (getAllCells row) as |cell|}}
              <td style={{this.cellStyle}}>
                <FlexRenderCell @cell={{cell}} />
              </td>
            {{/each}}
          </tr>
        {{/each}}
      </tbody>
      <tfoot>
        {{#each this.footerGroups as |footerGroup|}}
          <tr>
            {{#each footerGroup.headers as |header|}}
              <th style={{this.cellStyle}}>
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
      <select {{on 'change' this.handlePageSizeChange}}>
        {{#each this.pageSizes as |size|}}
          <option value={{size}} selected={{eq size this.pageSize}}>
            Show
            {{size}}
          </option>
        {{/each}}
      </select>
    </div>
    <div class='spacer-md'></div>
    <pre>Density: {{this.density}}</pre>
    <pre data-testid='table-state'>{{this.tableState}}</pre>
  </template>
}
