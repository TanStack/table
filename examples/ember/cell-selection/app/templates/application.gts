import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import { faker } from '@faker-js/faker'
import { createMultiHotkeyHandler } from '@tanstack/hotkeys'
import {
  FlexRenderCell,
  FlexRenderHeader,
  cellSelectionFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type Cell,
  type Column,
  type Header,
  type Row,
  type Table,
} from '@tanstack/ember-table'

import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({
  cellSelectionFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First Name' }),
  columnHelper.accessor('lastName', { header: 'Last Name' }),
  columnHelper.accessor('age', { header: 'Age' }),
  columnHelper.accessor('visits', { header: 'Visits' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    // enableCellSelection: false, // this column opts out of cell selection
  }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('phone', { header: 'Phone' }),
  columnHelper.accessor('city', { header: 'City' }),
  columnHelper.accessor('country', { header: 'Country' }),
  columnHelper.accessor('department', { header: 'Department' }),
  columnHelper.accessor('salary', { header: 'Salary' }),
])

// Serializing a selection for the clipboard is a userland concern: the table
// hands back `getSelectedCellRangesData()` as raw values, and the delimiter,
// the null representation, and the quoting rules are all yours to pick. This is
// the spreadsheet-flavored version.
function escapeTsvValue(value: unknown) {
  const text = value == null ? '' : String(value)
  const safeText =
    typeof value === 'string' && /^[\t\r ]*[=+@-]/.test(value)
      ? `'${text}`
      : text

  // spreadsheets expect a field to be quoted once it contains a delimiter, a
  // newline, or a quote, with inner quotes doubled
  return /["\t\n\r]/.test(safeText)
    ? `"${safeText.replace(/"/g, '""')}"`
    : safeText
}

function toTsv(ranges: Array<Array<Array<unknown>>>) {
  return ranges
    .map((grid) =>
      grid.map((row) => row.map(escapeTsvValue).join('\t')).join('\n'),
    )
    .join('\n\n') // blank line between disjoint rectangles
}

// Ember templates extract function references without binding, so every table
// or cell method used from the template needs a helper that calls it on the
// correct object.
const getVisibleCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getVisibleCells()

const canSelect = (cell: Cell<typeof features, Person>): boolean =>
  cell.getCanSelect()

const cellTabIndex = (cell: Cell<typeof features, Person>): number =>
  cell.getTabIndex()

const startHandler = (cell: Cell<typeof features, Person>) =>
  cell.getSelectionStartHandler()

const extendHandler = (cell: Cell<typeof features, Person>) =>
  cell.getSelectionExtendHandler()

const cellClass = (cell: Cell<typeof features, Person>): string => {
  // Most cells in a large grid are unselected, so bail before asking for edges.
  // getSelectionEdges() would otherwise resolve the cell's position a second
  // time just to discover it is not selected.
  if (!cell.getIsSelected()) {
    return cell.getIsFocused()
      ? 'cell-selectable cell-focused'
      : 'cell-selectable'
  }

  const edges = cell.getSelectionEdges()

  return [
    'cell-selectable',
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

const isVisible = (column: Column<typeof features, Person>): boolean =>
  column.getIsVisible()

const toggleVisibility = (column: Column<typeof features, Person>) =>
  column.getToggleVisibilityHandler()

const canSort = (header: Header<typeof features, Person, unknown>): boolean =>
  header.column.getCanSort()

const toggleSorting = (header: Header<typeof features, Person, unknown>) =>
  header.column.getToggleSortingHandler() ?? (() => {})

const sortIndicator = (
  header: Header<typeof features, Person, unknown>,
): string => {
  const sorted = header.column.getIsSorted()
  return sorted === 'asc' ? ' 🔼' : sorted === 'desc' ? ' 🔽' : ''
}

const canPin = (header: Header<typeof features, Person, unknown>): boolean =>
  header.column.getCanPin()

const pinnedAt = (
  header: Header<typeof features, Person, unknown>,
): string | false => header.column.getIsPinned()

const pinStart = (header: Header<typeof features, Person, unknown>) => () =>
  header.column.pin('start')
const pinEnd = (header: Header<typeof features, Person, unknown>) => () =>
  header.column.pin('end')
const unpin = (header: Header<typeof features, Person, unknown>) => () =>
  header.column.pin(false)

const not = (value: unknown): boolean => !value
const eq = (a: unknown, b: unknown): boolean => String(a) === String(b)

export default class CellSelectionTable extends Component {
  @tracked data: Array<Person> = makeData(20)

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    getRowId: (row: Person) => row.id,
    enableCellSelection: true, // enable cell selection for all cells
    // initialState: { cellSelection: [] }, // select cells on first render
    // atoms: { cellSelection: cellSelectionAtom }, // own selection state with an external atom
    // state: { cellSelection }, // classic controlled state; pair with onCellSelectionChange
    // onCellSelectionChange: setCellSelection,
    // enableCellRangeSelection: false, // disable Shift-click and drag ranges; default true
    // enableMultiCellRangeSelection: false, // allow only one rectangle at a time; default true
    // enableCellSelectionDrag: false, // disable drag-to-select; default true
    // isCellRangeSelectionEvent: event => Boolean(event.metaKey), // use Meta instead of Shift
  }))

  // Typed getters rather than reading this.table.* directly in the template:
  // Glint loses feature-method inference through an inline useTable in a
  // templated class, so hopping through a getter keeps the types.
  private get tableInstance(): Table<typeof features, Person> {
    return this.table as unknown as Table<typeof features, Person>
  }

  get headerGroups() {
    return this.tableInstance.getHeaderGroups()
  }

  get rows() {
    return this.tableInstance.getRowModel().rows
  }

  get leafColumns() {
    return this.tableInstance.getAllLeafColumns()
  }

  get allColumnsVisible() {
    return this.tableInstance.getIsAllColumnsVisible()
  }

  // Ember's tracked signals keep these reads fresh, so there is no equivalent
  // of React's per-row Subscribe to reach for here.
  get selectedCellCount() {
    return this.tableInstance.getSelectedCellCount().toLocaleString()
  }

  get selectedRowCount() {
    return this.tableInstance.getCellSelectionRowIds().length.toLocaleString()
  }

  get selectedColumnCount() {
    return this.tableInstance.getCellSelectionColumnIds().length
  }

  get stringifiedState() {
    return this.data.length < 1_001
      ? JSON.stringify(this.tableInstance.store.get(), null, 2)
      : ''
  }

  toggleAllVisibility = (event: Event) => {
    this.tableInstance.getToggleAllColumnsVisibilityHandler()(event)
  }

  // keyboard navigation is TanStack Hotkeys driving the table's imperative
  // APIs; table-core ships no keydown handling of its own. Ember has no hotkeys
  // adapter, so the framework-agnostic core handler is used directly.
  onGridKeyDown = createMultiHotkeyHandler({
    ArrowUp: () => this.tableInstance.moveCellSelection('up'),
    ArrowDown: () => this.tableInstance.moveCellSelection('down'),
    ArrowLeft: () => this.tableInstance.moveCellSelection('left'),
    ArrowRight: () => this.tableInstance.moveCellSelection('right'),
    'Shift+ArrowUp': () => this.tableInstance.extendCellSelection('up'),
    'Shift+ArrowDown': () => this.tableInstance.extendCellSelection('down'),
    'Shift+ArrowLeft': () => this.tableInstance.extendCellSelection('left'),
    'Shift+ArrowRight': () => this.tableInstance.extendCellSelection('right'),
    'Mod+A': () => this.tableInstance.selectAllCells(),
    Escape: () => this.tableInstance.resetCellSelection(true),
    'Mod+C': () => this.copySelection(),
  }) as unknown as (event: KeyboardEvent) => void

  refreshData = () => {
    this.data = makeData(20)
  }

  stressTest = () => {
    this.data = makeData(1_000)
  }

  shuffleColumns = () => {
    this.tableInstance.setColumnOrder(
      faker.helpers.shuffle(this.leafColumns.map((column) => column.id)),
    )
  }

  reverseColumns = () => {
    this.tableInstance.setColumnOrder(
      [...this.leafColumns.map((column) => column.id)].reverse(),
    )
  }

  resetColumnOrder = () => this.tableInstance.resetColumnOrder()
  resetColumnPinning = () => this.tableInstance.resetColumnPinning()
  resetColumnVisibility = () => this.tableInstance.resetColumnVisibility()
  selectAllCells = () => this.tableInstance.selectAllCells()
  clearSelection = () => this.tableInstance.resetCellSelection(true)

  copySelection = () => {
    void navigator.clipboard.writeText(
      toTsv(this.tableInstance.getSelectedCellRangesData()),
    )
  }

  logRangesData = () => {
    console.info(
      'table.getSelectedCellRangesData()',
      this.tableInstance.getSelectedCellRangesData(),
    )
  }

  <template>
    <div class='demo-root'>
      <div>
        <button
          class='demo-button demo-button-spaced'
          type='button'
          {{on 'click' this.refreshData}}
        >
          Regenerate Data
        </button>
        <button
          class='demo-button demo-button-spaced'
          type='button'
          {{on 'click' this.stressTest}}
        >
          Stress Test (1K rows)
        </button>
      </div>
      <div class='spacer-sm'></div>
      <p>
        Click and drag to select a range of cells. Hold Shift while clicking to
        extend the selection, or Ctrl/Cmd to add a second rectangle. Arrow keys
        move the selection, Shift+Arrow extends it, Mod+A selects all, Mod+C
        copies, and Escape clears. Uncomment
        <code>enableCellSelection: false</code>
        on a column def to opt that column out of selection.
      </p>
      <p class='demo-note'>
        Hiding, reordering, and pinning columns all keep a live selection
        anchored to the same cell ids. Ranges are indexed in render order, so a
        pinned column moves the rectangle with it rather than splitting it.
      </p>
      <div class='column-toggle-panel'>
        <div class='column-toggle-panel-header'>
          <label>
            <input
              type='checkbox'
              checked={{this.allColumnsVisible}}
              {{on 'change' this.toggleAllVisibility}}
            />
            Toggle All
          </label>
        </div>
        {{#each this.leafColumns as |column|}}
          <div class='column-toggle-row'>
            <label>
              <input
                type='checkbox'
                checked={{isVisible column}}
                {{on 'change' (toggleVisibility column)}}
              />
              {{column.id}}
            </label>
          </div>
        {{/each}}
      </div>
      <div class='spacer-sm'></div>
      <div class='button-row'>
        <button
          class='demo-button demo-button-spaced'
          type='button'
          {{on 'click' this.shuffleColumns}}
        >
          Shuffle Columns
        </button>
        <button
          class='demo-button demo-button-spaced'
          type='button'
          {{on 'click' this.reverseColumns}}
        >
          Reverse Column Order
        </button>
        <button
          class='demo-button demo-button-spaced'
          type='button'
          {{on 'click' this.resetColumnOrder}}
        >
          Reset Column Order
        </button>
        <button
          class='demo-button demo-button-spaced'
          type='button'
          {{on 'click' this.resetColumnPinning}}
        >
          Reset Pinning
        </button>
        <button
          class='demo-button demo-button-spaced'
          type='button'
          {{on 'click' this.resetColumnVisibility}}
        >
          Reset Visibility
        </button>
      </div>
      <div class='spacer-sm'></div>
      <div>
        {{this.selectedCellCount}}
        cells selected across
        {{this.selectedRowCount}}
        rows and
        {{this.selectedColumnCount}}
        columns
      </div>
      <div class='spacer-sm'></div>
      <div tabindex='0' {{on 'keydown' this.onGridKeyDown}}>
        <table>
          <thead>
            {{#each this.headerGroups as |headerGroup|}}
              <tr>
                {{#each headerGroup.headers as |header|}}
                  <th colspan={{header.colSpan}}>
                    {{#unless header.isPlaceholder}}
                      <button
                        type='button'
                        class='header-button
                          {{if (canSort header) "sortable-header"}}'
                        disabled={{if (canSort header) false true}}
                        {{on 'click' (toggleSorting header)}}
                      >
                        <FlexRenderHeader @header={{header}} />
                        {{sortIndicator header}}
                      </button>
                      {{#if (canPin header)}}
                        <div class='pin-actions'>
                          {{#unless (eq (pinnedAt header) 'start')}}
                            <button
                              class='pin-button'
                              type='button'
                              {{on 'click' (pinStart header)}}
                            >
                              &lt;=
                            </button>
                          {{/unless}}
                          {{#if (pinnedAt header)}}
                            <button
                              class='pin-button'
                              type='button'
                              {{on 'click' (unpin header)}}
                            >
                              X
                            </button>
                          {{/if}}
                          {{#unless (eq (pinnedAt header) 'end')}}
                            <button
                              class='pin-button'
                              type='button'
                              {{on 'click' (pinEnd header)}}
                            >
                              =&gt;
                            </button>
                          {{/unless}}
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
                  {{#if (canSelect cell)}}
                    <td
                      class={{cellClass cell}}
                      tabindex={{cellTabIndex cell}}
                      {{on 'mousedown' (startHandler cell)}}
                      {{on 'mouseenter' (extendHandler cell)}}
                    >
                      <FlexRenderCell @cell={{cell}} />
                    </td>
                  {{else}}
                    <td><FlexRenderCell @cell={{cell}} /></td>
                  {{/if}}
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
          <tfoot>
            <tr>
              <td colspan='20'>Rows ({{this.rows.length}})</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class='spacer-sm'></div>
      <div>
        <button
          class='demo-button demo-button-spaced'
          type='button'
          {{on 'click' this.copySelection}}
        >
          Copy Selection
        </button>
        <button
          class='demo-button demo-button-spaced'
          type='button'
          {{on 'click' this.selectAllCells}}
        >
          Select All Cells
        </button>
        <button
          class='demo-button demo-button-spaced'
          type='button'
          {{on 'click' this.clearSelection}}
        >
          Clear Selection
        </button>
      </div>
      <hr />
      <br />
      <div>
        <button
          class='demo-button demo-button-spaced'
          type='button'
          {{on 'click' this.logRangesData}}
        >
          Log table.getSelectedCellRangesData()
        </button>
      </div>
      <div>
        <label for='state-dump'>State:</label>
        <pre id='state-dump'>{{this.stringifiedState}}</pre>
      </div>
      <div>
        <label for='paste-target'>Paste Test:</label>
        {{! scratch area for pasting a copied selection back in, to eyeball the
            tab-separated shape. It sits outside the grid element, so the table
            hotkeys never intercept typing or Mod+V in here. }}
        <textarea
          id='paste-target'
          class='text-input'
          rows='8'
          placeholder='Copy a selection, then paste here to check the tab-separated output...'
        ></textarea>
      </div>
    </div>
  </template>
}

// `not` is exported so the template compiler keeps it referenced
export { not }
