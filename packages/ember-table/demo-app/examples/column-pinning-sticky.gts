import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import { htmlSafe, type SafeString } from '@ember/template'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  columnPinningFeature,
  columnSizingFeature,
  createColumnHelper,
  type Column,
  type Row,
  type Cell,
  type ColumnPinningPosition,
} from '#src/index.ts'
import { makeData, type Person } from '../utils/make-data'

const features = tableFeatures({
  columnPinningFeature,
  columnSizingFeature,
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
): Array<Cell<typeof features, Person>> => row.getAllCells()

const getCanPin = (column: Column<typeof features, Person>): boolean =>
  column.getCanPin()

const getIsPinned = (
  column: Column<typeof features, Person>,
): ColumnPinningPosition => column.getIsPinned()

const isPinnedLeft = (column: Column<typeof features, Person>): boolean =>
  column.getIsPinned() === 'left'

const isPinnedRight = (column: Column<typeof features, Person>): boolean =>
  column.getIsPinned() === 'right'

const getStart = (column: Column<typeof features, Person>): number =>
  column.getStart('left')

const getAfter = (column: Column<typeof features, Person>): number =>
  column.getAfter('right')

const getSize = (column: Column<typeof features, Person>): number =>
  column.getSize()

const pinningStyle = (column: Column<typeof features, Person>): SafeString => {
  const isPinned = getIsPinned(column)
  const parts: Array<string> = [`width:${getSize(column)}px`]

  if (isPinned === 'left') {
    parts.push(
      'position:sticky',
      `left:${getStart(column)}px`,
      'z-index:1',
      'opacity:0.97',
      'background:#f5f5f5',
      'box-shadow:-4px 0 4px -4px gray inset',
    )
  } else if (isPinned === 'right') {
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
    initialState: {
      columnPinning: {
        left: ['firstName'],
        right: ['progress'],
      },
    },
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
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

  <template>
    <div class="demo-root">
      <div class="button-row">
        <button
          class="demo-button demo-button-sm"
          {{on "click" this.regenerateData}}
        >Regenerate Data</button>
        <button
          class="demo-button demo-button-sm"
          {{on "click" this.stressTest}}
        >Stress Test (1k rows)</button>
        <button
          class="demo-button demo-button-sm"
          {{on "click" this.resetPinning}}
        >Reset Pinning</button>
      </div>
      <div class="spacer-md"></div>

      <div style="overflow-x:auto">
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
                      <div class="nowrap">
                        <FlexRenderHeader @header={{header}} />
                      </div>
                      {{#if (getCanPin header.column)}}
                        <div class="pin-actions">
                          {{#unless (isPinnedLeft header.column)}}
                            <button
                              class="pin-button"
                              {{on "click" (pin header.column "left")}}
                            >◀</button>
                          {{/unless}}
                          {{#if (getIsPinned header.column)}}
                            <button
                              class="pin-button"
                              {{on "click" (pin header.column false)}}
                            >✕</button>
                          {{/if}}
                          {{#unless (isPinnedRight header.column)}}
                            <button
                              class="pin-button"
                              {{on "click" (pin header.column "right")}}
                            >▶</button>
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
                  <td style={{pinningStyle cell.column}}>
                    <FlexRenderCell @cell={{cell}} />
                  </td>
                {{/each}}
              </tr>
            {{/each}}
          </tbody>
        </table>
      </div>

      <div class="spacer-md"></div>
      <pre>{{this.tableState}}</pre>
    </div>
  </template>
}
