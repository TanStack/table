import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
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
  type ColumnResizeMode,
} from '@tanstack/ember-table'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({ columnResizingFeature, columnSizingFeature })

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
      columnHelper.group({
        header: 'More Info',
        columns: columnHelper.columns([
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
    ]),
  }),
])

// --- Template helpers ---
// TanStack Table v9 uses prototype-based methods that require `this` binding.
// Ember templates extract function references without binding, so we provide
// module-scope helpers that call methods on the correct object.

const getHeaderSize = (header: Header<typeof features, Person>): number =>
  header.getSize()
const getCellColumnSize = (cell: Cell<typeof features, Person>): number =>
  cell.column.getSize()
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

export default class ColumnResizingTable extends Component {
  @tracked data: Array<Person> = makeData(10)
  @tracked resizeMode: ColumnResizeMode = 'onChange'

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    columnResizeMode: this.resizeMode,
    // initialState: { columnSizing: { firstName: 200 } }, // set column sizes on first render
    // atoms: { columnResizing: columnResizingAtom }, // preferred: own transient resize state with an external atom
    // state: { columnResizing }, // classic controlled state; pair with onColumnResizingChange
    // onColumnResizingChange: setColumnResizing,
    // columnResizeDirection: 'rtl', // calculate resize offsets right-to-left; default 'ltr'
    // enableColumnResizing: false, // disable resizing for every column; default true
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  get centerTotalSize() {
    return this.table.getCenterTotalSize()
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2)
  }

  get isOnChange() {
    return this.resizeMode === 'onChange'
  }

  get isOnEnd() {
    return this.resizeMode === 'onEnd'
  }

  regenerateData = () => {
    this.data = makeData(10)
  }

  stressTest = () => {
    this.data = makeData(100)
  }

  setResizeMode = (event: Event) => {
    const target = event.target as HTMLSelectElement
    this.resizeMode = target.value as ColumnResizeMode
  }

  <template>
    <div>
      <button class='demo-button' {{on 'click' this.regenerateData}}>
        Regenerate Data
      </button>
      <button class='demo-button' {{on 'click' this.stressTest}}>
        Stress Test (100 rows)
      </button>
    </div>
    <div class='spacer-md'></div>
    <select
      class='demo-button outlined-control'
      {{on 'change' this.setResizeMode}}
    >
      <option value='onEnd' selected={{this.isOnEnd}}>Resize: "onEnd"</option>
      <option value='onChange' selected={{this.isOnChange}}>Resize: "onChange"</option>
    </select>
    <div class='spacer-md'></div>
    <div class='section-title'>&lt;table/&gt;</div>
    <div class='scroll-container'>
      <table style='width:{{this.centerTotalSize}}px'>
        <thead>
          {{#each this.headerGroups as |headerGroup|}}
            <tr>
              {{#each headerGroup.headers as |header|}}
                <th
                  colspan={{header.colSpan}}
                  style='width:{{getHeaderSize header}}px'
                >
                  {{#unless header.isPlaceholder}}
                    <FlexRenderHeader @header={{header}} />
                  {{/unless}}
                  <div
                    class='resizer
                      {{if (getIsResizing header.column) "isResizing"}}'
                    {{on 'dblclick' (resetSize header.column)}}
                    {{on 'mousedown' (getResizeHandler header)}}
                    {{on 'touchstart' (getResizeHandler header)}}
                  ></div>
                </th>
              {{/each}}
            </tr>
          {{/each}}
        </thead>
        <tbody>
          {{#each this.rows as |row|}}
            <tr>
              {{#each (getAllCells row) as |cell|}}
                <td style='width:{{getCellColumnSize cell}}px'>
                  <FlexRenderCell @cell={{cell}} />
                </td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>
    </div>
    <div class='spacer-md'></div>
    <pre data-testid='table-state'>{{this.tableState}}</pre>
  </template>
}
