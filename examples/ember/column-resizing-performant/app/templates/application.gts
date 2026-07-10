import Component from '@glimmer/component'
import { tracked, cached } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type Header,
} from '@tanstack/ember-table'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({ columnSizingFeature, columnResizingFeature })

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.group({
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
    header: 'Info',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
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
    ]),
  }),
])

// --- Template helpers ---
// TanStack Table v9 uses prototype-based methods that require `this` binding.
// Ember templates extract function references without binding, so we provide
// module-scope helpers that call methods on the correct object.

const getIsResizing = (column: Column<typeof features, Person>): boolean =>
  column.getIsResizing()
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()
const resetSize = (column: Column<typeof features, Person>) => {
  return () => column.resetSize()
}
const getResizeHandler = (header: Header<typeof features, Person>) => {
  return (event: Event) => header.getResizeHandler()?.(event)
}

// Instead of reading a per-cell `getSize()` on every render (very expensive for
// large tables), sizes are published once as CSS variables on the table wrapper
// and each header/cell reads its width from the matching variable by id.
const headerWidthStyle = (header: Header<typeof features, Person>): string =>
  `width: calc(var(--header-${header.id}-size) * 1px)`
const colWidthStyle = (cell: Cell<typeof features, Person>): string =>
  `width: calc(var(--col-${cell.column.id}-size) * 1px)`

export default class ColumnResizingPerformantTable extends Component {
  @tracked data: Array<Person> = makeData(50)

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    columnResizeMode: 'onChange' as const,
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  get totalSize() {
    return this.table.getTotalSize()
  }

  get rowCount() {
    return this.data.length.toLocaleString()
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2)
  }

  /**
   * Calculate all column sizes at once at the root table level and expose them
   * as a CSS-variable style string applied to the table wrapper. Reading
   * `store.state.columnSizing` establishes reactivity so the vars recompute on
   * resize, while the individual header/cell widths simply read the variables.
   */
  @cached
  get columnSizeVars(): string {
    // Establish a reactive dependency on the current column sizing state.
    void this.table.store.state.columnSizing
    const headers = this.table.getFlatHeaders()
    const parts: Array<string> = []
    let i = headers.length
    while (--i >= 0) {
      const header = headers[i]!
      parts.push(`--header-${header.id}-size: ${header.getSize()}`)
      parts.push(`--col-${header.column.id}-size: ${header.column.getSize()}`)
    }
    return parts.join('; ')
  }

  get tableStyle(): string {
    return `${this.columnSizeVars}; width: ${this.totalSize}px`
  }

  regenerateData = () => {
    this.data = makeData(50)
  }

  stressTest = () => {
    this.data = makeData(2_000)
  }

  <template>
    <div>
      <button class="demo-button" {{on "click" this.regenerateData}}>
        Regenerate Data
      </button>
      <button class="demo-button" {{on "click" this.stressTest}}>
        Stress Test (2k rows)
      </button>
    </div>
    <div class="spacer-md"></div>
    ({{this.rowCount}}
    rows)
    <div class="spacer-md"></div>
    <div class="scroll-container">
      <div class="divTable" style={{this.tableStyle}}>
        <div class="thead">
          {{#each this.headerGroups as |headerGroup|}}
            <div class="tr">
              {{#each headerGroup.headers as |header|}}
                <div class="th" style={{headerWidthStyle header}}>
                  {{#unless header.isPlaceholder}}
                    <FlexRenderHeader @header={{header}} />
                  {{/unless}}
                  <div
                    class="resizer
                      {{if (getIsResizing header.column) 'isResizing'}}"
                    {{on "dblclick" (resetSize header.column)}}
                    {{on "mousedown" (getResizeHandler header)}}
                    {{on "touchstart" (getResizeHandler header)}}
                  ></div>
                </div>
              {{/each}}
            </div>
          {{/each}}
        </div>
        <div class="tbody">
          {{#each this.rows as |row|}}
            <div class="tr">
              {{#each (getAllCells row) as |cell|}}
                <div class="td" style={{colWidthStyle cell}}>
                  <FlexRenderCell @cell={{cell}} />
                </div>
              {{/each}}
            </div>
          {{/each}}
        </div>
      </div>
    </div>
    <div class="spacer-md"></div>
    <pre>{{this.tableState}}</pre>
  </template>
}
