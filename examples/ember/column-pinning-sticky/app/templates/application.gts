import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import { htmlSafe, type SafeString } from '@ember/template'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type Header,
  type ColumnPinningPosition,
} from '@tanstack/ember-table'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('visits', {
    header: () => 'Visits',
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (props) => props.column.id,
    size: 180,
  }),
])

// --- Template helpers (v9 methods need explicit `this` binding) ---

const getVisibleCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getVisibleCells()

const getCanPin = (column: Column<typeof features, Person>): boolean =>
  column.getCanPin()

const getIsPinned = (
  column: Column<typeof features, Person>,
): ColumnPinningPosition => column.getIsPinned()

const isPinnedStart = (column: Column<typeof features, Person>): boolean =>
  column.getIsPinned() === 'start'

const isPinnedEnd = (column: Column<typeof features, Person>): boolean =>
  column.getIsPinned() === 'end'

const getStart = (column: Column<typeof features, Person>): number =>
  column.getStart('start')

const getAfter = (column: Column<typeof features, Person>): number =>
  column.getAfter('end')

const getSize = (column: Column<typeof features, Person>): number =>
  column.getSize()

const getIsVisible = (column: Column<typeof features, Person>): boolean =>
  column.getIsVisible()

const toggleColumnVisibility = (column: Column<typeof features, Person>) => {
  return (event: Event) => column.getToggleVisibilityHandler()(event)
}

const getIsResizing = (column: Column<typeof features, Person>): boolean =>
  column.getIsResizing()

const getResizeHandler = (header: Header<typeof features, Person>) => {
  return (event: Event) => header.getResizeHandler()?.(event)
}

const resetSize = (column: Column<typeof features, Person>) => {
  return () => column.resetSize()
}

const pinningStyle = (column: Column<typeof features, Person>): SafeString => {
  const isPinned = getIsPinned(column)
  const parts: Array<string> = [`width:${getSize(column)}px`]

  if (isPinned === 'start') {
    parts.push(
      'position:sticky',
      `left:${getStart(column)}px`,
      'z-index:1',
      'opacity:0.97',
      'background:#f5f5f5',
      'box-shadow:-4px 0 4px -4px gray inset',
    )
  } else if (isPinned === 'end') {
    parts.push(
      'position:sticky',
      `right:${getAfter(column)}px`,
      'z-index:1',
      'opacity:0.97',
      'background:#f5f5f5',
      'box-shadow:4px 0 4px -4px gray inset',
    )
  } else {
    parts.push('position:relative')
  }

  return htmlSafe(parts.join(';'))
}

const pin = (
  column: Column<typeof features, Person>,
  side: ColumnPinningPosition,
) => {
  return () => column.pin(side)
}

export default class ColumnPinningStickyTable extends Component {
  @tracked data: Array<Person> = makeData(20)

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    columnResizeMode: 'onChange',
    initialState: {
      columnPinning: {
        start: ['firstName'],
        end: ['progress'],
      },
    },
    // atoms: { columnPinning: columnPinningAtom }, // preferred: own pinning state with an external atom
    // state: { columnPinning }, // classic controlled state; pair with onColumnPinningChange
    // onColumnPinningChange: setColumnPinning,
    // enableColumnPinning: false, // disable pinning for every column; default true
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  get leafColumns() {
    return this.table.getAllLeafColumns()
  }

  get isAllColumnsVisible() {
    return this.table.getIsAllColumnsVisible()
  }

  get totalSizeStyle(): SafeString {
    return htmlSafe(`width:${this.table.getTotalSize()}px`)
  }

  get tableState() {
    return JSON.stringify(this.table.store.state, null, 2)
  }

  regenerateData = () => {
    this.data = makeData(20)
  }

  stressTest = () => {
    this.data = makeData(1_000)
  }

  resetPinning = () => {
    this.table.resetColumnPinning()
  }

  toggleAllColumnsVisibility = (event: Event) => {
    this.table.getToggleAllColumnsVisibilityHandler()(event)
  }

  shuffleColumns = () => {
    const ids = this.table.getAllLeafColumns().map((column) => column.id)
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = ids[i]!
      ids[i] = ids[j]!
      ids[j] = tmp
    }
    this.table.setColumnOrder(ids)
  }

  resetColumnOrder = () => {
    this.table.resetColumnOrder()
  }

  <template>
    <div class='column-toggle-panel'>
      <div class='column-toggle-panel-header'>
        <label>
          <input
            type='checkbox'
            checked={{this.isAllColumnsVisible}}
            {{on 'change' this.toggleAllColumnsVisibility}}
          />
          Toggle All
        </label>
      </div>
      {{#each this.leafColumns as |column|}}
        <div class='column-toggle-row'>
          <label>
            <input
              type='checkbox'
              checked={{getIsVisible column}}
              {{on 'change' (toggleColumnVisibility column)}}
            />
            {{column.id}}
          </label>
        </div>
      {{/each}}
    </div>
    <div class='spacer-md'></div>

    <div class='button-row'>
      <button
        class='demo-button demo-button-sm'
        {{on 'click' this.regenerateData}}
      >Regenerate Data</button>
      <button
        class='demo-button demo-button-sm'
        {{on 'click' this.stressTest}}
      >Stress Test (1k rows)</button>
      <button
        class='demo-button demo-button-sm'
        {{on 'click' this.shuffleColumns}}
      >Shuffle Columns</button>
      <button
        class='demo-button demo-button-sm'
        {{on 'click' this.resetColumnOrder}}
      >Reset Order</button>
      <button
        class='demo-button demo-button-sm'
        {{on 'click' this.resetPinning}}
      >Reset Pinning</button>
    </div>
    <div class='spacer-md'></div>

    <div style='overflow-x:auto'>
      <table style={{this.totalSizeStyle}}>
        <thead>
          {{#each this.headerGroups as |headerGroup|}}
            <tr>
              {{#each headerGroup.headers as |header|}}
                <th
                  colspan={{header.colSpan}}
                  style={{pinningStyle header.column}}
                >
                  {{#unless header.isPlaceholder}}
                    <div class='nowrap'>
                      <FlexRenderHeader @header={{header}} />
                    </div>
                    {{#if (getCanPin header.column)}}
                      <div class='pin-actions'>
                        {{#unless (isPinnedStart header.column)}}
                          <button
                            class='pin-button'
                            {{on 'click' (pin header.column 'start')}}
                          >◀</button>
                        {{/unless}}
                        {{#if (getIsPinned header.column)}}
                          <button
                            class='pin-button'
                            {{on 'click' (pin header.column false)}}
                          >✕</button>
                        {{/if}}
                        {{#unless (isPinnedEnd header.column)}}
                          <button
                            class='pin-button'
                            {{on 'click' (pin header.column 'end')}}
                          >▶</button>
                        {{/unless}}
                      </div>
                    {{/if}}
                    <div
                      class='resizer
                        {{if (getIsResizing header.column) "isResizing"}}'
                      {{on 'dblclick' (resetSize header.column)}}
                      {{on 'mousedown' (getResizeHandler header)}}
                      {{on 'touchstart' (getResizeHandler header)}}
                    ></div>
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
                <td style={{pinningStyle cell.column}}>
                  <FlexRenderCell @cell={{cell}} />
                </td>
              {{/each}}
            </tr>
          {{/each}}
        </tbody>
      </table>
    </div>

    <div class='spacer-md'></div>
    <pre>{{this.tableState}}</pre>
  </template>
}
